
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  index: number;
}

const MovieCard = ({ movie, onClick, index }: MovieCardProps) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card 
        onClick={onClick}
        className="overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer bg-[#1b263b]/80 border border-blue-900/30 h-full flex flex-col"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0d1b2a]">
              <span className="text-blue-300">No Image Available</span>
            </div>
          )}
          <motion.div 
            className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm font-bold rounded-bl-md"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          >
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </motion.div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-blue-200 line-clamp-1">{movie.title}</CardTitle>
          <CardDescription className="text-blue-300/80">
            {releaseYear} • {movie.original_language?.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-blue-100/90 line-clamp-3 text-sm">{movie.overview || 'No description available'}</p>
        </CardContent>
        <CardFooter className="pt-2 pb-4 flex justify-end">
          <motion.span 
            className="text-xs text-blue-300/70 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            Click to view details
          </motion.span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
