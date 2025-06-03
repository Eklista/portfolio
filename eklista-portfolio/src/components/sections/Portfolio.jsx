import React, { useState } from 'react';
import ProjectCard from '../ui/ProjectCard';
import TechCard from '../ui/TechCard';
import { projects } from '../../data/projects';
import { serviceCategories } from '../../data/services';
import { Eye, Briefcase } from 'lucide-react';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('web-design');
  const [selectedProject, setSelectedProject] = useState(null);

  const currentProjects = projects[activeTab] || [];

  const handleProjectClick = (project) => {
    console.log('Opening project modal:', project); // Para debug
    setSelectedProject(project);
  };

  const closeTechCard = () => {
    setSelectedProject(null);
  };

  return (
    <section id="portafolio" className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary mb-6">
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="font-inter font-medium text-sm text-secondary">Mi Portafolio</span>
          </div>
          
          <h2 className="font-poppins text-4xl md:text-5xl font-semibold text-primary mb-6">
            Proyectos que hablan por mí
          </h2>
          
          <p className="font-inter text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Cada proyecto es una historia de colaboración, creatividad y 
            resultados excepcionales. Explora algunos de mis trabajos más destacados.
          </p>
        </div>

        {/* Portfolio Layout - Tabs izquierda, proyectos derecha */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Tabs verticales - Izquierda */}
          <div className="lg:col-span-1">
            {/* Mobile Dropdown */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-surface border-2 border-primary text-primary rounded-xl px-4 py-3 font-inter font-medium appearance-none cursor-pointer focus:border-accent focus:outline-none"
                >
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-surface text-primary">
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Tabs Verticales */}
            <div className="hidden lg:block space-y-3 sticky top-32">
              <h3 className="font-poppins text-lg font-semibold text-primary mb-4 px-2">
                Categorías
              </h3>
              {serviceCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = category.id === activeTab;
                const projectCount = projects[category.id]?.length || 0;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                      isActive
                        ? 'border-accent bg-accent-surface shadow-accent'
                        : 'border-primary bg-surface hover:border-secondary card-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-accent text-primary' 
                          : 'bg-primary text-accent group-hover:bg-accent group-hover:text-primary'
                      } transition-colors duration-300`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-poppins font-semibold text-sm ${
                          isActive ? 'text-primary' : 'text-primary group-hover:text-accent'
                        } transition-colors duration-300`}>
                          {category.name}
                        </h4>
                        <span className={`font-inter text-xs ${
                          isActive ? 'text-secondary' : 'text-muted'
                        }`}>
                          {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`font-inter text-xs leading-relaxed ${
                      isActive ? 'text-secondary' : 'text-muted'
                    }`}>
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects Area - Derecha */}
          <div className="lg:col-span-4">
            {currentProjects.length > 0 ? (
              <>
                {/* Projects Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-poppins text-2xl font-semibold text-primary mb-2">
                      {serviceCategories.find(cat => cat.id === activeTab)?.name}
                    </h3>
                    <p className="font-inter text-muted">
                      {currentProjects.length} proyecto{currentProjects.length !== 1 ? 's' : ''} encontrado{currentProjects.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Filter by year o similar - opcional */}
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted">
                    <span>Ordenado por:</span>
                    <span className="text-accent font-medium">Más reciente</span>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {currentProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={handleProjectClick}
                    />
                  ))}
                </div>

                {/* Load More Button - si hay muchos proyectos */}
                {currentProjects.length >= 6 && (
                  <div className="text-center">
                    <button className="px-8 py-3 bg-surface border-2 border-primary text-secondary hover-border-accent hover-text-accent rounded-xl font-inter font-semibold transition-all duration-300 hover:scale-105">
                      Ver más proyectos
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-primary">
                  <Eye className="w-12 h-12 text-muted" />
                </div>
                <h3 className="font-poppins text-2xl font-semibold text-primary mb-3">
                  Proyectos en camino
                </h3>
                <p className="font-inter text-muted max-w-md mx-auto leading-relaxed mb-8">
                  Estoy trabajando en algunos proyectos increíbles para esta categoría. 
                  ¡Pronto tendrás más contenido aquí!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:eklista@eklista.com?subject=Consulta sobre servicios"
                    className="btn-accent px-6 py-3 rounded-xl font-inter font-semibold"
                  >
                    Hablemos de tu proyecto
                  </a>
                  <button
                    onClick={() => setActiveTab('web-design')}
                    className="px-6 py-3 rounded-xl font-inter font-semibold border-2 border-secondary text-secondary hover-border-accent hover-text-accent transition-all duration-300"
                  >
                    Ver otros proyectos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action Global - REMOVED */}
        {/* Como Contact está justo abajo, no necesitamos CTA aquí */}
      </div>

      {/* Tech Card Modal */}
      {selectedProject && (
        <TechCard
          project={selectedProject}
          onClose={closeTechCard}
        />
      )}
    </section>
  );
};

export default Portfolio;