import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SearchBar = ({ onSearch, onFilterChange, className = "" }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const searchRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'technology', label: 'Technology' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'business', label: 'Business' },
    { id: 'health', label: 'Health' },
    { id: 'travel', label: 'Travel' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      onSearch({
        query: searchQuery,
        category: selectedCategory,
        sort: selectedSort
      });
      
      setIsExpanded(false);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'category') {
      setSelectedCategory(value);
    } else if (type === 'sort') {
      setSelectedSort(value);
    }
    
    onFilterChange({
      category: type === 'category' ? value : selectedCategory,
      sort: type === 'sort' ? value : selectedSort
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className={`flex items-center transition-all duration-300 ${
          isExpanded 
            ? 'bg-background border-2 border-blog-primary shadow-lg' 
            : 'bg-background/80 backdrop-blur-sm border border-border hover:border-blog-primary/60'
        } rounded-full overflow-hidden`}>
          <div className="flex-1 flex items-center">
            <Search className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search blogs, topics, authors..."
              className="border-0 bg-transparent focus:ring-0 focus:outline-none px-3 py-3 text-sm placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex items-center gap-2 pr-2">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-8 w-8 p-0 rounded-full transition-colors ${
                showFilters ? 'bg-blog-primary text-white' : 'hover:bg-muted'
              }`}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => handleSearch()}
              className="bg-blog-primary hover:bg-blog-secondary text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Search
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Recent Searches</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blog-primary/10 hover:text-blog-primary transition-colors"
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Trending Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'Web Development', 'AI', 'Design'].map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="cursor-pointer hover:bg-blog-primary hover:text-white hover:border-blog-primary transition-colors"
                      onClick={() => {
                        setQuery(topic);
                        handleSearch(topic);
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden w-80"
            >
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Filter & Sort</h3>
                
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('category', category.id)}
                        className={`justify-start text-xs ${
                          selectedCategory === category.id 
                            ? 'bg-blog-primary hover:bg-blog-secondary' 
                            : ''
                        }`}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                  <div className="grid grid-cols-1 gap-2">
                    {sortOptions.map((option) => (
                      <Button
                        key={option.id}
                        variant={selectedSort === option.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('sort', option.id)}
                        className={`justify-start text-xs ${
                          selectedSort === option.id 
                            ? 'bg-blog-primary hover:bg-blog-secondary' 
                            : ''
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
