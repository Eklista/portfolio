import React from 'react';
import { motion } from 'framer-motion';

const FolderWindow = ({ 
  window, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onBringToFront 
}) => {
  if (isMinimized) return null;

  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex || 100
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag
      dragMomentum={false}
      onMouseDown={() => onBringToFront(window.windowId)}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Window Header */}
      <div className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={() => onClose(window.windowId)}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-sm"
            ></button>
            <button
              onClick={() => onMinimize(window.windowId)}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors shadow-sm"
            ></button>
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-sm"></button>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${window.color} flex items-center justify-center shadow-sm`}>
              <window.icon size={18} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">{window.content.title}</span>
          </div>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-8 h-full overflow-y-auto">
        <div className="space-y-4">
          {window.content.items.map((item, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer shadow-sm hover:shadow-md"
              whileHover={{ x: 8, scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-gray-700 font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FolderWindow;