import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Calculator, 
  Send,
  Info,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  projectTypes, 
  technologiesAndFeatures, 
  additionalServices,
  calculateTotalPrice,
  formatPrice 
} from '../../data/pricing';

const QuoteCalculator = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    projectType: null,
    features: [],
    additionalServices: [],
    timeline: 'normal',
    contactInfo: {
      name: '',
      email: '',
      company: '',
      description: ''
    }
  });

  const totalSteps = 4;

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPrice = calculateTotalPrice(selections);
  const availableFeatures = selections.projectType 
    ? technologiesAndFeatures[selections.projectType.id] || []
    : [];

  const handleProjectTypeSelect = (projectType) => {
    setSelections(prev => ({
      ...prev,
      projectType,
      features: [] // Reset features cuando cambia el tipo de proyecto
    }));
  };

  const handleFeatureToggle = (feature) => {
    setSelections(prev => {
      const isSelected = prev.features.some(f => f.id === feature.id);
      
      if (isSelected) {
        return {
          ...prev,
          features: prev.features.filter(f => f.id !== feature.id)
        };
      } else {
        return {
          ...prev,
          features: [...prev.features, feature]
        };
      }
    });
  };

  const handleServiceToggle = (service) => {
    setSelections(prev => {
      const isSelected = prev.additionalServices.some(s => s.id === service.id);
      
      if (isSelected) {
        return {
          ...prev,
          additionalServices: prev.additionalServices.filter(s => s.id !== service.id)
        };
      } else {
        return {
          ...prev,
          additionalServices: [...prev.additionalServices, service]
        };
      }
    });
  };

  const handleContactInfoChange = (field, value) => {
    setSelections(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selections.projectType !== null;
      case 2:
        return selections.features.length > 0;
      case 3:
        return true; // Servicios adicionales son opcionales
      case 4:
        return selections.contactInfo.name && selections.contactInfo.email;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Aquí enviaríamos la cotización
    console.log('Cotización enviada:', selections, 'Total:', totalPrice);
    alert(`¡Cotización enviada! Total: ${formatPrice(totalPrice)}`);
    onClose();
  };

  const groupFeaturesByCategory = (features) => {
    return features.reduce((groups, feature) => {
      const category = feature.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(feature);
      return groups;
    }, {});
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelections({
      projectType: null,
      features: [],
      additionalServices: [],
      timeline: 'normal',
      contactInfo: {
        name: '',
        email: '',
        company: '',
        description: ''
      }
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-primary/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-secondary rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-surface border-b border-primary p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-poppins text-xl font-semibold text-primary">
                  Cotizador de Proyectos
                </h2>
                <p className="text-sm text-muted">
                  Paso {currentStep} de {totalSteps}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted">Estimado actual</p>
                <p className="font-poppins text-xl font-bold text-accent">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-primary hover:bg-border-secondary rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span>Tipo de proyecto</span>
              <span>Características</span>
              <span>Servicios extra</span>
              <span>Información</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          
          {/* Paso 1: Tipo de Proyecto */}
          {currentStep === 1 && (
            <div>
              <h3 className="font-poppins text-2xl font-semibold text-primary mb-2">
                ¿Qué tipo de proyecto necesitas?
              </h3>
              <p className="text-muted mb-8">
                Selecciona el tipo de proyecto que mejor describa lo que tienes en mente
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {projectTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selections.projectType?.id === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleProjectTypeSelect(type)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-accent bg-accent-surface shadow-accent'
                          : 'border-primary bg-surface hover:border-secondary card-hover'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-accent text-primary' 
                            : 'bg-primary text-accent'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-poppins font-semibold text-primary text-lg">
                            {type.name}
                          </h4>
                          <p className="text-muted text-sm">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="font-poppins text-lg font-bold text-accent">
                          Desde {formatPrice(type.basePrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paso 2: Características y Tecnologías */}
          {currentStep === 2 && (
            <div>
              <h3 className="font-poppins text-2xl font-semibold text-primary mb-2">
                ¿Qué características necesitas?
              </h3>
              <p className="text-muted mb-8">
                Selecciona las funcionalidades que quieres incluir en tu proyecto
              </p>

              {Object.entries(groupFeaturesByCategory(availableFeatures)).map(([category, features]) => (
                <div key={category} className="mb-8">
                  <h4 className="font-poppins font-semibold text-primary mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    {category}
                  </h4>
                  
                  <div className="grid gap-3">
                    {features.map((feature) => {
                      const isSelected = selections.features.some(f => f.id === feature.id);
                      
                      return (
                        <button
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'border-accent bg-accent-surface'
                              : 'border-primary bg-surface hover:border-secondary'
                          } ${feature.required ? 'opacity-75' : ''}`}
                          disabled={feature.required}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="font-poppins font-semibold text-primary">
                                  {feature.name}
                                  {feature.required && (
                                    <span className="text-accent text-sm ml-2">(Incluido)</span>
                                  )}
                                </h5>
                                {(isSelected || feature.required) && (
                                  <Check className="w-5 h-5 text-accent" />
                                )}
                              </div>
                              <p className="text-muted text-sm">
                                {feature.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <span className="font-poppins font-bold text-accent">
                                {feature.required ? 'Incluido' : formatPrice(feature.price)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paso 3: Servicios Adicionales */}
          {currentStep === 3 && (
            <div>
              <h3 className="font-poppins text-2xl font-semibold text-primary mb-2">
                Servicios adicionales
              </h3>
              <p className="text-muted mb-8">
                Agrega servicios extra para mejorar tu proyecto (opcional)
              </p>

              <div className="grid gap-4">
                {additionalServices.map((service) => {
                  const isSelected = selections.additionalServices.some(s => s.id === service.id);
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-accent bg-accent-surface'
                          : 'border-primary bg-surface hover:border-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-accent text-primary' : 'bg-primary text-accent'
                          }`}>
                            {isSelected ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Info className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-poppins font-semibold text-primary">
                              {service.name}
                            </h5>
                            <p className="text-muted text-sm">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-poppins font-bold text-accent">
                            {service.price 
                              ? formatPrice(service.price)
                              : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paso 4: Información de Contacto */}
          {currentStep === 4 && (
            <div>
              <h3 className="font-poppins text-2xl font-semibold text-primary mb-2">
                Información de contacto
              </h3>
              <p className="text-muted mb-8">
                Para enviarte la cotización detallada
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-inter font-medium text-secondary mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={selections.contactInfo.name}
                      onChange={(e) => handleContactInfoChange('name', e.target.value)}
                      className="w-full bg-surface border border-primary rounded-lg px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block font-inter font-medium text-secondary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={selections.contactInfo.email}
                      onChange={(e) => handleContactInfoChange('email', e.target.value)}
                      className="w-full bg-surface border border-primary rounded-lg px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-inter font-medium text-secondary mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    type="text"
                    value={selections.contactInfo.company}
                    onChange={(e) => handleContactInfoChange('company', e.target.value)}
                    className="w-full bg-surface border border-primary rounded-lg px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block font-inter font-medium text-secondary mb-2">
                    Descripción adicional (opcional)
                  </label>
                  <textarea
                    value={selections.contactInfo.description}
                    onChange={(e) => handleContactInfoChange('description', e.target.value)}
                    className="w-full bg-surface border border-primary rounded-lg px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none resize-none"
                    rows="4"
                    placeholder="Cuéntanos más sobre tu proyecto..."
                  />
                </div>

                {/* Resumen de la cotización */}
                <div className="bg-surface rounded-xl p-6 border border-primary">
                  <h4 className="font-poppins font-semibold text-primary mb-4">
                    Resumen de tu cotización
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-secondary">{selections.projectType?.name}</span>
                      <span className="text-secondary">{formatPrice(selections.projectType?.basePrice || 0)}</span>
                    </div>
                    
                    {selections.features.map((feature) => (
                      <div key={feature.id} className="flex justify-between text-sm">
                        <span className="text-muted">+ {feature.name}</span>
                        <span className="text-muted">{formatPrice(feature.price)}</span>
                      </div>
                    ))}
                    
                    {selections.additionalServices.map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="text-muted">+ {service.name}</span>
                        <span className="text-muted">
                          {service.price 
                            ? formatPrice(service.price)
                            : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-primary pt-4">
                    <div className="flex justify-between">
                      <span className="font-poppins font-semibold text-primary">Total estimado:</span>
                      <span className="font-poppins text-xl font-bold text-accent">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con navegación */}
        <div className="bg-surface border-t border-primary p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-secondary text-secondary hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted">Total estimado</p>
                <p className="font-poppins text-lg font-bold text-accent">
                  {formatPrice(totalPrice)}
                </p>
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-inter font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-inter font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar Cotización
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;