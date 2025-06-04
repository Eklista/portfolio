import React from 'react';
import { QuotePage } from './components';
import { ChatProvider } from './context/ChatContext';
import { useChatContext } from './context/ChatContext';
import LoadingScreen from './components/ui/LoadingScreen';

// Componente interno que usa el contexto
const AppContent = () => {
  const { currentPage } = useChatContext();
  
  // Si estamos en la página de cotizador, mostrar solo esa página
  if (currentPage === 'quote') {
    return <QuotePage />;
  }
  
  // Página principal con LoadingScreen que incluye DesktopOS
  return <LoadingScreen />;
};

function App() {
  return (
    <ChatProvider>
      <div className="app">
        <AppContent />
      </div>
    </ChatProvider>
  );
}

export default App;