import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2, 
  ArrowLeft, 
  Home, 
  ChevronRight,
  Folder as FolderIcon,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Zap
} from 'lucide-react';
import { explorerStructure, projectsData } from '../../data/projects';
import TechCard from '../ui/TechCard';

const WindowExplorer = ({ 
  window: windowProp, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
  const [currentPath, setCurrentPath] = useState([windowProp.id]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 800,
        position: { x: 100, y: 100 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    if (isMobile) {
      return {
        width: screenWidth,
        height: screenHeight - 80,
        position: { x: 0, y: 0 },
        isMobile: true,
        isTablet: false,
        isDesktop: false
      };
    } else if (isTablet) {
      return {
        width: Math.min(1000, screenWidth - 40),
        height: Math.min(screenHeight - 100, 850),
        position: { x: 20, y: 50 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1400, screenWidth - 120),
        height: Math.min(screenHeight - 100, 900),
        position: { x: 60, y: 40 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());
    setIsMaximized(windowProp.isMaximized || false);

    const handleResize = () => {
      if (!isMaximized) {
        setWindowDimensions(getResponsiveDimensions());
      }
    };

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  if (isMinimized || !windowDimensions) return null;

  // Función mejorada para obtener contenido actual
  const getCurrentContent = () => {
    try {
      let current = explorerStructure[currentPath[0]];
      
      if (!current) {
        console.warn(`No se encontró contenido para la ruta raíz: ${currentPath[0]}`);
        return null;
      }
      
      for (let i = 1; i < currentPath.length; i++) {
        const pathSegment = currentPath[i];
        
        if (current.children && typeof current.children === 'object' && current.children[pathSegment]) {
          current = current.children[pathSegment];
        } else {
          console.warn(`No se encontró el segmento de ruta: ${pathSegment} en:`, current);
          setCurrentPath(prevPath => prevPath.slice(0, i));
          return current;
        }
      }
      
      return current;
    } catch (error) {
      console.error('Error al obtener contenido actual:', error);
      setCurrentPath([windowProp.id]);
      return explorerStructure[windowProp.id];
    }
  };

  // Función mejorada para obtener proyectos
  const getCurrentProjects = () => {
    const current = getCurrentContent();
    
    if (!current) return null;
    
    if (current.children && typeof current.children === 'string') {
      const projects = projectsData[current.children];
      if (!projects) {
        console.warn(`No se encontraron proyectos para la referencia: ${current.children}`);
        return [];
      }
      return projects;
    }
    
    return null;
  };

  // Navegación con validaciones mejoradas
  const navigateTo = (pathSegment) => {
    const current = getCurrentContent();
    
    if (!current) {
      console.warn('No hay contenido actual para navegar');
      return;
    }
    
    if (current.children && typeof current.children === 'object' && current.children[pathSegment]) {
      setCurrentPath(prevPath => {
        const newPath = [...prevPath, pathSegment];
        return newPath;
      });
    } else {
      console.warn(`Segmento de navegación no válido: ${pathSegment}`);
    }
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prevPath => prevPath.slice(0, -1));
    }
  };

  const navigateHome = () => {
    setCurrentPath([windowProp.id]);
  };

  // Generar breadcrumbs con manejo de errores MEJORADO
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    try {
      let current = explorerStructure[currentPath[0]];
      
      if (!current) {
        return [{ name: 'Error', path: [windowProp.id] }];
      }
      
      breadcrumbs.push({ 
        name: current.name, 
        path: [currentPath[0]] 
      });

      for (let i = 1; i < currentPath.length; i++) {
        const pathSegment = currentPath[i];
        
        if (current.children && typeof current.children === 'object' && current.children[pathSegment]) {
          current = current.children[pathSegment];
          breadcrumbs.push({ 
            name: current.name, 
            path: currentPath.slice(0, i + 1) 
          });
        } else {
          console.warn(`Breadcrumb inválido en: ${pathSegment}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error al generar breadcrumbs:', error);
      return [{ name: explorerStructure[windowProp.id]?.name || 'Error', path: [windowProp.id] }];
    }

    return breadcrumbs;
  };

  const currentContent = getCurrentContent();
  const currentProjects = getCurrentProjects();
  const breadcrumbs = getBreadcrumbs();

  const navigateToBreadcrumb = (targetPath) => {
    if (Array.isArray(targetPath) && targetPath.length > 0) {
      setCurrentPath([...targetPath]);
    }
  };

  // Dimensiones
  const getMaximizedDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 800,
        position: { x: 20, y: 20 }
      };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;

    return {
      width: windowDimensions.isMobile ? screenWidth : screenWidth - 40,
      height: windowDimensions.isMobile ? screenHeight - 80 : screenHeight - 100,
      position: { x: windowDimensions.isMobile ? 0 : 20, y: windowDimensions.isMobile ? 0 : 20 }
    };
  };

  const getCurrentWindowSize = () => {
    if (isMaximized) {
      return getMaximizedDimensions();
    }
    return windowDimensions;
  };

  const getDragConstraints = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const currentSize = getCurrentWindowSize();

    if (isMaximized || windowDimensions.isMobile) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    return {
      left: 0,
      right: Math.max(0, screenWidth - currentSize.width),
      top: 0,
      bottom: Math.max(0, screenHeight - currentSize.height - 80)
    };
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize && onMaximize(windowProp.windowId);
  };

  if (!currentContent) {
    return (
      <motion.div className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error de Navegación</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar el contenido solicitado.</p>
          <button 
            onClick={() => setCurrentPath([windowProp.id])}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Volver al inicio
          </button>
        </div>
      </motion.div>
    );
  }

  const currentWindowSize = getCurrentWindowSize();

  // RENDER MÓVIL
  if (windowDimensions.isMobile) {
    return (
      <>
        <motion.div
          className="fixed inset-0 bg-white z-[1000] overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header móvil MEJORADO */}
          <div className="bg-gray-100/90 backdrop-blur-sm px-4 py-3 border-b border-gray-200/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <currentContent.icon size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-gray-800 text-sm truncate block">{currentContent.name}</span>
                  <div className="text-gray-500 text-xs">
                    Portfolio Explorer
                  </div>
                </div>
              </div>
              <button
                onClick={() => onClose(windowProp.windowId)}
                className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
                title="Cerrar"
              >
                <X size={18} className="text-gray-600 group-hover:text-red-600" />
              </button>
            </div>

            {/* Navegación móvil MEJORADA */}
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={navigateBack}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atrás"
              >
                <ArrowLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={navigateHome}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Inicio"
              >
                <Home size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Breadcrumbs móvil CORREGIDOS */}
            <div className="overflow-x-auto">
              <div className="flex items-center space-x-1 text-sm min-w-max">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <button
                      onClick={() => navigateToBreadcrumb(crumb.path)}
                      className={`px-2 py-1 rounded text-xs transition-colors truncate ${
                        index === breadcrumbs.length - 1 
                          ? 'bg-blue-100 text-blue-700 font-semibold' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      {crumb.name}
                    </button>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido móvil */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4">
              {/* Si hay subcarpetas, mostrarlas */}
              {currentContent.children && typeof currentContent.children === 'object' && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {Object.entries(currentContent.children).map(([key, folder]) => {
                    const IconComponent = folder.icon;
                    return (
                      <motion.button
                        key={key}
                        onClick={() => navigateTo(key)}
                        className="group p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 text-left shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                            <FolderIcon size={24} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">{folder.name}</h3>
                            <p className="text-gray-600 text-sm leading-tight line-clamp-2">{folder.description}</p>
                          </div>
                          <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Si hay proyectos, mostrarlos */}
              {currentProjects && currentProjects.length > 0 && (
                <div className="space-y-4">
                  {currentProjects.map((project, index) => {
                    const IconComponent = project.icon;
                    return (
                      <motion.button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group w-full p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 text-left shadow-sm"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Project Preview Image */}
                        <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                              <IconComponent size={12} className="text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors mt-1 flex-shrink-0" />
                          </div>

                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User size={10} />
                              <span>{project.client}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={10} />
                              <span>{project.year}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag size={10} />
                              <span>{project.category}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tech Stack Preview */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Results/Impact */}
                          {project.results && (
                            <div className="flex items-center space-x-1 mt-2 p-2 bg-green-50 rounded-lg">
                              <Zap size={12} className="text-green-600" />
                              <span className="text-green-700 text-xs font-medium">
                                {project.results}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {!currentContent.children && !currentProjects && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderIcon size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium text-base mb-2">Carpeta vacía</h3>
                  <p className="text-gray-500 text-sm">No hay contenido disponible en esta ubicación.</p>
                </div>
              )}

              {/* Espaciado extra */}
              <div className="h-8"></div>
            </div>
          </div>
        </motion.div>

        {/* Project Detail Modal para móvil */}
        {selectedProject && (
          <TechCard 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </>
    );
  }

  // RENDER DESKTOP/TABLET
  return (
    <>
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
        style={{
          left: isMaximized ? currentWindowSize.position.x : windowDimensions.position.x,
          top: isMaximized ? currentWindowSize.position.y : windowDimensions.position.y,
          width: currentWindowSize.width,
          height: currentWindowSize.height,
          zIndex: windowProp.zIndex || 100
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        drag={!isMaximized && !windowDimensions.isMobile}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={getDragConstraints()}
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Window Header MEJORADO */}
        <div 
          className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move flex-shrink-0"
          onPointerDown={(e) => {
            onBringToFront(windowProp.windowId);
            if (!isMaximized && !windowDimensions.isMobile) {
              dragControls.start(e);
            }
          }}
        >
          {/* Navigation & Title MEJORADO */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Navigation buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={navigateBack}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atrás"
              >
                <ArrowLeft size={14} className="text-gray-600" />
              </button>
              <button
                onClick={navigateHome}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Inicio"
              >
                <Home size={14} className="text-gray-600" />
              </button>
            </div>

            {/* Window icon and breadcrumbs container */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm flex-shrink-0">
                <currentContent.icon size={18} className="text-white" />
              </div>
              
              {/* Breadcrumbs CORREGIDOS para desktop */}
              <div className="flex-1 min-w-0 bg-white/60 rounded-lg px-3 py-2 border border-gray-200/50">
                <div className="flex items-center space-x-1 text-sm overflow-hidden">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center space-x-1 min-w-0">
                      <button
                        onClick={() => navigateToBreadcrumb(crumb.path)}
                        className={`px-2 py-1 rounded transition-colors truncate ${
                          index === breadcrumbs.length - 1 
                            ? 'bg-blue-100 text-blue-700 font-semibold' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                        }`}
                        title={crumb.name}
                      >
                        {crumb.name}
                      </button>
                      {index < breadcrumbs.length - 1 && (
                        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Window controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onMinimize(windowProp)}
              className="w-8 h-8 bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Minimizar"
            >
              <Minus size={14} className="text-gray-600 group-hover:text-yellow-600" />
            </button>
            
            <button 
              onClick={handleMaximize}
              className="w-8 h-8 bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group" 
              title={isMaximized ? "Restaurar" : "Maximizar"}
            >
              {isMaximized ? (
                <Square size={14} className="text-gray-600 group-hover:text-green-600" />
              ) : (
                <Maximize2 size={14} className="text-gray-600 group-hover:text-green-600" />
              )}
            </button>
            
            <button
              onClick={() => onClose(windowProp.windowId)}
              className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Cerrar"
            >
              <X size={14} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Content Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gray-50/50 flex-shrink-0">
          <h2 className="font-bold text-gray-800 text-lg">{currentContent.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{currentContent.description}</p>
        </div>

        {/* Main Content Area CORREGIDO */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {/* Si hay subcarpetas, mostrarlas */}
          {currentContent.children && typeof currentContent.children === 'object' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {Object.entries(currentContent.children).map(([key, folder]) => {
                const IconComponent = folder.icon;
                return (
                  <motion.button
                    key={key}
                    onClick={() => navigateTo(key)}
                    className="group p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <FolderIcon size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{folder.name}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{folder.description}</p>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Si hay proyectos, mostrarlos */}
          {currentProjects && currentProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentProjects.map((project, index) => {
                const IconComponent = project.icon;
                return (
                  <motion.button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group p-6 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Project Preview Image */}
                    <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                          <IconComponent size={16} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors mt-1" />
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User size={10} />
                          <span>{project.client}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={10} />
                          <span>{project.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag size={10} />
                          <span>{project.category}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack Preview */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Results/Impact */}
                      {project.results && (
                        <div className="flex items-center space-x-1 mt-2 p-2 bg-green-50 rounded-lg">
                          <Zap size={12} className="text-green-600" />
                          <span className="text-green-700 text-xs font-medium">
                            {project.results}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!currentContent.children && !currentProjects && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderIcon size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-600 font-medium text-base mb-2">Carpeta vacía</h3>
              <p className="text-gray-500 text-sm">No hay contenido disponible en esta ubicación.</p>
            </div>
          )}

          {/* Espaciado extra para scroll completo */}
          <div className="h-8"></div>
        </div>

        {/* Status Bar FIJO */}
        <div className="px-6 py-2 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {currentProjects && (
              <span>{currentProjects.length} elemento{currentProjects.length !== 1 ? 's' : ''}</span>
            )}
            {currentContent.children && typeof currentContent.children === 'object' && (
              <span>{Object.keys(currentContent.children).length} carpeta{Object.keys(currentContent.children).length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>EKLISTA Portfolio Explorer</span>
          </div>
        </div>
      </motion.div>

      {/* Project Detail Modal para desktop */}
      {selectedProject && (
        <TechCard 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
};

export default WindowExplorer;