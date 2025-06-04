import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';

const TechCard = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();

  if (!project) return null;

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    // Verificación de seguridad para SSR y montaje inicial
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1000,
        height: 700,
        position: { x: 100, y: 80 },
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
        width: screenWidth - 20,
        height: screenHeight - 120,
        position: { x: 10, y: 60 },
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
        position: { x: 100, y: 80 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  // Función para obtener dimensiones maximizadas
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

  // Obtener dimensiones actuales
  const windowDimensions = getResponsiveDimensions();

  if (!windowDimensions) return null;

  const projectImages = project.images || [project.image, project.image, project.image];
  const technologies = project.technologies || [];
  const features = project.features || [];

  // Dimensiones actuales de la ventana
  const getCurrentWindowSize = () => {
    if (isMaximized) {
      return getMaximizedDimensions();
    }
    return windowDimensions;
  };

  // Constraints para drag
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

  // Project specifications for sidebar
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const currentWindowSize = getCurrentWindowSize();

  return (
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
        {/* Window title and icon */}
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

        {/* Window controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => {/* onMinimize functionality if needed */}}
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

      {/* Content Layout - Responsive */}
      <div className={`flex ${windowDimensions.isMobile ? 'flex-col' : 'flex-row'} h-full`}>
        {/* Sidebar - Especificaciones del proyecto */}
        <div className={`${
          windowDimensions.isMobile 
            ? 'w-full border-b border-gray-200/50 max-h-48 overflow-y-auto' 
            : 'w-80 border-r border-gray-200/50'
        } bg-gray-50/50 overflow-y-auto`}>
          
          {/* Project Header */}
          <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'} border-b border-gray-200/50`}>
            <h2 className={`font-bold text-gray-800 ${windowDimensions.isMobile ? 'text-base' : 'text-lg'} mb-2`}>{project.title}</h2>
            <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} leading-relaxed mb-4`}>
              {project.description}
            </p>
            
            {/* Results Badge */}
            {project.results && (
              <div className="inline-flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <Award size={windowDimensions.isMobile ? 12 : 14} className="text-green-600" />
                <span className={`text-green-700 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium`}>{project.results}</span>
              </div>
            )}
          </div>

          {/* Project Specifications */}
          <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'} border-b border-gray-200/50`}>
            <h3 className={`font-semibold text-gray-800 mb-4 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'} flex items-center`}>
              <Package size={windowDimensions.isMobile ? 14 : 16} className="mr-2 text-gray-600" />
              Especificaciones
            </h3>
            <div className={`grid ${windowDimensions.isMobile ? 'grid-cols-2 gap-2' : 'gap-3'}`}>
              {projectSpecs.map((spec, index) => {
                const IconComponent = spec.icon;
                return (
                  <div key={index} className={`flex items-center space-x-3 ${windowDimensions.isMobile ? 'p-2' : 'p-3'} bg-white/60 rounded-lg border border-gray-200/50`}>
                    <div className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${spec.color} flex items-center justify-center shadow-sm`}>
                      <IconComponent size={windowDimensions.isMobile ? 12 : 14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-gray-500 font-medium uppercase tracking-wide ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
                        {spec.label}
                      </p>
                      <p className={`text-gray-800 font-medium truncate ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'}`}>
                        {spec.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technologies */}
          <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'} border-b border-gray-200/50`}>
            <h3 className={`font-semibold text-gray-800 mb-4 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'} flex items-center`}>
              <Code size={windowDimensions.isMobile ? 14 : 16} className="mr-2 text-gray-600" />
              Tecnologías
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium border border-gray-200`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'} border-b border-gray-200/50`}>
              <h3 className={`font-semibold text-gray-800 mb-4 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'} flex items-center`}>
                <Zap size={windowDimensions.isMobile ? 14 : 16} className="mr-2 text-gray-600" />
                Características
              </h3>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className={`text-gray-700 ${windowDimensions.isMobile ? 'text-xs' : 'text-sm'} leading-relaxed`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Navigation Counter - Solo en móvil */}
          {windowDimensions.isMobile && (
            <div className="p-4">
              <div className="bg-white/60 rounded-lg p-3 border border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Imagen {currentImageIndex + 1} de {projectImages.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevImage}
                      disabled={projectImages.length <= 1}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Imagen anterior"
                    >
                      <ChevronLeft size={14} className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={projectImages.length <= 1}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Siguiente imagen"
                    >
                      <ChevronRight size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Navigation dots */}
                {projectImages.length > 1 && (
                  <div className="flex items-center justify-center space-x-1">
                    {projectImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-blue-500 w-4' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <Globe size={14} />
                    <span>Ver Proyecto</span>
                    <ExternalLink size={12} />
                  </button>
                )}
                
                {project.caseStudy && project.caseStudy !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <Package size={14} />
                    <span>Caso de Estudio</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area - Galería de imágenes */}
        <div className="flex-1 relative overflow-hidden">
          {/* Image Display Area */}
          <div className={`absolute inset-0 flex items-center justify-center ${windowDimensions.isMobile ? 'p-4' : 'p-6'}`}>
            <div className="relative max-w-full max-h-full">
              <img
                src={projectImages[currentImageIndex]}
                alt={`${project.title} - Vista ${currentImageIndex + 1}`}
                className={`max-w-full max-h-full object-contain rounded-xl shadow-large ${
                  windowDimensions.isMobile ? 'min-h-48' : 'min-h-96'
                }`}
                style={{ 
                  maxHeight: windowDimensions.isMobile ? '200px' : 'calc(100vh - 200px)'
                }}
              />
              
              {/* Image overlay navigation - solo desktop */}
              {!windowDimensions.isMobile && projectImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Sidebar Info - Solo en desktop */}
          {!windowDimensions.isMobile && (
            <div className="absolute bottom-6 right-6 w-80">
              <div className="bg-white/60 rounded-lg p-4 border border-gray-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    Imagen {currentImageIndex + 1} de {projectImages.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevImage}
                      disabled={projectImages.length <= 1}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Imagen anterior"
                    >
                      <ChevronLeft size={14} className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={projectImages.length <= 1}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Siguiente imagen"
                    >
                      <ChevronRight size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Navigation dots */}
                {projectImages.length > 1 && (
                  <div className="flex items-center justify-center space-x-1 mt-3">
                    {projectImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-blue-500 w-4' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <Globe size={14} />
                    <span>Ver Proyecto</span>
                    <ExternalLink size={12} />
                  </button>
                )}
                
                {project.caseStudy && project.caseStudy !== '#' && (
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <Package size={14} />
                    <span>Caso de Estudio</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className={`${windowDimensions.isMobile ? 'px-4 py-2' : 'px-6 py-2'} border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
        <div className="flex items-center space-x-4">
          <span>EKLISTA Portfolio • {project.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Vista de proyecto</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TechCard;