import React from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon,
  DocumentArrowDownIcon,
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
    e.target.style.height = `${e.target.scrollHeight}px`;
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
      <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-300">Modo Demo</h4>
            <p className="text-sm text-amber-400 mt-1">
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
        text: 'Procesando mensaje...',
        color: 'text-blue-400'
      },
      generating: {
        icon: DocumentArrowDownIcon,
        text: 'Generando documento...',
        color: 'text-purple-400'
      },
      error: {
        icon: ExclamationTriangleIcon,
        text: 'Error en la conexión',
        color: 'text-red-400'
      },
      completed: {
        icon: CheckCircleIcon,
        text: 'Proceso completado',
        color: 'text-green-400'
      }
    };

    const config = statusConfig[chatStatus];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <div className="flex items-center space-x-2 text-sm">
        <Icon className={`w-4 h-4 ${config.color} animate-pulse`} />
        <span className={config.color}>{config.text}</span>
      </div>
    );
  };

  // Componente para las burbujas de mensaje
  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    
    if (message.isTyping) {
      return (
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg px-4 py-3 max-w-md border border-zinc-700">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-gradient-to-r from-blue-500 to-blue-600' : message.error ? 'bg-red-600' : 'bg-gradient-to-r from-zinc-600 to-zinc-700'
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
        <div className={`rounded-lg px-4 py-3 max-w-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto shadow-lg' 
            : message.error
            ? 'bg-red-900/50 border border-red-500 text-red-200'
            : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-zinc-100">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-blue-400">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                  li: ({ children }) => <li className="text-sm text-zinc-200">{children}</li>
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <div className={`text-xs mt-2 flex justify-between items-center ${
            isUser ? 'text-blue-100' : 'text-zinc-400'
          }`}>
            <span>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.error && (
              <span className="text-red-400 text-xs">Error</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Generar y mostrar resumen final
  const handleGenerateSummary = async () => {
    const summary = await generateSummary();
    console.log('Resumen generado:', summary);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Chat Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <ComputerDesktopIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">MediaLab Assistant</h1>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-zinc-400">Asistente para solicitudes de servicios</p>
                  <StatusIndicator />
                </div>
              </div>
            </div>
            
            {/* Controles del header */}
            <div className="flex items-center space-x-3">
              {/* Botón de PDF - Principal */}
              {canGeneratePDF && (
                <button
                  onClick={generatePDF}
                  disabled={isLoading || isGeneratingPDF}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center space-x-2 shadow-lg"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span>{isGeneratingPDF ? 'Generando...' : 'Descargar PDF'}</span>
                </button>
              )}
              
              {/* Botón de resumen */}
              {messages.length > 4 && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isLoading || isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg"
                >
                  Generar Resumen
                </button>
              )}
              
              <button
                onClick={clearConversation}
                disabled={isLoading}
                className="bg-zinc-700 text-white px-4 py-2 rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
              >
                Nueva Conversación
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-black">
          <div className="max-w-4xl mx-auto">
            <SystemStatus />
            
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-zinc-400 transition-all duration-200"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!canSend}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickActions.map((action) => (
                <button 
                  key={action.id}
                  onClick={() => executeQuickAction(action.id)}
                  disabled={isLoading}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-3 py-1 rounded-full transition-colors duration-200 text-zinc-300 border border-zinc-700"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;