import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Sparkles,
  Calculator,
  Code,
  Palette
} from 'lucide-react';

const ChatInput = ({ 
  onSendMessage, 
  isTyping = false, 
  placeholder = "Escribe tu mensaje...",
  disabled = false,
  showQuickActions = true 
}) => {
  const [input, setInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const textareaRef = useRef(null);

  const quickActions = [
    { text: 'Servicios', value: '¿Qué servicios ofreces?', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { text: 'Precios', value: '¿Cuáles son tus precios?', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
    { text: 'Portfolio', value: 'Muéstrame tu portfolio', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { text: 'Cotizar', value: 'Quiero una cotización', icon: Calculator, color: 'from-orange-500 to-red-500' }
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
    onSendMessage(value);
  };

  return (
    <div className="border-t border-primary p-3 md:p-4 bg-secondary/50">
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles size={14} className="text-accent-primary" />
            <span className="text-xs text-muted font-inter">Pregúntame sobre:</span>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <motion.button
                  key={action.text}
                  onClick={() => handleQuickAction(action.value)}
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
      <div className="flex items-end space-x-3">
        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 pr-12 text-secondary placeholder-muted focus:border-accent-primary focus:outline-none resize-none transition-all text-sm disabled:opacity-50 font-inter"
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

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={!input.trim() || disabled || isTyping}
          className="w-10 h-10 md:w-9 md:h-9 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-primary rounded-lg flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
          whileHover={{ scale: input.trim() && !disabled ? 1.05 : 1 }}
          whileTap={{ scale: input.trim() && !disabled ? 0.95 : 1 }}
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

        <div className="text-muted font-inter hidden md:block">
          Enter para enviar • Shift+Enter nueva línea
        </div>
      </div>
    </div>
  );
};

export default ChatInput;