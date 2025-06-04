import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Palette, 
  Briefcase, 
  Camera, 
  User, 
  Mail,
  Code,
  PenTool,
  Award,
  Monitor
} from 'lucide-react';
import { Folder, Taskbar } from '..';
import ModernChat from '../chat/ModernChat';
import WindowExplorer from './WindowExplorer';
import WindowInfo from './WindowInfo';
import WindowContact from './WindowContact';
import { explorerStructure } from '../../data/projects';

const DesktopOS = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto-abrir chat en desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setTimeout(() => {
        setIsChatOpen(true);
      }, 1500);
    }
  }, []);

  const isMobile = window.innerWidth < 1024;

  // Estructura de carpetas del escritorio
  const folders = [
    {
      id: 'portfolio',
      name: 'Mi Portfolio',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-500',
      category: 'explorer',
      ...explorerStructure.portfolio
    },
    {
      id: 'servicios',
      name: 'Mis Servicios',
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      category: 'info',
      ...explorerStructure.servicios
    },
    {
      id: 'sobre-mi',
      name: 'Sobre Mí',
      icon: User,
      color: 'from-violet-500 to-purple-500',
      category: 'info',
      ...explorerStructure['sobre-mi']
    },
    {
      id: 'contacto',
      name: 'Contacto',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      category: 'contact',
      content: {
        title: 'Información de Contacto',
        description: 'Formas de contactarme para tu próximo proyecto'
      }
    }
  ];

  const getInitialWindowDimensions = (category = 'explorer') => {
    // Verificación de seguridad
    if (typeof window === 'undefined') {
      return {
        width: 800,
        height: 600,
        position: { x: 100, y: 100 }
      };
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < 768;
    
    if (isMobile) {
      return {
        width: screenWidth - 20,
        height: screenHeight - 120,
        position: { x: 10, y: 60 }
      };
    } else {
      // Dimensiones para desktop/tablet
      const configs = {
        explorer: { width: Math.min(1200, screenWidth - 200), height: Math.min(800, screenHeight - 200) },
        contact: { width: Math.min(1000, screenWidth - 200), height: Math.min(700, screenHeight - 200) },
        info: { width: Math.min(1000, screenWidth - 200), height: Math.min(750, screenHeight - 200) }
      };
      
      const config = configs[category] || configs.explorer;
      
      return {
        width: config.width,
        height: config.height,
        position: { 
          x: 100 + (openWindows.length % 3) * 60, 
          y: 100 + (openWindows.length % 3) * 60 
        }
      };
    }
  };

  const openWindow = (folder) => {
    if (!openWindows.find(w => w.id === folder.id)) {
      const initialDimensions = getInitialWindowDimensions(folder.category);
      
      const newWindow = {
        ...folder,
        windowId: Date.now(),
        position: initialDimensions.position,
        size: { width: initialDimensions.width, height: initialDimensions.height },
        originalSize: { width: initialDimensions.width, height: initialDimensions.height },
        originalPosition: initialDimensions.position,
        isMinimized: false,
        isMaximized: false,
        zIndex: 100 + openWindows.length
      };
      
      setOpenWindows([...openWindows, newWindow]);
    }
  };

  const closeWindow = (windowId) => {
    setOpenWindows(openWindows.filter(w => w.windowId !== windowId));
  };

  const toggleWindow = (window) => {
    setOpenWindows(openWindows.map(w => 
      w.windowId === window.windowId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const maximizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(w => {
      if (w.windowId === windowId) {
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized: false,
            position: w.originalPosition,
            size: w.originalSize
          };
        } else {
          return {
            ...w,
            isMaximized: true,
            position: { x: 20, y: 20 },
            size: { 
              width: window.innerWidth - 40, 
              height: window.innerHeight - 120
            }
          };
        }
      }
      return w;
    }));
  };

  const bringToFront = (windowId) => {
    const maxZ = Math.max(...openWindows.map(w => w.zIndex || 100));
    setOpenWindows(openWindows.map(w => 
      w.windowId === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };
  
  const renderWindow = (window) => {
    // Separar la key del resto de props para evitar el warning
    const { windowId, ...windowProps } = window;
    
    const commonProps = {
      window: window,
      isMinimized: window.isMinimized,
      onClose: closeWindow,
      onMinimize: toggleWindow,
      onMaximize: maximizeWindow,
      onBringToFront: bringToFront
    };

    switch (window.category) {
      case 'explorer':
        return <WindowExplorer key={windowId} {...commonProps} />;
      case 'contact':
        return <WindowContact key={windowId} {...commonProps} />;
      default:
        return <WindowInfo key={windowId} {...commonProps} />;
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden select-none">
      {/* Wallpaper fijo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-20 pb-20 px-8 md:px-12">
        {/* Desktop Layout */}
        <div className="hidden lg:block h-full">
          <div className="w-auto">
            <motion.div 
              className="p-8 w-fit space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Portfolio - Primera fila, alineado a la izquierda */}
              <div className="flex justify-start">
                <Folder
                  key={folders[0].id}
                  folder={folders[0]}
                  index={0}
                  onClick={openWindow}
                />
              </div>
              
              {/* Servicios - Segunda fila, alineado a la izquierda */}
              <div className="flex justify-start">
                <Folder
                  key={folders[1].id}
                  folder={folders[1]}
                  index={1}
                  onClick={openWindow}
                />
              </div>
              
              {/* Sobre Mí - Tercera fila, alineado a la izquierda */}
              <div className="flex justify-start">
                <Folder
                  key={folders[2].id}
                  folder={folders[2]}
                  index={2}
                  onClick={openWindow}
                />
              </div>
              
              {/* Contacto - Cuarta fila, alineado a la izquierda */}
              <div className="flex justify-start">
                <Folder
                  key={folders[3].id}
                  folder={folders[3]}
                  index={3}
                  onClick={openWindow}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col h-full">
          <motion.div 
            className="grid grid-cols-2 gap-10 px-8 flex-1 content-start pb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {folders.map((folder, index) => (
              <Folder
                key={folder.id}
                folder={folder}
                index={index}
                onClick={openWindow}
                isMobileLarge={true}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modern Chat */}
      <ModernChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setChatMinimized(!chatMinimized)}
        isMinimized={chatMinimized}
        isMobile={isMobile}
      />

      {/* Windows - Renderizado dinámico según tipo */}
      <AnimatePresence>
        {openWindows.map((window) => renderWindow(window))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        onWindowToggle={toggleWindow}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        showNotifications={showNotifications}
        onNotificationsToggle={() => setShowNotifications(!showNotifications)}
      />

      {/* Background decorations */}
      <div className="absolute bottom-20 right-8 opacity-20 pointer-events-none hidden lg:block">
        <motion.div
          className="text-white/10 text-9xl font-black"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.02, 0.98, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          EK
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-16 w-2 h-2 bg-accent-primary rounded-full opacity-60 hidden lg:block"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-20 w-1 h-1 bg-white rounded-full opacity-40 hidden lg:block"
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-accent-light rounded-full opacity-50 hidden lg:block"
        animate={{
          x: [0, 10, 0],
          y: [0, -15, 0],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

export default DesktopOS;