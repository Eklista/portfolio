import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

const Chatbox = () => {
  const { isChatOpen, openChat, closeChat } = useChatContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente de Eklista. ¿En qué puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Aquí conectaremos con el backend de FastAPI
      // Por ahora simulamos la respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse = getBotResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, hubo un error. Por favor intenta de nuevo.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Respuestas temporales hasta conectar con FastAPI
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('presupuesto')) {
      return "Los precios varían según el proyecto. Para un sitio web básico comenzamos desde $500, sitios corporativos desde $1,200, y e-commerce desde $2,000. ¿Te gustaría una cotización personalizada?";
    }
    
    if (lowerMessage.includes('tiempo') || lowerMessage.includes('entrega') || lowerMessage.includes('duración')) {
      return "Los tiempos dependen del tipo de proyecto:\n• Sitio web básico: 2-3 semanas\n• Sitio corporativo: 4-6 semanas\n• E-commerce: 6-8 semanas\n• Aplicación web: 8-12 semanas";
    }
    
    if (lowerMessage.includes('tecnología') || lowerMessage.includes('herramientas')) {
      return "Trabajo con tecnologías modernas como React, Next.js, Node.js, WordPress, Figma, y más. ¿Hay alguna tecnología específica que te interese?";
    }
    
    if (lowerMessage.includes('contacto') || lowerMessage.includes('email') || lowerMessage.includes('whatsapp')) {
      return "Puedes contactarme por email: eklista@eklista.com o WhatsApp al +502 1234-5678. También puedes llenar el formulario de contacto en la página.";
    }
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('trabajos') || lowerMessage.includes('proyectos')) {
      return "Puedes ver mis trabajos en la sección de Portfolio. He realizado más de 50 proyectos incluyendo sitios web, aplicaciones y diseño gráfico.";
    }
    
    return "Gracias por tu pregunta. Para obtener información más específica, te recomiendo contactarme directamente. ¿Hay algo más en lo que pueda ayudarte?";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "¿Cuánto cuesta un sitio web?",
    "¿Cuánto tiempo toma un proyecto?",
    "¿Qué tecnologías usas?",
    "¿Cómo puedo contactarte?"
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={openChat}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-accent rounded-full shadow-large flex items-center justify-center text-primary hover:scale-110 transition-all duration-300 z-40 ${
          isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-secondary rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-secondary rounded-2xl shadow-large border border-primary z-50 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-surface border-b border-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-primary">Chat Eklista</h3>
                <p className="text-xs text-muted">Asistente virtual</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="w-8 h-8 bg-primary hover:bg-border-secondary rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[75%] ${
                  message.sender === 'user' ? 'order-1' : 'order-2'
                }`}>
                  <div className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-accent text-primary'
                      : 'bg-surface border border-primary text-secondary'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                  <p className="text-xs text-muted mt-1 px-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <div className="w-7 h-7 bg-primary border border-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-surface border border-primary p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    <span className="text-sm text-muted">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted mb-2">Preguntas frecuentes:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(question);
                      setTimeout(sendMessage, 100);
                    }}
                    className="p-2 bg-surface border border-primary rounded-lg text-xs text-secondary hover:border-accent hover:text-accent transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-primary p-4">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-surface border border-primary rounded-lg px-3 py-2 text-sm text-secondary placeholder-muted resize-none focus:border-accent focus:outline-none"
                rows="1"
                style={{ minHeight: '36px', maxHeight: '100px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-primary hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted mt-2 text-center">
              Presiona Enter para enviar
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;