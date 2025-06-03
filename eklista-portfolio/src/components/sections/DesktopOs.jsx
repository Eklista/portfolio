import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Palette, 
  Briefcase, 
  Camera, 
  User, 
  Mail,
  Wifi,
  Battery,
  Terminal,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Folder, FolderWindow, DraggableTerminal } from '../ui';

const DesktopOS = () => {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState([]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const folders = [
    {
      id: 'web-projects',
      name: 'Proyectos Web',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      content: {
        title: 'Proyectos Web',
        items: [
          'E-commerce React + Stripe',
          'SaaS Dashboard Vue.js',
          'Landing Page Next.js',
          'API REST Node.js',
          'PWA Mobile App'
        ]
      }
    },
    {
      id: 'design',
      name: 'UI/UX Design',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      content: {
        title: 'UI/UX Design',
        items: [
          'Banking Mobile App',
          'SaaS Platform Redesign',
          'Design System Creation',
          'Figma Prototypes',
          'User Research Studies'
        ]
      }
    },
    {
      id: 'branding',
      name: 'Branding',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      content: {
        title: 'Branding & Identity',
        items: [
          'Tech Startup Logo',
          'Restaurant Brand Identity',
          'Brand Guidelines',
          'Packaging Design',
          'Marketing Materials'
        ]
      }
    },
    {
      id: 'photography',
      name: 'Fotografía',
      icon: Camera,
      color: 'from-green-500 to-teal-500',
      content: {
        title: 'Fotografía',
        items: [
          'Corporate Portraits',
          'Product Photography',
          'Event Coverage',
          'Street Photography',
          'Commercial Shoots'
        ]
      }
    },
    {
      id: 'about',
      name: 'Sobre Mí',
      icon: User,
      color: 'from-indigo-500 to-purple-500',
      content: {
        title: 'Sobre Mí',
        items: [
          'Mi Historia Profesional',
          'Habilidades Técnicas',
          'Experiencia Laboral',
          'Educación y Certificaciones',
          'Filosofía de Diseño'
        ]
      }
    },
    {
      id: 'contact',
      name: 'Contacto',
      icon: Mail,
      color: 'from-pink-500 to-rose-500',
      content: {
        title: 'Contacto',
        items: [
          'hello@eklista.com',
          'LinkedIn Profile',
          'GitHub Repository',
          'Instagram Portfolio',
          'Schedule a Call'
        ]
      }
    }
  ];

  const openWindow = (folder) => {
    if (!openWindows.find(w => w.id === folder.id)) {
      const newWindow = {
        ...folder,
        windowId: Date.now(),
        position: { x: 150 + openWindows.length * 40, y: 100 + openWindows.length * 40 },
        size: { width: 600, height: 500 },
        isMinimized: false,
        zIndex: 100 + openWindows.length
      };
      setOpenWindows([...openWindows, newWindow]);
    }
  };

  const closeWindow = (windowId) => {
    setOpenWindows(openWindows.filter(w => w.windowId !== windowId));
  };

  const minimizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(w => 
      w.windowId === windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const bringToFront = (windowId) => {
    const maxZ = Math.max(...openWindows.map(w => w.zIndex || 100));
    setOpenWindows(openWindows.map(w => 
      w.windowId === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };

  const closeTerminal = () => {
    setShowTerminal(false);
  };

  const minimizeTerminal = () => {
    setTerminalMinimized(!terminalMinimized);
  };

  // Componente Terminal para móvil
  const MobileTerminal = () => {
    const [lines, setLines] = useState([]);
    const [showCursor, setShowCursor] = useState(true);

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

    return (
      <div className="bg-black/95 backdrop-blur-xl rounded-t-2xl border-t border-white/20 h-full overflow-hidden">
        {/* Header con handle */}
        <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Terminal size={16} className="text-gray-400" />
            <span className="text-gray-300 text-sm font-mono">creative-terminal</span>
          </div>
          <button
            onClick={() => setMobileTerminalOpen(false)}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown size={16} />
            <span className="text-xs">Cerrar</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-hidden flex flex-col">
          <div className="font-mono text-sm leading-relaxed flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                className={`mb-1 ${
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
            <div className="flex items-center text-green-400 mt-2">
              <span>$ </span>
              <span className={`ml-1 ${showCursor ? 'border-r-2 border-green-400' : ''} pr-1`}>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full relative overflow-hidden select-none">
      {/* Custom Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/wallpaper.jpg')`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Top Menu Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 h-8 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4 text-white/80 text-sm">
          <span className="font-semibold">EKLISTA</span>
          <span>Portfolio</span>
          <span>Creative</span>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <Wifi size={14} />
          <Battery size={14} />
          <span className="text-xs font-mono">
            {time.toLocaleTimeString('es-GT', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {/* Title Section */}
      <div className="absolute top-12 left-8 z-40">
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-white tracking-tight"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.02em',
            textShadow: '0 0 40px rgba(255,255,255,0.3)'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EKLISTA
        </motion.h1>
        <motion.p 
          className="text-white/80 text-lg md:text-xl font-light mt-2 ml-1"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Creative Operating System
        </motion.p>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-44 md:pt-40 pb-20 px-4 md:px-8 lg:pb-20">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full">
          {/* Folders Section - Alineados a la izquierda */}
          <div className="w-auto">
            <motion.div 
              className="grid grid-cols-3 gap-6 p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {folders.map((folder, index) => (
                <Folder
                  key={folder.id}
                  folder={folder}
                  index={index}
                  onDoubleClick={openWindow}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Folders Section - Mobile (más grandes y mejor espaciado) */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 gap-10 px-6 flex-1 content-start pb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {folders.map((folder, index) => (
              <Folder
                key={folder.id}
                folder={folder}
                index={index}
                onDoubleClick={openWindow}
                isMobileLarge={true}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Draggable Terminal - Desktop Only */}
      {showTerminal && (
        <div className="hidden lg:block">
          <DraggableTerminal 
            onClose={closeTerminal}
            onMinimize={minimizeTerminal}
            isMinimized={terminalMinimized}
            zIndex={150}
          />
        </div>
      )}

      {/* Mobile Terminal Drawer */}
      <AnimatePresence>
        {mobileTerminalOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 bottom-0 z-40"
            style={{ height: '60vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <MobileTerminal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <FolderWindow
            key={window.windowId}
            window={window}
            isMinimized={window.isMinimized}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onBringToFront={bringToFront}
          />
        ))}
      </AnimatePresence>

      {/* Dock */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 border border-white/30 shadow-2xl flex items-center space-x-3">
          {/* Terminal Button - Desktop */}
          {!showTerminal && (
            <motion.button
              className="hidden lg:flex w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center shadow-lg transition-all"
              whileHover={{ scale: 1.2, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTerminal(true)}
            >
              <Terminal size={24} className="text-white" />
            </motion.button>
          )}

          {/* Terminal Button - Mobile */}
          <motion.button
            className="lg:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileTerminalOpen(!mobileTerminalOpen)}
          >
            {mobileTerminalOpen ? (
              <ChevronDown size={24} className="text-white" />
            ) : (
              <Terminal size={24} className="text-white" />
            )}
          </motion.button>
          
          {/* Terminal Minimized State - Desktop */}
          {showTerminal && terminalMinimized && (
            <motion.button
              className="hidden lg:flex w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center shadow-lg transition-all opacity-70"
              whileHover={{ scale: 1.2, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={minimizeTerminal}
            >
              <Terminal size={24} className="text-white" />
            </motion.button>
          )}
          
          {/* Folder Windows */}
          {openWindows.map((window) => (
            <motion.button
              key={window.windowId}
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${window.color} flex items-center justify-center shadow-lg transition-all ${
                window.isMinimized ? 'opacity-50' : 'opacity-100'
              }`}
              whileHover={{ scale: 1.2, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => minimizeWindow(window.windowId)}
            >
              <window.icon size={24} className="text-white" />
            </motion.button>
          ))}
          
          {openWindows.length === 0 && showTerminal && !terminalMinimized && !mobileTerminalOpen && (
            <div className="text-white/60 text-sm px-4 py-2">
              Haz doble clic en las carpetas para abrir
            </div>
          )}
        </div>
      </div>

      {/* Overlay cuando terminal móvil está abierta */}
      {mobileTerminalOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileTerminalOpen(false)}
        />
      )}
    </div>
  );
};

export default DesktopOS;