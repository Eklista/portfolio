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
    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    if (isMobile) {
      return {
        width: screenWidth - 32,
        height: screenHeight - 160,
        position: { x: 16, y: 80 },
        isMobile: true,
        isTablet: false,
        isDesktop: false
      };
    } else if (isTablet) {
      return {
        width: Math.min(900, screenWidth - 80),
        height: Math.min(700, screenHeight - 160),
        position: { x: 40, y: 80 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1200, screenWidth - 200),
        height: Math.min(800, screenHeight - 200),
        position: { x: 100, y: 100 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  // Función para obtener dimensiones maximizadas
  const getMaximizedDimensions = () => {
    // Verificación de seguridad
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 800,
        height: 600,
        position: { x: 20, y: 20 }
      };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const isMobile = screenWidth < 768;

    return {
      width: isMobile ? screenWidth : screenWidth - 40,
      height: isMobile ? screenHeight - 80 : screenHeight - 120,
      position: { x: isMobile ? 0 : 20, y: isMobile ? 0 : 20 }
    };
  };

  // Inicializar dimensiones
  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());
    setIsMaximized(windowProp.isMaximized || false);
  }, []);

  // Actualizar dimensiones cuando cambie el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (!isMaximized) {
        setWindowDimensions(getResponsiveDimensions());
      }
    };

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  if (isMinimized || !windowDimensions) return null;

  // Obtener contenido actual basado en la ruta
  const getCurrentContent = () => {
    let current = explorerStructure[currentPath[0]];
    
    for (let i = 1; i < currentPath.length; i++) {
      current = current.children[currentPath[i]];
    }
    
    return current;
  };

  // Obtener proyectos si estamos en una carpeta de proyectos
  const getCurrentProjects = () => {
    const current = getCurrentContent();
    if (typeof current.children === 'string') {
      return projectsData[current.children] || [];
    }
    return null;
  };

  // Navegación
  const navigateTo = (pathSegment) => {
    setCurrentPath([...currentPath, pathSegment]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateHome = () => {
    setCurrentPath([windowProp.id]);
  };

  // Generar breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let current = explorerStructure[currentPath[0]];
    breadcrumbs.push({ name: current.name, path: [currentPath[0]] });

    for (let i = 1; i < currentPath.length; i++) {
      current = current.children[currentPath[i]];
      breadcrumbs.push({ 
        name: current.name, 
        path: currentPath.slice(0, i + 1) 
      });
    }

    return breadcrumbs;
  };

  const currentContent = getCurrentContent();
  const currentProjects = getCurrentProjects();
  const breadcrumbs = getBreadcrumbs();

  // Dimensiones actuales de la ventana
  const getCurrentWindowSize = () => {
    if (isMaximized) {
      return getMaximizedDimensions();
    }
    return windowDimensions;
  };

  // Constraints para drag
  const getDragConstraints = () => {
    // Verificación de seguridad
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

  return (
    <>
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        style={{
          left: isMaximized ? getMaximizedDimensions().position.x : windowDimensions.position.x,
          top: isMaximized ? getMaximizedDimensions().position.y : windowDimensions.position.y,
          width: isMaximized ? getMaximizedDimensions().width : windowDimensions.width,
          height: isMaximized ? getMaximizedDimensions().height : windowDimensions.height,
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
        {/* Window Header */}
        <div 
          className={`bg-gray-100/80 backdrop-blur-sm ${windowDimensions.isMobile ? 'px-4 py-3' : 'px-6 py-4'} flex items-center justify-between border-b border-gray-200/50 cursor-move`}
          onPointerDown={(e) => {
            onBringToFront(windowProp.windowId);
            if (!isMaximized && !windowDimensions.isMobile) {
              dragControls.start(e);
            }
          }}
        >
          {/* Navigation & Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={navigateBack}
                disabled={currentPath.length <= 1}
                className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Atrás"
              >
                <ArrowLeft size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600" />
              </button>
              <button
                onClick={navigateHome}
                disabled={currentPath.length <= 1}
                className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Inicio"
              >
                <Home size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600" />
              </button>
            </div>

            {/* Window icon and title */}
            <div className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${currentContent.color} flex items-center justify-center shadow-sm`}>
              <currentContent.icon size={windowDimensions.isMobile ? 14 : 18} className="text-white" />
            </div>
            
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-1 text-sm min-w-0 overflow-hidden">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-1 min-w-0">
                  <button
                    onClick={() => setCurrentPath(crumb.path)}
                    className={`text-gray-700 hover:text-blue-600 transition-colors font-medium truncate ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'}`}
                  >
                    {crumb.name}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={windowDimensions.isMobile ? 12 : 14} className="text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Window controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => onMinimize(windowProp)}
              className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group`}
              title="Minimizar"
            >
              <Minus size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-yellow-600" />
            </button>
            
            <button 
              onClick={handleMaximize}
              className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group`} 
              title={isMaximized ? "Restaurar" : "Maximizar"}
            >
              {isMaximized ? (
                <Square size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-green-600" />
              ) : (
                <Maximize2 size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-green-600" />
              )}
            </button>
            
            <button
              onClick={() => onClose(windowProp.windowId)}
              className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group`}
              title="Cerrar"
            >
              <X size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Content Header */}
          <div className={`${windowDimensions.isMobile ? 'px-4 py-3' : 'px-6 py-4'} border-b border-gray-200/50 bg-gray-50/50`}>
            <h2 className={`font-bold text-gray-800 ${windowDimensions.isMobile ? 'text-base' : 'text-lg'}`}>{currentContent.name}</h2>
            <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} mt-1`}>{currentContent.description}</p>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 overflow-y-auto ${windowDimensions.isMobile ? 'p-4' : 'p-6'}`}>
            {/* Si hay subcarpetas, mostrarlas */}
            {currentContent.children && typeof currentContent.children === 'object' && (
              <div className={`grid ${
                windowDimensions.isMobile ? 'grid-cols-1' : 
                windowDimensions.isTablet ? 'grid-cols-2' : 
                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              } gap-4 mb-6`}>
                {Object.entries(currentContent.children).map(([key, folder]) => {
                  const IconComponent = folder.icon;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => navigateTo(key)}
                      className={`group ${windowDimensions.isMobile ? 'p-3' : 'p-4'} bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${windowDimensions.isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-gradient-to-br ${folder.color} flex items-center justify-center ${windowDimensions.isMobile ? 'mb-2' : 'mb-3'} shadow-sm group-hover:shadow-md transition-shadow`}>
                        <FolderIcon size={windowDimensions.isMobile ? 20 : 24} className="text-white" />
                      </div>
                      <h3 className={`font-semibold text-gray-800 ${windowDimensions.isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'}`}>{folder.name}</h3>
                      <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-xs leading-tight' : 'text-xs leading-relaxed'}`}>{folder.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Si hay proyectos, mostrarlos */}
            {currentProjects && (
              <div className={`grid ${windowDimensions.isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                {currentProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`group ${windowDimensions.isMobile ? 'p-4' : 'p-6'} bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Project Preview Image */}
                      <div className={`relative ${windowDimensions.isMobile ? 'mb-3' : 'mb-4'} rounded-lg overflow-hidden bg-gray-100`}>
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className={`w-full ${windowDimensions.isMobile ? 'h-24' : 'h-32'} object-cover group-hover:scale-105 transition-transform duration-300`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-2 right-2">
                          <div className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${project.color || 'from-gray-500 to-gray-700'} flex items-center justify-center shadow-sm`}>
                            <IconComponent size={windowDimensions.isMobile ? 12 : 16} className="text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-bold text-gray-800 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'} group-hover:text-blue-600 transition-colors`}>
                            {project.title}
                          </h3>
                          <ExternalLink size={windowDimensions.isMobile ? 10 : 12} className="text-gray-400 group-hover:text-blue-500 transition-colors mt-1" />
                        </div>

                        <div className={`flex items-center space-x-3 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
                          <div className="flex items-center space-x-1">
                            <User size={windowDimensions.isMobile ? 8 : 10} />
                            <span>{project.client}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={windowDimensions.isMobile ? 8 : 10} />
                            <span>{project.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag size={windowDimensions.isMobile ? 8 : 10} />
                            <span>{project.category}</span>
                          </div>
                        </div>

                        <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} leading-relaxed line-clamp-2`}>
                          {project.description}
                        </p>

                        {/* Tech Stack Preview */}
                        <div className={`flex flex-wrap gap-1 ${windowDimensions.isMobile ? 'mt-2' : 'mt-3'}`}>
                          {project.technologies.slice(0, windowDimensions.isMobile ? 2 : 3).map((tech, idx) => (
                            <span 
                              key={idx}
                              className={`px-2 py-1 bg-gray-100 text-gray-600 rounded ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium`}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > (windowDimensions.isMobile ? 2 : 3) && (
                            <span className={`px-2 py-1 bg-gray-100 text-gray-500 rounded ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
                              +{project.technologies.length - (windowDimensions.isMobile ? 2 : 3)}
                            </span>
                          )}
                        </div>

                        {/* Results/Impact */}
                        {project.results && (
                          <div className={`flex items-center space-x-1 ${windowDimensions.isMobile ? 'mt-2' : 'mt-2'} p-2 bg-green-50 rounded-lg`}>
                            <Zap size={windowDimensions.isMobile ? 10 : 12} className="text-green-600" />
                            <span className={`text-green-700 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium`}>
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
                <div className={`${windowDimensions.isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-100 rounded-full flex items-center justify-center mb-4`}>
                  <FolderIcon size={windowDimensions.isMobile ? 20 : 24} className="text-gray-400" />
                </div>
                <h3 className={`text-gray-600 font-medium ${windowDimensions.isMobile ? 'text-sm' : 'text-base'} mb-2`}>Carpeta vacía</h3>
                <p className={`text-gray-500 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'}`}>No hay contenido disponible en esta ubicación.</p>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className={`${windowDimensions.isMobile ? 'px-4 py-2' : 'px-6 py-2'} border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
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
        </div>
      </motion.div>

      {/* Project Detail Modal */}
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