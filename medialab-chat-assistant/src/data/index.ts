// src/data/index.ts
// Exportaciones centralizadas de todos los datos mock

// Tipos
export * from './types';

// Departamentos y Facultades
export * from './departments';

// Servicios
export * from './services';

// Ubicaciones
export * from './locations';

// Función para buscar en todos los datos
export const searchInAllData = (query: string) => {
  const { 
    DEPARTMENTS, 
    CAREERS
  } = require('./departments');
  
  const { 
    SERVICES, 
    SUB_SERVICES, 
    detectServicesFromText 
  } = require('./services');
  
  const { 
    searchClassrooms,
    EXTERNAL_LOCATIONS 
  } = require('./locations');
  
  const lowerQuery = query.toLowerCase();
  
  return {
    departments: DEPARTMENTS.filter((dept: any) => 
      dept.name.toLowerCase().includes(lowerQuery) || 
      dept.abbreviation.toLowerCase().includes(lowerQuery)
    ),
    careers: CAREERS.filter((career: any) => 
      career.name.toLowerCase().includes(lowerQuery)
    ),
    services: SERVICES.filter((service: any) => 
      service.name.toLowerCase().includes(lowerQuery)
    ),
    subServices: SUB_SERVICES.filter((sub: any) => 
      sub.name.toLowerCase().includes(lowerQuery)
    ),
    classrooms: searchClassrooms(query),
    externalLocations: EXTERNAL_LOCATIONS.filter((loc: string) => 
      loc.toLowerCase().includes(lowerQuery)
    ),
    detectedServices: detectServicesFromText(query)
  };
};

// Datos de validación para la IA
export const VALIDATION_RULES = {
  requiredFields: {
    single: ['activityName', 'department_id', 'date', 'startTime', 'endTime', 'location'],
    recurrent: ['activityName', 'department_id', 'recurrence.startDate', 'recurrence.endDate'],
    podcast: ['podcastName', 'department_id', 'recurrence'],
    course: ['careerName', 'department_id', 'courses']
  },
  requesterFields: ['name', 'email', 'department_id'],
  dateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY'],
  timeFormats: ['HH:MM', 'HH:mm'],
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phonePattern: /^[\+]?[\d\s\-\(\)]{8,}$/
};

// Mensajes de ayuda para la IA
export const HELP_MESSAGES = {
  missingDate: 'Necesito una fecha específica en formato DD/MM/YYYY. Por ejemplo: 15/12/2024',
  missingTime: 'Falta la hora de inicio y/o fin en formato HH:MM. Por ejemplo: 14:00 - 16:00',
  missingLocation: 'Especifica la ubicación: Torre + Salón (ej: Torre 1, Salón 511) o ubicación externa',
  missingDepartment: 'Indica qué facultad es responsable: FISICC, FACTI, FACOM, etc.',
  missingServices: 'Menciona qué servicios necesitas: grabación, fotografía, transmisión, etc.',
  missingRequester: 'Necesito tus datos: nombre completo, email institucional y teléfono',
  invalidEmail: 'El email debe ser institucional (@galileo.edu)',
  vagueDate: 'Fechas como "mañana" o "viernes que viene" no son válidas. Usa formato DD/MM/YYYY'
};

// Configuración para el prompt de la IA
export const AI_PROMPT_CONFIG = {
  focusOnAdministrative: true,
  avoidTechnicalDetails: true,
  requireSpecificDates: true,
  supportedActivityTypes: ['single', 'recurrent', 'podcast', 'course'],
  maxConversationDepth: 15,
  autoSuggestServices: true,
  validateEmailDomains: ['@galileo.edu'],
  prioritizePopularLocations: true
};