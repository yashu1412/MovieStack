
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Movie } from '@/types/movie';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 500 } },
  exit: { opacity: 0, y: -50, scale: 0.95 }
};

const MovieDetailsModal = ({ movie, onClose }: MovieDetailsModalProps) => {
  // Format the release date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-4xl w-full"
        >
          <Card className="bg-[#0d1b2a] border border-blue-900/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Poster Column */}
              <div className="relative aspect-[2/3] md:col-span-1 overflow-hidden hidden md:block">
                {movie.poster_path ? (
                  <motion.img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="object-cover w-full h-full"
                    initial={{ scale: 1.1, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1b263b]">
                    <span className="text-blue-300">No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Content Column */}
              <div className="md:col-span-2">
                <CardHeader className="bg-[#1b263b]/70">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <CardTitle className="text-2xl md:text-3xl text-blue-200">{movie.title}</CardTitle>
                        {movie.title !== movie.original_title && (
                          <CardDescription className="text-blue-300/80 mt-1">
                            Original: {movie.original_title}
                          </CardDescription>
                        )}
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" onClick={onClose} className="text-blue-300 hover:bg-blue-900/20">
                        <X />
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <ScrollArea className="h-[50vh] md:h-[60vh]">
                  <CardContent className="p-6">
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <h4 className="text-sm text-blue-400">Release Date</h4>
                          <p className="text-blue-100">{formatDate(movie.release_date)}</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <h4 className="text-sm text-blue-400">Rating</h4>
                          <p className="text-blue-100">
                            <motion.span 
                              className="text-yellow-400"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7, type: "spring" }}
                            >★</motion.span> {movie.vote_average?.toFixed(1)}/10
                            <span className="text-sm text-blue-300/70"> ({movie.vote_count} votes)</span>
                          </p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <h4 className="text-sm text-blue-400">Language</h4>
                          <p className="text-blue-100">{movie.original_language?.toUpperCase() || 'Unknown'}</p>
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <h3 className="text-xl font-medium text-blue-200 mb-2">Overview</h3>
                        <p className="text-blue-100/90 mb-6 leading-relaxed">
                          {movie.overview || 'No description available.'}
                        </p>
                      </motion.div>
                      
                      {movie.genre_ids && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                        >
                          <h3 className="text-xl font-medium text-blue-200 mb-2">Genres</h3>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genre_ids.map((genreId, index) => (
                              <motion.span 
                                key={genreId}
                                className="px-3 py-1 bg-blue-800/40 text-blue-200 rounded-full text-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + (index * 0.1) }}
                              >
                                {genreId}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {movie.popularity && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.9 }}
                        >
                          <h3 className="text-xl font-medium text-blue-200 mb-2">Popularity</h3>
                          <div className="w-full bg-[#1b263b] rounded-full h-2.5 mb-6 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-600 to-blue-400 h-2.5 rounded-full" 
                              initial={{ width: '0%' }}
                              animate={{ width: `${Math.min(movie.popularity / 2, 100)}%` }}
                              transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardContent>
                </ScrollArea>
                <CardFooter className="p-6 border-t border-blue-900/30 bg-[#1b263b]/70">
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </motion.div>
                </CardFooter>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieDetailsModal;
