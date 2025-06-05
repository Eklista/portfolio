import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Calculator, 
  Send,
  Info,
  Clock,
  Users,
  Star,
  AlertCircle
} from 'lucide-react';
import { 
  projectTypes, 
  technologiesAndFeatures, 
  additionalServices,
  calculateTotalPrice,
  formatPrice 
} from '../../data/pricing';

const WindowQuote = ({ 
  window: windowProp, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
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
  const [errors, setErrors] = useState({});
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const dragControls = useDragControls();

  const totalSteps = 4;
  const totalPrice = calculateTotalPrice(selections);
  const availableFeatures = selections.projectType 
    ? technologiesAndFeatures[selections.projectType.id] || []
    : [];
  const availableServices = selections.projectType 
    ? additionalServices[selections.projectType.id] || []
    : [];

  // Función para obtener dimensiones responsive
  const getResponsiveDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 800,
        position: { x: 100, y: 60 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

    if (isMobile) {
      return {
        width: screenWidth,
        height: screenHeight - 80,
        position: { x: 0, y: 0 },
        isMobile: true,
        isTablet: false,
        isDesktop: false
      };
    } else if (isTablet) {
      return {
        width: Math.min(1000, screenWidth - 40),
        height: Math.min(screenHeight - 100, 800),
        position: { x: 20, y: 50 },
        isMobile: false,
        isTablet: true,
        isDesktop: false
      };
    } else {
      return {
        width: Math.min(1300, screenWidth - 120),
        height: Math.min(screenHeight - 100, 850),
        position: { x: 60, y: 40 },
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
  };

  useEffect(() => {
    setWindowDimensions(getResponsiveDimensions());
    setIsMaximized(windowProp.isMaximized || false);

    const handleResize = () => {
      if (!isMaximized) {
        setWindowDimensions(getResponsiveDimensions());
      }
    };

    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  if (isMinimized || !windowDimensions) return null;

  const getMaximizedDimensions = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return {
        width: 1200,
        height: 800,
        position: { x: 20, y: 20 }
      };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;

    return {
      width: windowDimensions.isMobile ? screenWidth : screenWidth - 40,
      height: windowDimensions.isMobile ? screenHeight - 80 : screenHeight - 100,
      position: { x: windowDimensions.isMobile ? 0 : 20, y: windowDimensions.isMobile ? 0 : 20 }
    };
  };

  const getCurrentWindowSize = () => {
    if (isMaximized) {
      return getMaximizedDimensions();
    }
    return windowDimensions;
  };

  const getDragConstraints = () => {
    if (typeof globalThis === 'undefined' || !globalThis.innerWidth) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    const screenWidth = globalThis.innerWidth;
    const screenHeight = globalThis.innerHeight;
    const currentSize = getCurrentWindowSize();

    if (isMaximized || windowDimensions.isMobile) {
      return { left: 0, right: 0, top: 0, bottom: 0 };
    }

    return {
      left: 0,
      right: Math.max(0, screenWidth - currentSize.width),
      top: 0,
      bottom: Math.max(0, screenHeight - currentSize.height - 80)
    };
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize && onMaximize(windowProp.windowId);
  };

  // Lógica del cotizador
  const handleProjectTypeSelect = (projectType) => {
    setSelections(prev => ({
      ...prev,
      projectType,
      features: availableFeatures.filter(f => f.required)
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
        return true;
      case 4:
        return selections.contactInfo.name && selections.contactInfo.email;
      default:
        return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selections.contactInfo.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!selections.contactInfo.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(selections.contactInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSending(true);
    
    // Simular envío
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      
      // Auto-cerrar después del éxito
      setTimeout(() => {
        onClose(windowProp.windowId);
      }, 3000);
    }, 2000);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Tipo de Proyecto';
      case 2: return 'Características';
      case 3: return 'Servicios Adicionales';
      case 4: return 'Información de Contacto';
      default: return 'Cotizador';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Selecciona qué tipo de proyecto tienes en mente';
      case 2: return 'Elige las funcionalidades que necesitas';
      case 3: return 'Agrega algunos extras para mejorar tu proyecto';
      case 4: return 'Déjanos tus datos para enviarte la cotización';
      default: return '';
    }
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

  const currentWindowSize = getCurrentWindowSize();

  // Modal de éxito
  if (sent) {
    return (
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
        style={{
          left: currentWindowSize.position.x,
          top: currentWindowSize.position.y,
          width: currentWindowSize.width,
          height: currentWindowSize.height,
          zIndex: windowProp.zIndex || 100
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onMouseDown={() => onBringToFront(windowProp.windowId)}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <Check size={40} className="text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ¡Cotización enviada exitosamente!
          </motion.h2>
          
          <motion.div 
            className="space-y-3 mb-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600 leading-relaxed">
              Gracias por tu interés. He recibido tu cotización y te responderé dentro de las próximas 24 horas con una propuesta detallada.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-800 font-semibold mb-2">
                Total estimado: {formatPrice(totalPrice)}
              </div>
              <div className="text-green-700 text-sm">
                {selections.projectType?.name} • {selections.features.length} características
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            Esta ventana se cerrará automáticamente...
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // RENDER MÓVIL
  if (windowDimensions.isMobile) {
    return (
      <motion.div
        className="fixed inset-0 bg-white z-[1000] overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header móvil */}
        <div className="bg-gray-100/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <Calculator size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-gray-800 text-sm truncate block">Cotizador</span>
              <div className="text-gray-500 text-xs">
                Paso {currentStep} de {totalSteps} • {formatPrice(totalPrice)}
              </div>
            </div>
          </div>
          <button
            onClick={() => onClose(windowProp.windowId)}
            className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Cerrar"
          >
            <X size={18} className="text-gray-600 group-hover:text-red-600" />
          </button>
        </div>

        {/* Progress bar móvil */}
        <div className="px-4 py-3 bg-white border-b border-gray-200/50 flex-shrink-0">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span className={currentStep >= 1 ? 'text-green-600' : ''}>Tipo</span>
            <span className={currentStep >= 2 ? 'text-green-600' : ''}>Características</span>
            <span className={currentStep >= 3 ? 'text-green-600' : ''}>Extras</span>
            <span className={currentStep >= 4 ? 'text-green-600' : ''}>Contacto</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            {/* Header del paso */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-gray-600 text-sm">
                {getStepDescription()}
              </p>
            </div>

            {/* Contenido específico por paso */}
            {/* Paso 1: Tipo de Proyecto */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {projectTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selections.projectType?.id === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleProjectTypeSelect(type)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-base mb-1">
                            {type.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {type.description}
                          </p>
                          <div className="text-green-600 font-bold text-lg">
                            {formatPrice(type.basePrice)}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Paso 2: Características */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {Object.entries(groupFeaturesByCategory(availableFeatures)).map(([category, features]) => (
                  <div key={category}>
                    <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      {category}
                    </h3>
                    
                    <div className="space-y-3">
                      {features.map((feature) => {
                        const isSelected = selections.features.some(f => f.id === feature.id);
                        
                        return (
                          <button
                            key={feature.id}
                            onClick={() => handleFeatureToggle(feature)}
                            className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            } ${feature.required ? 'opacity-90' : ''}`}
                            disabled={feature.required}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isSelected || feature.required
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <Check size={16} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 text-sm">
                                    {feature.name}
                                    {feature.required && (
                                      <span className="text-green-600 text-xs ml-2">(Incluido)</span>
                                    )}
                                  </h4>
                                  <p className="text-gray-600 text-xs mt-1">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-green-600 text-sm">
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
              <div className="space-y-4">
                {availableServices.length > 0 ? (
                  availableServices.map((service) => {
                    const isSelected = selections.additionalServices.some(s => s.id === service.id);
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceToggle(service)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {isSelected ? <Check size={20} /> : <Info size={20} />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                {service.name}
                              </h4>
                              <p className="text-gray-600 text-xs">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-green-600 text-sm">
                              {service.price 
                                ? formatPrice(service.price)
                                : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                              }
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">¡Todo listo!</h3>
                    <p className="text-gray-600 text-sm">No hay servicios adicionales disponibles para este tipo de proyecto.</p>
                  </div>
                )}
              </div>
            )}

            {/* Paso 4: Contacto */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-800 mb-2 text-sm">
                    ¿Cómo te llamas? *
                  </label>
                  <input
                    type="text"
                    value={selections.contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                    className={`w-full bg-white border-2 rounded-lg px-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-2 text-sm">
                    ¿Cuál es tu email? *
                  </label>
                  <input
                    type="email"
                    value={selections.contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className={`w-full bg-white border-2 rounded-lg px-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-2 text-sm">
                    ¿De qué empresa? (opcional)
                  </label>
                  <input
                    type="text"
                    value={selections.contactInfo.company}
                    onChange={(e) => handleContactInfoChange('company', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-2 text-sm">
                    Cuéntanos más sobre tu proyecto (opcional)
                  </label>
                  <textarea
                    value={selections.contactInfo.description}
                    onChange={(e) => handleContactInfoChange('description', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-lg px-3 py-3 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none resize-none transition-all"
                    rows="4"
                    placeholder="Fechas importantes, referencias que te gusten, detalles específicos..."
                  />
                </div>

                {/* Resumen de cotización */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-6">
                  <h3 className="font-bold text-green-800 mb-3 text-base">
                    Resumen de tu cotización
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-800">{selections.projectType?.name}</span>
                      <span className="font-semibold text-green-800">{formatPrice(selections.projectType?.basePrice || 0)}</span>
                    </div>
                    
                    {selections.features.map((feature) => (
                      <div key={feature.id} className="flex justify-between items-center text-sm">
                        <span className="text-green-700">+ {feature.name}</span>
                        <span className="text-green-700">{formatPrice(feature.price)}</span>
                      </div>
                    ))}
                    
                    {selections.additionalServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center text-sm">
                        <span className="text-green-600">+ {service.name}</span>
                        <span className="text-green-600">
                          {service.price 
                            ? formatPrice(service.price)
                            : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-green-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-800 text-lg">Total</span>
                      <span className="font-bold text-green-800 text-xl">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer móvil con navegación */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              <span>Anterior</span>
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">Total estimado</p>
              <p className="font-bold text-green-600 text-lg">{formatPrice(totalPrice)}</p>
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Siguiente</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSending}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // RENDER DESKTOP/TABLET
  return (
    <motion.div
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
      style={{
        left: isMaximized ? currentWindowSize.position.x : windowDimensions.position.x,
        top: isMaximized ? currentWindowSize.position.y : windowDimensions.position.y,
        width: currentWindowSize.width,
        height: currentWindowSize.height,
        zIndex: windowProp.zIndex || 100
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      drag={!isMaximized && !windowDimensions.isMobile}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={getDragConstraints()}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Window Header */}
      <div 
        className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move flex-shrink-0"
        onPointerDown={(e) => {
          onBringToFront(windowProp.windowId);
          if (!isMaximized && !windowDimensions.isMobile) {
            dragControls.start(e);
          }
        }}
      >
        {/* Window title and icon */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
            <Calculator size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-gray-800 text-base truncate block">Cotizador Personalizado</span>
            <div className="text-gray-500 text-xs">
              {getStepTitle()} • {formatPrice(totalPrice)}
            </div>
          </div>
        </div>

        {/* Window controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onMinimize(windowProp)}
            className="w-8 h-8 bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Minimizar"
          >
            <Minus size={14} className="text-gray-600 group-hover:text-yellow-600" />
          </button>
          
          <button 
            onClick={handleMaximize}
            className="w-8 h-8 bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group" 
            title={isMaximized ? "Restaurar" : "Maximizar"}
          >
            {isMaximized ? (
              <Square size={14} className="text-gray-600 group-hover:text-green-600" />
            ) : (
              <Maximize2 size={14} className="text-gray-600 group-hover:text-green-600" />
            )}
          </button>
          
          <button
            onClick={() => onClose(windowProp.windowId)}
            className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
            title="Cerrar"
          >
            <X size={14} className="text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* Progress Header */}
      <div className="px-6 py-4 border-b border-gray-200/50 bg-gray-50/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-gray-600 text-sm">2 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star size={16} className="text-gray-500" />
              <span className="text-gray-600 text-sm">Personalizado</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-gray-500" />
              <span className="text-gray-600 text-sm">Sin compromiso</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Tu inversión estimada</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(totalPrice)}</p>
            <p className="text-xs text-gray-500">Paso {currentStep} de {totalSteps}</p>
          </div>
        </div>
        
        {/* Progress visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span className={currentStep >= 1 ? 'text-green-600' : ''}>Tipo</span>
            <span className={currentStep >= 2 ? 'text-green-600' : ''}>Características</span>
            <span className={currentStep >= 3 ? 'text-green-600' : ''}>Extras</span>
            <span className={currentStep >= 4 ? 'text-green-600' : ''}>Contacto</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentStep === 1 && '¿Qué quieres crear?'}
              {currentStep === 2 && `Personaliza tu ${selections.projectType?.name.toLowerCase()}`}
              {currentStep === 3 && 'Mejora tu proyecto'}
              {currentStep === 4 && 'Casi terminamos'}
            </h2>
            <p className="text-gray-600">
              {getStepDescription()}
            </p>
          </div>

          {/* Step Content */}
          {/* Paso 1: Tipo de Proyecto */}
          {currentStep === 1 && (
            <div className="grid lg:grid-cols-2 gap-6">
              {projectTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selections.projectType?.id === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => handleProjectTypeSelect(type)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                      isSelected
                        ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-green-500 group-hover:text-white'
                        }`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {type.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500 block mb-1">Desde</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(type.basePrice)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Paso 2: Características */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {Object.entries(groupFeaturesByCategory(availableFeatures)).map(([category, features]) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  <div className="grid gap-4">
                    {features.map((feature) => {
                      const isSelected = selections.features.some(f => f.id === feature.id);
                      
                      return (
                        <button
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature)}
                          className={`group p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          } ${feature.required ? 'opacity-90' : ''}`}
                          disabled={feature.required}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected || feature.required
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 group-hover:bg-green-500 group-hover:text-white'
                                }`}>
                                  <Check size={16} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    {feature.name}
                                    {feature.required && (
                                      <span className="text-green-600 text-xs ml-2">(Incluido)</span>
                                    )}
                                  </h4>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm pl-11">
                                {feature.description}
                              </p>
                            </div>
                            <div className="text-right ml-6">
                              <span className="text-lg font-bold text-green-600">
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
            <div className="space-y-6">
              {availableServices.length > 0 ? (
                availableServices.map((service) => {
                  const isSelected = selections.additionalServices.some(s => s.id === service.id);
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service)}
                      className={`group w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-green-500 group-hover:text-white'
                          }`}>
                            {isSelected ? (
                              <Check size={24} />
                            ) : (
                              <Info size={24} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">
                              {service.name}
                            </h4>
                            <p className="text-gray-600">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-green-600">
                            {service.price 
                              ? formatPrice(service.price)
                              : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">¡Todo listo!</h3>
                  <p className="text-gray-600">No hay servicios adicionales disponibles para este tipo de proyecto.</p>
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Contacto */}
          {currentStep === 4 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulario */}
              <div className="space-y-6">
                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    ¿Cómo te llamas? *
                  </label>
                  <input
                    type="text"
                    value={selections.contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    ¿Cuál es tu email? *
                  </label>
                  <input
                    type="email"
                    value={selections.contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    ¿De qué empresa? (opcional)
                  </label>
                  <input
                    type="text"
                    value={selections.contactInfo.company}
                    onChange={(e) => handleContactInfoChange('company', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-2">
                    Cuéntanos más sobre tu proyecto (opcional)
                  </label>
                  <textarea
                    value={selections.contactInfo.description}
                    onChange={(e) => handleContactInfoChange('description', e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none resize-none transition-all"
                    rows="5"
                    placeholder="Fechas importantes, referencias que te gusten, detalles específicos..."
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 h-fit shadow-md">
                <h3 className="text-xl font-bold text-green-800 mb-6 text-center">
                  Tu cotización personalizada
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-3 border-b-2 border-green-300">
                    <span className="font-bold text-green-800">{selections.projectType?.name}</span>
                    <span className="font-bold text-green-800">{formatPrice(selections.projectType?.basePrice || 0)}</span>
                  </div>
                  
                  {selections.features.map((feature) => (
                    <div key={feature.id} className="flex justify-between items-center py-1">
                      <span className="text-green-700 text-sm">+ {feature.name}</span>
                      <span className="text-green-700 font-medium text-sm">{formatPrice(feature.price)}</span>
                    </div>
                  ))}
                  
                  {selections.additionalServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-1">
                      <span className="text-green-600 text-sm">+ {service.name}</span>
                      <span className="text-green-600 font-medium text-sm">
                        {service.price 
                          ? formatPrice(service.price)
                          : `+${((service.multiplier - 1) * 100).toFixed(0)}%`
                        }
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-green-300 pt-4">
                  <div className="text-center">
                    <p className="text-green-700 mb-1">Total de tu inversión</p>
                    <p className="text-3xl font-bold text-green-800 mb-3">
                      {formatPrice(totalPrice)}
                    </p>
                    <p className="text-xs text-green-600 leading-relaxed">
                      * Precio estimado. La cotización final puede ajustarse según los requerimientos específicos del proyecto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t border-gray-200/50 bg-gray-50/50 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Tu inversión total</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(totalPrice)}
            </p>
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <span>Siguiente</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSending}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Enviando cotización...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Enviar Cotización</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WindowQuote;