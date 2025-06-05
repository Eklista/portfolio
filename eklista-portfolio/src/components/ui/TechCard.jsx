import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';

const TechCard = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [windowDimensions, setWindowDimensions] = useState(null);
  const dragControls = useDragControls();

  if (!project) return null;

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 800,
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

  // Inicializar dimensiones
  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());

    const handleResize = () => {
      setWindowDimensions(getResponsiveDimensions());
    };

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, []);

  if (!windowDimensions) return null;

  const projectImages = project.images || [project.image, project.image, project.image];
  const technologies = project.technologies || [];
  const features = project.features || [];

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

  // RENDER MÓVIL - Layout completamente diferente
  if (windowDimensions.isMobile) {
    return (
      <>
        <motion.div
          className="fixed inset-0 bg-white z-[1000] overflow-hidden"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header móvil fijo */}
          <div className="bg-gray-100/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200/50 relative z-10">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                <project.icon size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-gray-800 text-sm truncate block">{project.title}</span>
                <div className="text-gray-500 text-xs truncate">
                  {project.client} • {project.year}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Cerrar"
            >
              <X size={18} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>

          {/* Contenido móvil con scroll */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Galería de imágenes móvil */}
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative">
                <img
                  src={projectImages[currentImageIndex]}
                  alt={`${project.title} - Vista ${currentImageIndex + 1}`}
                  className="w-full h-64 object-cover"
                  onClick={() => expandImage(currentImageIndex)}
                />
                
                {/* Overlay con controles */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} de {projectImages.length}
                    </div>
                    <button
                      onClick={() => expandImage(currentImageIndex)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <ZoomIn size={18} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Navegación de imágenes */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails horizontales */}
              {projectImages.length > 1 && (
                <div className="p-4 bg-white border-b border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {projectImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-blue-500 shadow-md scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
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
                </div>
              )}
            </div>

            {/* Información del proyecto */}
            <div className="p-4 bg-white space-y-4">
              {/* Header del proyecto */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {project.description}
                </p>
                
                {project.results && (
                  <div className="inline-flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                    <Award size={14} className="text-green-600" />
                    <span className="text-green-700 text-sm font-medium">{project.results}</span>
                  </div>
                )}
              </div>

              {/* Especificaciones en grid */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base flex items-center">
                  <Package size={16} className="mr-2 text-gray-600" />
                  Especificaciones
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {projectSpecs.map((spec, index) => {
                    const IconComponent = spec.icon;
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                            <IconComponent size={12} className="text-white" />
                          </div>
                          <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                            {spec.label}
                          </p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm">
                          {spec.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tecnologías */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-base flex items-center">
                  <Code size={16} className="mr-2 text-gray-600" />
                  Tecnologías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Características */}
              {features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-base flex items-center">
                    <Zap size={16} className="mr-2 text-gray-600" />
                    Características Principales
                  </h3>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                    <Globe size={18} />
                    <span>Ver Proyecto Live</span>
                    <ExternalLink size={14} />
                  </button>
                )}
                
                {project.caseStudy && project.caseStudy !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
                    <Package size={18} />
                    <span>Ver Caso de Estudio</span>
                    <ExternalLink size={14} />
                  </button>
                )}
              </div>

              {/* Espaciado extra para scroll completo */}
              <div className="h-8"></div>
            </div>
          </div>
        </motion.div>

        {/* Modal de imagen expandida para móvil */}
        <AnimatePresence>
          {isImageExpanded && (
            <motion.div
              className="fixed inset-0 bg-black z-[2000] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Controles superiores móvil */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <button
                  onClick={closeExpandedImage}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-white" />
                </button>
                
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {expandedImageIndex + 1} de {projectImages.length}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={zoomOut}
                    disabled={imageZoom <= 0.5}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center disabled:opacity-50"
                  >
                    <ZoomOut size={16} className="text-white" />
                  </button>
                  <button
                    onClick={zoomIn}
                    disabled={imageZoom >= 3}
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center disabled:opacity-50"
                  >
                    <ZoomIn size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Imagen expandida móvil */}
              <motion.img
                src={projectImages[expandedImageIndex]}
                alt={`${project.title} - Vista expandida ${expandedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                }}
                drag={imageZoom > 1}
                dragMomentum={false}
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

              {/* Navegación entre imágenes móvil */}
              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={prevExpandedImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  
                  <button
                    onClick={nextExpandedImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // RENDER DESKTOP/TABLET - Layout con sidebar
  return (
    <>
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
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
          className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move flex-shrink-0"
          onPointerDown={(e) => {
            if (!isMaximized && !windowDimensions.isMobile) {
              dragControls.start(e);
            }
          }}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
              <project.icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-800 text-base truncate block">{project.title}</span>
              <div className="text-gray-500 mt-0.5 text-xs truncate">
                {project.client} • {project.year}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => {}}
              className="w-8 h-8 bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Minimizar"
            >
              <Minus size={14} className="text-gray-600 group-hover:text-yellow-600" />
            </button>
            
            <button 
              onClick={toggleMaximize}
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
              onClick={onClose}
              className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Cerrar"
            >
              <X size={14} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Content Layout - ALTURA FIJA CORREGIDA */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200/50 bg-gray-50/50 overflow-y-auto flex-shrink-0">
            
            {/* Project Header */}
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="font-bold text-gray-800 text-lg mb-3">{project.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              
              {project.results && (
                <div className="inline-flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <Award size={14} className="text-green-600" />
                  <span className="text-green-700 text-sm font-medium">{project.results}</span>
                </div>
              )}
            </div>

            {/* Project Specifications */}
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm flex items-center">
                <Package size={16} className="mr-2 text-gray-600" />
                Especificaciones
              </h3>
              <div className="grid gap-3">
                {projectSpecs.map((spec, index) => {
                  const IconComponent = spec.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-gray-200/50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-sm">
                        <IconComponent size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 font-medium uppercase tracking-wide text-xs">
                          {spec.label}
                        </p>
                        <p className="text-gray-800 font-medium text-sm truncate">
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technologies */}
            <div className="p-6 border-b border-gray-200/50">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm flex items-center">
                <Code size={16} className="mr-2 text-gray-600" />
                Tecnologías
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm flex items-center">
                  <Zap size={16} className="mr-2 text-gray-600" />
                  Características
                </h3>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area - CORREGIDO: altura y scroll apropiados */}
          <div className="flex-1 min-h-0 relative bg-gray-100 flex flex-col">
            {/* Galería de imágenes - SIN RESTRICCIONES DE ALTURA */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* Imagen principal destacada */}
                <motion.div 
                  className="relative w-full cursor-pointer group"
                  onClick={() => expandImage(0)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={projectImages[0]}
                    alt={`${project.title} - Imagen principal`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
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
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    1 de {projectImages.length}
                  </div>
                </motion.div>

                {/* Grid de imágenes adicionales */}
                {projectImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
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
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                          >
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <ZoomIn size={16} className="text-gray-800" />
                            </div>
                          </motion.div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                          {index + 2}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Información adicional del proyecto */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Sobre este proyecto
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {project.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                        <Globe size={16} />
                        <span>Ver Proyecto</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                    
                    {project.caseStudy && project.caseStudy !== '#' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                        <Package size={16} />
                        <span>Caso de Estudio</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalles técnicos adicionales */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-4">
                  <h4 className="text-base font-semibold text-gray-800 flex items-center">
                    <Code size={18} className="mr-2 text-gray-600" />
                    Detalles Técnicos
                  </h4>
                  
                  {/* Stack tecnológico expandido */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Stack Tecnológico</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {technologies.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/60 rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-700 text-sm font-medium">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Características técnicas expandidas */}
                  {features.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Características Implementadas</h5>
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg border border-gray-200">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Métricas de rendimiento (simuladas) */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Métricas de Proyecto</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-blue-600 font-bold text-lg">98%</div>
                        <div className="text-blue-700 text-xs">Performance Score</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-green-600 font-bold text-lg">A+</div>
                        <div className="text-green-700 text-xs">Accessibility</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-purple-600 font-bold text-lg">100%</div>
                        <div className="text-purple-700 text-xs">SEO Score</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-orange-600 font-bold text-lg">95%</div>
                        <div className="text-orange-700 text-xs">Best Practices</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial o feedback del cliente (opcional) */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <User size={18} className="mr-2 text-blue-600" />
                    Testimonial del Cliente
                  </h4>
                  <blockquote className="text-gray-700 italic text-sm leading-relaxed mb-3">
                    "El trabajo de EKLISTA superó nuestras expectativas. La atención al detalle y la calidad técnica son excepcionales. Definitivamente trabajaremos juntos en futuros proyectos."
                  </blockquote>
                  <cite className="text-gray-600 text-sm font-medium">
                    — {project.client}, Cliente
                  </cite>
                </div>

                {/* Spacer extra para scroll completo */}
                <div className="h-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar - FIJO EN LA PARTE INFERIOR */}
        <div className="px-6 py-2 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-medium">EKLISTA Portfolio</span>
            <span>•</span>
            <span className="truncate max-w-48">{project.title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span>Vista proyecto</span>
          </div>
        </div>
      </motion.div>

      {/* Modal de imagen expandida - DESKTOP */}
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