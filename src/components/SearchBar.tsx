
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, 500); 
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <form onSubmit={handleSearch} className="flex relative">
        <motion.div
          className="relative flex-1"
          animate={{ width: isFocused ? "calc(100% + 8px)" : "100%" }}
          transition={{ duration: 0.2 }}
        >
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="rounded-r-none bg-[#1b263b]/70 text-blue-100 placeholder:text-blue-300/50 border-blue-900/30 focus:border-blue-400 pr-10 transition-all duration-300"
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300/70 hover:text-blue-200"
            >
              ×
            </motion.button>
          )}
        </motion.div>
        <div className="relative">
          <Button 
            type="submit" 
            className="rounded-l-none bg-blue-600 hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
          >
            <Search size={16} className="mr-1" />
            Search
          </Button>
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            whileTap={{ scale: 0.95 }}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;
