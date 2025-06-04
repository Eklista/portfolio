import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  window, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
  const [activeSection, setActiveSection] = useState(0);

  if (isMinimized) return null;

  const content = explorerStructure[window.id].content;

  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex || 100
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag={!window.isMaximized}
      dragMomentum={false}
      onMouseDown={() => onBringToFront(window.windowId)}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Window Header */}
      <div className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move">
        {/* Window title and icon */}
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${window.color} flex items-center justify-center shadow-sm`}>
            <window.icon size={18} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-gray-800">{content.title}</span>
            <div className="text-xs text-gray-500 mt-0.5">
              {content.sections?.length} sección{content.sections?.length !== 1 ? 'es' : ''}
            </div>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMinimize(window)}
            className="w-8 h-8 bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Minimizar"
          >
            <Minus size={14} className="text-gray-600 group-hover:text-yellow-600" />
          </button>
          
          <button 
            onClick={() => onMaximize && onMaximize(window.windowId)}
            className="w-8 h-8 bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group" 
            title={window.isMaximized ? "Restaurar" : "Maximizar"}
          >
            {window.isMaximized ? (
              <Square size={14} className="text-gray-600 group-hover:text-green-600" />
            ) : (
              <Maximize2 size={14} className="text-gray-600 group-hover:text-green-600" />
            )}
          </button>
          
          <button
            onClick={() => onClose(window.windowId)}
            className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Cerrar"
          >
            <X size={14} className="text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        {content.sections && content.sections.length > 1 && (
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
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                          <section.icon size={24} className="text-white" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                        {section.deliveryTime && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-600">Tiempo de entrega: {section.deliveryTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{section.description}</p>
                  </div>

                  {/* Services List */}
                  {section.services && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid (para Sobre Mí) */}
                  {section.skills && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Zap size={18} className="text-blue-500 mr-2" />
                        Stack Tecnológico
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(section.skills).map(([category, skills]) => (
                          <div key={category} className="p-4 bg-white/60 rounded-lg border border-gray-200/50">
                            <h4 className="font-medium text-gray-800 mb-3">{category}</h4>
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
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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

                  {/* CTA Section */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          ¿Interesado en este servicio?
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Conversemos sobre tu proyecto y cómo puedo ayudarte.
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          <Mail size={16} />
                          <span className="text-sm font-medium">Contactar</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
            <div className="p-6">
              <div className="prose prose-gray max-w-none">
                <p>Contenido básico para esta sección.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
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