import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Minus, 
  X, 
  Square, 
  Send, 
  Loader2,
  Bot,
  User,
  Sparkles,
  Code,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const ChatTerminal = ({ 
  isOpen = false, 
  onClose, 
  onMinimize, 
  isMinimized = false,
  isMobile = false 
}) => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [currentDirectory, setCurrentDirectory] = useState('~/eklista');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Configuración responsive
  const terminalWidth = isMobile ? '100%' : '500px';
  const terminalHeight = isMobile ? '70vh' : '500px';

  // Sistema de comandos estilo terminal
  const commands = {
    'help': {
      description: 'Muestra comandos disponibles',
      response: `Comandos disponibles:
├── help          - Muestra esta ayuda
├── about         - Información sobre EKLISTA
├── services      - Lista de servicios
├── portfolio     - Muestra proyectos
├── contact       - Información de contacto
├── skills        - Habilidades técnicas
├── quote         - Iniciar cotización
├── clear         - Limpiar terminal
└── whoami        - ¿Quién soy?

Tip: También puedes escribir en lenguaje natural.`
    },
    'about': {
      description: 'Información sobre EKLISTA',
      response: `EKLISTA Creative Studio
━━━━━━━━━━━━━━━━━━━━━━━━
Desarrollador Full-Stack & Diseñador
Especializado en crear experiencias digitales únicas

• 5+ años de experiencia
• 50+ proyectos completados
• Enfoque en UX/UI y desarrollo moderno`
    },
    'services': {
      description: 'Lista de servicios',
      response: `Servicios disponibles:
━━━━━━━━━━━━━━━━━━━━━━━━
┌─ Desarrollo Web
│  ├── React/Next.js Apps
│  ├── WordPress Custom
│  └── E-commerce Solutions
│
┌─ UX/UI Design
│  ├── User Research
│  ├── Prototyping
│  └── Design Systems
│
└─ Diseño Gráfico
   ├── Branding
   ├── Print Design
   └── Digital Assets

Precio desde Q800. Usa 'quote' para cotizar.`
    },
    'portfolio': {
      description: 'Muestra proyectos',
      response: `Proyectos destacados:
━━━━━━━━━━━━━━━━━━━━━━━━
• Banking App UI/UX        [2024]
• E-commerce Platform      [2024]
• SaaS Dashboard          [2023]
• Restaurant Website      [2023]
• Brand Identity Package  [2023]

Explora las carpetas del escritorio para ver más detalles.`
    },
    'contact': {
      description: 'Información de contacto',
      response: `Información de contacto:
━━━━━━━━━━━━━━━━━━━━━━━━
📧 hello@eklista.com
📱 WhatsApp: +502 1234-5678
💼 LinkedIn: /in/eklista
🐙 GitHub: @eklista
📍 Guatemala City, GT

¿Listo para empezar tu proyecto?`
    },
    'skills': {
      description: 'Habilidades técnicas',
      response: `Stack tecnológico:
━━━━━━━━━━━━━━━━━━━━━━━━
Frontend:  React, Next.js, TypeScript, Tailwind
Backend:   Node.js, Express, MongoDB, PostgreSQL
Design:    Figma, Adobe Suite, Sketch
Tools:     Git, Docker, AWS, Vercel

Siempre aprendiendo nuevas tecnologías 🚀`
    },
    'quote': {
      description: 'Iniciar cotización',
      response: `Iniciando cotizador...
━━━━━━━━━━━━━━━━━━━━━━━━
¿Qué tipo de proyecto tienes en mente?

1. Sitio WordPress      (desde Q1,200)
2. UX/UI Design        (desde Q800)
3. Diseño Gráfico      (desde Q500)
4. Desarrollo Custom   (desde Q4,000)

Escribe el número o usa el botón "Cotizar" del menú.`
    },
    'whoami': {
      description: '¿Quién soy?',
      response: `eklista@creative-studio:~$ whoami
━━━━━━━━━━━━━━━━━━━━━━━━
Eklista - Creative Developer
Apasionado por crear experiencias digitales que importan.

"El buen diseño es tan poco diseño como sea posible"
- Dieter Rams`
    },
    'clear': {
      description: 'Limpiar terminal',
      response: 'CLEAR_TERMINAL'
    }
  };

  // Mensajes iniciales de la terminal
  const initializeTerminal = () => {
    const initMessages = [
      {
        id: 1,
        type: 'system',
        content: 'EKLISTA Creative Terminal v2.0.1',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'system',
        content: 'Inicializando workspace creativo...',
        timestamp: new Date()
      },
      {
        id: 3,
        type: 'system',
        content: '✓ Sistema listo. Escribe "help" para ver comandos disponibles.',
        timestamp: new Date()
      }
    ];

    let delay = 0;
    initMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, message]);
      }, delay);
      delay += 800;
    });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeTerminal();
    }
  }, [isOpen]);

  useEffect(() => {
    // Cursor parpadeante
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Auto scroll al final
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Focus en input cuando se abre
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const processCommand = (input) => {
    const command = input.toLowerCase().trim();
    
    // Comandos del sistema
    if (commands[command]) {
      if (command === 'clear') {
        setMessages([]);
        initializeTerminal();
        return;
      }
      return commands[command].response;
    }
    
    // Respuestas en lenguaje natural (fallback)
    if (command.includes('hola') || command.includes('hello')) {
      return '¡Hola! 👋 Bienvenido a EKLISTA Terminal. Escribe "help" para ver comandos.';
    }
    
    if (command.includes('precio') || command.includes('costo')) {
      return 'Los precios varían por proyecto. Usa "services" para ver rangos o "quote" para cotizar.';
    }
    
    // Comando no encontrado
    return `bash: ${input}: command not found
Usa "help" para ver comandos disponibles.`;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    // Agregar a historial de comandos
    setCommandHistory(prev => [...prev, currentInput.trim()]);
    setHistoryIndex(-1);

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simular tiempo de procesamiento
    setTimeout(() => {
      const response = processCommand(userMessage.content);
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 500 + Math.random() * 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={`fixed bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-green-500/30 z-50 font-mono ${
        isMobile 
          ? 'inset-x-4 bottom-20 top-20' 
          : 'bottom-20 right-6 w-[500px] h-[500px]'
      }`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: isMinimized ? 0 : 1, 
        scale: isMinimized ? 0.9 : 1, 
        y: isMinimized ? 20 : 0 
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Terminal Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-green-500/30">
        <div className="flex items-center space-x-3">
          {/* Traffic Light Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-sm"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors shadow-sm"
            />
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-sm" />
          </div>
          
          {/* Terminal Title */}
          <div className="flex items-center space-x-2 ml-4">
            <Terminal size={16} className="text-green-400" />
            <span className="text-green-400 text-sm">eklista@creative-studio: {currentDirectory}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs">Online</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex flex-col h-full bg-black">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 text-sm">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className="font-mono leading-relaxed"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {message.type === 'system' ? (
                  <div className="text-cyan-400">
                    {message.content}
                  </div>
                ) : message.type === 'user' ? (
                  <div className="flex items-start space-x-2">
                    <span className="text-green-400 flex-shrink-0">
                      eklista@creative-studio:{currentDirectory}$
                    </span>
                    <span className="text-white">{message.content}</span>
                  </div>
                ) : (
                  <div className="text-gray-300 whitespace-pre-line pl-6 border-l-2 border-green-500/30 ml-2">
                    {message.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex items-center space-x-2 text-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 size={12} className="animate-spin" />
              <span className="text-sm">Procesando comando...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-green-500/30 p-4 bg-gray-900/50">
          <div className="flex items-center space-x-2">
            {/* Prompt */}
            <span className="text-green-400 text-sm font-mono flex-shrink-0">
              eklista@creative-studio:{currentDirectory}$
            </span>
            
            {/* Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-white text-sm font-mono focus:outline-none placeholder-gray-500"
                placeholder="Escribe un comando..."
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Terminal cursor */}
              {currentInput === '' && (
                <span className={`absolute top-0 left-0 text-green-400 font-mono text-sm ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                } transition-opacity`}>
                  ▋
                </span>
              )}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-4">
              {['help', 'about', 'services', 'contact'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => setCurrentInput(cmd)}
                  className="text-gray-500 hover:text-green-400 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
            
            <div className="text-gray-600">
              ↑↓ historial | Enter ejecutar
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatTerminal;