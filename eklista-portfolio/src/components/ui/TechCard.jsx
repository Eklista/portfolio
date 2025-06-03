import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, Monitor, Package, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const TechCard = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      setIsScrolled(scrollTop > 200);
    };

    const modal = document.querySelector('.tech-card-content');
    if (modal) {
      modal.addEventListener('scroll', handleScroll);
      return () => modal.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!project) return null;

  const technologies = project.technologies || [];
  const projectImages = project.images || [project.image, project.image, project.image];

  // Specs simplificadas
  const projectSpecs = [
    { 
      icon: Calendar, 
      label: 'Duración', 
      value: project.specs?.duration || '3-6 meses' 
    },
    { 
      icon: Monitor, 
      label: 'Dispositivos', 
      value: 'Responsive' 
    },
    { 
      icon: Package, 
      label: 'Entregables', 
      value: project.specs?.deliverables || 'Sitio completo' 
    },
    { 
      icon: Target, 
      label: 'Cliente', 
      value: project.client 
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-primary/95 backdrop-blur-sm z-50 flex"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Sidebar izquierda con info del proyecto */}
      <div className="w-80 bg-secondary border-r border-primary p-6 overflow-y-auto">
        
        {/* Header del proyecto */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <User className="w-4 h-4" />
              <span>{project.client}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-surface hover:bg-primary rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <h1 className="font-poppins text-2xl font-semibold text-primary mb-3">
            {project.title}
          </h1>
          
          <p className="font-inter text-secondary leading-relaxed text-sm">
            {project.description}
          </p>
        </div>

        {/* Especificaciones como tarjetitas */}
        <div className="mb-8">
          <h3 className="font-poppins font-semibold text-primary mb-4 text-sm">
            Detalles del proyecto
          </h3>
          <div className="space-y-3">
            {projectSpecs.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <div key={index} className="bg-surface rounded-lg p-3 border border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-xs text-muted uppercase tracking-wide">
                        {spec.label}
                      </p>
                      <p className="font-inter text-sm text-secondary font-medium truncate">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-8">
          <h3 className="font-poppins font-semibold text-primary mb-4 text-sm">
            Tecnologías utilizadas
          </h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary border border-secondary text-secondary rounded-full font-inter text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation counter */}
        <div className="bg-surface rounded-lg p-3 border border-primary">
          <div className="flex items-center justify-between">
            <span className="font-inter text-xs text-muted">
              Imagen {currentImageIndex + 1} de {projectImages.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevImage}
                disabled={projectImages.length <= 1}
                className="w-6 h-6 bg-primary rounded flex items-center justify-center text-muted hover:text-accent transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={nextImage}
                disabled={projectImages.length <= 1}
                className="w-6 h-6 bg-primary rounded flex items-center justify-center text-muted hover:text-accent transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal de imágenes - estilo Behance */}
      <div className="flex-1 relative">
        
        {/* Header sticky minimalista */}
        <div className={`absolute top-0 left-0 right-0 bg-secondary/95 backdrop-blur-md transition-all duration-300 z-20 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}>
          <div className="flex items-center justify-between p-4">
            <h3 className="font-poppins text-lg font-semibold text-primary">
              {project.title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-surface/80 hover:bg-surface backdrop-blur-sm rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navegación de imágenes con flechas */}
        {projectImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-muted hover:text-primary transition-all duration-300 z-10 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center text-muted hover:text-primary transition-all duration-300 z-10 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Container de imágenes - scroll vertical */}
        <div className="tech-card-content h-full overflow-y-auto">
          
          {/* Espaciado superior */}
          <div className="h-8"></div>
          
          {/* Galería de imágenes pegadas */}
          <div className="max-w-4xl mx-auto px-8">
            {projectImages.map((image, index) => (
              <div key={index} className="mb-0">
                <img
                  src={image}
                  alt={`${project.title} - Vista ${index + 1}`}
                  className="w-full h-auto object-cover transition-opacity duration-300"
                  style={{ 
                    minHeight: '600px',
                    maxHeight: '1200px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Espaciado inferior */}
          <div className="h-16"></div>
        </div>

        {/* Indicadores de imagen */}
        {projectImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full">
            {projectImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-accent w-6' 
                    : 'bg-muted hover:bg-secondary'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechCard;