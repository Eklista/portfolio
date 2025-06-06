// src/components/chat/ModernChat.jsx - UI ARREGLADO
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot,
  User,
  X, 
  Minus, 
  Square,
  Send,
  MessageSquare,
  Loader2,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import chatAI from '../../services/groqChatAI';

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
  const [aiStatus, setAiStatus] = useState('checking');
  const [sessionState, setSessionState] = useState(null);
  // ✅ REMOVIDO: Quick Actions eliminadas completamente
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // ✅ NUEVO: Referencia al input

  // ✅ VERIFICAR ESTADO DE GROQ AL INICIALIZAR
  useEffect(() => {
    const checkAIStatus = async () => {
      setAiStatus('checking');
      
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
      chatAI.resetSession();
    }
  }, [isOpen]);

  // ✅ AUTO-FOCUS AL INPUT cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      // Pequeño delay para asegurar que el componente se renderizó
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]); // ✅ REMOVIDO: showQuickActions

  // ✅ INICIALIZAR CONVERSACIÓN AUTOMÁTICAMENTE
  useEffect(() => {
    if (isOpen && messages.length === 0 && aiStatus !== 'checking') {
      setTimeout(() => {
        handleSendMessage('inicio', true);
      }, 1200);
    }
  }, [isOpen, aiStatus]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ REMOVIDO: Control de Quick Actions eliminado

  // ✅ NUEVA LÓGICA DE PROCESAMIENTO SIN QUICK ACTIONS
  const handleSendMessage = async (content, isAutomatic = false) => {
    // ✅ ENFOCAR INPUT DESPUÉS DE ENVIAR
    const focusInput = () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    if (!isAutomatic) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    setCurrentInput('');
    setIsTyping(true);

    try {
      const aiResponse = await chatAI.respond(isAutomatic ? 'inicio' : content);
      
      const newSessionState = chatAI.getSessionState();
      setSessionState(newSessionState);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        aiPowered: aiResponse.source === 'groq',
        source: aiResponse.source,
        sessionStage: newSessionState.conversationStage
      };

      const delay = aiResponse.source === 'groq' ? 1500 : 800;
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        focusInput(); // ✅ RECUPERAR FOCUS

        // ✅ DETECTAR SI DEBE ABRIR COTIZADOR
        if (newSessionState.conversationStage === 'pricing' && 
            (aiResponse.content.toLowerCase().includes('cotizador') || 
             aiResponse.content.toLowerCase().includes('detallado'))) {
          setTimeout(() => {
            openQuoteWithBrief(newSessionState.briefData);
          }, 2000);
        }
      }, delay);

    } catch (error) {
      console.error('Error en chat AI:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Disculpa, tuve un problema técnico. Pero puedo ayudarte:

• **Sitio web** - WordPress desde Q1,200
• **Logo/branding** - Diseño desde Q500  
• **Desarrollo custom** - Apps desde Q4,000
• **Contacto directo** - hello@eklista.com

¿En qué te puedo ayudar?`,
        timestamp: new Date(),
        aiPowered: false,
        isError: true
      };

      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        focusInput(); // ✅ RECUPERAR FOCUS
      }, 1000);
    }
  };

  // ✅ ABRIR COTIZADOR CON DATOS DEL BRIEF
  const openQuoteWithBrief = (briefData) => {
    if (onOpenQuote) {
      const mappedData = {
        projectType: briefData.projectType,
        features: briefData.features,
        businessType: briefData.businessType,
        contactInfo: {
          name: sessionState?.userName || '',
          email: '',
          company: '',
          description: `Brief del chat: ${briefData.features.join(', ')}`
        }
      };
      
      onOpenQuote(mappedData);
    }
  };

  // ✅ REMOVIDO: Quick Actions eliminadas

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
        {/* Header móvil */}
        <div className="bg-secondary border-b border-primary px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
              <Bot size={18} className="text-white" />
              {aiStatus === 'available' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Zap size={8} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-primary">
                {sessionState?.userName ? `Hola ${sessionState.userName}!` : 'EKLISTA Chat'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  aiStatus === 'available' ? 'bg-green-400' : 
                  aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
                }`}></div>
                <span className="text-xs text-muted">
                  {sessionState?.conversationStage === 'helping' ? 'Consultas' :
                   sessionState?.conversationStage === 'briefing' ? 'Proyecto' :
                   sessionState?.conversationStage === 'pricing' ? 'Cotización' :
                   aiStatus === 'available' ? 'AI Listo' : 'Conectando...'}
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

          {/* Typing indicator */}
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
                    Pablo escribiendo...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ✅ REMOVIDO: Quick Actions eliminadas de móvil */}

        {/* Input móvil */}
        <div className="border-t border-primary bg-secondary flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef} // ✅ REFERENCIA PARA FOCUS
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
                    sessionState?.conversationStage === 'greeting' 
                      ? "Tu nombre..." 
                      : sessionState?.conversationStage === 'briefing'
                      ? "Cuéntame de tu proyecto..."
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
                
                {/* Cursor animado */}
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

            {/* Status Info */}
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
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ✅ RENDER DESKTOP MEJORADO
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
            <Bot size={16} className="text-white" />
            {aiStatus === 'available' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                <Zap size={6} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-poppins font-bold text-primary text-sm">
              {sessionState?.userName ? `Hola ${sessionState.userName}!` : 'EKLISTA Chat'}
            </h3>
            <div className="flex items-center space-x-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                aiStatus === 'available' ? 'bg-green-400' : 
                aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
              }`}></div>
              <span className="text-xs text-muted">
                {sessionState?.conversationStage === 'helping' ? 'Consultas' :
                 sessionState?.conversationStage === 'briefing' ? 'Proyecto' :
                 sessionState?.conversationStage === 'pricing' ? 'Cotización' :
                 'Asistente AI'}
              </span>
            </div>
          </div>
        </div>

        {/* Window controls simplificados */}
        <div className="flex items-center space-x-2">
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

        {/* Typing indicator desktop */}
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
                <span className="text-xs text-muted">Pablo escribiendo...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ✅ REMOVIDO: Quick Actions eliminadas de desktop */}

      {/* Input desktop */}
      <div className="border-t border-primary bg-secondary/50 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef} // ✅ REFERENCIA PARA FOCUS
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
                  sessionState?.conversationStage === 'greeting' 
                    ? "Tu nombre..."
                    : sessionState?.conversationStage === 'briefing'
                    ? "Detalles de tu proyecto..."
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
              
              {/* Cursor animado */}
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
                  <span className="text-accent-primary font-inter">Pablo escribiendo...</span>
                </div>
              )}
            </div>

            <div className="text-muted font-inter">
              Enter enviar • Shift+Enter nueva línea
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernChat;