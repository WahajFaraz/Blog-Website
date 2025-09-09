import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "./BlogCard";

const BlogGrid = ({ blogs: initialBlogs, searchFilters = { query: '', category: 'all', sort: 'newest' } }) => {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchFilters.query) params.append('search', searchFilters.query);
      if (searchFilters.category && searchFilters.category !== 'all') params.append('category', searchFilters.category);
      if (searchFilters.sort) params.append('sort', searchFilters.sort);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const url = `${baseUrl}/blogs${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setBlogs(data.data.blogs || []);
      } else {
        throw new Error(data.error || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialBlogs) {
      setBlogs(initialBlogs);
      setLoading(false);
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search') || '';
    setSearchQuery(search);
    
    fetchBlogs();
  }, [location.search, searchFilters, initialBlogs]);

  if (loading) {
                  return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              );
  }

  return (
    <div>
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Search results for: "{searchQuery}"
          </h2>
          <p className="text-muted-foreground">
            {blogs.length} {blogs.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <BlogCard key={blog._id || blog.id || Math.random()} blog={blog} index={index} />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8 col-span-full">
            {searchQuery ? (
              <div>
                <p className="text-lg mb-2">No blogs found for "{searchQuery}"</p>
                <p className="text-sm">Try different keywords or browse all posts</p>
              </div>
            ) : (
              "No blogs available"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;
