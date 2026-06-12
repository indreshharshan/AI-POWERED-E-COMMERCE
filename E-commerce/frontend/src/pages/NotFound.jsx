import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-9xl font-black text-gray-200"
        >
          404
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative -mt-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className="inline-block px-8 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg shadow-red-200"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
