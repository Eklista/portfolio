// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Escuchar cambios en el hash de la URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Quitar el #
      if (hash === 'cotizador') {
        setCurrentPage('quote');
      } else {
        setCurrentPage('home');
      }
    };

    // Verificar el hash inicial
    handleHashChange();

    // Escuchar cambios
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const navigateToQuote = () => {
    window.location.hash = 'cotizador';
  };

  const navigateToHome = () => {
    window.location.hash = 'inicio';
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        openChat,
        closeChat,
        toggleChat,
        currentPage,
        navigateToQuote,
        navigateToHome
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};