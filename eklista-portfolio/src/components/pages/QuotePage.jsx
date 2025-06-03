import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Calculator, 
  Send,
  Info,
  ArrowLeft,
  Home,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { 
  projectTypes, 
  technologiesAndFeatures, 
  additionalServices,
  calculateTotalPrice,
  formatPrice 
} from '../../data/pricing';

const QuotePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    projectType: null,
    features: [],
    additionalServices: [],
    contactInfo: {
      name: '',
      email: '',
      company: '',
      description: ''
    }
  });

  const totalSteps = 4;
  const totalPrice = calculateTotalPrice(selections);
  const availableFeatures = selections.projectType 
    ? technologiesAndFeatures[selections.projectType.id] || []
    : [];
  const availableServices = selections.projectType 
    ? additionalServices[selections.projectType.id] || []
    : [];

  const handleProjectTypeSelect = (projectType) => {
    setSelections(prev => ({
      ...prev,
      projectType,
      features: availableFeatures.filter(f => f.required) // Auto-select required features
    }));
  };

  const handleFeatureToggle = (feature) => {
    if (feature.required) return;
    
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    console.log('Cotización enviada:', selections, 'Total:', totalPrice);
    alert(`¡Cotización enviada! Total: ${formatPrice(totalPrice)}\n\nTe contactaremos pronto.`);
    window.location.href = '#inicio';
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Tipo de Proyecto';
      case 2:
        return 'Características';
      case 3:
        return 'Servicios Adicionales';
      case 4:
        return 'Información de Contacto';
      default:
        return 'Cotizador';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Selecciona qué tipo de proyecto tienes en mente';
      case 2:
        return 'Elige las funcionalidades que necesitas';
      case 3:
        return 'Agrega algunos extras para mejorar tu proyecto';
      case 4:
        return 'Déjanos tus datos para enviarte la cotización';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header compacto */}
      <div className="bg-secondary border-b border-primary">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="#inicio"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-inter font-medium text-sm">Volver al inicio</span>
            </a>
            
            <div className="flex items-center gap-2 text-xs text-muted bg-surface px-3 py-1 rounded-full border border-primary">
              <Home className="w-3 h-3" />
              <span>/</span>
              <span>Cotizador</span>
              <span>/</span>
              <span className="text-accent font-medium">{getStepTitle()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero compacto */}
      <div className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center">
          <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-accent mb-4">
            <Calculator className="w-4 h-4 text-accent" />
            <span className="font-inter font-medium text-secondary">Cotizador Personalizado</span>
          </div>
          
          <h1 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-3">
            Obtén tu cotización
            <span className="block text-accent">al instante</span>
          </h1>
          
          <p className="font-inter text-lg text-secondary mb-6 max-w-2xl mx-auto">
            Solo toma 2 minutos. Responde unas preguntas sobre tu proyecto y conoce el costo exacto
          </p>

          {/* Indicadores compactos */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-secondary font-inter">2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <span className="text-secondary font-inter">Personalizado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-secondary font-inter">Sin compromiso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar compacto */}
      <div className="bg-secondary border-b border-primary">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="bg-surface rounded-2xl p-4 border border-primary shadow-medium">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-poppins text-xl font-bold text-primary">
                  {getStepTitle()}
                </h3>
                <p className="text-secondary font-inter">
                  {getStepDescription()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted mb-1">Tu inversión estimada</p>
                <p className="font-poppins text-2xl font-bold text-accent">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-xs text-subtle">Paso {currentStep} de {totalSteps}</p>
              </div>
            </div>
            
            {/* Progress visual */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-inter font-medium text-muted">
                <span className={currentStep >= 1 ? 'text-accent' : ''}>Tipo</span>
                <span className={currentStep >= 2 ? 'text-accent' : ''}>Características</span>
                <span className={currentStep >= 3 ? 'text-accent' : ''}>Extras</span>
                <span className={currentStep >= 4 ? 'text-accent' : ''}>Contacto</span>
              </div>
              <div className="w-full bg-primary rounded-full h-2">
                <div 
                  className="gradient-accent h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-secondary rounded-2xl shadow-large border border-primary overflow-hidden">
          
          {/* Paso 1: Tipo de Proyecto */}
          {currentStep === 1 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins text-2xl font-bold text-primary mb-2">
                  ¿Qué quieres crear?
                </h2>
                <p className="font-inter text-secondary">
                  Selecciona el tipo de proyecto que mejor describa tu idea
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                {projectTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selections.projectType?.id === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleProjectTypeSelect(type)}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden card-hover ${
                        isSelected
                          ? 'border-accent bg-accent-surface shadow-accent scale-105'
                          : 'border-primary hover:border-secondary'
                      }`}
                    >
                      {/* Gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                      
                      <div className="relative">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isSelected 
                              ? 'bg-accent text-primary' 
                              : 'bg-soft text-muted group-hover:bg-accent group-hover:text-primary'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-poppins text-lg font-bold text-primary mb-1">
                              {type.name}
                            </h3>
                            <p className="text-secondary font-inter text-sm">
                              {type.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center pt-3 border-t border-primary">
                          <span className="text-xs text-muted block mb-1 font-inter">Desde</span>
                          <span className="font-poppins text-xl font-bold text-accent">
                            {formatPrice(type.basePrice)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Paso 2: Características */}
          {currentStep === 2 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins text-2xl font-bold text-primary mb-2">
                  Personaliza tu {selections.projectType?.name.toLowerCase()}
                </h2>
                <p className="font-inter text-secondary">
                  Selecciona las funcionalidades que necesitas
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(groupFeaturesByCategory(availableFeatures)).map(([category, features]) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <h3 className="font-poppins text-lg font-bold text-primary">{category}</h3>
                      <div className="flex-1 h-px bg-primary"></div>
                    </div>
                    
                    <div className="grid gap-3">
                      {features.map((feature) => {
                        const isSelected = selections.features.some(f => f.id === feature.id);
                        
                        return (
                          <button
                            key={feature.id}
                            onClick={() => handleFeatureToggle(feature)}
                            className={`group p-4 rounded-xl border-2 transition-all duration-300 text-left card-hover ${
                              isSelected
                                ? 'border-accent bg-accent-surface shadow-accent'
                                : 'border-primary hover:border-secondary'
                            } ${feature.required ? 'opacity-90' : ''}`}
                            disabled={feature.required}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                    isSelected || feature.required
                                      ? 'bg-accent text-primary'
                                      : 'bg-soft text-muted group-hover:bg-accent group-hover:text-primary'
                                  }`}>
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="font-poppins text-base font-bold text-primary">
                                      {feature.name}
                                      {feature.required && (
                                        <span className="text-accent text-xs ml-2 font-inter font-normal">(Incluido)</span>
                                      )}
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-secondary font-inter text-sm pl-11">
                                  {feature.description}
                                </p>
                              </div>
                              <div className="text-right ml-6">
                                <span className="font-poppins text-lg font-bold text-accent">
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
            </div>
          )}

          {/* Paso 3: Servicios Adicionales */}
          {currentStep === 3 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins text-2xl font-bold text-primary mb-2">
                  Mejora tu proyecto
                </h2>
                <p className="font-inter text-secondary">
                  Estos extras pueden hacer tu proyecto aún mejor. Todos son opcionales
                </p>
              </div>

              <div className="grid gap-4">
                {availableServices.map((service) => {
                  const isSelected = selections.additionalServices.some(s => s.id === service.id);
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`group p-4 rounded-xl border-2 transition-all duration-300 text-left card-hover ${
                        isSelected
                          ? 'border-accent bg-accent-surface shadow-accent'
                          : 'border-primary hover:border-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isSelected ? 'bg-accent text-primary' : 'bg-soft text-muted group-hover:bg-accent group-hover:text-primary'
                          }`}>
                            {isSelected ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Info className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-poppins text-base font-bold text-primary mb-1">
                              {service.name}
                            </h4>
                            <p className="text-secondary font-inter text-sm">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-poppins text-lg font-bold text-accent">
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

              {availableServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-primary">
                    <Check className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-poppins text-xl font-bold text-primary mb-2">¡Todo listo!</h3>
                  <p className="text-secondary font-inter">No hay servicios adicionales disponibles para este tipo de proyecto.</p>
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Contacto */}
          {currentStep === 4 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="font-poppins text-2xl font-bold text-primary mb-2">
                  Casi terminamos
                </h2>
                <p className="font-inter text-secondary">
                  Solo necesitamos tus datos para enviarte la cotización detallada
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-poppins text-sm font-bold text-primary mb-2">
                      ¿Cómo te llamas? *
                    </label>
                    <input
                      type="text"
                      value={selections.contactInfo.name}
                      onChange={(e) => handleContactInfoChange('name', e.target.value)}
                      className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none focus:bg-tertiary transition-all font-inter"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-sm font-bold text-primary mb-2">
                      ¿Cuál es tu email? *
                    </label>
                    <input
                      type="email"
                      value={selections.contactInfo.email}
                      onChange={(e) => handleContactInfoChange('email', e.target.value)}
                      className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none focus:bg-tertiary transition-all font-inter"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-sm font-bold text-primary mb-2">
                      ¿De qué empresa? (opcional)
                    </label>
                    <input
                      type="text"
                      value={selections.contactInfo.company}
                      onChange={(e) => handleContactInfoChange('company', e.target.value)}
                      className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none focus:bg-tertiary transition-all font-inter"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-sm font-bold text-primary mb-2">
                      Cuéntanos más sobre tu proyecto (opcional)
                    </label>
                    <textarea
                      value={selections.contactInfo.description}
                      onChange={(e) => handleContactInfoChange('description', e.target.value)}
                      className="w-full bg-surface border-2 border-primary rounded-xl px-4 py-3 text-secondary placeholder-muted focus:border-accent focus:outline-none focus:bg-tertiary resize-none transition-all font-inter"
                      rows="4"
                      placeholder="Fechas importantes, referencias que te gusten, detalles específicos..."
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="bg-surface rounded-2xl p-6 border-2 border-accent h-fit shadow-accent">
                  <h3 className="font-poppins text-xl font-bold text-primary mb-6 text-center">
                    Tu cotización personalizada
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-3 border-b-2 border-accent">
                      <span className="font-poppins font-bold text-primary">{selections.projectType?.name}</span>
                      <span className="font-poppins font-bold text-primary">{formatPrice(selections.projectType?.basePrice || 0)}</span>
                    </div>
                    
                    {selections.features.map((feature) => (
                      <div key={feature.id} className="flex justify-between items-center py-1">
                        <span className="text-secondary font-inter text-sm">+ {feature.name}</span>
                        <span className="text-secondary font-inter font-medium text-sm">{formatPrice(feature.price)}</span>
                      </div>
                    ))}
                    
                    {selections.additionalServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center py-1">
                        <span className="text-accent-light font-inter text-sm">+ {service.name}</span>
                        <span className="text-accent-light font-inter font-medium text-sm">
                          {service.price 
                            ? formatPrice(service.price)
                            : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t-2 border-accent pt-4">
                    <div className="text-center">
                      <p className="font-inter text-secondary mb-1">Total de tu inversión</p>
                      <p className="font-poppins text-3xl font-bold text-accent mb-3">
                        {formatPrice(totalPrice)}
                      </p>
                      <p className="text-xs text-muted leading-relaxed font-inter">
                        * Precio estimado. La cotización final puede ajustarse según los requerimientos específicos del proyecto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <div className="bg-secondary rounded-2xl shadow-large border border-primary p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-secondary text-secondary hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>

              <div className="text-center">
                <p className="text-sm text-muted mb-1 font-inter">Tu inversión total</p>
                <p className="font-poppins text-2xl font-bold text-accent">
                  {formatPrice(totalPrice)}
                </p>
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 btn-accent px-6 py-3 rounded-xl font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar Cotización
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;