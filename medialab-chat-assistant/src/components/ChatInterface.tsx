import React from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat, type Message } from '../hooks/useChat';

const ChatInterface: React.FC = () => {
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);
  
  const {
    // Estados
    messages,
    inputValue,
    chatStatus,
    isGroqConfigured,
    messagesEndRef,
    
    // Acciones
    sendMessage,
    setInput,
    clearConversation,
    
    // Estados derivados
    isLoading
  } = useChat();

  // Cooldown effect
  React.useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Auto-resize del textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && cooldownSeconds === 0) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || cooldownSeconds > 0) return;
    
    await sendMessage();
    setCooldownSeconds(3); // 3 segundos de cooldown
  };

  // Componente para el estado del sistema
  const SystemStatus: React.FC = () => {
    if (isGroqConfigured) return null;

    return (
      <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">Modo Demo</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              El chat funciona con respuestas predefinidas. 
              Configura tu API key de Groq para IA completa.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Componente del indicador de estado
  const StatusIndicator: React.FC = () => {
    if (chatStatus === 'idle' && cooldownSeconds === 0) return null;

    if (cooldownSeconds > 0) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-300">
          <ClockIcon className="w-3.5 h-3.5 text-gray-600 animate-pulse" />
          <span className="text-xs font-medium text-gray-600">
            Espera {cooldownSeconds}s...
          </span>
        </div>
      );
    }

    const statusConfig: Record<string, {
      icon: React.ComponentType<any>;
      text: string;
      color: string;
      bgColor: string;
    }> = {
      typing: {
        icon: ClockIcon,
        text: 'Escribiendo...',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      },
      error: {
        icon: ExclamationTriangleIcon,
        text: 'Error en conexión',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      completed: {
        icon: CheckCircleIcon,
        text: 'Completado',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    };

    const config = statusConfig[chatStatus];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bgColor} border border-gray-200`}>
        <Icon className={`w-3.5 h-3.5 ${config.color} animate-pulse`} />
        <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  // Componente para las burbujas de mensaje con typing effect
  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const [displayedContent, setDisplayedContent] = React.useState('');
    const [isTypingComplete, setIsTypingComplete] = React.useState(false);
    const [hasStartedTyping, setHasStartedTyping] = React.useState(false);
    const isUser = message.sender === 'user';
    
    // Typing effect para mensajes del asistente
    React.useEffect(() => {
      if (isUser || message.isTyping || hasStartedTyping) {
        if (!hasStartedTyping) {
          setDisplayedContent(message.content);
          setIsTypingComplete(true);
        }
        return;
      }

      // Solo aplicar typing effect UNA VEZ por mensaje
      if (message.content && message.content.length > 0) {
        setHasStartedTyping(true);
        let index = 0;
        setDisplayedContent('');
        setIsTypingComplete(false);

        const typingInterval = setInterval(() => {
          if (index < message.content.length) {
            setDisplayedContent(message.content.slice(0, index + 1));
            index++;
          } else {
            setIsTypingComplete(true);
            clearInterval(typingInterval);
          }
        }, 12); // 12ms entre caracteres

        return () => clearInterval(typingInterval);
      }
    }, [message.id]); // Solo depende del ID del mensaje
    
    if (message.isTyping) {
      return (
        <div className="flex items-start space-x-3 mb-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 max-w-xs sm:max-w-md border border-gray-200">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-start space-x-3 mb-6 animate-in slide-in-from-bottom-2 duration-300 ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gray-600' 
              : message.error 
              ? 'bg-red-500' 
              : 'bg-gray-700'
          }`}>
            {isUser ? (
              <UserIcon className="w-4 h-4 text-white" />
            ) : message.error ? (
              <ExclamationTriangleIcon className="w-4 h-4 text-white" />
            ) : (
              <SparklesIcon className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        
        <div className={`rounded-2xl px-4 py-3 max-w-xs sm:max-w-md lg:max-w-lg border ${
          isUser 
            ? 'bg-gray-700 text-white ml-auto border-gray-700' 
            : message.error
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-white text-gray-900 border-gray-200 shadow-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside my-3 space-y-1.5">{children}</ul>,
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                }}
              >
                {displayedContent}
              </ReactMarkdown>
              {!isTypingComplete && !isUser && (
                <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-1" />
              )}
            </div>
          )}
          
          <div className={`text-xs mt-2 flex justify-between items-center ${
            isUser ? 'text-gray-300' : 'text-gray-500'
          }`}>
            <span>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.error && (
              <span className="text-red-500 text-xs font-medium">Error</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Chat Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Asistente MediaLab</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">Asistente para solicitudes</p>
                  <StatusIndicator />
                </div>
              </div>
            </div>
            
            {/* Solo botón Nueva conversación */}
            <button
              onClick={clearConversation}
              disabled={isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm border border-gray-300 hover:border-gray-400"
            >
              <span className="hidden sm:inline">Nueva conversación</span>
              <span className="sm:hidden">Nueva</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <SystemStatus />
            
            <div className="space-y-1">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Input principal */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    cooldownSeconds > 0 
                      ? `Espera ${cooldownSeconds} segundos...` 
                      : "Escribe tu mensaje..."
                  }
                  disabled={isLoading || cooldownSeconds > 0}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-500 transition-all duration-200 text-sm sm:text-base leading-relaxed"
                  rows={3}
                  style={{ minHeight: '80px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || cooldownSeconds > 0}
                className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            {cooldownSeconds > 0 && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Por favor espera {cooldownSeconds} segundos antes del próximo mensaje
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;