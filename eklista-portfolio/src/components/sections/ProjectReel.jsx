import React from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { projects } from '../../data/projects';

const ProjectReel = () => {
  // Obtener todas las imágenes de todos los proyectos
  const allProjects = Object.values(projects).flat();
  
  // Duplicar los proyectos para loop infinito
  const duplicatedProjects = [...allProjects, ...allProjects];

  if (allProjects.length === 0) return null;

  return (
    <section className="py-8 bg-secondary overflow-hidden border-t border-primary">
      {/* Section header */}
      <div className="text-center mb-8 px-6">
        <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary mb-6">
          <Play className="w-4 h-4 text-accent" />
          <span className="font-inter font-medium text-sm text-secondary">Proyectos Destacados</span>
        </div>
        <h2 className="font-poppins text-3xl md:text-4xl font-semibold text-primary mb-4">
          Un vistazo a mi trabajo
        </h2>
        <p className="font-inter text-muted max-w-2xl mx-auto">
          Cada proyecto cuenta una historia única de colaboración, creatividad y resultados excepcionales
        </p>
      </div>

      <div className="relative">
        {/* Gradientes para fade en los bordes - mejorados para el tema dark */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-secondary to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-secondary to-transparent z-10"></div>
        
        {/* Container del carrusel */}
        <div className="flex gap-8 animate-scroll items-center">
          {duplicatedProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="group flex-shrink-0 w-80 h-52 rounded-2xl overflow-hidden shadow-medium transform transition-all duration-500 relative border border-primary hover:border-accent"
              style={{
                transform: `rotate(${(index % 3 - 1) * 2}deg)` // Rotaciones más sutiles: -2°, 0°, 2°
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay con información del proyecto */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-poppins text-lg font-semibold text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="font-inter text-sm text-secondary mb-3 line-clamp-2">
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

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Texto y botón debajo */}
      <div className="text-center mt-12 px-6">
        <p className="font-inter text-sm text-muted mb-8">
          Algunos de mis proyectos más recientes • Hover para ver detalles
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#portafolio"
            className="btn-accent px-8 py-4 rounded-full font-inter font-semibold inline-flex items-center gap-3 group"
          >
            Explorar portafolio completo
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </a>
          
          <a
            href="#servicios"
            className="px-8 py-4 rounded-full font-inter font-semibold border-2 border-secondary text-secondary hover-border-accent hover-text-accent transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
          >
            Ver mis servicios
          </a>
        </div>

        {/* Stats rápidas */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-primary">
          <div className="text-center">
            <div className="font-poppins text-2xl font-bold text-accent mb-1">{allProjects.length}+</div>
            <div className="font-inter text-sm text-muted">Proyectos completados</div>
          </div>
          <div className="text-center">
            <div className="font-poppins text-2xl font-bold text-accent mb-1">5</div>
            <div className="font-inter text-sm text-muted">Años de experiencia</div>
          </div>
          <div className="text-center">
            <div className="font-poppins text-2xl font-bold text-accent mb-1">100%</div>
            <div className="font-inter text-sm text-muted">Clientes satisfechos</div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ProjectReel;