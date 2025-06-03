import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Portafolio', href: '#portafolio' },
    { name: 'Cotizador', href: '#cotizador' },
    { name: 'Contacto', href: '#contacto' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect shadow-medium border-b border-primary' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a 
            href="#inicio"
            className="flex items-center group cursor-pointer"
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-accent">
              <span className="text-primary font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-poppins font-semibold text-primary hover-text-accent transition-colors">
              Eklista
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-inter font-medium text-secondary hover-text-accent transition-all duration-300 hover:scale-105 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <a
              href="#cotizador"
              className="btn-accent px-6 py-2 rounded-full font-inter font-semibold text-sm"
            >
              Cotizar proyecto
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover-overlay hover-text-accent transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-primary animate-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col space-y-3 pt-4">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-inter font-medium py-3 px-4 text-secondary hover-text-accent hover-overlay rounded-lg transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-2">
                <a
                  href="#cotizador"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-accent w-full text-center py-3 rounded-lg font-inter font-semibold text-sm block"
                >
                  Cotizar proyecto
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;