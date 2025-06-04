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
  Folder as FolderIcon,
  FileText,
  Award,
  Heart
} from 'lucide-react';
import { Folder, FolderWindow, ChatTerminal, Taskbar } from '..';

const DesktopOS = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Auto-abrir terminal en desktop
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setIsChatOpen(true);
    }
  }, []);

  // Estructura mejorada de carpetas organizadas por categorías
  const folders = [
    // Primera fila - Servicios principales
    {
      id: 'web-development',
      name: 'Desarrollo Web',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      category: 'services',
      content: {
        title: 'Desarrollo Web',
        items: [
          'Aplicaciones React/Next.js',
          'Sitios WordPress Personalizados', 
          'E-commerce y Tiendas Online',
          'APIs y Backend Development',
          'PWAs y Aplicaciones Móviles',
          'Optimización y Performance'
        ]
      }
    },
    {
      id: 'ux-ui-design',
      name: 'UX/UI Design',
      icon: PenTool,
      color: 'from-purple-500 to-pink-500',
      category: 'services',
      content: {
        title: 'UX/UI Design',
        items: [
          'Investigación de Usuarios',
          'Wireframes y Prototipos',
          'Interfaces Web y Mobile',
          'Design Systems',
          'Testing de Usabilidad',
          'Optimización de Conversiones'
        ]
      }
    },
    {
      id: 'graphic-design',
      name: 'Diseño Gráfico',
      icon: Palette,
      color: 'from-orange-500 to-red-500',
      category: 'services',
      content: {
        title: 'Diseño Gráfico & Branding',
        items: [
          'Identidad Visual y Logos',
          'Branding Corporativo',
          'Diseño Editorial',
          'Packaging y Etiquetas',
          'Marketing Digital',
          'Ilustraciones Personalizadas'
        ]
      }
    },

    // Segunda fila - Portfolio y trabajos
    {
      id: 'web-projects',
      name: 'Proyectos Web',
      icon: Globe,
      color: 'from-emerald-500 to-teal-500',
      category: 'portfolio',
      content: {
        title: 'Portfolio - Proyectos Web',
        items: [
          'E-commerce Fashion Store',
          'SaaS Dashboard Analytics',
          'Restaurant Booking System',
          'Real Estate Platform',
          'Corporate Website',
          'Portfolio Photography'
        ]
      }
    },
    {
      id: 'design-portfolio',
      name: 'Portfolio Diseño',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-500',
      category: 'portfolio',
      content: {
        title: 'Portfolio - Diseño',
        items: [
          'Banking App UI/UX',
          'Healthcare Dashboard',
          'Mobile App Redesign',
          'Brand Identity Café Local',
          'Editorial Magazine Layout',
          'Packaging Cosméticos'
        ]
      }
    },
    {
      id: 'photography',
      name: 'Fotografía',
      icon: Camera,
      color: 'from-pink-500 to-rose-500',
      category: 'portfolio',
      content: {
        title: 'Fotografía',
        items: [
          'Retratos Corporativos',
          'Fotografía de Producto',
          'Eventos y Bodas',
          'Arquitectura y Espacios',
          'Street Photography',
          'Sesiones Comerciales'
        ]
      }
    },

    // Tercera fila - Información personal y contacto
    {
      id: 'about-me',
      name: 'Sobre Mí',
      icon: User,
      color: 'from-violet-500 to-purple-500',
      category: 'personal',
      content: {
        title: 'Acerca de EKLISTA',
        items: [
          'Mi Historia y Experiencia',
          'Filosofía de Diseño',
          'Habilidades Técnicas',
          'Formación y Certificaciones',
          'Clientes y Testimonios',
          'Pasiones y Hobbies'
        ]
      }
    },
    {
      id: 'achievements',
      name: 'Logros',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      category: 'personal',
      content: {
        title: 'Logros y Reconocimientos',
        items: [
          'Proyectos Destacados 2024',
          'Certificaciones Obtenidas',
          'Reconocimientos de Clientes',
          'Participación en Eventos',
          'Contribuciones Open Source',
          'Mentorías y Enseñanza'
        ]
      }
    },
    {
      id: 'contact',
      name: 'Contacto',
      icon: Mail,
      color: 'from-green-500 to-emerald-500',
      category: 'contact',
      content: {
        title: 'Contacto',
        items: [
          'hello@eklista.com',
          'WhatsApp: +502 1234-5678',
          'LinkedIn: /in/eklista',
          'GitHub: @eklista',
          'Instagram: @eklista.design',
          'Agenda una Reunión'
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
        size: { width: 650, height: 500 },
        isMinimized: false,
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

  const bringToFront = (windowId) => {
    const maxZ = Math.max(...openWindows.map(w => w.zIndex || 100));
    setOpenWindows(openWindows.map(w => 
      w.windowId === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };

  // Agrupar carpetas por categoría para mejor organización visual
  const groupedFolders = {
    services: folders.filter(f => f.category === 'services'),
    portfolio: folders.filter(f => f.category === 'portfolio'),
    personal: folders.filter(f => f.category === 'personal'),
    contact: folders.filter(f => f.category === 'contact')
  };

  return (
    <div className="h-screen w-full relative overflow-hidden select-none">
      {/* Wallpaper fijo - sin sistema de cambio */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.jpg')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Title Section - Back to left side, more subtle */}
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
          {/* Folders Section - Alineados a la izquierda como escritorio real */}
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

      {/* Chat Terminal */}
      <ChatTerminal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setChatMinimized(!chatMinimized)}
        isMinimized={chatMinimized}
        isMobile={window.innerWidth < 1024}
      />

      {/* Windows */}
      <AnimatePresence>
        {openWindows.map((window) => (
          <FolderWindow
            key={window.windowId}
            window={window}
            isMinimized={window.isMinimized}
            onClose={closeWindow}
            onMinimize={toggleWindow}
            onBringToFront={bringToFront}
          />
        ))}
      </AnimatePresence>

      {/* Taskbar - Props simplificados */}
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