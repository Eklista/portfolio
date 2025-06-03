import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Square,
  Sparkles 
} from 'lucide-react';

const ChatInput = ({ 
  onSendMessage, 
  isTyping = false, 
  placeholder = "Escribe tu mensaje...",
  disabled = false,
  showQuickActions = true 
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const textareaRef = useRef(null);

  const quickActions = [
    { text: 'Servicios', value: '¿Qué servicios ofreces?' },
    { text: 'Precios', value: '¿Cuáles son tus precios?' },
    { text: 'Portfolio', value: 'Muéstrame tu portfolio' },
    { text: 'Contacto', value: '¿Cómo puedo contactarte?' },
    { text: 'Cotizar', value: 'Necesito una cotización' }
  ];

  useEffect(() => {
    // Cursor parpadeante
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled || isTyping) return;
    
    onSendMessage(input.trim());
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (value) => {
    setInput(value);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implementar grabación de voz
  };

  return (
    <div className="border-t border-primary p-4 bg-secondary/50">
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles size={14} className="text-accent-primary" />
            <span className="text-xs text-muted">Atajos rápidos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.text}
                onClick={() => handleQuickAction(action.value)}
                className="text-xs px-3 py-1.5 bg-primary hover:bg-accent-primary/20 text-muted hover:text-accent-primary rounded-lg transition-all duration-200 border border-transparent hover:border-accent-primary/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {action.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-3">
        {/* Additional Actions */}
        <div className="flex flex-col space-y-2">
          <motion.button
            className="w-9 h-9 bg-surface hover:bg-primary border border-primary rounded-lg flex items-center justify-center transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Adjuntar archivo"
          >
            <Paperclip size={16} className="text-muted hover:text-accent-primary" />
          </motion.button>
          
          <motion.button
            className="w-9 h-9 bg-surface hover:bg-primary border border-primary rounded-lg flex items-center justify-center transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Emojis"
          >
            <Smile size={16} className="text-muted hover:text-accent-primary" />
          </motion.button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-surface border border-primary rounded-xl px-4 py-3 pr-12 text-secondary placeholder-muted focus:border-accent-primary focus:outline-none resize-none transition-all text-sm disabled:opacity-50"
            rows="1"
            style={{ 
              minHeight: '44px',
              maxHeight: '120px'
            }}
          />
          
          {/* Terminal-style cursor cuando está vacío */}
          {input === '' && !disabled && (
            <div className="absolute top-3 left-4 pointer-events-none">
              <span className={`text-accent-primary font-mono text-sm ${
                showCursor ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}>
                |
              </span>
            </div>
          )}

          {/* Character Counter */}
          {input.length > 200 && (
            <div className="absolute bottom-1 right-2 text-xs text-muted">
              {input.length}/500
            </div>
          )}
        </div>

        {/* Voice/Send Button */}
        <div className="flex flex-col space-y-2">
          {/* Voice Recording */}
          <motion.button
            onClick={toggleRecording}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-surface hover:bg-primary border border-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isRecording ? "Detener grabación" : "Grabar mensaje de voz"}
          >
            {isRecording ? (
              <Square size={16} className="text-white" />
            ) : (
              <Mic size={16} className="text-muted hover:text-accent-primary" />
            )}
          </motion.button>

          {/* Send Button */}
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || disabled || isTyping}
            className="w-9 h-9 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-primary rounded-lg flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
            whileHover={{ scale: input.trim() && !disabled ? 1.05 : 1 }}
            whileTap={{ scale: input.trim() && !disabled ? 0.95 : 1 }}
            title="Enviar mensaje"
          >
            <Send size={16} className="text-primary" />
          </motion.button>
        </div>
      </div>

      {/* Status Info */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-muted">EKLISTA AI Online</span>
          </div>
          
          {isTyping && (
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse"></div>
              <span className="text-accent-primary">Escribiendo...</span>
            </div>
          )}
        </div>

        <div className="text-muted">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
};

export default ChatInput;