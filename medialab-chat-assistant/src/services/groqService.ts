import Groq from 'groq-sdk';

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

// Interfaces para datos estructurados que mapean exactamente al formulario original
export interface ActivityLocation {
  type: 'university' | 'external' | 'virtual';
  tower?: string;
  classroom?: string;
  externalAddress?: string;
}

export interface RecurrencePattern {
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
}

export interface ServiceSelection {
  mainServices: string[];
  subServices: { [mainServiceId: string]: string[] };
}

export interface RequesterData {
  name: string;
  email: string;
  phone?: string;
  department: string;
  requestDate: string;
  additionalNotes?: string;
}

// Interfaces específicas por tipo de actividad
export interface SingleActivityData {
  type: 'single';
  activityName: string;
  faculty: string;
  date: string;
  startTime: string;
  endTime: string;
  location: ActivityLocation;
  description?: string;
  services: ServiceSelection;
  requester: RequesterData;
}

export interface RecurrentActivityData {
  type: 'recurrent';
  activityName: string;
  faculty: string;
  recurrence: RecurrencePattern;
  location: ActivityLocation;
  description?: string;
  services: ServiceSelection;
  requester: RequesterData;
}

export interface PodcastData {
  type: 'podcast';
  podcastName: string;
  faculty: string;
  description?: string;
  recurrence: RecurrencePattern;
  location: ActivityLocation;
  moderators: Array<{
    name: string;
    position: string;
    role: string;
  }>;
  episodes: Array<{
    name: string;
    topic: string;
    faculty: string;
    description?: string;
    guests?: string[];
  }>;
  services: ServiceSelection;
  requester: RequesterData;
}

export interface CourseData {
  type: 'course';
  careerName: string;
  faculty: string;
  description?: string;
  recurrence: RecurrencePattern;
  location: ActivityLocation;
  courses: Array<{
    name: string;
    professor: string;
    faculty: string;
    duration: string;
    description?: string;
    recordingDates?: string[];
    recordingTime?: string;
  }>;
  services: ServiceSelection;
  requester: RequesterData;
}

export type ExtractedActivityData = SingleActivityData | RecurrentActivityData | PodcastData | CourseData;

class GroqService {
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  constructor() {
    // Prompt simplificado que se enfoca solo en datos administrativos
    this.conversationHistory.push({
      role: 'system',
      content: `Eres el asistente virtual de MediaLab para recopilar SOLO información administrativa básica.

🎯 TU OBJETIVO: Recopilar únicamente los datos necesarios para generar una solicitud oficial. Los detalles técnicos se definen después en reuniones con el equipo.

📋 DATOS ADMINISTRATIVOS OBLIGATORIOS:

**PARA TODAS LAS ACTIVIDADES:**
✅ Tipo de actividad (única, recurrente, podcast, cursos)
✅ Nombre específico de la actividad/evento
✅ Facultad o departamento responsable (FISICC, FACTI, FACOM)
✅ Fecha(s) específica(s) en formato DD/MM/YYYY
✅ Horarios de inicio y fin (formato HH:MM)
✅ Ubicación básica:
   - Universidad: Torre + Número de salón
   - Externa: Dirección completa  
   - Virtual: Confirmación
✅ Descripción breve de la actividad
✅ Servicios generales solicitados (grabación, transmisión, fotografía, etc.)

**DATOS DEL SOLICITANTE (OBLIGATORIO):**
✅ Nombre completo
✅ Correo electrónico institucional (@universidad.edu o @galileo.edu)
✅ Teléfono de contacto o extensión
✅ Departamento/facultad de adscripción

🚫 NO PREGUNTES DETALLES TÉCNICOS:
❌ Tipo específico de cámaras o ángulos
❌ Tipo específico de fotos o encuadres  
❌ Configuraciones técnicas de audio/video
❌ Detalles de postproducción
❌ Especificaciones de equipos

✅ EN SU LUGAR DI:
"Los detalles técnicos se coordinarán con el equipo en una reunión posterior"
"Nuestros profesionales se encargarán de los aspectos técnicos"
"El equipo técnico determinará la mejor configuración"

🔄 FLUJO SIMPLIFICADO:
1. Identificar tipo de actividad
2. Nombre específico
3. Facultad responsable  
4. Fecha exacta (DD/MM/YYYY) - NO aceptes "viernes que viene"
5. Horarios específicos (HH:MM)
6. Ubicación (torre + salón O dirección completa)
7. Descripción breve
8. Servicios generales (grabación, transmisión, fotografía)
9. Datos completos del solicitante

🔴 REGLAS CRÍTICAS:
- NUNCA aceptes fechas vagas como "mañana", "viernes que viene", "la próxima semana"
- SIEMPRE insiste en fechas específicas en formato DD/MM/YYYY
- SIEMPRE confirma el año para evitar confusiones
- NO preguntes por detalles técnicos que se definen en reuniones posteriores

EJEMPLO CORRECTO:
Usuario: "necesito grabar una conferencia el viernes que viene"
Asistente: "Perfecto. Necesito la fecha exacta en formato DD/MM/YYYY. ¿Puedes confirmar el día, mes y año específico? Por ejemplo: 13/12/2024"

Una vez que tengas TODOS los datos administrativos obligatorios, confirma todo antes de finalizar.`
    });
  }

  // Enviar mensaje y obtener respuesta
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

      const completion = await groq.chat.completions.create({
        messages: this.conversationHistory,
        model: 'llama3-70b-8192',
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 0.8,
        stream: false
      });

      const assistantResponse = completion.choices[0]?.message?.content || 
        'Lo siento, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;

    } catch (error) {
      console.error('Error detallado en GroqService:', error);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        
        if (error.message.includes('API key') || error.message.includes('401')) {
          return 'Error: No se pudo autenticar con el servicio de IA. Verifica tu API key en el archivo .env.local';
        }
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          return 'El servicio está temporalmente ocupado. Por favor intenta en unos segundos.';
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
          return 'Error de conexión. Verifica tu conexión a internet y vuelve a intentar.';
        }
        
        return `Error técnico: ${error.message}. Revisa la consola del navegador para más detalles.`;
      }
      
      return 'Lo siento, hubo un problema técnico inesperado. ¿Puedes intentar reformular tu mensaje?';
    }
  }

  // Extraer datos estructurados de la conversación
  async extractStructuredData(): Promise<ExtractedActivityData | null> {
    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        console.warn('API key no configurada para extracción de datos');
        return null;
      }

      const groq = getGroqClient();

      const extractionPrompt = `Analiza TODA la conversación y extrae la información en formato JSON estructurado.

IMPORTANTE: Solo responde con JSON válido, sin texto adicional.

Determina el tipo de actividad y usa la estructura correspondiente:

Para ACTIVIDAD ÚNICA:
{
  "type": "single",
  "activityName": "nombre específico",
  "faculty": "facultad responsable",
  "date": "DD/MM/YYYY",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "location": {
    "type": "university|external|virtual",
    "tower": "torre (si aplica)",
    "classroom": "salón (si aplica)",
    "externalAddress": "dirección (si aplica)"
  },
  "description": "descripción detallada",
  "services": {
    "mainServices": ["audiovisual"],
    "subServices": {"audiovisual": ["video", "audio", "photography"]}
  },
  "requester": {
    "name": "nombre completo",
    "email": "email@universidad.edu",
    "phone": "teléfono",
    "department": "departamento",
    "requestDate": "DD/MM/YYYY",
    "additionalNotes": "notas adicionales"
  }
}

Para ACTIVIDAD RECURRENTE:
{
  "type": "recurrent",
  "activityName": "nombre específico",
  "faculty": "facultad responsable",
  "recurrence": {
    "isRecurrent": true,
    "type": "daily|weekly|monthly|manual",
    "startDate": "DD/MM/YYYY",
    "endDate": "DD/MM/YYYY",
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "weekDays": ["monday", "tuesday", etc],
    "weekOfMonth": "first|second|third|fourth|last",
    "dayOfMonth": "1-31",
    "selectedDates": ["DD/MM/YYYY", "DD/MM/YYYY"]
  },
  "location": { /* misma estructura */ },
  "description": "descripción",
  "services": { /* misma estructura */ },
  "requester": { /* misma estructura */ }
}

Para PODCAST:
{
  "type": "podcast",
  "podcastName": "nombre del podcast",
  "faculty": "facultad principal",
  "description": "descripción general",
  "recurrence": { /* estructura de recurrencia */ },
  "location": { /* estructura de ubicación */ },
  "moderators": [
    {
      "name": "nombre del moderador",
      "position": "cargo",
      "role": "rol en el podcast"
    }
  ],
  "episodes": [
    {
      "name": "nombre del episodio",
      "topic": "tema principal",
      "faculty": "facultad responsable",
      "description": "descripción del episodio",
      "guests": ["invitado1", "invitado2"]
    }
  ],
  "services": { /* estructura de servicios */ },
  "requester": { /* estructura del solicitante */ }
}

Para CURSOS:
{
  "type": "course",
  "careerName": "nombre de la carrera",
  "faculty": "facultad principal",
  "description": "descripción general",
  "recurrence": { /* estructura de recurrencia */ },
  "location": { /* estructura de ubicación */ },
  "courses": [
    {
      "name": "nombre del curso",
      "professor": "nombre del catedrático",
      "faculty": "facultad del curso",
      "duration": "duración de cada clase",
      "description": "descripción del curso",
      "recordingDates": ["DD/MM/YYYY", "DD/MM/YYYY"],
      "recordingTime": "HH:MM"
    }
  ],
  "services": { /* estructura de servicios */ },
  "requester": { /* estructura del solicitante */ }
}

Si algún campo no está disponible en la conversación, usa "No especificado" para strings, null para dates, o arrays vacíos según corresponda.

RESPONDE SOLO CON EL JSON, SIN TEXTO ADICIONAL.`;

      const completion = await groq.chat.completions.create({
        messages: [
          ...this.conversationHistory,
          { role: 'user', content: extractionPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.1,
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

  // Generar resumen final estructurado
  async generateSummary(): Promise<string> {
    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        return 'Resumen no disponible en modo demo. Configure la API key de Groq para esta funcionalidad.';
      }

      // Primero extraemos los datos estructurados
      const structuredData = await this.extractStructuredData();
      
      if (!structuredData) {
        return 'No se pudo generar un resumen estructurado. Asegúrate de proporcionar toda la información solicitada.';
      }

      const groq = getGroqClient();

      const summaryPrompt = `Genera un resumen profesional y legible basado en estos datos estructurados:

${JSON.stringify(structuredData, null, 2)}

El resumen debe:
1. Ser claro y profesional
2. Incluir todos los detalles importantes
3. Estar organizado por secciones lógicas
4. Ser fácil de leer para validación del usuario

Formato de respuesta en texto plano, bien estructurado con secciones claramente definidas.`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Eres un asistente especializado en crear resúmenes profesionales claros y organizados.' },
          { role: 'user', content: summaryPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false
      });

      return completion.choices[0]?.message?.content || 
        'No se pudo generar el resumen de la solicitud.';

    } catch (error) {
      console.error('Error generando resumen:', error);
      return 'Error al generar el resumen de la solicitud.';
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
    console.log('Groq API configurada:', isConfigured ? 'Sí' : 'No');
    if (!isConfigured) {
      console.log('Para usar IA real, configura VITE_GROQ_API_KEY en tu archivo .env.local');
    }
    return isConfigured;
  }
}

// Exportar una instancia singleton
export const groqService = new GroqService();
export default GroqService;