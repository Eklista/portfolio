import React, { useState } from 'react';
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
  Mail,
  MessageSquare
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
  const dragControls = useDragControls();

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    // Verificación de seguridad para SSR y montaje inicial
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
        width: screenWidth - 20,
        height: screenHeight - 120,
        position: { x: 10, y: 60 },
        isMobile: true,
        isTablet: false,
        isDesktop: false
      };
    } else if (isTablet) {
      return {
        width: Math.min(800, screenWidth - 80),
        height: Math.min(650, screenHeight - 160),
        position: { x: 40, y: 80 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1000, screenWidth - 200),
        height: Math.min(750, screenHeight - 200),
        position: { x: 120, y: 100 },
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
        height: 750,
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

  if (isMinimized || !windowDimensions) return null;

  const content = explorerStructure[windowProp.id].content;

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

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize && onMaximize(windowProp.windowId);
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
        className={`bg-gray-100/80 backdrop-blur-sm ${windowDimensions.isMobile ? 'px-4 py-3' : 'px-6 py-4'} flex items-center justify-between border-b border-gray-200/50 cursor-move`}
        onPointerDown={(e) => {
          if (!isMaximized && !windowDimensions.isMobile) {
            dragControls.start(e);
          }
        }}
      >
        {/* Window title and icon */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className={`${windowDimensions.isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-gradient-to-br ${windowProp.color} flex items-center justify-center shadow-sm`}>
            <windowProp.icon size={windowDimensions.isMobile ? 14 : 18} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className={`font-semibold text-gray-800 ${windowDimensions.isMobile ? 'text-sm' : 'text-base'} truncate block`}>{content.title}</span>
            <div className={`text-gray-500 mt-0.5 ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'}`}>
              {content.sections?.length} sección{content.sections?.length !== 1 ? 'es' : ''}
            </div>
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

      {/* Content Layout - Responsive */}
      <div className={`flex ${windowDimensions.isMobile ? 'flex-col' : 'flex-row'} h-full`}>
        {/* Sidebar Navigation - Solo en desktop */}
        {!windowDimensions.isMobile && content.sections && content.sections.length > 1 && (
          <div className="w-64 border-r border-gray-200/50 bg-gray-50/50 p-4">
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
        <div className="flex-1 overflow-y-auto">
          {content.sections ? (
            /* Servicios Layout */
            <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'}`}>
              {/* Mobile Navigation Tabs */}
              {windowDimensions.isMobile && content.sections.length > 1 && (
                <div className="mb-6">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {content.sections.map((section, index) => {
                      const IconComponent = section.icon || CheckCircle;
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveSection(index)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                            activeSection === index
                              ? 'bg-blue-500 text-white shadow-sm'
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

              {content.sections.map((section, index) => (
                <div 
                  key={index} 
                  className={`${activeSection === index ? 'block' : 'hidden'}`}
                >
                  {/* Section Header */}
                  <div className={`mb-6 ${windowDimensions.isMobile ? 'text-center' : ''}`}>
                    <div className={`flex ${windowDimensions.isMobile ? 'flex-col' : 'flex-row'} items-center ${windowDimensions.isMobile ? 'space-y-3' : 'space-x-4'} mb-4`}>
                      {section.icon && (
                        <div className={`${windowDimensions.isMobile ? 'w-16 h-16' : 'w-12 h-12'} rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                          <section.icon size={windowDimensions.isMobile ? 32 : 24} className="text-white" />
                        </div>
                      )}
                      <div className={windowDimensions.isMobile ? 'text-center' : ''}>
                        <h2 className={`font-bold text-gray-800 ${windowDimensions.isMobile ? 'text-xl' : 'text-2xl'}`}>{section.title}</h2>
                        {section.deliveryTime && (
                          <div className={`flex items-center ${windowDimensions.isMobile ? 'justify-center' : ''} space-x-2 mt-1`}>
                            <Clock size={windowDimensions.isMobile ? 12 : 14} className="text-gray-500" />
                            <span className={`text-gray-600 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'}`}>Tiempo de entrega: {section.deliveryTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={`text-gray-600 leading-relaxed ${windowDimensions.isMobile ? 'text-sm' : 'text-base'}`}>{section.description}</p>
                  </div>

                  {/* Services List */}
                  {section.services && (
                    <div className="mb-6">
                      <h3 className={`font-semibold text-gray-800 mb-4 flex items-center ${windowDimensions.isMobile ? 'text-base' : 'text-lg'}`}>
                        <CheckCircle size={windowDimensions.isMobile ? 16 : 18} className="text-green-500 mr-2" />
                        Servicios incluidos
                      </h3>
                      <div className={`grid ${windowDimensions.isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-3`}>
                        {section.services.map((service, idx) => (
                          <motion.div
                            key={idx}
                            className={`flex items-start space-x-3 ${windowDimensions.isMobile ? 'p-3' : 'p-3'} bg-white/60 rounded-lg border border-gray-200/50`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className={`text-gray-700 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'}`}>{service}</span>
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
                            className={`flex items-start space-x-3 ${windowDimensions.isMobile ? 'p-3' : 'p-4'} bg-white/60 rounded-lg border border-gray-200/50`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className={`text-gray-700 ${windowDimensions.isMobile ? 'text-sm' : 'text-base'}`}>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid (para Sobre Mí) */}
                  {section.skills && (
                    <div className="mb-6">
                      <h3 className={`font-semibold text-gray-800 mb-4 flex items-center ${windowDimensions.isMobile ? 'text-base' : 'text-lg'}`}>
                        <Zap size={windowDimensions.isMobile ? 16 : 18} className="text-blue-500 mr-2" />
                        Stack Tecnológico
                      </h3>
                      <div className={`grid ${windowDimensions.isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                        {Object.entries(section.skills).map(([category, skills]) => (
                          <div key={category} className={`${windowDimensions.isMobile ? 'p-3' : 'p-4'} bg-white/60 rounded-lg border border-gray-200/50`}>
                            <h4 className={`font-medium text-gray-800 mb-3 ${windowDimensions.isMobile ? 'text-sm' : 'text-base'}`}>{category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, idx) => (
                                <span 
                                  key={idx}
                                  className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} font-medium`}
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
                      <h3 className={`font-semibold text-gray-800 mb-4 flex items-center ${windowDimensions.isMobile ? 'text-base' : 'text-lg'}`}>
                        <Zap size={windowDimensions.isMobile ? 16 : 18} className="text-purple-500 mr-2" />
                        Tecnologías
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {section.technologies.map((tech, idx) => (
                          <span 
                            key={idx}
                            className={`px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'} font-medium border border-gray-200`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Section */}
                  <div className={`mt-8 ${windowDimensions.isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50`}>
                    <div className={`flex ${windowDimensions.isMobile ? 'flex-col text-center' : 'flex-row'} items-center justify-between`}>
                      <div className={windowDimensions.isMobile ? 'mb-4' : ''}>
                        <h3 className={`font-bold text-gray-800 mb-2 ${windowDimensions.isMobile ? 'text-base' : 'text-lg'}`}>
                          ¿Interesado en este servicio?
                        </h3>
                        <p className={`text-gray-600 ${windowDimensions.isMobile ? 'text-sm' : 'text-sm'}`}>
                          Conversemos sobre tu proyecto y cómo puedo ayudarte.
                        </p>
                      </div>
                      <div className={`flex ${windowDimensions.isMobile ? 'flex-col w-full' : 'flex-row'} space-x-0 ${windowDimensions.isMobile ? 'space-y-2' : 'space-x-3'}`}>
                        <button className={`flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${windowDimensions.isMobile ? 'w-full' : ''}`}>
                          <Mail size={16} />
                          <span className="text-sm font-medium">Contactar</span>
                        </button>
                        <button className={`flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${windowDimensions.isMobile ? 'w-full' : ''}`}>
                          <MessageSquare size={16} />
                          <span className="text-sm font-medium">WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single Content Layout */
            <div className={`${windowDimensions.isMobile ? 'p-4' : 'p-6'}`}>
              <div className="prose prose-gray max-w-none">
                <p>Contenido básico para esta sección.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className={`${windowDimensions.isMobile ? 'px-4 py-2' : 'px-6 py-2'} border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between ${windowDimensions.isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
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