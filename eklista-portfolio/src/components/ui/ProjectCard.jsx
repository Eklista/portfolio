import React from 'react';
import { Eye, Calendar, User, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(project);
  };

  return (
    <div 
      className="group bg-surface rounded-2xl border border-primary overflow-hidden card-hover cursor-pointer"
      onClick={handleClick}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Year badge */}
        <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full border border-primary">
          <span className="font-inter text-sm font-medium text-secondary">{project.year}</span>
        </div>

        {/* Hover overlay content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-surface/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-primary">
            <span className="font-inter text-sm font-medium text-accent">Ver ficha técnica</span>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-poppins text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="font-inter text-muted text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Client info */}
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-accent" />
          <span className="font-inter text-sm text-secondary">{project.client}</span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary text-secondary rounded-full font-inter text-xs font-medium border border-secondary hover:border-accent hover:text-accent transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 bg-primary text-muted rounded-full font-inter text-xs font-medium border border-secondary">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <div className="flex items-center justify-between pt-4 border-t border-primary">
          <span className="font-inter text-secondary font-semibold text-sm hover:text-accent transition-colors group/btn flex items-center gap-2">
            Ver ficha técnica
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </span>
          <Eye className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;