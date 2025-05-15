
import React, { useEffect, useCallback } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/types/movie';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const MovieList = ({ movies, onMovieClick, onLoadMore, hasMore, isLoading }: MovieListProps) => {
  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 800; 

    if (scrollPosition >= threshold) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (movies.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64 p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.svg 
          className="w-16 h-16 text-blue-400 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
        </motion.svg>
        <motion.h3 
          className="text-xl font-semibold text-blue-300 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          No Movies Found
        </motion.h3>
        <motion.p 
          className="text-blue-200/70"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Try adjusting your search criteria
        </motion.p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onClick={() => onMovieClick(movie)} 
            index={index}
          />
        ))}
        {isLoading && (
          <motion.div 
            className="col-span-full flex justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-8 w-8 border-t-2 border-b-2 border-blue-400 rounded-full animate-spin" />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default MovieList;
