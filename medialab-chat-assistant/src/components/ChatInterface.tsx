import React from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  DocumentArrowDownIcon,
  UserIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat, type Message } from '../hooks/useChat';

const ChatInterface: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
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
    generateSummary,
    executeQuickAction,
    generatePDF,
    
    // Utilidades
    quickActions,
    
    // Estados derivados
    isLoading,
    isGenerating,
    canSend,
    canGeneratePDF,
    isGeneratingPDF
  } = useChat();

  // Auto-resize del textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Componente para el estado del sistema
  const SystemStatus: React.FC = () => {
    if (isGroqConfigured) return null;

    return (
      <div className="mx-4 mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-amber-300 mb-1">Modo Demo</h4>
            <p className="text-sm text-amber-200/80 leading-relaxed">
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
    if (chatStatus === 'idle') return null;

    const statusConfig = {
      typing: {
        icon: ClockIcon,
        text: 'Procesando...',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
      },
      generating: {
        icon: DocumentArrowDownIcon,
        text: 'Generando documento...',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10'
      },
      error: {
        icon: ExclamationTriangleIcon,
        text: 'Error en conexión',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10'
      },
      completed: {
        icon: CheckCircleIcon,
        text: 'Completado',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10'
      }
    };

    const config = statusConfig[chatStatus];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bgColor} border border-white/10`}>
        <Icon className={`w-3.5 h-3.5 ${config.color} animate-pulse`} />
        <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  // Componente para las burbujas de mensaje
  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    
    if (message.isTyping) {
      return (
        <div className="flex items-start space-x-3 mb-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs sm:max-w-md border border-white/10 shadow-xl">
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
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
              : message.error 
              ? 'bg-gradient-to-br from-red-500 to-pink-500' 
              : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
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
        
        <div className={`rounded-2xl px-4 py-3 max-w-xs sm:max-w-md lg:max-w-lg shadow-xl ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white ml-auto' 
            : message.error
            ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 text-red-100'
            : 'bg-white/5 backdrop-blur-sm text-gray-100 border border-white/10'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 text-gray-100 leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-blue-300">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside my-3 space-y-1.5">{children}</ul>,
                  li: ({ children }) => <li className="text-sm text-gray-200 leading-relaxed">{children}</li>,
                  h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2">{children}</h2>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          <div className={`text-xs mt-2 flex justify-between items-center ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            <span>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.error && (
              <span className="text-red-300 text-xs font-medium">Error</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Componente de controles del header (para mobile)
  const HeaderControls: React.FC = () => (
    <div className="flex items-center space-x-2">
      {/* Botón de PDF - Principal */}
      {canGeneratePDF && (
        <button
          onClick={generatePDF}
          disabled={isLoading || isGeneratingPDF}
          className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2 sm:px-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm flex items-center space-x-2 shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{isGeneratingPDF ? 'Generando...' : 'PDF'}</span>
        </button>
      )}
      
      {/* Botón de resumen */}
      {messages.length > 4 && (
        <button
          onClick={async () => {
            const summary = await generateSummary();
            console.log('Resumen generado:', summary);
          }}
          disabled={isLoading || isGenerating}
          className="group bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-2 sm:px-4 rounded-xl hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-purple-500/25 hover:scale-105"
        >
          <span className="hidden sm:inline">Resumen</span>
          <span className="sm:hidden">📝</span>
        </button>
      )}
      
      <button
        onClick={clearConversation}
        disabled={isLoading}
        className="group bg-white/10 backdrop-blur-sm text-white px-3 py-2 sm:px-4 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-xs sm:text-sm border border-white/20 hover:scale-105"
      >
        <span className="hidden sm:inline">Nueva</span>
        <span className="sm:hidden">🗑️</span>
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Chat Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">MediaLab Assistant</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <p className="text-xs sm:text-sm text-gray-300 truncate">Asistente para solicitudes</p>
                  <StatusIndicator />
                </div>
              </div>
            </div>
            
            {/* Controles del header - Desktop */}
            <div className="hidden md:flex">
              <HeaderControls />
            </div>
            
            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Menú móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
              <HeaderControls />
            </div>
          )}
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
        <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map((action) => (
                <button 
                  key={action.id}
                  onClick={() => executeQuickAction(action.id)}
                  disabled={isLoading}
                  className="group text-xs bg-white/10 hover:bg-white/20 disabled:opacity-50 px-3 py-1.5 rounded-full transition-all duration-200 text-gray-300 border border-white/20 backdrop-blur-sm hover:scale-105 hover:text-white"
                >
                  {action.label}
                </button>
              ))}
            </div>
            
            {/* Input principal */}
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-400 transition-all duration-200 text-sm sm:text-base leading-relaxed"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!canSend}
                className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex-shrink-0"
              >
                <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;