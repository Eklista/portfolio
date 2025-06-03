import React, { useState } from 'react';
import { serviceDetails, serviceCategories } from '../../data/services';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('web-design');
  const currentService = serviceDetails[activeTab];

  return (
    <section id="servicios" className="py-20 bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-inter font-medium text-sm text-secondary">Mis Servicios</span>
          </div>
          
          <h2 className="font-poppins text-4xl md:text-5xl font-semibold text-primary mb-6">
            Lo que hago mejor
          </h2>
          
          <p className="font-inter text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Cada proyecto es único, pero mi enfoque siempre es el mismo: 
            calidad, innovación y resultados que superen expectativas.
          </p>
        </div>

        {/* Service Layout - Tabs izquierda, contenido derecha */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          
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
            <div className="hidden lg:block space-y-3">
              {serviceCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = category.id === activeTab;
                
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
                      
                      <h3 className={`font-poppins font-semibold ${
                        isActive ? 'text-primary' : 'text-primary group-hover:text-accent'
                      } transition-colors duration-300`}>
                        {category.name}
                      </h3>
                    </div>
                    
                    <p className={`font-inter text-sm leading-relaxed ${
                      isActive ? 'text-secondary' : 'text-muted'
                    }`}>
                      {category.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area - Derecha */}
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-2xl shadow-medium border border-primary p-8">
              
              {/* Header del servicio */}
              <div className="mb-8">
                <h3 className="font-poppins text-3xl font-semibold text-primary mb-4">
                  {currentService.title}
                </h3>
                <p className="font-inter text-lg text-secondary leading-relaxed">
                  {currentService.subtitle}
                </p>
              </div>

              {/* Grid de contenido */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                
                {/* Features */}
                <div>
                  <h4 className="font-poppins font-semibold text-primary mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Lo que incluye:
                  </h4>
                  <div className="space-y-3">
                    {currentService.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="font-inter text-secondary group-hover:text-primary transition-colors text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-poppins font-semibold text-primary mb-6">
                    Tecnologías que domino:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentService.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary border border-secondary text-secondary rounded-full font-inter text-xs font-medium hover:border-accent hover:text-accent transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-primary">
                <p className="font-inter text-sm text-muted text-center">
                  ¿Interesado en este servicio? Conversemos sobre tu proyecto en la sección de contacto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '50+', label: 'Proyectos completados' },
            { number: '5', label: 'Años de experiencia' },
            { number: '100%', label: 'Clientes satisfechos' },
            { number: '24h', label: 'Tiempo de respuesta' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-surface rounded-2xl border border-primary card-hover">
              <div className="font-poppins text-3xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="font-inter text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;