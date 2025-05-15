
import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';

// We'll use TMDB API
const API_KEY = '37743222a7d03aee94abafe7ef5a846e'; // This is a public TMDB API key for demo purposes
const BASE_URL = 'https://api.themoviedb.org/3';

export const useMovies = (searchQuery: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(async (page: number = 1, isLoadMore: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let url;
      if (searchQuery.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Limit to 9 movies per page
      const limitedResults = data.results.slice(0, 9);
      setMovies(prev => isLoadMore ? [...prev, ...limitedResults] : limitedResults);
      
      // Adjust total pages based on 9 movies per page
      const totalMovies = data.total_results;
      const adjustedTotalPages = Math.ceil(totalMovies / 9);
      setTotalPages(adjustedTotalPages > 500 ? 500 : adjustedTotalPages);
      
      setCurrentPage(page);
      setHasMore(page < adjustedTotalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      if (!isLoadMore) setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const loadMore = useCallback((page?: number) => {
    if (isLoading) return;
    
    if (page !== undefined) {
      // Handle specific page navigation
      if (page >= 1 && page <= totalPages) {
        fetchMovies(page, false);
      }
    } else {
      // Handle default "load more" behavior
      if (hasMore) {
        fetchMovies(currentPage + 1, true);
      }
    }
  }, [currentPage, hasMore, isLoading, fetchMovies, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1, false);
  }, [searchQuery, fetchMovies]);

  // Inside useMovies hook
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchMovies(page, false);
  }, [totalPages, fetchMovies]);

  // Add a new function for handling previous/next navigation
  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMovies(newPage, false);
    }
  }, [currentPage, totalPages, fetchMovies]);

  return {
    movies,
    isLoading,
    error,
    currentPage,
    totalPages,
    hasMore,
    loadMore,
    handlePageChange,
    handleNavigation  // Add this to the return object
  };
};
