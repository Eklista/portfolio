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
import WindowContact from './WindowContact'; // NUEVO IMPORT
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
    },
    // Carpetas adicionales para completar el grid
    {
      id: 'certificaciones',
      name: 'Certificaciones',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      category: 'info',
      content: {
        title: 'Certificaciones y Logros',
        description: 'Mis credenciales y reconocimientos profesionales',
        sections: [
          {
            title: 'Certificaciones Técnicas',
            description: 'Credenciales en las últimas tecnologías',
            content: [
              '🏆 React Advanced Certification - Meta (2024)',
              '🏆 AWS Solutions Architect - Amazon (2023)',
              '🏆 Google UX Design Certificate (2023)',
              '🏆 Advanced TypeScript - Microsoft (2024)',
              '🏆 Next.js Expert Certification (2024)'
            ]
          },
          {
            title: 'Reconocimientos',
            description: 'Premios y menciones recibidas',
            content: [
              '🥇 Mejor Portfolio Digital - Awwwards (2024)',
              '🥇 Proyecto del Año - Guatemala Tech Awards (2023)',
              '🥈 Innovación en UX - Design Awards GT (2024)',
              '⭐ 5.0 estrellas promedio en testimonios de clientes',
              '📈 100% de proyectos entregados a tiempo'
            ]
          }
        ]
      }
    },
    {
      id: 'recursos',
      name: 'Recursos',
      icon: Monitor,
      color: 'from-teal-500 to-cyan-500',
      category: 'info',
      content: {
        title: 'Recursos y Herramientas',
        description: 'Tools y recursos que uso en mis proyectos',
        sections: [
          {
            title: 'Design Tools',
            description: 'Herramientas de diseño que domino',
            content: [
              '🎨 Figma - Diseño de interfaces y prototipos',
              '🎨 Adobe Creative Suite - Diseño gráfico completo',
              '🎨 Sketch - Diseño de productos digitales',
              '🎨 InVision - Prototipado y colaboración',
              '🎨 Principle - Animaciones de UI'
            ]
          },
          {
            title: 'Development Stack',
            description: 'Tecnologías de desarrollo actuales',
            content: [
              '⚡ Frontend: React, Next.js, TypeScript, Tailwind',
              '⚡ Backend: Node.js, Express, MongoDB, PostgreSQL',
              '⚡ Tools: Git, Docker, AWS, Vercel, Figma',
              '⚡ Testing: Jest, Cypress, Testing Library',
              '⚡ CMS: WordPress, Strapi, Contentful'
            ]
          }
        ]
      }
    }
  ];

  const openWindow = (folder) => {
    if (!openWindows.find(w => w.id === folder.id)) {
      const newWindow = {
        ...folder,
        windowId: Date.now(),
        position: { 
          x: 150 + (openWindows.length % 3) * 60, 
          y: 100 + (openWindows.length % 3) * 60 
        },
        size: { width: 900, height: 600 }, // Ventanas más grandes
        originalSize: { width: 900, height: 600 },
        originalPosition: {
          x: 150 + (openWindows.length % 3) * 60, 
          y: 100 + (openWindows.length % 3) * 60 
        },
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

  // Componente para renderizar la ventana correcta según el tipo
  const renderWindow = (window) => {
    switch (window.category) {
      case 'explorer':
        return (
          <WindowExplorer
            key={window.windowId}
            window={window}
            isMinimized={window.isMinimized}
            onClose={closeWindow}
            onMinimize={toggleWindow}
            onMaximize={maximizeWindow}
            onBringToFront={bringToFront}
          />
        );
      case 'contact':
        return (
          <WindowContact
            key={window.windowId}
            window={window}
            isMinimized={window.isMinimized}
            onClose={closeWindow}
            onMinimize={toggleWindow}
            onMaximize={maximizeWindow}
            onBringToFront={bringToFront}
          />
        );
      default:
        return (
          <WindowInfo
            key={window.windowId}
            window={window}
            isMinimized={window.isMinimized}
            onClose={closeWindow}
            onMinimize={toggleWindow}
            onMaximize={maximizeWindow}
            onBringToFront={bringToFront}
          />
        );
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

      {/* Title Section */}
      <div className="absolute top-12 left-8 z-40">
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-white tracking-tight font-poppins"
          style={{ 
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
          className="text-white/80 text-lg md:text-xl font-light mt-2 ml-1 font-inter"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Creative Operating System
        </motion.p>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-44 md:pt-40 pb-20 px-8 md:px-12">
        {/* Desktop Layout */}
        <div className="hidden lg:block h-full">
          <div className="w-auto">
            <motion.div 
              className="grid grid-cols-3 gap-8 p-8 w-fit"
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
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 gap-10 px-8 flex-1 content-start pb-4"
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