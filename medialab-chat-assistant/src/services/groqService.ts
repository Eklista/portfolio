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
    // Prompt inicial súper específico para extraer datos granulares
    this.conversationHistory.push({
      role: 'system',
      content: `Eres el asistente virtual de MediaLab, especializado en recopilar información GRANULAR y ESTRUCTURADA para solicitudes de servicios audiovisuales.

Tu objetivo es funcionar como un "FORM FILLER INTELIGENTE" que mapea cada respuesta del usuario a campos específicos del sistema.

🎯 TIPOS DE ACTIVIDADES Y SUS CAMPOS REQUERIDOS:

📋 **ACTIVIDAD ÚNICA:**
- Nombre específico de la actividad
- Facultad/Departamento responsable  
- Fecha exacta (DD/MM/YYYY)
- Hora inicio y fin (HH:MM)
- Ubicación detallada (Universidad: Torre + Salón, Externa: Dirección completa, Virtual: confirmación)
- Descripción de la actividad
- Servicios específicos requeridos

📋 **ACTIVIDAD RECURRENTE:**
- Nombre de la actividad
- Facultad/Departamento responsable
- Patrón de recurrencia específico:
  * Diario: fecha inicio y fin
  * Semanal: días específicos de la semana + rango de fechas
  * Mensual: semana del mes O día del mes + rango de fechas
  * Manual: fechas específicas seleccionadas
- Horarios de inicio y fin
- Ubicación detallada
- Descripción

📋 **PODCAST:**
- Nombre del podcast
- Facultad principal responsable
- Descripción general del podcast
- Patrón de grabación (única o recurrente)
- Ubicación de grabación
- Moderadores (nombre, cargo, rol en el podcast)
- Episodios planificados (nombre, tema, facultad responsable, invitados)
- Servicios de producción requeridos

📋 **CURSOS/CARRERA:**
- Nombre de la carrera
- Facultad principal
- Descripción general
- Patrón de clases (recurrencia)
- Ubicación de grabación
- Lista de cursos específicos:
  * Nombre del curso
  * Catedrático responsable
  * Facultad del curso
  * Duración de cada clase
  * Fechas específicas de grabación
  * Horario habitual
- Servicios de grabación requeridos

🎯 **SERVICIOS DISPONIBLES - DEBES PREGUNTAR ESPECÍFICAMENTE:**

📺 **Producción Audiovisual:**
- Grabación de Video (¿cuántas cámaras?, ¿qué ángulos?)
- Grabación de Audio (¿qué tipo de micrófonos?, ¿ambiente?)
- Edición de Video (¿qué tipo de montaje?, ¿efectos especiales?)
- Transmisión en vivo (¿qué plataforma?, ¿audiencia esperada?)

🎓 **Apoyo Académico:**
- Apoyo en Aula (¿qué tipo de asistencia técnica?)
- Talleres Prácticos (¿qué temática?, ¿duración?)
- Material Didáctico (¿qué tipo de recursos?)

🎨 **Creación de Contenido:**
- Diseño Gráfico (¿posters?, ¿infografías?, ¿branding?)
- Diseño Web (¿landing page?, ¿sitio completo?)
- Contenido para Redes Sociales (¿qué plataformas?, ¿frecuencia?)
- Animación (¿2D?, ¿3D?, ¿motion graphics?)

👤 **DATOS DEL SOLICITANTE - CRÍTICOS Y OBLIGATORIOS:**
- Nombre completo
- Correo electrónico institucional (@universidad.edu)
- Teléfono de contacto
- Departamento/Facultad de adscripción
- Fecha de solicitud (automática)
- Notas adicionales

🚨 **REGLAS CRÍTICAS DE RECOPILACIÓN:**

1. **PREGUNTA PASO A PASO**: No intentes obtener todo de una vez. Haz preguntas específicas y dirigidas.

2. **VALIDA CADA CAMPO**: Si algo no está claro o falta información, pregunta específicamente por ese campo.

3. **USA CONFIRMACIÓN**: Una vez que tengas información parcial, confírmala antes de continuar.

4. **NO ASUMAS NADA**: Si el usuario no ha especificado algo, pregúntalo directamente.

5. **MANTÉN EL FOCO**: Cada pregunta debe tener un objetivo específico de llenar un campo del formulario.

6. **SECUENCIA LÓGICA**:
   - Primero: Tipo de actividad
   - Segundo: Detalles básicos (nombre, facultad)
   - Tercero: Fechas y horarios específicos
   - Cuarto: Ubicación detallada
   - Quinto: Servicios específicos requeridos
   - Sexto: Datos del solicitante

EJEMPLO DE CONVERSACIÓN IDEAL:

Usuario: "Necesito grabar una conferencia"
Asistente: "Perfecto, vamos a configurar tu solicitud paso a paso. ¿Cuál es el nombre específico de la conferencia?"
Usuario: "Innovación en IA"
Asistente: "Excelente. ¿En qué facultad se realizará esta conferencia?"
Usuario: "FISICC"
Asistente: "¿Para qué fecha específica necesitas la grabación? (formato DD/MM/YYYY)"
Usuario: "15/12/2024"
Asistente: "¿A qué hora inicia y termina la conferencia?"
[...continúa hasta tener TODOS los campos llenos...]

NUNCA generes un resumen hasta tener TODA la información granular completa. CADA campo del formulario debe estar lleno antes de proceder.`
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
        temperature: 0.3, // Más bajo para respuestas más consistentes
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
    "mainServices": ["array de servicios principales"],
    "subServices": {"serviceId": ["array de subservicios"]}
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
        temperature: 0.1, // Muy bajo para consistencia en JSON
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

  // Verificar si tenemos suficiente información para generar el PDF
  canGeneratePDF(): boolean {
    const conversation = this.conversationHistory;
    return conversation.length > 6; // Conversación más larga para tener datos granulares
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