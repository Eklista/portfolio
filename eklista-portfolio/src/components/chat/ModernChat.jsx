import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot,
  User,
  X, 
  Minus, 
  Square,
  Send,
  Sparkles,
  MessageSquare,
  Loader2,
  Coffee,
  Lightbulb,
  Code,
  Palette,
  Calculator
} from 'lucide-react';
import ChatMessage from './ChatMessage';

const ModernChat = ({ 
  isOpen = false, 
  onClose, 
  onMinimize, 
  isMinimized = false,
  isMobile = false,
  onOpenQuote // Nueva prop para abrir cotizador
}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const messagesEndRef = useRef(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Respuestas predefinidas del bot
  const botResponses = {
    'servicios': `¡Perfecto! Ofrezco tres servicios principales:

🎨 **Diseño Gráfico & Branding** - Desde Q500
• Logos e identidad visual
• Papelería corporativa  
• Packaging y etiquetas

💻 **Desarrollo Web** - Desde Q1,200
• Sitios WordPress personalizados
• Aplicaciones React/Next.js
• E-commerce y tiendas online

🎯 **UX/UI Design** - Desde Q800
• Investigación de usuarios
• Prototipos interactivos
• Interfaces web y móvil

¿Te interesa algún servicio en particular?`,

    'precios': `Mis precios son muy competitivos para Guatemala:

💰 **Diseño Gráfico**: Q500 - Q1,500
💰 **Sitios WordPress**: Q1,200 - Q4,000  
💰 **UX/UI Design**: Q800 - Q2,500
💰 **Desarrollo Custom**: Q4,000+

Los precios varían según la complejidad del proyecto. ¿Quieres una cotización personalizada?`,

    'portfolio': `¡Te muestro algunos de mis trabajos recientes!

🏆 **Proyectos destacados 2024:**
• Banking App UI/UX - Interfaz moderna para fintech
• E-commerce Platform - Tienda completa con pagos
• Restaurant Website - Reservas y menú digital
• Brand Identity Café - Identidad visual completa

Para ver los detalles y mockups, haz doble clic en las carpetas del escritorio. ¿Hay algún tipo de proyecto que te llame más la atención?`,

    'contacto': `¡Perfecto! Aquí tienes toda mi información:

📧 **Email**: hello@eklista.com
📱 **WhatsApp**: +502 1234-5678
💼 **LinkedIn**: /in/eklista
🐙 **GitHub**: @eklista
📍 **Ubicación**: Guatemala City, GT

Prefiero WhatsApp para una respuesta más rápida. ¿Cuál es la mejor forma de contactarte?`,

    'cotizar': `¡Excelente! Te voy a abrir el cotizador personalizado.

✨ **¿Qué incluye?**
• Selección de tipo de proyecto
• Características personalizables  
• Servicios adicionales opcionales
• Cotización instantánea

El cotizador te tomará solo 2 minutos y tendrás un precio exacto al final. ¿Estás listo para empezar?

*Abriendo cotizador...*`,

    'hola': `¡Hola! 👋 Soy tu asistente virtual de EKLISTA.

Estoy aquí para ayudarte con:
• Información sobre mis servicios
• Precios y cotizaciones
• Ver mi portfolio de trabajos
• Agendar una reunión

¿En qué puedo ayudarte hoy?`,

    'quien': `¡Hola! Soy Pablo Lacán, pero todos me conocen como **EKLISTA**.

👨‍💻 **Diseñador gráfico y Web**
🎨 **5+ años de experiencia**
🚀 **50+ proyectos completados**
🇬🇹 **Basado en Guatemala**

Me especializo en crear experiencias digitales únicas que combinan diseño atractivo con funcionalidad robusta. Mi enfoque es siempre centrado en el usuario y en resultados que importen para tu negocio.

¿Te gustaría saber más sobre algún servicio específico?`,

    'default': `Interesante pregunta. Como tu asistente virtual, te puedo ayudar con:

• **Servicios** - Qué ofrezco y cómo puedo ayudarte
• **Precios** - Tarifas y cotizaciones personalizadas  
• **Portfolio** - Trabajos recientes y casos de éxito
• **Contacto** - Cómo podemos trabajar juntos

También puedes explorar las carpetas del escritorio para ver ejemplos de mi trabajo. ¿Hay algo específico que te interese?`
  };

  // Mensajes iniciales
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        content: `¡Hola! 👋 Soy tu **asistente virtual** de EKLISTA.

Estoy aquí para mostrarte mis servicios, resolver tus dudas y ayudarte a encontrar la solución perfecta para tu proyecto.

¿En qué puedo ayudarte hoy?`,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Procesar mensaje del usuario
  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simular tiempo de respuesta
    setTimeout(() => {
      const response = getBotResponse(content);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Si es cotización, abrir ventana
      if (content.toLowerCase().includes('cotiz') || content.toLowerCase().includes('presupuesto')) {
        setTimeout(() => {
          onOpenQuote && onOpenQuote();
        }, 1000);
      }
    }, 800 + Math.random() * 1200);
  };

  // Lógica de respuestas del bot
  const getBotResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    if (normalizedInput.includes('hola') || normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
      return botResponses.hola;
    }
    if (normalizedInput.includes('servicio') || normalizedInput.includes('qué ofreces') || normalizedInput.includes('que haces')) {
      return botResponses.servicios;
    }
    if (normalizedInput.includes('precio') || normalizedInput.includes('costo') || normalizedInput.includes('cuanto')) {
      return botResponses.precios;
    }
    if (normalizedInput.includes('portfolio') || normalizedInput.includes('trabajo') || normalizedInput.includes('proyecto')) {
      return botResponses.portfolio;
    }
    if (normalizedInput.includes('contacto') || normalizedInput.includes('contactar') || normalizedInput.includes('email') || normalizedInput.includes('whatsapp')) {
      return botResponses.contacto;
    }
    if (normalizedInput.includes('cotiz') || normalizedInput.includes('presupuesto') || normalizedInput.includes('quote')) {
      return botResponses.cotizar;
    }
    if (normalizedInput.includes('quien') || normalizedInput.includes('eres') || normalizedInput.includes('about')) {
      return botResponses.quien;
    }
    
    return botResponses.default;
  };

  // Quick Actions simplificadas
  const quickActions = [
    { text: 'Servicios', value: '¿Qué servicios ofreces?', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { text: 'Precios', value: '¿Cuáles son tus precios?', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
    { text: 'Portfolio', value: 'Muéstrame tu portfolio', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { text: 'Cotizar', value: 'Quiero una cotización', icon: Calculator, color: 'from-orange-500 to-red-500' }
  ];

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Layout móvil - pantalla completa
  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 bg-primary z-50 flex flex-col"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header móvil */}
        <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-primary">EKLISTA Chat</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-muted">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-surface hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>

        {/* Messages área móvil */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                showReactions={false}
              />
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-primary border border-secondary rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-accent-primary rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input móvil CORREGIDO */}
        <div className="border-t border-primary bg-secondary flex-shrink-0">
          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <div className="p-4 border-b border-primary">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles size={14} className="text-accent-primary" />
                <span className="text-xs text-muted font-inter">Pregúntame sobre:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.button
                      key={action.text}
                      onClick={() => handleSendMessage(action.value)}
                      className="flex items-center space-x-2 text-xs px-3 py-2 bg-primary hover:bg-accent-primary/10 text-muted hover:text-accent-primary rounded-xl transition-all duration-200 border border-transparent hover:border-accent-primary/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-4 h-4 rounded bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <IconComponent size={10} className="text-white" />
                      </div>
                      <span className="font-inter font-medium">{action.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (currentInput.trim()) {
                        handleSendMessage(currentInput.trim());
                      }
                    }
                  }}
                  placeholder="Escribe tu mensaje..."
                  disabled={isTyping}
                  className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 pr-12 text-secondary placeholder-muted focus:border-accent-primary focus:outline-none resize-none transition-all text-sm disabled:opacity-50 font-inter"
                  rows="1"
                  style={{ 
                    minHeight: '44px',
                    maxHeight: '120px'
                  }}
                />
                
                {/* Terminal-style cursor cuando está vacío */}
                {currentInput === '' && !isTyping && (
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <motion.span 
                      className="text-accent-primary font-mono text-sm"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <motion.button
                onClick={() => {
                  if (currentInput.trim()) {
                    handleSendMessage(currentInput.trim());
                  }
                }}
                disabled={!currentInput.trim() || isTyping}
                className="w-12 h-12 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-primary rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                whileHover={{ scale: currentInput.trim() && !isTyping ? 1.05 : 1 }}
                whileTap={{ scale: currentInput.trim() && !isTyping ? 0.95 : 1 }}
                title="Enviar mensaje"
              >
                <Send size={18} className="text-primary" />
              </motion.button>
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-muted font-inter">EKLISTA Chat Online</span>
                </div>
                
                {isTyping && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse"></div>
                    <span className="text-accent-primary font-inter">Escribiendo...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Layout desktop - ventana flotante CORREGIDO
  return (
    <motion.div
      className={`fixed bg-secondary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary overflow-hidden z-50 flex flex-col ${
        isMinimized ? 'opacity-0 pointer-events-none' : ''
      }`}
      style={{
        bottom: '5rem',
        right: '1.5rem',
        width: '420px',
        height: '600px'
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        scale: isMinimized ? 0.9 : 1, 
        y: isMinimized ? 20 : 0 
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header desktop */}
      <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
        {/* Chat info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-primary text-sm">EKLISTA Chat</h3>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs text-muted">Asistente Virtual</span>
            </div>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="w-8 h-8 bg-surface hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
            title="Atajos rápidos"
          >
            <Sparkles size={14} className="text-accent-primary" />
          </button>
          
          <button
            onClick={onMinimize}
            className="w-8 h-8 bg-surface hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
            title="Minimizar"
          >
            <Minus size={14} className="text-muted hover:text-secondary" />
          </button>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-surface hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Cerrar"
          >
            <X size={14} className="text-muted group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Messages área desktop */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              showReactions={true}
            />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-primary border border-secondary rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-accent-primary rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input desktop CORREGIDO */}
      <div className="border-t border-primary bg-secondary/50 flex-shrink-0">
        {/* Quick Actions */}
        {showQuickActions && messages.length <= 1 && (
          <div className="p-3 border-b border-primary">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles size={14} className="text-accent-primary" />
              <span className="text-xs text-muted font-inter">Pregúntame sobre:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <motion.button
                    key={action.text}
                    onClick={() => handleSendMessage(action.value)}
                    className="flex items-center space-x-2 text-xs px-3 py-2 bg-primary hover:bg-accent-primary/10 text-muted hover:text-accent-primary rounded-xl transition-all duration-200 border border-transparent hover:border-accent-primary/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-4 h-4 rounded bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <IconComponent size={10} className="text-white" />
                    </div>
                    <span className="font-inter font-medium">{action.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (currentInput.trim()) {
                      handleSendMessage(currentInput.trim());
                    }
                  }
                }}
                placeholder="Pregúntame sobre mis servicios..."
                disabled={isTyping}
                className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 pr-12 text-secondary placeholder-muted focus:border-accent-primary focus:outline-none resize-none transition-all text-sm disabled:opacity-50 font-inter"
                rows="1"
                style={{ 
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
              />
              
              {/* Terminal-style cursor cuando está vacío */}
              {currentInput === '' && !isTyping && (
                <div className="absolute top-3 left-4 pointer-events-none">
                  <motion.span 
                    className="text-accent-primary font-mono text-sm"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                </div>
              )}
            </div>

            {/* Send Button */}
            <motion.button
              onClick={() => {
                if (currentInput.trim()) {
                  handleSendMessage(currentInput.trim());
                }
              }}
              disabled={!currentInput.trim() || isTyping}
              className="w-10 h-10 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-primary rounded-lg flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
              whileHover={{ scale: currentInput.trim() && !isTyping ? 1.05 : 1 }}
              whileTap={{ scale: currentInput.trim() && !isTyping ? 0.95 : 1 }}
              title="Enviar mensaje"
            >
              <Send size={16} className="text-primary" />
            </motion.button>
          </div>

          {/* Status Info */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-muted font-inter">EKLISTA Chat Online</span>
              </div>
              
              {isTyping && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse"></div>
                  <span className="text-accent-primary font-inter">Escribiendo...</span>
                </div>
              )}
            </div>

            <div className="text-muted font-inter">
              Enter para enviar • Shift+Enter nueva línea
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernChat;