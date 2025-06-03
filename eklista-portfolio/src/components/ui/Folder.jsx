import React from 'react';
import { motion } from 'framer-motion';

const Folder = ({ folder, index, onDoubleClick }) => {
  return (
    <motion.div
      className="cursor-pointer group flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={() => onDoubleClick(folder)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
    >
      {/* Folder Icon - macOS Style */}
      <div className="relative mb-3">
        {/* Folder Shadow */}
        <div className="absolute top-2 left-2 w-16 h-16 bg-black/20 rounded-lg blur-sm lg:block hidden"></div>
        <div className="absolute top-1 left-1 w-12 h-12 bg-black/20 rounded-lg blur-sm lg:hidden"></div>
        
        {/* Folder Body */}
        <div className="relative w-16 h-16 lg:block hidden group-hover:scale-110 transition-transform duration-200">
          {/* Folder Back */}
          <div className={`absolute inset-0 bg-gradient-to-br ${folder.color} rounded-lg shadow-lg`}></div>
          
          {/* Folder Tab */}
          <div className={`absolute -top-1 left-2 w-6 h-3 bg-gradient-to-br ${folder.color} rounded-t-md shadow-sm`}></div>
          
          {/* Folder Front */}
          <div className={`absolute inset-0 bg-gradient-to-br ${folder.color} opacity-90 rounded-lg shadow-inner border border-white/20`}></div>
          
          {/* Folder Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <folder.icon size={24} className="text-white drop-shadow-lg" />
          </div>
          
          {/* Folder Highlight */}
          <div className="absolute top-1 left-1 right-1 h-4 bg-white/20 rounded-t-lg blur-sm"></div>
        </div>

        {/* Mobile Folder Icon */}
        <div className="relative w-12 h-12 lg:hidden group-hover:scale-110 transition-transform duration-200">
          <div className={`absolute inset-0 bg-gradient-to-br ${folder.color} rounded-lg shadow-lg`}></div>
          <div className={`absolute -top-0.5 left-1.5 w-4 h-2 bg-gradient-to-br ${folder.color} rounded-t-md shadow-sm`}></div>
          <div className={`absolute inset-0 bg-gradient-to-br ${folder.color} opacity-90 rounded-lg shadow-inner border border-white/20`}></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <folder.icon size={18} className="text-white drop-shadow-lg" />
          </div>
          
          <div className="absolute top-0.5 left-0.5 right-0.5 h-3 bg-white/20 rounded-t-lg blur-sm"></div>
        </div>
      </div>
      
      {/* Folder Label */}
      <div className="text-center max-w-20 lg:max-w-20 max-w-16">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 lg:px-3 lg:py-1.5 px-2 py-1 rounded-lg lg:rounded-lg rounded-md">
          <span className="text-white text-xs font-medium leading-tight drop-shadow-lg">
            {folder.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Folder;