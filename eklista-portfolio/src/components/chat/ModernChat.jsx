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
  Palette
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ModernChat = ({ 
  isOpen = false, 
  onClose, 
  onMinimize, 
  isMinimized = false,
  isMobile = false 
}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
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

    'cotizar': `¡Excelente! El cotizador te ayudará paso a paso.

Te haré algunas preguntas sobre:
✅ Tipo de proyecto que necesitas
✅ Funcionalidades específicas  
✅ Servicios adicionales
✅ Información de contacto

¿Estás listo para empezar con tu cotización personalizada?`,

    'hola': `¡Hola! 👋 Soy EKLISTA AI, tu asistente creativo.

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

    'default': `Interesante pregunta. Como tu asistente creativo, te puedo ayudar con:

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
        content: `¡Hola! 👋 Soy **EKLISTA AI**, tu asistente creativo personal.

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
        <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-poppins font-bold text-primary">EKLISTA AI</h2>
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

        {/* Messages área */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

        {/* Input móvil */}
        <div className="border-t border-primary bg-secondary">
          <ChatInput
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            placeholder="Escribe tu mensaje..."
            showQuickActions={showQuickActions && messages.length <= 1}
          />
        </div>
      </motion.div>
    );
  }

  // Layout desktop - ventana flotante
  return (
    <motion.div
      className={`fixed bg-secondary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary overflow-hidden z-50 ${
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
      <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between">
        {/* Chat info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-poppins font-bold text-primary text-sm">EKLISTA AI</h3>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-xs text-muted">Asistente Creativo</span>
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
      <div className="flex flex-col h-full">
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

        {/* Input desktop */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          placeholder="Pregúntame sobre mis servicios..."
          showQuickActions={showQuickActions && messages.length <= 1}
        />
      </div>
    </motion.div>
  );
};

export default ModernChat;