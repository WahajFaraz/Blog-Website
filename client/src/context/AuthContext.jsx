import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const clearError = () => {
    setError(null);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = await response.json();
      if (response.ok) {
        setUser(userData);
        setError(null);
      } else if (response.status === 401) {
        logout();
      } else {
        console.error('Profile fetch failed:', response.status, response.statusText);
        setError('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Network error while fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setError(null);
        return { success: true };
      } else {
        const errorMessage = data.error || 'Invalid Credentials';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'Invalid Credentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const isFormData = userData instanceof FormData;
      
      const response = await fetch('/api/v1/users/signup', {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json'
        },
        body: isFormData ? userData : JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setError(null);
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please log in to continue.' 
          } 
        });
        return { success: true };
      } else {
        let errorMessage = 'Signup failed';
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(err => err.msg || err.error).join(', ');
        } else if (data.error) {
          errorMessage = data.error;
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const isFormData = updates instanceof FormData;
      
      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: isFormData ? {
          'Authorization': `Bearer ${token}`
        } : {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: isFormData ? updates : JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setError(null);
        return { success: true };
      } else {
        if (data.errors) {
          const errorMessage = data.errors.map(err => err.msg).join(', ');
          setError(errorMessage);
          return { success: false, error: errorMessage };
        } else {
          setError(data.error || 'Profile update failed');
          return { success: false, error: data.error };
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Network error. Please try again.');
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
