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

// Tipos para el análisis de datos
export interface ExtractedFormData {
  activityType?: 'single' | 'recurrent' | 'podcast' | 'course';
  activityName?: string;
  faculty?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  locationType?: 'university' | 'external' | 'virtual';
  location?: string;
  description?: string;
  services?: string[];
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  recurrencePattern?: string;
  moderators?: string[];
  guests?: string[];
  courses?: string[];
  professors?: string[];
  confidence?: number;
}

class GroqService {
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

  constructor() {
    // Prompt inicial del sistema con contexto de MediaLab
    this.conversationHistory.push({
      role: 'system',
      content: `Eres el asistente virtual de MediaLab, una unidad de producción audiovisual universitaria en Guatemala. 

Tu objetivo es recopilar TODA la información OBLIGATORIA para completar una solicitud oficial de servicios. NINGÚN campo puede quedar vacío.

SERVICIOS DISPONIBLES:
- Grabación de video y audio
- Transmisión en vivo (streaming)
- Edición y post-producción
- Diseño gráfico y animación
- Apoyo técnico en eventos
- Creación de contenido digital

TIPOS DE ACTIVIDADES:
1. ACTIVIDAD ÚNICA: Eventos únicos como conferencias, presentaciones, graduaciones
2. ACTIVIDAD RECURRENTE: Series que se repiten (talleres semanales, seminarios mensuales)
3. PODCAST: Producción de episodios con moderadores e invitados
4. CURSOS: Grabación académica de clases por carrera/semestre

FACULTADES DISPONIBLES:
- FISICC (Facultad de Ingeniería en Sistemas, Informática y Ciencias de la Computación)
- FACTI (Facultad de Ciencias y Tecnologías de la Información)
- FACOM (Facultad de Comunicación)

🚨 INFORMACIÓN OBLIGATORIA - DEBES PREGUNTAR POR TODO:

📋 DETALLES DE LA ACTIVIDAD (OBLIGATORIO):
✅ Tipo de actividad (única, recurrente, podcast, cursos)
✅ Nombre completo de la actividad/evento
✅ Facultad o departamento responsable
✅ Fecha(s) específica(s) (día/mes/año)
✅ Hora de inicio y hora de fin
✅ Ubicación exacta:
   - Si es en universidad: Torre y número de salón
   - Si es externa: Dirección completa
   - Si es virtual: Confirmar plataforma
✅ Descripción detallada de la actividad

📝 SERVICIOS ESPECÍFICOS (OBLIGATORIO):
✅ Qué servicios necesita exactamente:
   - ¿Grabación de video? ¿Cuántas cámaras?
   - ¿Transmisión en vivo? ¿Qué plataforma?
   - ¿Grabación de audio? ¿Qué tipo de micrófonos?
   - ¿Edición posterior? ¿Qué tipo?
   - ¿Apoyo técnico? ¿Qué equipos?

👤 DATOS DEL SOLICITANTE (CRÍTICO - SIN EXCEPCIÓN):
✅ Nombre completo del solicitante
✅ Correo electrónico institucional (@universidad.edu)
✅ Número de teléfono de contacto
✅ Departamento/facultad de adscripción
✅ Cargo o posición (profesor, coordinador, estudiante, etc.)

PROCESO OBLIGATORIO PASO A PASO:
1. Saluda y explica tu función
2. Pregunta por el tipo de actividad que necesitan
3. Recopila TODOS los detalles de la actividad (nombre, fecha, hora, lugar, descripción)
4. Pregunta por TODOS los servicios específicos que necesitan
5. **OBLIGATORIO**: Solicita TODOS los datos personales del solicitante
6. Revisa que NO falte NINGÚN dato
7. Confirma toda la información completa
8. Solo entonces ofrece generar el PDF

FRASES OBLIGATORIAS PARA DATOS DEL SOLICITANTE:
- "Para procesar oficialmente tu solicitud, necesito tus datos completos"
- "Es requisito institucional tener todos los datos del solicitante"
- "Por favor, proporciona tu nombre completo, email institucional, teléfono y departamento"
- "Sin estos datos no puedo generar la solicitud oficial"

REGLAS CRÍTICAS - NUNCA VIOLES ESTAS REGLAS:
🚫 NUNCA generes resumen sin TODOS los datos del solicitante
🚫 NUNCA asumas información que no te han dado
🚫 NUNCA permitas campos vacíos o con "No especificado"
🚫 NUNCA finalices sin confirmar que tienes TODO
✅ SIEMPRE insiste amablemente hasta tener información completa
✅ SIEMPRE verifica que el email sea institucional
✅ SIEMPRE confirma fechas y horarios específicos

VERIFICACIÓN FINAL OBLIGATORIA:
Antes de generar PDF, confirma que tienes:
- ✅ Tipo y nombre de actividad
- ✅ Facultad/departamento
- ✅ Fecha(s) y horario(s) exactos
- ✅ Ubicación específica
- ✅ Servicios detallados
- ✅ Nombre completo del solicitante
- ✅ Email institucional
- ✅ Teléfono
- ✅ Departamento del solicitante

Si falta CUALQUIER dato, pregunta específicamente por él.

Sé amigable pero firme. Es mejor una conversación más larga con datos completos que una solicitud incompleta.`
    });
  }

  // Enviar mensaje y obtener respuesta
  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Verificar si tenemos API key antes de intentar
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        throw new Error('API key no configurada');
      }

      // Agregar mensaje del usuario al historial
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Obtener cliente de Groq
      const groq = getGroqClient();

      // Llamar a la API de Groq
      const completion = await groq.chat.completions.create({
        messages: this.conversationHistory,
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      });

      const assistantResponse = completion.choices[0]?.message?.content || 
        'Lo siento, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?';

      // Agregar respuesta del asistente al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;

    } catch (error) {
      console.error('Error detallado en GroqService:', error);
      
      // Manejar errores específicos con más detalle
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

  // Generar resumen final de la solicitud
  async generateSummary(): Promise<string> {
    try {
      // Verificar si tenemos API key
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        return 'Resumen no disponible en modo demo. Configure la API key de Groq para esta funcionalidad.';
      }

      // Obtener cliente de Groq
      const groq = getGroqClient();

      const summaryPrompt = `Genera un resumen profesional y completo de toda la información recopilada en esta conversación para la solicitud de servicios de MediaLab.

El resumen debe incluir:
- Tipo de actividad y nombre
- Detalles de fechas, horarios y ubicación
- Servicios solicitados
- Información del solicitante
- Cualquier detalle adicional relevante

Usa un formato claro y profesional que pueda ser usado como confirmación de la solicitud.`;

      const summaryCompletion = await groq.chat.completions.create({
        messages: [
          ...this.conversationHistory,
          { role: 'user', content: summaryPrompt }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      });

      return summaryCompletion.choices[0]?.message?.content || 
        'No se pudo generar el resumen. Por favor revisa la información proporcionada.';

    } catch (error) {
      console.error('Error generando resumen:', error);
      return 'Error al generar el resumen de la solicitud.';
    }
  }

  // Limpiar el historial de conversación
  clearConversation(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Mantener solo el prompt del sistema
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