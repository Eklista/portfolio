import React from 'react';
import { Layout, Header, Hero, Services, Portfolio, Contact, Footer } from './components';

function App() {
  return (
    <Layout>
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Contact />
      <Footer />
    </Layout>
  );
}

export default App;