import Groq from 'groq-sdk';
import { 
  DEPARTMENTS, 
  SERVICES, 
  SUB_SERVICES, 
  getPopularClassrooms,
  getMediaLabSpaces,
  detectServicesFromText,
  searchClassrooms,
  EXTERNAL_LOCATIONS
} from '../data';

// Función para verificar y obtener la API key
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY no está configurada');
  }
  return apiKey;
};

// Inicializar cliente de Groq de forma lazy
let groqClient: Groq | null = null;

const getGroqClient = (): Groq => {
  if (!groqClient) {
    try {
      groqClient = new Groq({
        apiKey: getApiKey(),
        dangerouslyAllowBrowser: true
      });
    } catch (error) {
      console.error('Error inicializando Groq:', error);
      throw error;
    }
  }
  return groqClient;
};

// Interfaces para datos estructurados actualizadas
export interface ActivityLocation {
  type: 'university' | 'external' | 'virtual';
  tower?: string;
  classroom?: string;
  classroom_id?: string;
  externalAddress?: string;
  description?: string;
}

export interface ExtractedServices {
  mainServices: number[];
  subServices: { [serviceId: number]: number[] };
  details?: { [subServiceId: number]: string };
  detected_keywords?: string[];
}

export interface RequesterData {
  name: string;
  email: string;
  phone?: string;
  department_id: number;
  department_name?: string;
  position?: string;
  requestDate: string;
  additionalNotes?: string;
}

// Interfaces específicas por tipo de actividad actualizadas
export interface SingleActivityData {
  type: 'single';
  activityName: string;
  department_id: number;
  department_name?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: ActivityLocation;
  description?: string;
  services: ExtractedServices;
  requester: RequesterData;
}

export interface RecurrentActivityData {
  type: 'recurrent';
  activityName: string;
  department_id: number;
  department_name?: string;
  recurrence: {
    isRecurrent: boolean;
    type?: 'daily' | 'weekly' | 'monthly' | 'manual';
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    weekDays?: string[];
    weekOfMonth?: string;
    dayOfMonth?: string;
    selectedDates?: string[];
  };
  location: ActivityLocation;
  description?: string;
  services: ExtractedServices;
  requester: RequesterData;
}

export interface PodcastData {
  type: 'podcast';
  podcastName: string;
  department_id: number;
  department_name?: string;
  description?: string;
  recurrence: {
    isRecurrent: boolean;
    type?: 'daily' | 'weekly' | 'monthly' | 'manual';
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    weekDays?: string[];
    selectedDates?: string[];
  };
  location: ActivityLocation;
  moderators: Array<{
    name: string;
    position: string;
    role: string;
  }>;
  episodes: Array<{
    title: string;
    topic: string;
    department_id?: number;
    description?: string;
    guests?: string[];
  }>;
  services: ExtractedServices;
  requester: RequesterData;
}

export interface CourseData {
  type: 'course';
  careerName: string;
  department_id: number;
  department_name?: string;
  description?: string;
  recurrence: {
    isRecurrent: boolean;
    type?: 'daily' | 'weekly' | 'monthly' | 'manual';
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    weekDays?: string[];
    selectedDates?: string[];
  };
  location: ActivityLocation;
  courses: Array<{
    name: string;
    professor: string;
    department_id?: number;
    duration: string;
    description?: string;
    recordingDates?: string[];
    recordingTime?: string;
  }>;
  services: ExtractedServices;
  requester: RequesterData;
}

export type ExtractedActivityData = SingleActivityData | RecurrentActivityData | PodcastData | CourseData;

class GroqService {
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  constructor() {
    // Prompt amigable y contextualizado con datos reales
    this.conversationHistory.push({
      role: 'system',
      content: `Eres el asistente virtual amigable de MediaLab en Universidad Galileo. Tu personalidad es helpful, casual pero profesional, y siempre buscas hacer la vida más fácil a los usuarios.

🎯 TU MISIÓN: Ayudar a recopilar datos administrativos para solicitudes de servicios audiovisuales de manera natural y conversacional.

👋 PERSONALIDAD:
- Amigable y casual (usa "Hey", "¡Genial!", "Perfecto")
- Proactivo: sugiere opciones cuando sea útil
- Empático: entiende que la gente está ocupada
- Inteligente: reconoce patrones y ayuda a completar información
- Paciente: no presiona, pero sí guía amablemente

🏛️ CONOCIMIENTO DE LA UNIVERSIDAD:
Conoces perfectamente:
- Facultades: FISICC (Ingeniería), FACTI (TI), FACOM (Comunicaciones), FACIMED (Medicina), FAHUM (Humanidades), FACE (Económicas), FACJUR (Derecho), FAARQ (Arquitectura)
- Ubicaciones populares: Torre 1 Salón 511, Torre 1 Salón 401 (muy solicitados)
- MediaLab: Torre 2 con 2 estudios profesionales y 3 cabinas de audio
- Torres: 1, 2, 3 (cada una con 6 niveles, salones numerados como T1-101, T1-201, etc.)
- Ubicaciones externas: Hoteles como Camino Real, Hilton, Barceló

🎬 SERVICIOS QUE OFRECES:
- Producción Audiovisual: grabación video/audio, fotografía, iluminación
- Transmisión: streaming, conferencias virtuales
- Postproducción: edición, motion graphics, subtítulos
- Contenido Digital: diseño gráfico, redes sociales, animaciones
- Apoyo Técnico: configuración, soporte, capacitación

💬 ESTILO DE CONVERSACIÓN:

BUENO ✅:
"¡Hey! Perfecto, una conferencia. Me gusta la idea 😊

Para que todo salga genial, necesito algunos detalles:
• ¿Cuál es el nombre específico del evento?
• ¿Qué facultad lo organiza? (FISICC, FACOM, etc.)
• ¿Ya tienes fecha en mente? (formato DD/MM/YYYY)

Y si necesitas sugerencias de ubicación, los salones más populares son Torre 1 Salón 511 y 401. ¿Te sirve alguno?"

MALO ❌:
"Requiero los siguientes datos obligatorios:
1. Nombre de actividad
2. Facultad responsable  
3. Fecha específica
Proporcione la información solicitada."

🔍 INTELIGENCIA CONTEXTUAL:
- Si dicen "FISICC", traduce automáticamente a "Facultad de Ingeniería, Sistemas, Informática y Ciencias de la Computación"
- Si mencionan "Torre 1, 511", reconoce que es una ubicación válida y popular
- Si dicen "grabación y fotos", identifica servicios de video y fotografía
- Si usan fechas vagas ("viernes que viene"), amablemente pide fecha específica
- Si el email no es @galileo.edu, sugiere usar el institucional

🚫 NUNCA preguntes detalles técnicos como:
- Tipo de cámaras o ángulos específicos
- Configuraciones de iluminación  
- Especificaciones de audio
- Detalles de postproducción

✅ EN SU LUGAR di cosas como:
"Los aspectos técnicos los coordinaremos con el equipo después"
"Nuestros profesionales se encargan de la parte técnica"
"Nosotros nos ocupamos de todos los detalles técnicos"

🎯 FLUJO NATURAL:
1. Saluda amigablemente e identifica el tipo de actividad
2. Pregunta datos básicos de forma conversacional
3. Sugiere opciones cuando sea útil (ubicaciones populares, facultades)
4. Valida información de forma amigable
5. Confirma todo al final con entusiasmo

🔄 MANEJO DE ERRORES COMÚN:
- Fechas vagas → "Para asegurarme de que todo esté coordinado, ¿podrías darme la fecha exacta? Por ejemplo: 15/12/2024"
- Facultad unclear → "¿Me confirmas qué facultad organiza esto? Puede ser FISICC, FACOM, FACTI..."
- Email no institucional → "Para la solicitud oficial necesito tu email institucional (@galileo.edu)"

Recuerda: Eres útil, amigable y eficiente. Tu objetivo es que la persona se sienta cómoda y que el proceso sea fácil.`
    });
  }

  // Función helper para enriquecer respuestas con datos contextuales
  private enrichResponseWithContext(userMessage: string, baseResponse: string): string {
    let enrichedResponse = baseResponse;

    // Detectar servicios mencionados y ser más específico
    const detectedServices = detectServicesFromText(userMessage);
    if (detectedServices.length > 0) {
      const serviceNames = detectedServices.map(id => {
        const subService = SUB_SERVICES.find(s => s.id === id);
        return subService ? subService.name : 'servicio';
      }).join(', ');
      
      if (!baseResponse.includes('servicio')) {
        enrichedResponse += `\n\n📝 Veo que necesitas: ${serviceNames}. Perfecto, eso lo tenemos cubierto.`;
      }
    }

    // Sugerir ubicaciones populares si no se mencionan
    if (userMessage.toLowerCase().includes('ubicación') || userMessage.toLowerCase().includes('salón') || 
        userMessage.toLowerCase().includes('donde')) {
      if (!baseResponse.includes('Torre') && !baseResponse.includes('salón')) {
        enrichedResponse += `\n\n🏢 Sugerencia: Los salones más populares son Torre 1 Salón 511 y Torre 1 Salón 401. También tenemos estudios en MediaLab (Torre 2) si necesitas algo más especializado.`;
      }
    }

    // Ayudar con facultades si se menciona de forma unclear
    const lowerMessage = userMessage.toLowerCase();
    if ((lowerMessage.includes('ingeniería') || lowerMessage.includes('sistemas')) && !lowerMessage.includes('fisicc')) {
      enrichedResponse += `\n\n💡 Por cierto, para ingeniería y sistemas usamos la abreviación FISICC.`;
    }

    return enrichedResponse;
  }

  // Enviar mensaje con contexto enriquecido
  async sendMessage(userMessage: string): Promise<string> {
    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        throw new Error('API key no configurada');
      }

      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const groq = getGroqClient();

      // Agregar contexto de datos disponibles
      const contextualPrompt = `
      DATOS DISPONIBLES PARA REFERENCIA:
      
      Facultades disponibles:
      ${DEPARTMENTS.map(d => `- ${d.abbreviation}: ${d.name}`).join('\n')}
      
      Ubicaciones populares:
      ${getPopularClassrooms().map(c => `- ${c.name} (${c.tower_id})`).join('\n')}
      
      Estudios MediaLab:
      ${getMediaLabSpaces().map(s => `- ${s.name}`).join('\n')}
      
      Servicios principales:
      ${SERVICES.map(s => `- ${s.name}: ${s.description}`).join('\n')}
      
      Ubicaciones externas comunes:
      ${EXTERNAL_LOCATIONS.slice(0, 5).join(', ')}
      
      Responde de manera amigable, conversacional y útil. Usa estos datos para ser más específico y servicial.
      `;

      const completion = await groq.chat.completions.create({
        messages: [
          ...this.conversationHistory,
          { role: 'system', content: contextualPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7, // Más creativo y natural
        max_tokens: 1024,
        top_p: 0.9,
        stream: false
      });

      let assistantResponse = completion.choices[0]?.message?.content || 
        '¡Ups! Algo no salió bien. ¿Podrías intentar de nuevo? 😅';

      // Enriquecer respuesta con contexto
      assistantResponse = this.enrichResponseWithContext(userMessage, assistantResponse);

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;

    } catch (error) {
      console.error('Error detallado en GroqService:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('401')) {
          return '¡Oops! 🔑 Parece que hay un problema con la configuración. Verifica tu API key de Groq.';
        }
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          return '¡Estamos muy ocupados! 😅 Intenta de nuevo en unos segunditos.';
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
          return '¡Ay! 📡 Problemas de conexión. Revisa tu internet y vuelve a intentar.';
        }
        
        return `¡Rayos! 🔧 Error técnico: ${error.message}. ¿Puedes intentar reformular tu mensaje?`;
      }
      
      return '¡Ups! 🤔 Algo inesperado pasó. ¿Podrías intentar de nuevo con otras palabras?';
    }
  }

  // Extraer datos estructurados con mejor contexto
  async extractStructuredData(): Promise<ExtractedActivityData | null> {
    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        console.warn('API key no configurada para extracción de datos');
        return null;
      }

      const groq = getGroqClient();

      const extractionPrompt = `Analiza TODA la conversación y extrae datos estructurados usando NÚMEROS ID reales de nuestra base de datos.

IMPORTANTE: Solo responde con JSON válido, sin texto adicional.

CONTEXTO DE LA UNIVERSIDAD:
Departamentos (usar department_id):
${DEPARTMENTS.map(d => `${d.id}: ${d.abbreviation} - ${d.name}`).join('\n')}

Servicios (usar service_id y sub_service_id):
${SERVICES.map(s => `${s.id}: ${s.name}`).join('\n')}

Sub-servicios:
${SUB_SERVICES.map(s => `${s.id}: ${s.name} (categoria: ${s.service_id})`).join('\n')}

Torres y salones populares:
${getPopularClassrooms().map(c => `"${c.id}": ${c.name}`).join('\n')}

MediaLab:
${getMediaLabSpaces().map(s => `"${s.id}": ${s.name}`).join('\n')}

FORMATO JSON según tipo:

Para ACTIVIDAD ÚNICA:
{
  "type": "single",
  "activityName": "nombre específico",
  "department_id": [ID_NUMERICO],
  "department_name": "nombre completo de facultad",
  "date": "DD/MM/YYYY",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "location": {
    "type": "university|external|virtual",
    "tower": "Torre X",
    "classroom": "Salón XXX",
    "classroom_id": "TX-XXX",
    "externalAddress": "dirección completa"
  },
  "description": "descripción detallada",
  "services": {
    "mainServices": [1, 2],
    "subServices": {"1": [1, 2, 3], "2": [6, 7]},
    "details": {"1": "detalles específicos si los hay"},
    "detected_keywords": ["palabras que detectaste"]
  },
  "requester": {
    "name": "nombre completo",
    "email": "email@galileo.edu",
    "phone": "teléfono",
    "department_id": [ID_NUMERICO],
    "department_name": "nombre departamento",
    "position": "cargo",
    "requestDate": "DD/MM/YYYY",
    "additionalNotes": "notas"
  }
}

REGLAS IMPORTANTES:
- Usa SIEMPRE IDs numéricos reales de arriba
- Si detectas "FISICC", usa department_id: 1
- Si detectas "Torre 1, Salón 511", usa classroom_id: "T1-511"
- Para servicios, detecta palabras clave y mapea a IDs reales
- Si no hay datos, usa null (NO "No especificado")

RESPONDE SOLO CON EL JSON:`;

      const completion = await groq.chat.completions.create({
        messages: [
          ...this.conversationHistory,
          { role: 'user', content: extractionPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.1, // Más preciso para extracción
        max_tokens: 2048,
        top_p: 0.8,
        stream: false
      });

      const response = completion.choices[0]?.message?.content || '';
      
      try {
        // Limpiar la respuesta para extraer solo el JSON
        const cleanResponse = response.replace(/```json|```/g, '').trim();
        const jsonStart = cleanResponse.indexOf('{');
        const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
        
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const jsonStr = cleanResponse.slice(jsonStart, jsonEnd);
          const extractedData = JSON.parse(jsonStr) as ExtractedActivityData;
          
          // Enriquecer con nombres reales si solo tenemos IDs
          this.enrichExtractedData(extractedData);
          
          console.log('✅ Datos extraídos exitosamente:', extractedData);
          return extractedData;
        } else {
          throw new Error('No se encontró JSON válido en la respuesta');
        }
        
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        console.error('Respuesta original:', response);
        return null;
      }

    } catch (error) {
      console.error('❌ Error extrayendo datos estructurados:', error);
      return null;
    }
  }

  // Enriquecer datos extraídos con nombres reales
  private enrichExtractedData(data: ExtractedActivityData): void {
    // Enriquecer departamento
    if (data.department_id && !data.department_name) {
      const dept = DEPARTMENTS.find(d => d.id === data.department_id);
      if (dept) {
        data.department_name = dept.name;
      }
    }

    // Enriquecer ubicación
    if (data.location?.classroom_id && !data.location.classroom) {
      const classroom = searchClassrooms(data.location.classroom_id)[0];
      if (classroom) {
        data.location.classroom = classroom.name;
        data.location.tower = `Torre ${classroom.tower_id.replace('T', '')}`;
      }
    }

    // Enriquecer requester department
    if (data.requester?.department_id && !data.requester.department_name) {
      const dept = DEPARTMENTS.find(d => d.id === data.requester.department_id);
      if (dept) {
        data.requester.department_name = dept.name;
      }
    }
  }

  // Generar resumen final amigable
  async generateSummary(): Promise<string> {
    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        return '¡Oops! 🔧 El resumen no está disponible en modo demo. Configura la API key de Groq para usar esta funcionalidad.';
      }

      const structuredData = await this.extractStructuredData();
      
      if (!structuredData) {
        return '¡Ups! 📋 No pude generar un resumen todavía. Asegúrate de haber proporcionado toda la información necesaria.';
      }

      const groq = getGroqClient();

      const summaryPrompt = `Genera un resumen amigable y profesional basado en estos datos:

${JSON.stringify(structuredData, null, 2)}

El resumen debe:
- Ser conversacional y amigable (usa "tu actividad", "has solicitado")
- Incluir todos los detalles importantes
- Estar bien organizado pero no robótico
- Usar emojis sutilmente para mejor legibilidad
- Sonar como si un humano amable lo escribiera

Ejemplo de tono:
"¡Perfecto! He recopilado toda la información para tu [tipo de actividad]..."

NO uses formato de lista numerada. Usa párrafos naturales con secciones.`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Eres un asistente amigable que escribe resúmenes conversacionales y profesionales.' },
          { role: 'user', content: summaryPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.4, // Balance entre creatividad y precisión
        max_tokens: 1024,
        top_p: 0.9,
        stream: false
      });

      return completion.choices[0]?.message?.content || 
        '¡Lo siento! 😅 No pude generar el resumen. Pero tranquilo, todos tus datos están guardados correctamente.';

    } catch (error) {
      console.error('Error generando resumen:', error);
      return '¡Rayos! 🔧 Hubo un problemita generando el resumen. Pero no te preocupes, tu información está segura.';
    }
  }

  // Limpiar el historial de conversación
  clearConversation(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1);
  }

  // Obtener el historial completo
  getConversationHistory(): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }

  // Verificar si la API key está configurada
  static isConfigured(): boolean {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const isConfigured = !!apiKey && apiKey.trim() !== '';
    console.log('Groq API configurada:', isConfigured ? 'Sí ✅' : 'No ❌');
    if (!isConfigured) {
      console.log('💡 Para usar IA real, configura VITE_GROQ_API_KEY en tu archivo .env.local');
    }
    return isConfigured;
  }
}

// Exportar una instancia singleton
export const groqService = new GroqService();
export default GroqService;