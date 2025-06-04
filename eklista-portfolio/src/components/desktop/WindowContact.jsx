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
  Mail
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
    timeline: ''
  });
  
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  
  const textareaRef = useRef(null);
  const dragControls = useDragControls();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [formData.message]);

  if (isMinimized) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simular envío
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      
      // Auto-cerrar después del éxito
      setTimeout(() => {
        onClose(windowProp.windowId);
      }, 2000);
    }, 1500);
  };

  if (sent) {
    return (
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        style={{
          left: window.position?.x || windowProp.position?.x || 150,
          top: window.position?.y || windowProp.position?.y || 120,
          width: window.size?.width || windowProp.size?.width || 1000,
          height: window.size?.height || windowProp.size?.height || 700,
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
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={32} className="text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ¡Mensaje enviado!
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Tu mensaje ha sido enviado exitosamente. Te responderé dentro de 24 horas.
            <br />
            <span className="text-sm text-gray-500">
              También puedes contactarme directamente por WhatsApp: +502 1234-5678
            </span>
          </motion.p>
          
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

  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      style={{
        left: window.position?.x || windowProp.position?.x || 150,
        top: window.position?.y || windowProp.position?.y || 120,
        width: window.size?.width || windowProp.size?.width || 1000,
        height: window.size?.height || windowProp.size?.height || 700,
        zIndex: windowProp.zIndex || 100
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag={!windowProp.isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - (window.size?.width || 1000),
        top: 0,
        bottom: window.innerHeight - (window.size?.height || 700) - 80
      }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Gmail-style Header */}
      <div 
        className="bg-gray-50/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-gray-200/50 cursor-move"
        onPointerDown={(e) => {
          onBringToFront(windowProp.windowId);
          if (!windowProp.isMaximized) {
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
            onClick={() => onMaximize && onMaximize(windowProp.windowId)}
            className="w-8 h-8 bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group" 
            title={windowProp.isMaximized ? "Restaurar" : "Maximizar"}
          >
            {windowProp.isMaximized ? (
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

      {/* Gmail-style Compose Area */}
      <div className="flex flex-col h-full">
        {/* Email Form Fields */}
        <div className="flex-1 overflow-y-auto">
          {/* From/To Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="space-y-3">
              {/* From */}
              <div className="flex items-center text-sm">
                <span className="w-16 text-gray-600 font-medium">De:</span>
                <div className="flex items-center space-x-2 flex-1">
                  <User size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Tu nombre"
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center text-sm">
                <span className="w-16 text-gray-600 font-medium">Email:</span>
                <div className="flex items-center space-x-2 flex-1">
                  <Mail size={16} className="text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    placeholder="tu@email.com"
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="flex items-center text-sm">
                <span className="w-16 text-gray-600 font-medium">Empresa:</span>
                <div className="flex items-center space-x-2 flex-1">
                  <Building size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onFocus={() => setActiveField('company')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Tu empresa (opcional)"
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* To */}
              <div className="flex items-center text-sm">
                <span className="w-16 text-gray-600 font-medium">Para:</span>
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">EK</span>
                  </div>
                  <span className="text-gray-700 font-medium">EKLISTA</span>
                  <span className="text-gray-500">&lt;hello@eklista.com&gt;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="px-4 py-3 border-b border-gray-100">
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              onFocus={() => setActiveField('subject')}
              onBlur={() => setActiveField(null)}
              placeholder="Asunto del mensaje"
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          {/* Project Details Section - SIN SELECTS */}
          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Project Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tipo de Proyecto</label>
                <input
                  type="text"
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  placeholder="Ej: Sitio Web, App, UX/UI, Branding..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Presupuesto</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Ej: Q500-1500, Q3000-5000, +Q10000..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Tiempo de Entrega</label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="Ej: 1 semana, 1 mes, 3 meses, Flexible..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div className="p-4 flex-1">
            <textarea
              ref={textareaRef}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              onFocus={() => setActiveField('message')}
              onBlur={() => setActiveField(null)}
              placeholder={`Escribe tu mensaje aquí...

Cuéntame sobre tu proyecto:
• ¿Qué problema quieres resolver?
• ¿Quién es tu audiencia objetivo?
• ¿Tienes referencias o inspiración?
• ¿Hay fechas importantes a considerar?`}
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
              style={{ minHeight: '200px' }}
            />
          </div>
        </div>

        {/* Footer SIMPLE - Solo botón de enviar */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={!formData.name || !formData.email || !formData.message || isSending}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg transition-colors disabled:cursor-not-allowed font-medium"
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
        </div>
      </div>
    </motion.div>
  );
};

export default WindowContact;