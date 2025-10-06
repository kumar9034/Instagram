import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

export const Popup = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-5 left-1/2 z-[9999] w-[90%] max-w-[28%] -translate-x-1/2 rounded-xl bg-white shadow-xl ring-1 ring-red-200"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <XCircle className="h-6 w-6 text-red-600" />
            <p className="flex-1 text-sm font-medium text-gray-800">
              {message}
            </p>
            
          </div>
          <div className="h-1 w-full bg-red-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
