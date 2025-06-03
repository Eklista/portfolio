import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Minus, X, Square } from 'lucide-react';

const DraggableTerminal = ({ 
  initialPosition = { x: window.innerWidth - 530, y: 120 },
  onClose,
  onMinimize,
  isMinimized = false,
  zIndex = 200,
  isMobile = false
}) => {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const [position, setPosition] = useState(initialPosition);

  // Configuración responsive
  const terminalWidth = isMobile ? window.innerWidth - 40 : 500;
  const terminalHeight = isMobile ? 260 : 380;

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    const sequence = [
      { text: "Welcome to EKLISTA Portfolio OS", delay: 500 },
      { text: "", delay: 200 },
      { text: "Initializing creative workspace...", delay: 800 },
      { text: "✓ Loading projects", delay: 600 },
      { text: "✓ Mounting design assets", delay: 400 },
      { text: "✓ Connecting to inspiration", delay: 500 },
      { text: "", delay: 300 },
      { text: "System ready. Double-click folders to explore.", delay: 700 },
      { text: "", delay: 200 },
      { text: "$ portfolio --status", delay: 1000 },
      { text: "Online | Creative Mode Active", delay: 300 },
      { text: "", delay: 500 },
      { text: "Ready for collaboration ✨", delay: 400 }
    ];

    let timeouts = [];
    let currentDelay = 0;

    sequence.forEach((item) => {
      currentDelay += item.delay;
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, item.text]);
      }, currentDelay);
      timeouts.push(timeout);
    });

    return () => {
      clearInterval(cursorInterval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // En móvil, ajustar posición inicial
  useEffect(() => {
    if (isMobile) {
      setPosition({ x: 20, y: 0 });
    }
  }, [isMobile]);

  if (isMinimized) return null;

  const constraintsConfig = isMobile 
    ? {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    : {
        left: 0,
        right: window.innerWidth - 500,
        top: 30,
        bottom: window.innerHeight - 380
      };

  return (
    <motion.div
      className="absolute bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: terminalWidth,
        height: terminalHeight,
        zIndex: zIndex
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag={!isMobile}
      dragMomentum={false}
      dragConstraints={constraintsConfig}
      onDrag={!isMobile ? (event, info) => {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 500, info.point.x - 250)),
          y: Math.max(30, Math.min(window.innerHeight - 380, info.point.y - 20))
        });
      } : undefined}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
    >
      {/* Terminal Header - macOS style */}
      <div className={`bg-gray-800/80 backdrop-blur-sm px-4 ${
        isMobile ? 'py-2' : 'py-3'
      } flex items-center justify-between border-b border-gray-700/50 ${
        isMobile ? '' : 'cursor-move'
      }`}>
        <div className="flex items-center space-x-3">
          {/* Traffic Light Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className={`${
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center group`}
            >
              <X size={isMobile ? 6 : 8} className="text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={onMinimize}
              className={`${
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors shadow-sm flex items-center justify-center group`}
            >
              <Minus size={isMobile ? 6 : 8} className="text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className={`${
              isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
            } bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center group`}>
              <Square size={isMobile ? 4 : 6} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          
          {/* Terminal Title */}
          <div className="flex items-center space-x-2 ml-4">
            <Terminal size={isMobile ? 12 : 16} className="text-gray-400" />
            <span className={`text-gray-300 ${
              isMobile ? 'text-xs' : 'text-sm'
            } font-mono`}>creative-terminal</span>
          </div>
        </div>
        
        {/* Window Controls - Solo en desktop */}
        {!isMobile && (
          <div className="text-gray-500 text-xs">
            ⌘ Draggable
          </div>
        )}
      </div>

      {/* Terminal Content */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} h-full overflow-hidden`}>
        <div className={`font-mono ${
          isMobile ? 'text-xs' : 'text-sm'
        } leading-relaxed h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent`}>
          {lines.map((line, index) => (
            <motion.div
              key={index}
              className={`${isMobile ? 'mb-0.5' : 'mb-1'} ${
                line.startsWith('✓') 
                  ? 'text-green-400' 
                  : line.startsWith('$') 
                  ? 'text-blue-400' 
                  : line.includes('Ready') || line.includes('✨')
                  ? 'text-purple-400'
                  : line.includes('EKLISTA')
                  ? 'text-white font-bold'
                  : 'text-gray-300'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {line || ' '}
            </motion.div>
          ))}
          <div className={`flex items-center text-green-400 ${isMobile ? 'mt-1' : 'mt-2'}`}>
            <span>$ </span>
            <span className={`ml-1 ${showCursor ? 'border-r-2 border-green-400' : ''} pr-1`}>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DraggableTerminal;