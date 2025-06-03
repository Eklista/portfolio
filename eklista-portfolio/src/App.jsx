import React from 'react';
import { Layout, Header, Hero, Services, Portfolio, Contact, Footer, Chatbox, QuotePage } from './components';
import { ChatProvider } from './context/ChatContext';
import { useChatContext } from './context/ChatContext';

// Componente interno que usa el contexto
const AppContent = () => {
  const { currentPage } = useChatContext();
  
  // Si estamos en la página de cotizador, mostrar solo esa página
  if (currentPage === 'quote') {
    return (
      <Layout>
        <QuotePage />
      </Layout>
    );
  }
  
  // Página principal
  return (
    <Layout>
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Contact />
      <Footer />
      <Chatbox />
    </Layout>
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