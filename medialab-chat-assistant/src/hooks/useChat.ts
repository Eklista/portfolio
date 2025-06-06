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

Estoy aquí para ayudarte a solicitar nuestros servicios de manera súper fácil. Solo platícame qué necesitas y yo me encargaré de todo el papeleo.

**¿Qué tipo de actividad quieres programar?**
- 🎯 Actividad única (conferencia, evento especial)
- 🔄 Actividad recurrente (series, clases regulares)  
- 🎙️ Podcast (grabación de episodios)
- 📚 Cursos (grabación académica por semestres)

¡Solo dime qué tienes en mente!`,
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

  // Fallback mock response cuando Groq no está configurado
  const getMockResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('conferencia') || lower.includes('evento') || lower.includes('única')) {
      return `Perfecto, una **actividad única**. 🎯

¿Me puedes contar más detalles?
- ¿Cuál es el nombre del evento?
- ¿En qué facultad se realizará? (FISICC, FACTI, o FACOM)
- ¿Qué fecha tienes en mente?
- ¿Necesitas grabación, transmisión en vivo, o ambos?`;
    }
    
    if (lower.includes('podcast') || lower.includes('episodio')) {
      return `¡Excelente! Un **podcast**. 🎙️

Para organizar todo necesito saber:
- ¿Cuál será el nombre del podcast?
- ¿Quiénes serán los moderadores?
- ¿Con qué frecuencia planeas grabar? (semanal, mensual, etc.)
- ¿Ya tienes invitados confirmados?`;
    }
    
    if (lower.includes('curso') || lower.includes('clase') || lower.includes('carrera')) {
      return `Perfecto, **grabación de cursos**. 📚

Me ayudas con estos datos:
- ¿De qué carrera se trata?
- ¿Cuáles son los cursos que necesitas grabar?
- ¿Quiénes son los catedráticos?
- ¿En qué horarios suelen impartirse?`;
    }
    
    if (lower.includes('recurrente') || lower.includes('serie') || lower.includes('regular')) {
      return `Entendido, una **actividad recurrente**. 🔄

Para programar la serie necesito:
- ¿Cada cuánto se repetirá? (diario, semanal, mensual)
- ¿Cuándo inicia y cuándo termina?
- ¿Qué días de la semana?
- ¿Siempre en el mismo lugar?`;
    }
    
    if (lower.includes('nombre') && (lower.includes('soy') || lower.includes('me llamo'))) {
      const nameMatch = userMessage.match(/(?:soy|me llamo)\s+([^,.\n]+)/i);
      if (nameMatch) {
        return `¡Mucho gusto, ${nameMatch[1]}! 👋 

Ya tengo tu nombre registrado. ¿Me puedes compartir también tu correo electrónico para enviar la confirmación?`;
      }
    }
    
    return `Entiendo. 🤔

¿Podrías ser un poco más específico? Por ejemplo:
- ¿Es para una fecha específica o será recurrente?
- ¿Qué tipo de producción necesitas? (video, audio, streaming)
- ¿En qué facultad o departamento se realizará?

¡Entre más detalles me des, mejor podré ayudarte!`;
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
        // Usar Groq real
        response = await groqService.sendMessage(content);
      } else {
        // Usar mock response
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
            content: 'Lo siento, hubo un problema técnico. ¿Puedes intentar de nuevo?',
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

  // Generar resumen final
  const generateSummary = useCallback(async (): Promise<string> => {
    if (!isGroqConfigured) {
      return 'Resumen no disponible en modo demo. Configure la API key de Groq para esta funcionalidad.';
    }

    try {
      setChatStatus('generating');
      const summary = await groqService.generateSummary();
      setChatStatus('completed');
      return summary;
    } catch (error) {
      console.error('Error generando resumen:', error);
      setChatStatus('error');
      return 'Error al generar el resumen de la solicitud.';
    }
  }, [isGroqConfigured]);

  // Generar y descargar PDF
  const generatePDF = useCallback(async () => {
    if (!pdfGenerator.canGeneratePDF()) {
      console.log('❌ No hay suficiente conversación para generar PDF');
      return;
    }

    setIsGeneratingPDF(true);
    setChatStatus('generating');
    
    try {
      console.log('🔄 Generando PDF de solicitud...');
      await pdfGenerator.generateAndDownloadPDF();
      console.log('✅ PDF generado exitosamente');
      setChatStatus('completed');
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
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

  // Quick actions predefinidas
  const quickActions = [
    {
      id: 'conference',
      label: 'Conferencia',
      message: 'Necesito grabar una conferencia'
    },
    {
      id: 'podcast',
      label: 'Podcast',
      message: 'Quiero crear un podcast'
    },
    {
      id: 'course',
      label: 'Cursos',
      message: 'Necesito grabar clases de una carrera'
    },
    {
      id: 'recurrent',
      label: 'Actividad Recurrente',
      message: 'Tengo una actividad que se repite periódicamente'
    }
  ];

  const executeQuickAction = useCallback((actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      sendMessage(action.message);
    }
  }, [sendMessage]);

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
    
    // Utilidades
    quickActions,
    
    // Estados derivados
    isLoading: chatStatus === 'typing',
    isGenerating: chatStatus === 'generating',
    canSend: inputValue.trim().length > 0 && chatStatus === 'idle',
    canGeneratePDF: pdfGenerator.canGeneratePDF() && messages.length > 4,
    isGeneratingPDF
  };
};