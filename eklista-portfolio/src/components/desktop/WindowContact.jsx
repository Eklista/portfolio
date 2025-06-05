import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  Send,
  CheckCircle2,
  Loader2,
  User,
  Building,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';

const WindowContact = ({ 
  window: windowProp, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    projectType: '',
    budget: '',
    timeline: '',
    phone: ''
  });
  
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const textareaRef = useRef(null);
  const dragControls = useDragControls();

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1000,
        height: 700,
        position: { x: 150, y: 120 },
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
        position: { x: 80, y: 60 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());
    setIsMaximized(windowProp.isMaximized || false);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const handleResize = () => {
      if (!isMaximized) {
        setWindowDimensions(getResponsiveDimensions());
      }
    };

    globalThis.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      globalThis.removeEventListener('resize', handleResize);
    };
  }, [isMaximized]);

  if (isMinimized || !windowDimensions) return null;

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;
    
    setIsSending(true);
    
    // Simular envío
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      
      // Auto-cerrar después del éxito
      setTimeout(() => {
        onClose(windowProp.windowId);
      }, 3000);
    }, 2000);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize && onMaximize(windowProp.windowId);
  };

  const currentWindowSize = getCurrentWindowSize();

  // Modal de éxito
  if (sent) {
    return (
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
        style={{
          left: currentWindowSize.position.x,
          top: currentWindowSize.position.y,
          width: currentWindowSize.width,
          height: currentWindowSize.height,
          zIndex: windowProp.zIndex || 100
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onMouseDown={() => onBringToFront(windowProp.windowId)}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ¡Mensaje enviado exitosamente!
          </motion.h2>
          
          <motion.div 
            className="space-y-3 mb-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600 leading-relaxed">
              Gracias por contactarme. He recibido tu mensaje y te responderé dentro de las próximas 24 horas.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-1">
                <Mail size={14} />
                <span>Email: hello@eklista.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>WhatsApp: +502 1234-5678</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            Esta ventana se cerrará automáticamente en unos segundos...
          </motion.div>
        </div>
      </motion.div>
    );
  }

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
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-sm">
              <Mail size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Nuevo mensaje</h3>
              <div className="text-xs text-gray-500">
                Para: hello@eklista.com
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

        {/* Contenido móvil */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Información de contacto */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Información de contacto</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Mail size={14} />
                  <span>hello@eklista.com</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700">
                  <Phone size={14} />
                  <span>+502 1234-5678 (WhatsApp)</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700">
                  <MapPin size={14} />
                  <span>Guatemala City, GT</span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Información personal */}
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-800 text-sm">Información personal</h5>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Cómo te llamas? *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Cuál es tu email? *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono / WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all text-sm"
                    placeholder="+502 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all text-sm"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              {/* Detalles del proyecto */}
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-800 text-sm">Detalles del proyecto</h5>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de proyecto
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="website">Sitio Web / WordPress</option>
                    <option value="webapp">Aplicación Web / React</option>
                    <option value="uxui">UX/UI Design</option>
                    <option value="branding">Branding / Diseño Gráfico</option>
                    <option value="ecommerce">E-commerce / Tienda Online</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presupuesto
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none transition-all text-sm"
                    >
                      <option value="">Seleccionar</option>
                      <option value="500-1500">Q500 - Q1,500</option>
                      <option value="1500-3000">Q1,500 - Q3,000</option>
                      <option value="3000-5000">Q3,000 - Q5,000</option>
                      <option value="5000+">Q5,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none transition-all text-sm"
                    >
                      <option value="">Seleccionar</option>
                      <option value="1-2weeks">1-2 semanas</option>
                      <option value="1month">1 mes</option>
                      <option value="2-3months">2-3 meses</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuéntame sobre tu proyecto *
                </label>
                <textarea
                  ref={textareaRef}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none resize-none transition-all text-sm ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  rows="4"
                  placeholder="Describe tu proyecto: ¿Qué necesitas? ¿Cuáles son tus objetivos? ¿Tienes alguna referencia o inspiración?"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer móvil */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed font-medium"
          >
            {isSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar Mensaje</span>
              </>
            )}
          </button>
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
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Header estilo Gmail */}
      <div 
        className="bg-gray-50/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-gray-200/50 cursor-move flex-shrink-0"
        onPointerDown={(e) => {
          onBringToFront(windowProp.windowId);
          if (!isMaximized && !windowDimensions.isMobile) {
            dragControls.start(e);
          }
        }}
      >
        {/* Left side - Gmail style */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-sm">
              <Mail size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Nuevo mensaje</h3>
              <div className="text-xs text-gray-500">
                Para: hello@eklista.com
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Window controls */}
        <div className="flex items-center space-x-2">
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

      {/* Información de contacto */}
      <div className="px-6 py-4 bg-blue-50/50 border-b border-gray-200/50 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-blue-700">
            <Mail size={16} />
            <span>hello@eklista.com</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-700">
            <Phone size={16} />
            <span>+502 1234-5678 (WhatsApp)</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-700">
            <MapPin size={16} />
            <span>Guatemala City, GT</span>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Información personal</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      ¿Cómo te llamas? *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      ¿Cuál es tu email? *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Teléfono / WhatsApp (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        placeholder="+502 1234-5678"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Detalles del proyecto</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Tipo de proyecto
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="website">Sitio Web / WordPress</option>
                      <option value="webapp">Aplicación Web / React</option>
                      <option value="uxui">UX/UI Design</option>
                      <option value="branding">Branding / Diseño Gráfico</option>
                      <option value="ecommerce">E-commerce / Tienda Online</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Presupuesto estimado
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                      >
                        <option value="">Seleccionar rango</option>
                        <option value="500-1500">Q500 - Q1,500</option>
                        <option value="1500-3000">Q1,500 - Q3,000</option>
                        <option value="3000-5000">Q3,000 - Q5,000</option>
                        <option value="5000-10000">Q5,000 - Q10,000</option>
                        <option value="10000+">Q10,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Tiempo de entrega
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:border-blue-500 focus:outline-none transition-all"
                      >
                        <option value="">Seleccionar tiempo</option>
                        <option value="1-2weeks">1-2 semanas</option>
                        <option value="1month">1 mes</option>
                        <option value="2-3months">2-3 meses</option>
                        <option value="3+months">3+ meses</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Asunto del mensaje
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Ej: Necesito un sitio web para mi negocio"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2 text-sm">
                  Cuéntame sobre tu proyecto *
                </label>
                <textarea
                  ref={textareaRef}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none resize-none transition-all ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  rows="6"
                  placeholder={`Describe tu proyecto en detalle:

• ¿Qué problema quieres resolver?
• ¿Quién es tu audiencia objetivo?
• ¿Tienes referencias o inspiración?
• ¿Hay fechas importantes a considerar?
• ¿Qué funcionalidades específicas necesitas?`}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                  <MessageSquare size={20} className="mr-2 text-blue-600" />
                  ¿Por qué elegir EKLISTA?
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Respuesta garantizada en menos de 24 horas</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Más de 5 años de experiencia en proyectos digitales</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Portfolio con 50+ proyectos exitosos</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Especialista en React, WordPress y UX/UI</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 text-base flex items-center">
                  <CheckCircle2 size={18} className="mr-2" />
                  Proceso de trabajo
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-green-700">Análisis y cotización personalizada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-green-700">Propuesta y planificación del proyecto</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-green-700">Desarrollo con revisiones constantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-green-700">Entrega final y soporte post-lanzamiento</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 text-base flex items-center">
                  <Globe size={18} className="mr-2" />
                  Otras formas de contacto
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Phone size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-blue-800 text-sm">WhatsApp</div>
                        <div className="text-blue-600 text-xs">Respuesta más rápida</div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Abrir chat
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calendar size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-blue-800 text-sm">Videollamada</div>
                        <div className="text-blue-600 text-xs">Agendar reunión</div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Espaciado extra */}
          <div className="h-8"></div>
        </div>
      </div>

      {/* Footer FIJO */}
      <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>Los campos marcados con * son obligatorios</p>
          </div>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg transition-colors disabled:cursor-not-allowed font-medium"
          >
            {isSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Enviando mensaje...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar Mensaje</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WindowContact;