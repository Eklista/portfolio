import React, { useState } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  Calendar,
  User,
  Clock,
  Monitor,
  Package,
  Target,
  ExternalLink,
  Code,
  Zap,
  Globe,
  Award,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw
} from 'lucide-react';

const TechCard = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragControls = useDragControls();

  if (!project) return null;

  // Función para obtener dimensiones responsive - MÁXIMO ESPACIO DISPONIBLE
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 850,
        position: { x: 50, y: 30 },
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
        width: screenWidth - 16, // Casi pantalla completa
        height: screenHeight - 80, // Máximo altura móvil
        position: { x: 8, y: 40 },
        isMobile: true,
        isTablet: false,
        isDesktop: false
      };
    } else if (isTablet) {
      return {
        width: Math.min(1100, screenWidth - 40), // Más ancho
        height: Math.min(screenHeight - 80, 900), // Máxima altura disponible
        position: { x: 20, y: 40 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1500, screenWidth - 100), // MÁXIMO ancho disponible
        height: Math.min(screenHeight - 80, 950), // MÁXIMA altura disponible
        position: { x: 50, y: 30 }, // Posición más arriba
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  const getMaximizedDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1000,
        height: 700,
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

  const windowDimensions = getResponsiveDimensions();
  if (!windowDimensions) return null;

  const projectImages = project.images || [project.image, project.image, project.image];
  const technologies = project.technologies || [];
  const features = project.features || [];

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

  const projectSpecs = [
    { 
      icon: User, 
      label: 'Cliente', 
      value: project.client,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Calendar, 
      label: 'Año', 
      value: project.year,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Target, 
      label: 'Categoría', 
      value: project.category,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Clock, 
      label: 'Duración', 
      value: project.specs?.duration || '3-6 meses',
      color: 'from-orange-500 to-red-500'
    },
    { 
      icon: Monitor, 
      label: 'Tipo', 
      value: project.type === 'file' ? 'Proyecto Web' : 'Aplicación',
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      icon: Package, 
      label: 'Entregables', 
      value: project.specs?.deliverables || 'Producto completo',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  // Funciones de navegación de imágenes
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Funciones para el modal de imagen expandida
  const expandImage = (index = currentImageIndex) => {
    setExpandedImageIndex(index);
    setIsImageExpanded(true);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const closeExpandedImage = () => {
    setIsImageExpanded(false);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const nextExpandedImage = () => {
    setExpandedImageIndex((prev) => (prev + 1) % projectImages.length);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const prevExpandedImage = () => {
    setExpandedImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const currentWindowSize = getCurrentWindowSize();

  return (
    <>
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        style={{
          left: isMaximized ? currentWindowSize.position.x : windowDimensions.position.x,
          top: isMaximized ? currentWindowSize.position.y : windowDimensions.position.y,
          width: currentWindowSize.width,
          height: currentWindowSize.height,
          zIndex: 1000
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
            if (!isMaximized && !windowDimensions.isMobile) {
              dragControls.start(e);
            }
          }}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${project.color || 'from-indigo-500 to-purple-500'} flex items-center justify-center shadow-sm`}>
              <project.icon size={windowDimensions.isMobile ? 14 : 18} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className={`font-semibold text-gray-800 ${windowDimensions.isMobile ? 'text-sm' : 'text-base'} truncate block`}>{project.title}</span>
              <div className={`text-gray-500 mt-0.5 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} truncate`}>
                {project.client} • {project.year}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => {}}
              className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group`}
              title="Minimizar"
            >
              <Minus size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-yellow-600" />
            </button>
            
            <button 
              onClick={toggleMaximize}
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
              onClick={onClose}
              className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group`}
              title="Cerrar"
            >
              <X size={windowDimensions.isMobile ? 12 : 14} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Content Layout - MÁXIMA ALTURA DISPONIBLE */}
        <div className={`flex ${windowDimensions.isMobile ? 'flex-col' : 'flex-row'} h-full`}>
          {/* Sidebar - ALTURA OPTIMIZADA */}
          <div className={`${
            windowDimensions.isMobile 
              ? 'w-full border-b border-gray-200/50 h-auto max-h-none' // Sin restricción de altura en móvil
              : windowDimensions.isTablet
              ? 'w-64 border-r border-gray-200/50' // Sidebar más angosto
              : 'w-72 border-r border-gray-200/50' // Sidebar angosto en desktop para más espacio
          } bg-gray-50/50 overflow-y-auto flex-shrink-0`}>
            
            {/* Project Header - COMPACTO */}
            <div className={`${windowDimensions.isMobile ? 'p-3' : 'p-4'} border-b border-gray-200/50`}>
              <h2 className={`font-bold text-gray-800 ${windowDimensions.isMobile ? 'text-sm' : 'text-base'} mb-2`}>{project.title}</h2>
              <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} leading-tight mb-3 line-clamp-3`}>
                {project.description}
              </p>
              
              {project.results && (
                <div className="inline-flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                  <Award size={windowDimensions.isMobile ? 10 : 12} className="text-green-600" />
                  <span className={`text-green-700 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium`}>{project.results}</span>
                </div>
              )}
            </div>

            {/* Project Specifications - COMPACTO */}
            <div className={`${windowDimensions.isMobile ? 'p-3' : 'p-4'} border-b border-gray-200/50`}>
              <h3 className={`font-semibold text-gray-800 mb-3 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} flex items-center`}>
                <Package size={windowDimensions.isMobile ? 12 : 14} className="mr-2 text-gray-600" />
                Especificaciones
              </h3>
              <div className={`grid ${windowDimensions.isMobile ? 'grid-cols-1 gap-1' : 'gap-2'}`}>
                {projectSpecs.slice(0, windowDimensions.isMobile ? 4 : 6).map((spec, index) => {
                  const IconComponent = spec.icon;
                  return (
                    <div key={index} className={`flex items-center space-x-2 ${windowDimensions.isMobile ? 'p-1.5' : 'p-2'} bg-white/60 rounded-lg border border-gray-200/50`}>
                      <div className={`${windowDimensions.isMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-lg bg-gradient-to-br ${spec.color} flex items-center justify-center shadow-sm`}>
                        <IconComponent size={windowDimensions.isMobile ? 10 : 12} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-500 font-medium uppercase tracking-wide ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
                          {spec.label}
                        </p>
                        <p className={`text-gray-800 font-medium truncate ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technologies - COMPACTO */}
            <div className={`${windowDimensions.isMobile ? 'p-3' : 'p-4'} ${!windowDimensions.isMobile ? 'border-b border-gray-200/50' : ''}`}>
              <h3 className={`font-semibold text-gray-800 mb-3 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} flex items-center`}>
                <Code size={windowDimensions.isMobile ? 12 : 14} className="mr-2 text-gray-600" />
                Tecnologías
              </h3>
              <div className="flex flex-wrap gap-1">
                {technologies.slice(0, windowDimensions.isMobile ? 4 : 8).map((tech, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium border border-gray-200`}
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > (windowDimensions.isMobile ? 4 : 8) && (
                  <span className={`px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
                    +{technologies.length - (windowDimensions.isMobile ? 4 : 8)}
                  </span>
                )}
              </div>
            </div>

            {/* Features - Solo en desktop para ahorrar espacio */}
            {!windowDimensions.isMobile && features.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center">
                  <Zap size={14} className="mr-2 text-gray-600" />
                  Características
                </h3>
                <div className="space-y-1">
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  {features.length > 3 && (
                    <div className="text-xs text-gray-500 mt-2">+{features.length - 3} más...</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area - ESPACIO MÁXIMO PARA GALERÍA */}
          <div className="flex-1 min-h-0 relative bg-gray-100">
            {/* Galería de imágenes estilo Behance - SIN OVERFLOW OCULTO */}
            <div className="h-full overflow-y-auto">
              <div className="space-y-4 p-3 md:p-4 pb-12"> {/* Menos padding para más espacio */}
                
                {/* Imagen principal destacada - ALTURA ADAPTATIVA */}
                <motion.div 
                  className="relative w-full cursor-pointer group"
                  onClick={() => expandImage(0)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={projectImages[0]}
                    alt={`${project.title} - Imagen principal`}
                    className={`w-full ${
                      windowDimensions.isMobile ? 'h-40' : 
                      windowDimensions.isTablet ? 'h-56' : 
                      'h-64'
                    } object-cover rounded-xl shadow-lg`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ZoomIn size={20} className="text-gray-800" />
                      </div>
                    </motion.div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                    1 de {projectImages.length}
                  </div>
                </motion.div>

                {/* Grid de imágenes adicionales - ALTURA OPTIMIZADA */}
                {projectImages.length > 1 && (
                  <div className={`grid ${
                    windowDimensions.isMobile ? 'grid-cols-1 gap-3' : 
                    windowDimensions.isTablet ? 'grid-cols-2 gap-3' :
                    'grid-cols-2 gap-4'
                  }`}>
                    {projectImages.slice(1).map((image, index) => (
                      <motion.div
                        key={index + 1}
                        className="relative cursor-pointer group"
                        onClick={() => expandImage(index + 1)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={image}
                          alt={`${project.title} - Vista ${index + 2}`}
                          className={`w-full ${
                            windowDimensions.isMobile ? 'h-28' : 
                            windowDimensions.isTablet ? 'h-32' : 
                            'h-36'
                          } object-cover rounded-lg shadow-md`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                          >
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <ZoomIn size={14} className="text-gray-800" />
                            </div>
                          </motion.div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs">
                          {index + 2}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Información adicional del proyecto - COMPACTA */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 space-y-3">
                  <h3 className={`${windowDimensions.isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-800`}>
                    Sobre este proyecto
                  </h3>
                  <p className={`text-gray-600 leading-relaxed ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} line-clamp-3`}>
                    {project.description}
                  </p>
                  
                  {/* Action Buttons - COMPACTOS */}
                  <div className={`flex ${windowDimensions.isMobile ? 'flex-col gap-2' : 'flex-wrap gap-2'}`}>
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <button className={`flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium ${windowDimensions.isMobile ? 'w-full' : ''}`}>
                        <Globe size={14} />
                        <span>Ver Proyecto</span>
                        <ExternalLink size={10} />
                      </button>
                    )}
                    
                    {project.caseStudy && project.caseStudy !== '#' && (
                      <button className={`flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-xs font-medium ${windowDimensions.isMobile ? 'w-full' : ''}`}>
                        <Package size={14} />
                        <span>Caso de Estudio</span>
                        <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Features adicionales solo en main area para móvil */}
                {windowDimensions.isMobile && features.length > 0 && (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                      <Zap size={12} className="mr-2 text-gray-600" />
                      Características
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-xs leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spacer extra para scroll completo */}
                <div className="h-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar - MÁS COMPACTO */}
        <div className={`${windowDimensions.isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} text-gray-500 flex-shrink-0`}>
          <div className="flex items-center space-x-3">
            <span className="font-medium">EKLISTA Portfolio</span>
            <span>•</span>
            <span className="truncate max-w-32">{project.title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span>Vista proyecto</span>
          </div>
        </div>
      </motion.div>

      {/* Modal de imagen expandida */}
      <AnimatePresence>
        {isImageExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Controles superiores */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-4">
                <button
                  onClick={closeExpandedImage}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
                
                <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  <span className="font-medium">{project.title}</span>
                  <span className="mx-2">•</span>
                  <span>{expandedImageIndex + 1} de {projectImages.length}</span>
                </div>
              </div>

              {/* Controles de zoom */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={zoomOut}
                  disabled={imageZoom <= 0.5}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut size={20} className="text-white" />
                </button>
                
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm min-w-16 text-center">
                  {Math.round(imageZoom * 100)}%
                </div>
                
                <button
                  onClick={zoomIn}
                  disabled={imageZoom >= 3}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn size={20} className="text-white" />
                </button>
                
                <button
                  onClick={resetZoom}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <RotateCcw size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Imagen expandida */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <motion.img
                src={projectImages[expandedImageIndex]}
                alt={`${project.title} - Vista expandida ${expandedImageIndex + 1}`}
                className="max-w-none cursor-move"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                }}
                drag={imageZoom > 1}
                dragMomentum={false}
                onDragStart={() => setIsDraggingImage(true)}
                onDragEnd={() => setIsDraggingImage(false)}
                onDrag={(event, info) => {
                  if (imageZoom > 1) {
                    setImagePosition({
                      x: imagePosition.x + info.delta.x / imageZoom,
                      y: imagePosition.y + info.delta.y / imageZoom
                    });
                  }
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Navegación entre imágenes */}
            {projectImages.length > 1 && (
              <>
                <button
                  onClick={prevExpandedImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                
                <button
                  onClick={nextExpandedImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </>
            )}

            {/* Thumbnails inferiores */}
            {projectImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full p-3">
                {projectImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setExpandedImageIndex(index);
                      setImageZoom(1);
                      setImagePosition({ x: 0, y: 0 });
                    }}
                    className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                      index === expandedImageIndex 
                        ? 'border-white shadow-lg' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Instrucciones de uso */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
              {imageZoom > 1 ? 'Arrastra para mover' : 'Scroll o +/- para zoom'}
            </div>

            {/* Event listeners para keyboard y scroll */}
            <div
              className="absolute inset-0"
              onWheel={(e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                  zoomIn();
                } else {
                  zoomOut();
                }
              }}
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'Escape':
                    closeExpandedImage();
                    break;
                  case 'ArrowLeft':
                    prevExpandedImage();
                    break;
                  case 'ArrowRight':
                    nextExpandedImage();
                    break;
                  case '+':
                  case '=':
                    zoomIn();
                    break;
                  case '-':
                    zoomOut();
                    break;
                  case '0':
                    resetZoom();
                    break;
                }
              }}
              tabIndex={0}
              style={{ outline: 'none' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TechCard;