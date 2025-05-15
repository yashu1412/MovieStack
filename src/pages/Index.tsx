
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import MovieList from '@/components/MovieList';
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from '@/components/SearchBar';
import { useMovies } from '@/hooks/useMovies';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import { Movie } from '@/types/movie';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const { toast } = useToast();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    movies, 
    isLoading, 
    error, 
    currentPage, 
    totalPages,
    hasMore,
    loadMore 
  } = useMovies(searchQuery);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movies. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1b263b] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.header 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              type: "spring",
              stiffness: 200
            }}
          >
            Movie Catalog
          </motion.h1>
          <motion.p 
            className="text-blue-200 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Discover the latest and greatest films from around the world
          </motion.p>
          <SearchBar onSearch={handleSearch} />
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-0 bg-[#1b263b]/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="bg-[#0d1b2a]/70 border-b border-blue-900/30">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                <CardTitle className="text-2xl text-blue-300">Popular Movies</CardTitle>
                <CardDescription className="text-blue-200/70">
                  Browse through our collection of top-rated films
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[65vh] w-full">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      className="flex justify-center items-center h-64"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="h-16 w-16 border-t-2 border-b-2 border-blue-400 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="movies"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MovieList 
                        movies={movies} 
                        onMovieClick={handleMovieClick}
                        onLoadMore={loadMore}
                        hasMore={hasMore}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-center bg-[#0d1b2a]/70 border-t border-blue-900/30 py-4">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
                          <PaginationPrevious 
                            onClick={() => loadMore(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </motion.div>
                      </PaginationItem>
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNumber = currentPage - 2 + index;
                        if (pageNumber > 0 && pageNumber <= totalPages) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                <PaginationLink 
                                  onClick={() => loadMore(pageNumber)}
                                  isActive={pageNumber === currentPage}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </motion.div>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      <PaginationItem>
                        <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.9 }}>
                          <PaginationNext 
                            onClick={() => loadMore(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </motion.div>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              </AnimatePresence>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Index;
