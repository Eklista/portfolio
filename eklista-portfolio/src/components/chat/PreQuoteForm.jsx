// src/components/chat/PreQuoteForm.jsx - Formulario de Precotización basado en conversación AI
import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  MessageSquare,
  Phone,
  Mail,
  DollarSign,
  Clock,
  FileText,
  User,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  Edit3,
  Bot
} from 'lucide-react';

const PreQuoteForm = ({ 
  isOpen = false, 
  onClose, 
  onMinimize,
  onMaximize,
  conversationData = {}, // Datos de la conversación con la IA
  onSubmit,
  isMobile = false,
  window: windowProp,
  onBringToFront
}) => {
  const [formData, setFormData] = useState({
    // ✅ DATOS PRE-LLENADOS POR LA IA (SOLO LECTURA)
    projectSummary: conversationData.summary || '',
    estimatedPrice: conversationData.estimate || '',
    projectType: conversationData.projectType || '',
    aiAnalysis: conversationData.aiAnalysis || '',
    
    // ✅ DATOS A COMPLETAR POR EL USUARIO
    fullName: conversationData.userName || '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    contactMethod: 'whatsapp', // whatsapp, email, llamada
    additionalComments: '',
    urgency: 'normal', // urgent, normal, flexible
    hasDeadline: false,
    deadline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const dragControls = useDragControls();

  // ✅ FUNCIÓN PARA OBTENER DIMENSIONES RESPONSIVE (igual que tus otros componentes)
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1000,
        height: 700,
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
        width: Math.min(1100, screenWidth - 120),
        height: Math.min(screenHeight - 100, 750),
        position: { x: 100, y: 80 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());
    setIsMaximized(windowProp?.isMaximized || false);

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

  // ✅ PRE-LLENAR FORMULARIO CON DATOS DE LA CONVERSACIÓN
  useEffect(() => {
    if (conversationData && isOpen) {
      setFormData(prev => ({
        ...prev,
        projectSummary: conversationData.summary || 'Proyecto analizado por IA basado en nuestra conversación',
        estimatedPrice: conversationData.estimate || 'Calculado según conversación',
        projectType: conversationData.projectType || 'Definido en chat',
        aiAnalysis: conversationData.aiAnalysis || 'IA analizó los requerimientos durante la conversación',
        fullName: conversationData.userName || ''
      }));
    }
  }, [conversationData, isOpen]);

  if (!isOpen || !windowDimensions) return null;

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

  // ✅ VALIDACIÓN DE CAMPOS
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'El presupuesto aproximado es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ ENVÍO DEL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Preparar datos completos para envío
      const completeData = {
        ...formData,
        conversationHistory: conversationData.conversationHistory || [],
        timestamp: new Date().toISOString(),
        source: 'chat-ai-prequote',
        totalEstimate: conversationData.estimate
      };
      
      if (onSubmit) {
        await onSubmit(completeData);
      }
      
      setSubmitted(true);
      
      // Auto-cerrar después de 3 segundos
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        // Reset form
        setFormData({
          projectSummary: '',
          estimatedPrice: '',
          projectType: '',
          aiAnalysis: '',
          fullName: '',
          email: '',
          phone: '',
          company: '',
          budget: '',
          contactMethod: 'whatsapp',
          additionalComments: '',
          urgency: 'normal',
          hasDeadline: false,
          deadline: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error enviando precotización:', error);
      setErrors({ submit: 'Error al enviar. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ ACTUALIZAR CAMPOS
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize && onMaximize(windowProp?.windowId);
  };

  const currentWindowSize = getCurrentWindowSize();

  // ✅ PANTALLA DE ÉXITO (igual que tus otros componentes)
  if (submitted) {
    return (
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
        style={{
          left: currentWindowSize.position.x,
          top: currentWindowSize.position.y,
          width: currentWindowSize.width,
          height: currentWindowSize.height,
          zIndex: windowProp?.zIndex || 100
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onMouseDown={() => onBringToFront && onBringToFront(windowProp?.windowId)}
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
            ¡Precotización Enviada!
          </motion.h2>
          
          <motion.div 
            className="space-y-3 mb-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600 leading-relaxed">
              Gracias {formData.fullName}. Pablo revisará tu precotización y se comunicará contigo por {formData.contactMethod} en las próximas 24-48 horas.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-800 font-semibold mb-2">
                Estimado: {formData.estimatedPrice}
              </div>
              <div className="text-green-700 text-sm">
                Proyecto: {formData.projectType}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            Esta ventana se cerrará automáticamente...
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ✅ RENDER MÓVIL (siguiendo el patrón de tus componentes)
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Precotización IA</h3>
              <div className="text-xs text-gray-500">
                Completar datos de contacto
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
          >
            <X size={18} className="text-gray-600 group-hover:text-red-600" />
          </button>
        </div>

        {/* Contenido móvil */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Resumen de IA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Bot size={20} className="text-purple-600" />
                <h4 className="font-semibold text-purple-800">Análisis de IA</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-purple-700"><strong>Proyecto:</strong> {formData.projectType}</p>
                <p className="text-purple-700"><strong>Estimado:</strong> {formData.estimatedPrice}</p>
                <p className="text-purple-700"><strong>Resumen:</strong> {formData.projectSummary}</p>
              </div>
            </div>

            {/* Formulario móvil */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Tu nombre completo"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contacto *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
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
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-all text-sm ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="+502 1234-5678"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto aproximado *
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  className={`w-full bg-white border-2 rounded-lg px-3 py-2 text-gray-800 focus:outline-none transition-all text-sm ${
                    errors.budget ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                >
                  <option value="">Selecciona tu presupuesto</option>
                  <option value="500-1500">Q500 - Q1,500</option>
                  <option value="1500-3000">Q1,500 - Q3,000</option>
                  <option value="3000-5000">Q3,000 - Q5,000</option>
                  <option value="5000-10000">Q5,000 - Q10,000</option>
                  <option value="10000+">Q10,000+</option>
                  <option value="flexible">Flexible según propuesta</option>
                </select>
                {errors.budget && (
                  <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.budget}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Cómo prefieres que Pablo te contacte? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'llamada', label: 'Llamada', icon: Phone }
                  ].map((method) => {
                    const IconComponent = method.icon;
                    const isSelected = formData.contactMethod === method.value;
                    
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => updateField('contactMethod', method.value)}
                        className={`p-2 rounded-lg border-2 transition-all text-xs flex flex-col items-center space-y-1 ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <IconComponent size={16} />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => updateField('additionalComments', e.target.value)}
                  className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none transition-all text-sm"
                  rows="3"
                  placeholder="Fechas importantes, referencias, detalles adicionales..."
                />
              </div>
            </form>
          </div>
        </div>

        {/* Footer móvil */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Enviando precotización...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar Precotización</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // ✅ RENDER DESKTOP/TABLET (siguiendo el patrón de tus componentes)
  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
      style={{
        left: isMaximized ? currentWindowSize.position.x : windowDimensions.position.x,
        top: isMaximized ? currentWindowSize.position.y : windowDimensions.position.y,
        width: currentWindowSize.width,
        height: currentWindowSize.height,
        zIndex: windowProp?.zIndex || 100
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
      {/* Header estilo window */}
      <div 
        className="bg-gray-50/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-gray-200/50 cursor-move flex-shrink-0"
        onPointerDown={(e) => {
          onBringToFront && onBringToFront(windowProp?.windowId);
          if (!isMaximized && !windowDimensions.isMobile) {
            dragControls.start(e);
          }
        }}
      >
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Precotización con IA</h3>
              <div className="text-xs text-gray-500">
                Basada en conversación • {formData.fullName || 'Completar datos'}
              </div>
            </div>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMinimize && onMinimize(windowProp)}
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
            onClick={onClose}
            className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Cerrar"
          >
            <X size={14} className="text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* Información del análisis IA */}
      <div className="px-6 py-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200/50 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles size={20} className="text-purple-600" />
          <h4 className="font-semibold text-purple-800">Análisis Automático de IA</h4>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-purple-600 font-medium">Tipo de Proyecto</p>
            <p className="text-purple-800">{formData.projectType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-purple-600 font-medium">Estimado Inicial</p>
            <p className="text-purple-800 font-semibold">{formData.estimatedPrice}</p>
          </div>
          <div className="space-y-1">
            <p className="text-purple-600 font-medium">Incluye</p>
            <p className="text-purple-800">Análisis de requerimientos, NO incluye hosting</p>
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
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Completar información</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Email de contacto *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
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
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                        }`}
                        placeholder="+502 1234-5678"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle size={14} />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Presupuesto aproximado *
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                      className={`w-full bg-white border-2 rounded-lg px-4 py-3 text-gray-800 focus:outline-none transition-all ${
                        errors.budget ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                    >
                      <option value="">Selecciona tu presupuesto</option>
                      <option value="500-1500">Q500 - Q1,500</option>
                      <option value="1500-3000">Q1,500 - Q3,000</option>
                      <option value="3000-5000">Q3,000 - Q5,000</option>
                      <option value="5000-10000">Q5,000 - Q10,000</option>
                      <option value="10000+">Q10,000+</option>
                      <option value="flexible">Flexible según propuesta</option>
                    </select>
                    {errors.budget && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{errors.budget}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      ¿Cómo prefieres que Pablo te contacte? *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'whatsapp', label: 'WhatsApp', icon: Phone, desc: 'Respuesta rápida' },
                        { value: 'email', label: 'Email', icon: Mail, desc: 'Más formal' },
                        { value: 'llamada', label: 'Llamada', icon: Phone, desc: 'Conversación directa' }
                      ].map((method) => {
                        const IconComponent = method.icon;
                        const isSelected = formData.contactMethod === method.value;
                        
                        return (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => updateField('contactMethod', method.value)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <IconComponent size={16} className={isSelected ? 'text-purple-600' : 'text-gray-600'} />
                              <span className={`font-medium text-sm ${isSelected ? 'text-purple-800' : 'text-gray-800'}`}>
                                {method.label}
                              </span>
                            </div>
                            <p className={`text-xs ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                              {method.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Comentarios adicionales (opcional)
                    </label>
                    <textarea
                      value={formData.additionalComments}
                      onChange={(e) => updateField('additionalComments', e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none transition-all"
                      rows="4"
                      placeholder="Fechas importantes, referencias que te gusten, detalles específicos que no mencionamos en el chat..."
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                      Urgencia del proyecto
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'urgent', label: 'Urgente', desc: '1-2 semanas', color: 'red' },
                        { value: 'normal', label: 'Normal', desc: '1-2 meses', color: 'blue' },
                        { value: 'flexible', label: 'Flexible', desc: 'Sin prisa', color: 'green' }
                      ].map((urgency) => {
                        const isSelected = formData.urgency === urgency.value;
                        
                        return (
                          <button
                            key={urgency.value}
                            type="button"
                            onClick={() => updateField('urgency', urgency.value)}
                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                              isSelected 
                                ? `border-${urgency.color}-500 bg-${urgency.color}-50` 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`font-medium text-sm ${isSelected ? `text-${urgency.color}-800` : 'text-gray-800'}`}>
                              {urgency.label}
                            </div>
                            <div className={`text-xs ${isSelected ? `text-${urgency.color}-600` : 'text-gray-500'}`}>
                              {urgency.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Resumen y información adicional */}
            <div className="space-y-6">
              {/* Resumen del proyecto IA */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                  <MessageSquare size={20} className="mr-2 text-purple-600" />
                  Resumen de tu proyecto
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Análisis IA:</span>
                    <p className="text-gray-600 mt-1">{formData.projectSummary}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Estimado inicial:</span>
                    <p className="text-purple-600 font-semibold text-lg">{formData.estimatedPrice}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      * Estimado basado en conversación. Puede variar según detalles finales.
                      <br />* NO incluye hosting ni dominio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proceso de trabajo */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 text-base flex items-center">
                  <CheckCircle2 size={18} className="mr-2" />
                  Próximos pasos
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-green-700">Pablo revisará tu precotización en 24-48 horas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-green-700">Te contactará para clarificar cualquier duda</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="text-green-700">Recibirás cotización final y propuesta detallada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <span className="text-green-700">Definición de cronograma y inicio del proyecto</span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 text-base flex items-center">
                  <User size={18} className="mr-2" />
                  Información de contacto
                </h4>
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
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Clock size={14} />
                    <span>Lun-Vie: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Testimonial o garantía */}
              <div className="bg-gray-800 text-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h4 className="font-semibold">Garantía de calidad</h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Más de 5 años creando experiencias digitales únicas. Portfolio con 50+ proyectos exitosos. 
                  Respuesta garantizada en menos de 24 horas."
                </p>
                <div className="flex items-center space-x-4 mt-4 text-xs text-gray-400">
                  <span>⭐ 4.9/5 satisfacción</span>
                  <span>🚀 Entrega puntual</span>
                  <span>🔄 Revisiones incluidas</span>
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
            <p className="text-xs mt-1">Esta precotización es solo un estimado inicial</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg transition-colors disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Enviando precotización...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar Precotización</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PreQuoteForm;