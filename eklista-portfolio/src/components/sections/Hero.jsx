import React from 'react';
import { Sparkles, ArrowDown, Play } from 'lucide-react';
import { projects } from '../../data/projects';

const Hero = () => {
  // Obtener todas las imágenes de todos los proyectos
  const allProjects = Object.values(projects).flat();
  
  // Duplicar los proyectos para loop infinito
  const duplicatedProjects = [...allProjects, ...allProjects];

  return (
    <section id="inicio" className="pt-32 pb-8 relative overflow-hidden bg-primary">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-accent-light rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-16">
        <div className="mb-6 inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="font-inter text-sm font-medium text-secondary">Disponible para nuevos proyectos</span>
        </div>

        <h1 className="font-poppins text-4xl md:text-6xl font-light text-primary mb-6 leading-tight tracking-tight">
          Ideas que se convierten en
          <span className="block font-medium">
            <span className="text-accent">experiencias increíbles</span>
          </span>
        </h1>

        <p className="font-inter text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
          Cada pixel cuenta, cada línea de código importa. 
          Descubre cómo transformo conceptos en realidades digitales.
        </p>
      </div>

      {/* Project Reel integrado */}
      {allProjects.length > 0 && (
        <div className="relative z-10">
          {/* Header del reel */}
          <div className="text-center mb-8 px-6">
            <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary mb-4">
              <Play className="w-4 h-4 text-accent" />
              <span className="font-inter font-medium text-sm text-secondary">Algunos de mis trabajos</span>
            </div>
          </div>

          {/* Carrusel */}
          <div className="relative mb-12">
            {/* Gradientes para fade en los bordes */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10"></div>
            
            {/* Container del carrusel */}
            <div className="flex gap-8 animate-scroll items-center">
              {duplicatedProjects.map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
                  className="group flex-shrink-0 w-80 h-48 rounded-2xl overflow-hidden shadow-medium transform transition-all duration-500 relative border border-primary hover:border-accent"
                  style={{
                    transform: `rotate(${(index % 3 - 1) * 2}deg)`
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay con información del proyecto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-poppins text-lg font-semibold text-primary mb-1">
                        {project.title}
                      </h3>
                      <p className="font-inter text-sm text-secondary mb-2 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-xs text-accent font-medium">
                          {project.client}
                        </span>
                        <span className="font-inter text-xs text-muted">
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="text-center px-6">
            <a 
              href="#portafolio"
              className="btn-accent px-8 py-4 rounded-full font-inter font-semibold inline-flex items-center gap-3 group"
            >
              Explorar trabajo completo
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-352px * ${allProjects.length}));
          }
        }
        
        .animate-scroll {
          animation: scroll ${allProjects.length * 6}s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Hero;