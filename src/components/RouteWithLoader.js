// components/RouteWithLoader.js
import React, { useEffect, useState } from 'react';
import PageLoader from './PageLoader';
import { motion, AnimatePresence } from 'framer-motion';

const RouteWithLoader = ({ children, delay = 1000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <PageLoader />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteWithLoader;
