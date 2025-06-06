// src/data/services.ts
import type { Service, SubService, ServicesStructured } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    name: 'Producción Audiovisual',
    description: 'Servicios de grabación y producción de contenido audiovisual',
    icon_name: 'video'
  },
  {
    id: 2,
    name: 'Postproducción',
    description: 'Servicios de edición y postproducción de contenido',
    icon_name: 'edit'
  },
  {
    id: 3,
    name: 'Contenido Digital',
    description: 'Creación de contenido digital y diseño gráfico',
    icon_name: 'design'
  },
  {
    id: 4,
    name: 'Apoyo Técnico',
    description: 'Soporte técnico y configuración de equipos',
    icon_name: 'support'
  },
  {
    id: 5,
    name: 'Transmisión y Streaming',
    description: 'Servicios de transmisión en vivo y streaming',
    icon_name: 'broadcast'
  }
];

export const SUB_SERVICES: SubService[] = [
  // Producción Audiovisual (service_id: 1)
  {
    id: 1,
    name: 'Grabación de Video',
    description: 'Grabación profesional de video con múltiples cámaras',
    service_id: 1,
    icon: '🎥'
  },
  {
    id: 2,
    name: 'Grabación de Audio',
    description: 'Captura de audio profesional con micrófonos especializados',
    service_id: 1,
    icon: '🎵'
  },
  {
    id: 3,
    name: 'Fotografía de Eventos',
    description: 'Cobertura fotográfica profesional de actividades',
    service_id: 1,
    icon: '📸'
  },
  {
    id: 4,
    name: 'Grabación Multi-cámara',
    description: 'Configuración con múltiples ángulos de cámara',
    service_id: 1,
    icon: '🎬'
  },
  {
    id: 5,
    name: 'Iluminación Profesional',
    description: 'Setup de iluminación para producciones',
    service_id: 1,
    icon: '💡'
  },

  // Postproducción (service_id: 2)
  {
    id: 6,
    name: 'Edición de Video',
    description: 'Edición y montaje de contenido audiovisual',
    service_id: 2,
    icon: '✂️'
  },
  {
    id: 7,
    name: 'Edición de Audio',
    description: 'Limpieza y masterización de audio',
    service_id: 2,
    icon: '🎧'
  },
  {
    id: 8,
    name: 'Corrección de Color',
    description: 'Corrección y gradación de color profesional',
    service_id: 2,
    icon: '🎨'
  },
  {
    id: 9,
    name: 'Subtitulado',
    description: 'Creación de subtítulos y transcripciones',
    service_id: 2,
    icon: '📝'
  },
  {
    id: 10,
    name: 'Motion Graphics',
    description: 'Animación y gráficos en movimiento',
    service_id: 2,
    icon: '✨'
  },

  // Contenido Digital (service_id: 3)
  {
    id: 11,
    name: 'Diseño Gráfico',
    description: 'Creación de material gráfico promocional',
    service_id: 3,
    icon: '🎨'
  },
  {
    id: 12,
    name: 'Contenido para Redes Sociales',
    description: 'Adaptación de contenido para plataformas digitales',
    service_id: 3,
    icon: '📱'
  },
  {
    id: 13,
    name: 'Thumbnails y Portadas',
    description: 'Diseño de miniaturas y portadas atractivas',
    service_id: 3,
    icon: '🖼️'
  },
  {
    id: 14,
    name: 'Infografías',
    description: 'Creación de contenido infográfico educativo',
    service_id: 3,
    icon: '📊'
  },
  {
    id: 15,
    name: 'Animación 2D',
    description: 'Animaciones explicativas y educativas',
    service_id: 3,
    icon: '🎭'
  },

  // Apoyo Técnico (service_id: 4)
  {
    id: 16,
    name: 'Configuración de Equipos',
    description: 'Setup y configuración de equipos audiovisuales',
    service_id: 4,
    icon: '⚙️'
  },
  {
    id: 17,
    name: 'Soporte en Vivo',
    description: 'Asistencia técnica durante eventos',
    service_id: 4,
    icon: '🔧'
  },
  {
    id: 18,
    name: 'Capacitación Técnica',
    description: 'Entrenamiento en uso de equipos',
    service_id: 4,
    icon: '🎓'
  },
  {
    id: 19,
    name: 'Consultoría Audiovisual',
    description: 'Asesoría en proyectos audiovisuales',
    service_id: 4,
    icon: '💼'
  },

  // Transmisión y Streaming (service_id: 5)
  {
    id: 20,
    name: 'Streaming en Vivo',
    description: 'Transmisión en tiempo real a plataformas digitales',
    service_id: 5,
    icon: '📡'
  },
  {
    id: 21,
    name: 'Conferencias Virtuales',
    description: 'Setup para videoconferencias y webinars',
    service_id: 5,
    icon: '💻'
  },
  {
    id: 22,
    name: 'Streaming Multi-plataforma',
    description: 'Transmisión simultánea a múltiples plataformas',
    service_id: 5,
    icon: '📺'
  },
  {
    id: 23,
    name: 'Grabación de Streams',
    description: 'Captura y archivo de transmisiones en vivo',
    service_id: 5,
    icon: '💾'
  }
];

// Datos estructurados por categoría (más fácil para la IA)
export const SERVICES_STRUCTURED: ServicesStructured = {
  '1': {
    service: SERVICES[0], // Producción Audiovisual
    subServices: SUB_SERVICES.filter(sub => sub.service_id === 1)
  },
  '2': {
    service: SERVICES[1], // Postproducción
    subServices: SUB_SERVICES.filter(sub => sub.service_id === 2)
  },
  '3': {
    service: SERVICES[2], // Contenido Digital
    subServices: SUB_SERVICES.filter(sub => sub.service_id === 3)
  },
  '4': {
    service: SERVICES[3], // Apoyo Técnico
    subServices: SUB_SERVICES.filter(sub => sub.service_id === 4)
  },
  '5': {
    service: SERVICES[4], // Transmisión y Streaming
    subServices: SUB_SERVICES.filter(sub => sub.service_id === 5)
  }
};

// Funciones de utilidad
export const getServiceById = (id: number): Service | undefined => {
  return SERVICES.find(service => service.id === id);
};

export const getSubServiceById = (id: number): SubService | undefined => {
  return SUB_SERVICES.find(subService => subService.id === id);
};

export const getSubServicesByService = (serviceId: number): SubService[] => {
  return SUB_SERVICES.filter(sub => sub.service_id === serviceId);
};

export const getServiceOptions = () => {
  return SERVICES.map(service => ({
    value: service.id,
    label: service.name,
    description: service.description,
    icon: service.icon_name
  }));
};

export const getSubServiceOptions = (serviceId?: number) => {
  const subServices = serviceId 
    ? SUB_SERVICES.filter(sub => sub.service_id === serviceId)
    : SUB_SERVICES;
    
  return subServices.map(subService => {
    const service = getServiceById(subService.service_id);
    return {
      value: subService.id,
      label: subService.name,
      description: subService.description,
      icon: subService.icon,
      category: service?.name || 'N/A',
      service_id: subService.service_id
    };
  });
};

// Para que la IA identifique servicios por palabras clave
export const SERVICE_KEYWORDS = {
  video: [1], // Grabación de Video
  audio: [2], // Grabación de Audio  
  fotografía: [3], // Fotografía de Eventos
  fotos: [3],
  edición: [6], // Edición de Video
  streaming: [20, 21, 22], // Servicios de streaming
  transmisión: [20, 21, 22],
  diseño: [11], // Diseño Gráfico
  redes: [12], // Contenido para Redes Sociales
  apoyo: [16, 17], // Apoyo técnico
  configuración: [16],
  multicámara: [4], // Grabación Multi-cámara
  iluminación: [5], // Iluminación Profesional
  subtítulos: [9], // Subtitulado
  animación: [10, 15], // Motion Graphics y Animación 2D
  capacitación: [18], // Capacitación Técnica
  consultoría: [19] // Consultoría Audiovisual
};

export const detectServicesFromText = (text: string): number[] => {
  const lowerText = text.toLowerCase();
  const detectedServices: Set<number> = new Set();
  
  Object.entries(SERVICE_KEYWORDS).forEach(([keyword, serviceIds]) => {
    if (lowerText.includes(keyword)) {
      serviceIds.forEach(id => detectedServices.add(id));
    }
  });
  
  return Array.from(detectedServices);
};