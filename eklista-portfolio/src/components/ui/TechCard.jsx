import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, Monitor, Package, Target, ExternalLink, ChevronDown } from 'lucide-react';

const TechCard = ({ project, onClose }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    const modal = document.querySelector('.tech-card-content');
    if (modal) {
      modal.addEventListener('scroll', handleScroll);
      return () => modal.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Si no hay project, no renderizar nada
  if (!project) return null;

  // Asegurar que technologies existe y es un array
  const technologies = project.technologies || [];

  // Crear múltiples imágenes si solo hay una
  const projectImages = project.images || [
    project.image,
    project.image, // Duplicamos para demo
    project.image
  ];

  // Specs por defecto si no existen
  const projectSpecs = project.specs || {
    duration: "3-6 meses", 
    devices: "Responsive (móvil, tablet, desktop)",
    deliverables: "Sitio web completo y documentación",
    technologies: technologies.join(', ') || "Tecnologías modernas"
  };

  return (
    <div 
      className="fixed inset-0 bg-primary/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-secondary rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative">
        
        {/* Sticky Header - minimalista */}
        <div className={`absolute top-0 left-0 right-0 bg-secondary/95 backdrop-blur-md border-b border-primary transition-all duration-300 z-30 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <h3 className="font-poppins text-lg font-semibold text-primary">
                {project.title}
              </h3>
              <span className="text-muted">•</span>
              <span className="font-inter text-sm text-muted">{project.client}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="w-8 h-8 bg-surface hover:bg-primary rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Close button fijo */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className={`absolute top-6 right-6 w-10 h-10 bg-surface/80 hover:bg-surface backdrop-blur-sm rounded-full flex items-center justify-center text-muted hover:text-primary transition-all duration-300 z-20 ${
            isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="tech-card-content max-h-[95vh] overflow-y-auto">
          
          {/* Project Header - Compacto */}
          <div className="relative p-8 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-poppins text-3xl font-semibold text-primary mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {project.client}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Technologies Pills */}
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 6).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary border border-secondary text-secondary rounded-full font-inter text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 6 && (
                <span className="px-3 py-1 bg-primary border border-secondary text-muted rounded-full font-inter text-xs">
                  +{technologies.length - 6}
                </span>
              )}
            </div>
          </div>

          {/* Images Gallery - Foco principal */}
          <div className="px-4 pb-8">
            <div className="space-y-4">
              {projectImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${project.title} - Vista ${index + 1}`}
                    className="w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ 
                      height: index === 0 ? '500px' : '400px' // Primera imagen más grande
                    }}
                  />
                  
                  {/* Overlay sutil en hover */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-inter text-xs font-medium text-secondary">
                      {index + 1} de {projectImages.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs - Colapsable y discreto */}
          <div className="px-8 pb-8">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSpecs(!showSpecs);
              }}
              className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-primary hover:border-secondary transition-colors group"
            >
              <span className="font-poppins font-semibold text-primary">
                Especificaciones del proyecto
              </span>
              <ChevronDown className={`w-5 h-5 text-muted group-hover:text-secondary transition-all duration-300 ${
                showSpecs ? 'rotate-180' : ''
              }`} />
            </button>

            {showSpecs && (
              <div className="mt-4 p-6 bg-surface rounded-xl border border-primary">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(projectSpecs).map(([key, value], index) => {
                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                    
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-primary rounded-lg">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h5 className="font-poppins font-medium text-secondary text-sm mb-1">
                            {label}
                          </h5>
                          <p className="font-inter text-muted text-sm">
                            {value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Final spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default TechCard;