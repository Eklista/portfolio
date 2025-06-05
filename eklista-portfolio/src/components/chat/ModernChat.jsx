// src/components/chat/ModernChat.jsx - ACTUALIZADO CON GROQ AI
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
  Calculator,
  Zap,
  AlertCircle
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import chatAI from '../../services/groqChatAI'; // ✅ NUEVO IMPORT

const ModernChat = ({ 
  isOpen = false, 
  onClose, 
  onMinimize, 
  isMinimized = false,
  isMobile = false,
  onOpenQuote
}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [aiStatus, setAiStatus] = useState('checking'); // checking, available, fallback
  const messagesEndRef = useRef(null);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // ✅ VERIFICAR ESTADO DE GROQ AL INICIALIZAR
  useEffect(() => {
    const checkAIStatus = async () => {
      setAiStatus('checking');
      
      // Dar tiempo a que Groq se inicialice
      setTimeout(() => {
        const isAvailable = chatAI.isAvailable();
        setAiStatus(isAvailable ? 'available' : 'fallback');
        
        console.log('🤖 Estado del AI:', {
          disponible: isAvailable,
          stats: chatAI.getStats()
        });
      }, 1000);
    };

    if (isOpen && messages.length === 0) {
      checkAIStatus();
    }
  }, [isOpen]);

  // Mensajes iniciales MEJORADOS
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        content: `¡Hola! 👋 Soy tu **asistente virtual** de EKLISTA.

Estoy aquí para ayudarte con información sobre:
• Mis servicios de diseño y desarrollo
• Precios y cotizaciones personalizadas
• Portfolio de proyectos completados
• Cualquier duda sobre tu próximo proyecto

${aiStatus === 'available' ? '🤖 **Chat inteligente activado** - Puedes hacerme cualquier pregunta específica.' : '💬 **Modo respuestas rápidas** - Te ayudo con las consultas más comunes.'}

¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
        aiPowered: aiStatus === 'available'
      };

      setTimeout(() => {
        setMessages([welcomeMessage]);
      }, 800);
    }
  }, [isOpen, aiStatus]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ NUEVA LÓGICA DE PROCESAMIENTO DE MENSAJES CON GROQ
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

    try {
      // ✅ USAR GROQ CHAT AI
      const aiResponse = await chatAI.respond(content);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        aiPowered: aiResponse.source === 'groq',
        source: aiResponse.source // Para debugging
      };

      // Tiempo de respuesta realista
      const delay = aiResponse.source === 'groq' ? 1500 : 800;
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // ✅ DETECTAR SI DEBE ABRIR COTIZADOR - MÁS INTELIGENTE
        if ((content.toLowerCase().includes('cotizador') && 
             (content.toLowerCase().includes('abrir') || content.toLowerCase().includes('empezar'))) ||
            (aiResponse.content.toLowerCase().includes('abrirte el cotizador') || 
             aiResponse.content.toLowerCase().includes('abrir el cotizador'))) {
          setTimeout(() => {
            onOpenQuote && onOpenQuote();
          }, 1500);
        }
      }, delay);

    } catch (error) {
      console.error('Error en chat AI:', error);
      
      // Mensaje de error amigable
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Disculpa, tuve un pequeño problema técnico. Pero no te preocupes, puedo ayudarte con:

• **Servicios y precios** - Desarrollo web, UX/UI, diseño gráfico
• **Portfolio** - Explora las carpetas del escritorio para ver mis trabajos
• **Cotizaciones** - Usa el botón "Cotizar" para obtener un presupuesto
• **Contacto** - hello@eklista.com o WhatsApp +502 1234-5678

¿En qué más puedo ayudarte?`,
        timestamp: new Date(),
        aiPowered: false,
        isError: true
      };

      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // ✅ QUICK ACTIONS MEJORADAS
  const quickActions = [
    { 
      text: 'Servicios', 
      value: '¿Qué servicios ofreces y cuáles son sus precios?', 
      icon: Code, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      text: 'Portfolio', 
      value: 'Muéstrame tus mejores proyectos y casos de éxito', 
      icon: Palette, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      text: 'Cotizar', 
      value: 'Quiero una cotización personalizada para mi proyecto', 
      icon: Calculator, 
      color: 'from-orange-500 to-red-500' 
    },
    { 
      text: 'Contacto', 
      value: 'Dame tu información de contacto', 
      icon: MessageSquare, 
      color: 'from-green-500 to-emerald-500' 
    }
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

  // ✅ RENDER MÓVIL MEJORADO
  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 bg-primary z-50 flex flex-col"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header móvil MEJORADO */}
        <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
              <Bot size={18} className="text-white" />
              {/* ✅ INDICADOR DE ESTADO AI */}
              {aiStatus === 'available' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Zap size={8} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-primary">EKLISTA Chat</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  aiStatus === 'available' ? 'bg-green-400' : 
                  aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-xs text-muted">
                  {aiStatus === 'available' ? 'AI Inteligente' : 
                   aiStatus === 'checking' ? 'Conectando...' : 'Respuestas Rápidas'}
                </span>
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
                aiPowered={message.aiPowered}
              />
            ))}
          </AnimatePresence>

          {/* ✅ TYPING INDICATOR MEJORADO */}
          {isTyping && (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                <Bot size={14} className="text-white" />
                {aiStatus === 'available' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                )}
              </div>
              <div className="bg-primary border border-secondary rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
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
                  <span className="text-xs text-muted">
                    {aiStatus === 'available' ? 'AI pensando...' : 'Escribiendo...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input móvil */}
        <div className="border-t border-primary bg-secondary flex-shrink-0">
          {/* Quick Actions MEJORADAS */}
          {showQuickActions && messages.length <= 1 && (
            <div className="p-4 border-b border-primary">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles size={14} className="text-accent-primary" />
                <span className="text-xs text-muted font-inter">Pregúntame sobre:</span>
                {aiStatus === 'available' && (
                  <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                    <Zap size={10} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">AI</span>
                  </div>
                )}
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
                      if (currentInput.trim() && !isTyping) {
                        handleSendMessage(currentInput.trim());
                      }
                    }
                  }}
                  placeholder={
                    aiStatus === 'available' 
                      ? "Pregúntame cualquier cosa específica..." 
                      : "Escribe tu mensaje..."
                  }
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
                  if (currentInput.trim() && !isTyping) {
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

            {/* Status Info MEJORADO */}
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    aiStatus === 'available' ? 'bg-green-400' : 
                    aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-muted font-inter">
                    EKLISTA Chat {aiStatus === 'available' ? 'AI' : 'Online'}
                  </span>
                </div>
                
                {isTyping && (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse"></div>
                    <span className="text-accent-primary font-inter">
                      {aiStatus === 'available' ? 'AI escribiendo...' : 'Escribiendo...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ✅ RENDER DESKTOP/TABLET MEJORADO
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
      {/* Header desktop MEJORADO */}
      <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
        {/* Chat info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
            <Bot size={16} className="text-white" />
            {/* ✅ INDICADOR DE ESTADO AI */}
            {aiStatus === 'available' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                <Zap size={6} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-poppins font-bold text-primary text-sm">EKLISTA Chat</h3>
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                aiStatus === 'available' ? 'bg-green-400' : 
                aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
              }`}></div>
              <span className="text-xs text-muted">
                {aiStatus === 'available' ? 'AI Inteligente' : 
                 aiStatus === 'checking' ? 'Conectando...' : 'Asistente Virtual'}
              </span>
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
              aiPowered={message.aiPowered}
            />
          ))}
        </AnimatePresence>

        {/* ✅ TYPING INDICATOR MEJORADO DESKTOP */}
        {isTyping && (
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
              <Bot size={14} className="text-white" />
              {aiStatus === 'available' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              )}
            </div>
            <div className="bg-primary border border-secondary rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
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
                <span className="text-xs text-muted">
                  {aiStatus === 'available' ? 'AI analizando...' : 'Escribiendo...'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input desktop */}
      <div className="border-t border-primary bg-secondary/50 flex-shrink-0">
        {/* Quick Actions MEJORADAS */}
        {showQuickActions && messages.length <= 1 && (
          <div className="p-3 border-b border-primary">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles size={14} className="text-accent-primary" />
              <span className="text-xs text-muted font-inter">Pregúntame sobre:</span>
              {aiStatus === 'available' && (
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <Zap size={8} className="text-green-600" />
                  <span className="text-xs text-green-600 font-medium">AI</span>
                </div>
              )}
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
                    if (currentInput.trim() && !isTyping) {
                      handleSendMessage(currentInput.trim());
                    }
                  }
                }}
                placeholder={
                  aiStatus === 'available' 
                    ? "Pregúntame cualquier cosa específica sobre mis servicios..." 
                    : "Pregúntame sobre mis servicios..."
                }
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
                if (currentInput.trim() && !isTyping) {
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

          {/* Status Info MEJORADO */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  aiStatus === 'available' ? 'bg-green-400' : 
                  aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-muted font-inter">
                  EKLISTA Chat {aiStatus === 'available' ? 'AI' : 'Online'}
                </span>
              </div>
              
              {isTyping && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse"></div>
                  <span className="text-accent-primary font-inter">
                    {aiStatus === 'available' ? 'AI escribiendo...' : 'Escribiendo...'}
                  </span>
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