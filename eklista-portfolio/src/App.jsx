import React from 'react';
import { DesktopOS, Chatbox, QuotePage,} from './components';
import { ChatProvider } from './context/ChatContext';
import { useChatContext } from './context/ChatContext';

// Componente interno que usa el contexto
const AppContent = () => {
  const { currentPage } = useChatContext();
  
  // Si estamos en la página de cotizador, mostrar solo esa página
  if (currentPage === 'quote') {
    return (
        <QuotePage />
    );
  }
  
  // Página principal
  return (
      <DesktopOS />
  );
};

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;