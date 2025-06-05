import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  Clock,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Star,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';
import { explorerStructure } from '../../data/projects';

const WindowInfo = ({ 
  window: windowProp, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(null);
  const dragControls = useDragControls();

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1000,
        height: 750,
        position: { x: 120, y: 100 },
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
        width: Math.min(900, screenWidth - 40),
        height: Math.min(screenHeight - 100, 800),
        position: { x: 20, y: 50 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1200, screenWidth - 120),
        height: Math.min(screenHeight - 100, 850),
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

  const content = explorerStructure[windowProp.id].content;

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

  const currentWindowSize = getCurrentWindowSize();

  // RENDER MÓVIL
  if (windowDimensions.isMobile) {
    return (
      <motion.div
        className="fixed inset-0 bg-white z-[1000] overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header móvil */}
        <div className="bg-gray-100/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
              <windowProp.icon size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-800 text-sm truncate block">{content.title}</span>
              <div className="text-gray-500 text-xs">
                {content.sections?.length} sección{content.sections?.length !== 1 ? 'es' : ''}
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

        {/* Navegación por pestañas móvil */}
        {content.sections && content.sections.length > 1 && (
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {content.sections.map((section, index) => {
                const IconComponent = section.icon || CheckCircle;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                      activeSection === index
                        ? 'bg-violet-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      activeSection === index ? 'bg-white/20' : 'bg-gray-300'
                    }`}>
                      <IconComponent size={12} className={activeSection === index ? 'text-white' : 'text-gray-600'} />
                    </div>
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Contenido móvil con scroll */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            {content.sections ? (
              content.sections.map((section, index) => (
                <div 
                  key={index} 
                  className={`${activeSection === index ? 'block' : 'hidden'}`}
                >
                  {/* Section Header móvil */}
                  <div className="text-center mb-6">
                    <div className="flex flex-col items-center space-y-3 mb-4">
                      {section.icon && (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                          <section.icon size={32} className="text-white" />
                        </div>
                      )}
                      <div className="text-center">
                        <h2 className="font-bold text-gray-800 text-xl">{section.title}</h2>
                        {section.deliveryTime && (
                          <div className="flex items-center justify-center space-x-2 mt-2">
                            <Clock size={14} className="text-gray-500" />
                            <span className="text-gray-600 text-sm">Tiempo de entrega: {section.deliveryTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">{section.description}</p>
                  </div>

                  {/* Services List */}
                  {section.services && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-base flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        Servicios incluidos
                      </h3>
                      <div className="space-y-3">
                        {section.services.map((service, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">{service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content List (para Sobre Mí) */}
                  {section.content && (
                    <div className="mb-6">
                      <div className="space-y-3">
                        {section.content.map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid (para Sobre Mí) */}
                  {section.skills && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-base flex items-center">
                        <Zap size={16} className="text-blue-500 mr-2" />
                        Stack Tecnológico
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(section.skills).map(([category, skills]) => (
                          <div key={category} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="font-medium text-gray-800 mb-3 text-sm">{category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {section.technologies && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-base flex items-center">
                        <Zap size={16} className="text-purple-500 mr-2" />
                        Tecnologías
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {section.technologies.map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star size={20} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2 text-base">
                        Información verificada
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Toda la información mostrada es actual y está basada en experiencia real de proyectos.
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Single Content Layout */
              <div className="prose prose-gray max-w-none">
                <p>Contenido básico para esta sección.</p>
              </div>
            )}

            {/* Espaciado extra */}
            <div className="h-8"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  // RENDER DESKTOP/TABLET
  return (
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
      onMouseDown={() => onBringToFront(windowProp.windowId)}
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
        {/* Window title and icon */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
            <windowProp.icon size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-gray-800 text-base truncate block">{content.title}</span>
            <div className="text-gray-500 mt-0.5 text-xs">
              {content.sections?.length} sección{content.sections?.length !== 1 ? 'es' : ''}
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

      {/* Content Layout - Responsive */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Navigation - Solo en desktop */}
        {!windowDimensions.isMobile && content.sections && content.sections.length > 1 && (
          <div className="w-64 border-r border-gray-200/50 bg-gray-50/50 p-4 overflow-y-auto flex-shrink-0">
            <nav className="space-y-2">
              {content.sections.map((section, index) => {
                const IconComponent = section.icon || CheckCircle;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === index
                        ? 'bg-white shadow-sm border border-gray-200 text-gray-800'
                        : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      section.color ? `bg-gradient-to-br ${section.color}` : 'bg-gray-200'
                    }`}>
                      <IconComponent size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{section.title}</div>
                      {section.deliveryTime && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{section.deliveryTime}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {content.sections ? (
            /* Servicios Layout */
            <div className="p-6">
              {content.sections.map((section, index) => (
                <div 
                  key={index} 
                  className={`${activeSection === index ? 'block' : 'hidden'}`}
                >
                  {/* Section Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      {section.icon && (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                          <section.icon size={24} className="text-white" />
                        </div>
                      )}
                      <div>
                        <h2 className="font-bold text-gray-800 text-2xl">{section.title}</h2>
                        {section.deliveryTime && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock size={14} className="text-gray-500" />
                            <span className="text-gray-600 text-sm">Tiempo de entrega: {section.deliveryTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-base">{section.description}</p>
                  </div>

                  {/* Services List */}
                  {section.services && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                        <CheckCircle size={18} className="text-green-500 mr-2" />
                        Servicios incluidos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.services.map((service, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg border border-gray-200/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content List (para Sobre Mí) */}
                  {section.content && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 gap-3">
                        {section.content.map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start space-x-3 p-4 bg-white/60 rounded-lg border border-gray-200/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-base">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid (para Sobre Mí) */}
                  {section.skills && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                        <Zap size={18} className="text-blue-500 mr-2" />
                        Stack Tecnológico
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(section.skills).map(([category, skills]) => (
                          <div key={category} className="p-4 bg-white/60 rounded-lg border border-gray-200/50">
                            <h4 className="font-medium text-gray-800 mb-3 text-base">{category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {section.technologies && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                        <Zap size={18} className="text-purple-500 mr-2" />
                        Tecnologías
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {section.technologies.map((tech, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información verificada */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2 text-lg">
                          Información verificada y actualizada
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Toda la información mostrada es actual y está basada en experiencia real de proyectos completados.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Content Layout */
            <div className="p-6">
              <div className="prose prose-gray max-w-none">
                <p>Contenido básico para esta sección.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span>EKLISTA Portfolio</span>
          {content.sections && (
            <span>Sección {activeSection + 1} de {content.sections.length}</span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Información actualizada</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WindowInfo;