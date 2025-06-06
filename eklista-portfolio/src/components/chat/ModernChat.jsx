// src/components/chat/ModernChat.jsx - OPTIMIZADO para nuevo flujo directo
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
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import chatAI from '../../services/groqChatAI';

const ModernChat = ({ 
  isOpen = false, 
  onClose, 
  onMinimize, 
  isMinimized = false,
  isMobile = false,
  onOpenQuote,
  onOpenPreQuote // ✅ NUEVO: Callback para abrir PreQuoteForm
}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [aiStatus, setAiStatus] = useState('checking');
  const [sessionState, setSessionState] = useState(null);
  const [showQuoteButton, setShowQuoteButton] = useState(false); // ✅ NUEVO: Para mostrar botón formulario
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  // ✅ AUTO-FOCUS AL INPUT
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

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

  // ✅ LÓGICA DE PROCESAMIENTO OPTIMIZADA
  const handleSendMessage = async (content, isAutomatic = false) => {
    const focusInput = () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    // ✅ DETECTAR COMANDO "VER FORMULARIO"
    if (!isAutomatic && content.toLowerCase().includes('ver formulario')) {
      setShowQuoteButton(true);
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentInput('');
      
      const systemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: '📝 Formulario de cotización disponible',
        timestamp: new Date(),
        showQuoteButton: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, systemMessage]);
        focusInput();
      }, 500);
      
      return;
    }

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
        sessionStage: newSessionState.conversationStage,
        sessionData: newSessionState // ✅ NUEVO: Datos completos de sesión
      };

      const delay = aiResponse.source === 'groq' ? 1500 : 800;
      
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        focusInput();

        // ✅ DETECTAR SI DEBE ABRIR PREQUOTEFORM
        if (newSessionState.shouldOpenPreQuote && onOpenPreQuote) {
          setTimeout(() => {
            const preQuoteData = chatAI.getPreQuoteData();
            onOpenPreQuote(preQuoteData);
            chatAI.resetPreQuoteFlag(); // Reset flag después de abrir
          }, 1500);
        }

        // ✅ DETECTAR SI MENCIONA FORMULARIO (sin abrir automáticamente)
        if (aiResponse.content.toLowerCase().includes('formulario') && 
            !aiResponse.content.toLowerCase().includes('ver formulario')) {
          setShowQuoteButton(true);
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
        focusInput();
      }, 1000);
    }
  };

  // ✅ OBTENER PLACEHOLDER DINÁMICO SEGÚN ETAPA
  const getPlaceholder = () => {
    if (!sessionState) return "Escribe tu mensaje...";
    
    switch(sessionState.conversationStage) {
      case 'greeting':
        return sessionState.userName ? "Cuéntame más sobre tu proyecto..." : "Ej: Soy María y necesito una solución para...";
      case 'brief':
        if (!sessionState.briefData.projectType) {
          return "Ej: Necesito un sitio web para...";
        }
        if (!sessionState.briefData.businessType) {
          return "Ej: Es para mi restaurante...";
        }
        return "Características especiales...";
      case 'estimate':
        return 'Escribe "enviar" o "formulario"';
      case 'contact_method':
        return 'WhatsApp, Email o Llamada...';
      case 'final':
        return "¿Algo más en lo que pueda ayudarte?";
      default:
        return "Escribe tu mensaje...";
    }
  };

  // ✅ OBTENER ESTADO DE PROGRESO
  const getProgressInfo = () => {
    if (!sessionState) return { text: 'Conectando...', progress: 0 };
    
    const { conversationStage, questionCount, maxQuestions } = sessionState;
    
    switch(conversationStage) {
      case 'greeting':
        return { text: 'Presentación', progress: 20 };
      case 'brief':
        const briefProgress = 20 + ((questionCount / maxQuestions) * 40);
        return { 
          text: `Brief (${questionCount}/${maxQuestions})`, 
          progress: Math.min(briefProgress, 60) 
        };
      case 'estimate':
        return { text: 'Cotización lista', progress: 80 };
      case 'contact_method':
        return { text: 'Datos de contacto', progress: 90 };
      case 'final':
        return { text: 'Completado', progress: 100 };
      default:
        return { text: 'En proceso', progress: 0 };
    }
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

  const progressInfo = getProgressInfo();

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
        {/* Header móvil mejorado */}
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
                  {progressInfo.text}
                </span>
                {/* ✅ BARRA DE PROGRESO */}
                <div className="w-16 h-1 bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressInfo.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
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

          {/* ✅ BOTÓN DE FORMULARIO CUANDO CORRESPONDE */}
          {showQuoteButton && (
            <motion.div
              className="flex justify-center py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => onOpenQuote && onOpenQuote()}
                className="bg-accent-primary hover:bg-accent-secondary text-primary px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors"
              >
                <FileText size={18} />
                <span>Abrir Formulario Detallado</span>
                <ExternalLink size={14} />
              </button>
            </motion.div>
          )}

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

        {/* Input móvil mejorado */}
        <div className="border-t border-primary bg-secondary flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
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
                  placeholder={getPlaceholder()} // ✅ PLACEHOLDER DINÁMICO
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

            {/* Status Info mejorado */}
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
                
                {/* ✅ INDICADOR DE PREGUNTAS RESTANTES */}
                {sessionState?.conversationStage === 'brief' && (
                  <div className="flex items-center space-x-1">
                    <Clock size={12} className="text-accent-primary" />
                    <span className="text-accent-primary font-inter">
                      {sessionState.maxQuestions - sessionState.questionCount} preguntas restantes
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
      {/* Header desktop mejorado */}
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
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                aiStatus === 'available' ? 'bg-green-400' : 
                aiStatus === 'checking' ? 'bg-yellow-400' : 'bg-blue-400'
              }`}></div>
              <span className="text-xs text-muted">
                {progressInfo.text}
              </span>
              {/* ✅ MINI BARRA DE PROGRESO */}
              <div className="w-12 h-1 bg-surface rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressInfo.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Window controls */}
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

        {/* ✅ BOTÓN DE FORMULARIO CUANDO CORRESPONDE */}
        {showQuoteButton && (
          <motion.div
            className="flex justify-center py-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => onOpenQuote && onOpenQuote()}
              className="bg-accent-primary hover:bg-accent-secondary text-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <FileText size={16} />
              <span>Formulario Detallado</span>
              <ExternalLink size={12} />
            </button>
          </motion.div>
        )}

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

      {/* Input desktop mejorado */}
      <div className="border-t border-primary bg-secondary/50 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
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
                placeholder={getPlaceholder()} // ✅ PLACEHOLDER DINÁMICO
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
              
              {/* ✅ INDICADOR DE PREGUNTAS RESTANTES */}
              {sessionState?.conversationStage === 'brief' && (
                <div className="flex items-center space-x-1">
                  <Clock size={12} className="text-accent-primary" />
                  <span className="text-accent-primary font-inter">
                    {sessionState.maxQuestions - sessionState.questionCount} preguntas
                  </span>
                </div>
              )}
              
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