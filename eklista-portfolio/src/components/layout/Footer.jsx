import React from 'react';
import { Instagram, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary border-t border-primary">
      {/* Back to top section */}
      <div className="border-b border-primary">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-3 bg-surface hover-overlay px-6 py-3 rounded-full border border-primary hover-border-accent transition-all duration-300 hover:scale-105"
            >
              <ArrowUp className="w-4 h-4 text-accent group-hover:animate-bounce" />
              <span className="font-inter font-medium text-secondary group-hover:text-accent">
                Volver arriba
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 group">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-glow">
                <span className="text-primary font-bold text-xl">E</span>
              </div>
              <h3 className="font-poppins text-2xl font-semibold text-primary">Eklista</h3>
            </div>
            <p className="font-inter text-muted mb-6 leading-relaxed">
              Diseño y desarrollo web con enfoque en experiencias que realmente importan. 
              Cada proyecto es una oportunidad de crear algo extraordinario.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="font-inter text-sm text-accent font-medium">
                Disponible para nuevos proyectos
              </span>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h4 className="font-poppins text-lg font-semibold text-primary mb-6">
              Navegación
            </h4>
            <nav className="space-y-3">
              {[
                { name: 'Inicio', href: '#inicio' },
                { name: 'Servicios', href: '#servicios' },
                { name: 'Portafolio', href: '#portafolio' },
                { name: 'Contacto', href: '#contacto' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block font-inter text-muted hover-text-accent transition-colors py-1"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Contact info */}
          <div className="md:col-span-1">
            <h4 className="font-poppins text-lg font-semibold text-primary mb-6">
              Conectemos
            </h4>
            <div className="space-y-4 mb-6">
              <a 
                href="mailto:eklista@eklista.com"
                className="group flex items-center gap-3 text-muted hover-text-accent transition-colors"
              >
                <div className="w-8 h-8 bg-surface border border-primary group-hover:border-accent rounded-lg flex items-center justify-center transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-inter text-sm">eklista@eklista.com</span>
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/eklista" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-surface border border-primary hover-border-accent rounded-lg flex items-center justify-center text-muted hover-text-accent transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/in/eklista" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-surface border border-primary hover-border-accent rounded-lg flex items-center justify-center text-muted hover-text-accent transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="border-t border-primary">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-inter text-subtle text-sm text-center md:text-left">
              © 2025 Eklista. Hecho con pasión, código limpio y mucha cafeína ☕
            </p>
            <div className="flex items-center gap-4 text-xs text-subtle">
              <span>Diseñado y desarrollado con ❤️</span>
              <div className="w-1 h-1 bg-subtle rounded-full"></div>
              <span>Guatemala 🇬🇹</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;