import { useState, useCallback, useRef, useEffect } from 'react';
import { groqService } from '../services/groqService';
import GroqService from '../services/groqService';
import { pdfGenerator } from '../services/pdfGenerator';

// Tipos para los mensajes
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  error?: boolean;
}

// Estados del chat
export type ChatStatus = 'idle' | 'typing' | 'generating' | 'error' | 'completed';

// Hook personalizado para el chat
export const useChat = () => {
  // Estados principales
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `¡Hola! 👋 Soy el asistente virtual de **MediaLab**. 

Estoy aquí para ayudarte a solicitar nuestros servicios recopilando únicamente la **información administrativa básica**. Los detalles técnicos se coordinarán después en reuniones con nuestro equipo.

**¿Qué tipo de actividad quieres programar?**
- 🎯 **Actividad única** (conferencia, evento especial)
- 🔄 **Actividad recurrente** (series, clases regulares)  
- 🎙️ **Podcast** (grabación de episodios)
- 📚 **Cursos** (grabación académica por carreras)

Solo dime qué tienes en mente y comenzaremos a recopilar los datos necesarios para tu solicitud oficial.`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [chatStatus, setChatStatus] = useState<ChatStatus>('idle');
  const [isGroqConfigured, setIsGroqConfigured] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Referencias para manejo de DOM
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verificar configuración de Groq al montar
  useEffect(() => {
    setIsGroqConfigured(GroqService.isConfigured());
    if (!GroqService.isConfigured()) {
      console.warn('Groq API key no configurada. El chat funcionará en modo demo.');
    }
  }, []);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock response mejorado para ser más específico y evitar detalles técnicos
  const getMockResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    // Detectar fechas vagas y corregir
    if (lower.includes('viernes que viene') || lower.includes('mañana') || lower.includes('próxima semana') || lower.includes('siguiente')) {
      return `Necesito una fecha más específica. 📅\n\n**¿Puedes confirmar la fecha exacta en formato DD/MM/YYYY?**\n\nPor ejemplo:\n- 13/12/2024\n- 20/12/2024\n\nEsto es importante para generar la solicitud oficial correctamente.`;
    }
    
    if (lower.includes('conferencia') || lower.includes('evento') || lower.includes('única')) {
      return `Perfecto, una **actividad única**. 🎯\n\n**Información administrativa que necesito:**\n\n1. **Nombre específico** del evento\n2. **Facultad** responsable (FISICC, FACTI, FACOM)  \n3. **Fecha exacta** (DD/MM/YYYY)\n4. **Horarios** (inicio y fin)\n5. **Ubicación** (torre + salón)\n6. **Servicios generales** (grabación, fotografía, transmisión)\n\n¿Empezamos con el nombre específico del evento?\n\n*Nota: Los detalles técnicos se coordinarán en reuniones posteriores.*`;
    }
    
    if (lower.includes('podcast') || lower.includes('episodio')) {
      return `¡Excelente! Un **podcast**. 🎙️\n\n**Datos administrativos que recopilaré:**\n\n1. **Nombre del podcast**\n2. **Facultad principal** responsable\n3. **Fechas de grabación** planificadas\n4. **Moderadores** principales\n5. **Ubicación** del estudio\n6. **Tus datos** de contacto\n\n¿Cuál será el nombre oficial de tu podcast?\n\n*Los aspectos técnicos de producción se definirán con el equipo.*`;
    }
    
    if (lower.includes('curso') || lower.includes('clase') || lower.includes('carrera')) {
      return `Perfecto, **grabación de cursos**. 📚\n\n**Información administrativa necesaria:**\n\n1. **Nombre de la carrera**\n2. **Facultad principal** responsable\n3. **Lista de cursos** a grabar\n4. **Catedráticos** responsables\n5. **Fechas y horarios** generales\n6. **Ubicación** de clases\n\n¿De qué carrera específica se trata?\n\n*La configuración técnica se coordinará posteriormente.*`;
    }
    
    if (lower.includes('recurrente') || lower.includes('serie') || lower.includes('regular')) {
      return `Entendido, una **actividad recurrente**. 🔄\n\n**Datos que necesito recopilar:**\n\n1. **Nombre de la actividad**\n2. **Patrón de repetición** (semanal, mensual, etc.)\n3. **Periodo** (fecha inicio y fin)\n4. **Horarios fijos**\n5. **Ubicación constante**\n\n¿Cuál es el nombre de esta actividad que se repetirá?\n\n*Los detalles de producción se ajustarán según cada sesión.*`;
    }
    
    // Manejo de nombres
    if (lower.includes('nombre') && (lower.includes('soy') || lower.includes('me llamo'))) {
      const nameMatch = userMessage.match(/(?:soy|me llamo)\s+([^,.\n]+)/i);
      if (nameMatch) {
        return `¡Mucho gusto, ${nameMatch[1]}! 👋 \n\n**Ahora necesito tus datos de contacto:**\n\n¿Cuál es tu correo electrónico institucional? (debe terminar en @universidad.edu o @galileo.edu)\n\nTambién necesitaré tu teléfono y departamento de adscripción.`;
      }
    }
    
    // Manejo de emails
    if (lower.includes('@') && (lower.includes('email') || lower.includes('correo') || lower.includes('universidad') || lower.includes('galileo'))) {
      return `Excelente, ya tengo tu email registrado. ✅\n\n**¿Cuál es tu número de teléfono de contacto o extensión?**\n\nDespués confirmaré:\n- ¿A qué departamento/facultad perteneces?\n- ¿Cuál es tu cargo? (profesor, coordinador, estudiante, etc.)`;
    }
    
    // Cuando mencionan servicios técnicos específicos
    if (lower.includes('cámara') || lower.includes('micrófono') || lower.includes('ángulo') || lower.includes('encuadre')) {
      return `Los detalles técnicos específicos se coordinarán con nuestro equipo en reuniones posteriores. 🔧\n\n**Para la solicitud oficial, solo necesito:**\n- Servicios generales (grabación, fotografía, transmisión)\n- No especificaciones técnicas\n\n¿Necesitas grabación de video y audio para tu evento?`;
    }
    
    return `Entiendo. Para crear tu solicitud oficial necesito **solo datos administrativos**:\n\n**📋 Información básica:**\n• Nombre exacto del evento\n• Fecha específica (DD/MM/YYYY)\n• Horarios y ubicación\n• Servicios generales necesarios\n• Tus datos de contacto completos\n\n**⚙️ Nota importante:**\nLos detalles técnicos (tipo de cámaras, encuadres, configuraciones) se definen en reuniones posteriores con nuestro equipo técnico.\n\n¿Qué información administrativa te gustaría proporcionar primero?`;
  };

  // Enviar mensaje
  const sendMessage = useCallback(async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || chatStatus === 'typing') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatStatus('typing');

    // Mensaje de "escribiendo..."
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      let response: string;

      if (isGroqConfigured) {
        // Usar Groq real con prompts simplificados
        response = await groqService.sendMessage(content);
      } else {
        // Usar mock response mejorado
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        response = getMockResponse(content);
      }
      
      // Remover mensaje de typing y agregar respuesta real
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            content: response,
            sender: 'assistant',
            timestamp: new Date()
          }
        ];
      });

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      
      // Remover typing y mostrar error
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => !msg.isTyping);
        return [
          ...withoutTyping,
          {
            id: Date.now().toString(),
            content: 'Lo siento, hubo un problema técnico. ¿Puedes intentar de nuevo? Si el problema persiste, verifica tu conexión a internet.',
            sender: 'assistant',
            timestamp: new Date(),
            error: true
          }
        ];
      });
      setChatStatus('error');
      return;
    }

    setChatStatus('idle');
  }, [inputValue, chatStatus, isGroqConfigured]);

  // Generar resumen final con datos estructurados
  const generateSummary = useCallback(async (): Promise<string> => {
    if (!isGroqConfigured) {
      return 'Resumen no disponible en modo demo. Configure la API key de Groq para esta funcionalidad.';
    }

    try {
      setChatStatus('generating');
      
      // Intentar extraer datos estructurados primero
      const structuredData = await groqService.extractStructuredData();
      
      if (structuredData) {
        console.log('📊 Datos estructurados extraídos:', structuredData);
        
        // Generar resumen basado en datos estructurados
        const summary = await groqService.generateSummary();
        setChatStatus('completed');
        return summary;
      } else {
        // Fallback al método anterior si no hay datos estructurados
        const summary = await groqService.generateSummary();
        setChatStatus('completed');
        return summary;
      }
      
    } catch (error) {
      console.error('Error generando resumen:', error);
      setChatStatus('error');
      return 'Error al generar el resumen de la solicitud. Por favor intenta de nuevo.';
    }
  }, [isGroqConfigured]);

  // Generar y descargar PDF con feedback específico mejorado
  const generatePDF = useCallback(async () => {
    if (!pdfGenerator.canGeneratePDF()) {
      console.log('❌ No hay suficiente conversación para generar PDF');
      
      // Mensaje más específico al usuario
      setMessages(prev => [...prev, {
        id: `pdf-help-${Date.now()}`,
        content: `ℹ️ **Para generar un PDF necesito más información administrativa**\n\nAsegúrate de proporcionar:\n\n• **Tipo de actividad** (conferencia, podcast, etc.)\n• **Nombre específico** del evento\n• **Fecha exacta** (DD/MM/YYYY)\n• **Horarios** (inicio y fin)\n• **Ubicación detallada** (torre + salón)\n• **Servicios generales** necesarios\n• **Tus datos completos** (nombre, email, teléfono)\n\n¿Qué información te gustaría completar primero?\n\n*Recuerda: Solo datos administrativos, los técnicos se definen después.*`,
        sender: 'assistant',
        timestamp: new Date()
      }]);
      return;
    }

    setIsGeneratingPDF(true);
    setChatStatus('generating');
    
    try {
      console.log('🔄 Generando PDF de solicitud...');
      
      // Mostrar progreso
      setMessages(prev => [...prev, {
        id: `pdf-progress-${Date.now()}`,
        content: '🔄 **Generando tu PDF profesional...**\n\nAnalizando y estructurando la información administrativa...',
        sender: 'assistant',
        timestamp: new Date()
      }]);
      
      // Intentar generar PDF y obtener mensaje específico
      const resultMessage = await pdfGenerator.generateAndDownloadPDF();
      
      // Mostrar resultado (éxito o error específico)
      setMessages(prev => [...prev, {
        id: `pdf-result-${Date.now()}`,
        content: resultMessage,
        sender: 'assistant',
        timestamp: new Date(),
        error: resultMessage.includes('❌')
      }]);
      
      if (!resultMessage.includes('❌')) {
        console.log('✅ PDF generado exitosamente');
        setChatStatus('completed');
      } else {
        setChatStatus('error');
      }
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      
      // Error técnico inesperado
      setMessages(prev => [...prev, {
        id: `pdf-error-${Date.now()}`,
        content: `❌ **Error técnico inesperado**\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nPor favor intenta nuevamente o contacta soporte si el problema persiste.`,
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      }]);
      
      setChatStatus('error');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, []);

  // Limpiar conversación
  const clearConversation = useCallback(() => {
    setMessages([messages[0]]); // Mantener solo el mensaje inicial
    setChatStatus('idle');
    setInputValue('');
    
    if (isGroqConfigured) {
      groqService.clearConversation();
    }
  }, [isGroqConfigured, messages]);

  // Funciones de utilidad para el input
  const setInput = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Quick actions mejoradas enfocadas en datos administrativos
  const quickActions = [
    {
      id: 'conference',
      label: 'Conferencia única',
      message: 'Necesito programar una conferencia para una fecha específica'
    },
    {
      id: 'podcast',
      label: 'Nuevo podcast',
      message: 'Quiero crear un podcast con episodios regulares'
    },
    {
      id: 'course-recording',
      label: 'Grabación de cursos',
      message: 'Necesito grabar clases de una carrera universitaria'
    },
    {
      id: 'weekly-series',
      label: 'Serie semanal',
      message: 'Tengo una actividad que se repite cada semana'
    },
    {
      id: 'general-services',
      label: 'Servicios generales',
      message: 'Necesito grabación y fotografía para un evento'
    },
    {
      id: 'help-info',
      label: '¿Qué datos necesitas?',
      message: '¿Qué información administrativa específica necesitas para mi solicitud?'
    }
  ];

  const executeQuickAction = useCallback((actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      sendMessage(action.message);
    }
  }, [sendMessage]);

  // Función para obtener vista previa de datos estructurados
  const getDataPreview = useCallback(async () => {
    if (!isGroqConfigured) {
      return null;
    }
    
    try {
      return await groqService.extractStructuredData();
    } catch (error) {
      console.error('Error obteniendo vista previa:', error);
      return null;
    }
  }, [isGroqConfigured]);

  return {
    // Estados
    messages,
    inputValue,
    chatStatus,
    isGroqConfigured,
    messagesEndRef,
    
    // Acciones principales
    sendMessage,
    setInput,
    clearConversation,
    generateSummary,
    executeQuickAction,
    generatePDF,
    getDataPreview,
    
    // Utilidades
    quickActions,
    
    // Estados derivados
    isLoading: chatStatus === 'typing',
    isGenerating: chatStatus === 'generating',
    canSend: inputValue.trim().length > 0 && chatStatus === 'idle',
    canGeneratePDF: pdfGenerator.canGeneratePDF() && messages.length > 6,
    isGeneratingPDF
  };
};