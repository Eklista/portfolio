// src/services/groqChatAI.js
import { projectTypes, calculateTotalPrice, formatPrice } from '../data/pricing.js';
import { explorerStructure, projectsData } from '../data/projects.js';

class EklistaChatAI {
  constructor() {
    this.isInitialized = false;
    this.groq = null;
    this.initializeGroq();
  }

  async initializeGroq() {
    try {
      // Importación dinámica para evitar errores de SSR
      const { Groq } = await import('groq-sdk');
      this.groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true // Para uso en frontend
      });
      this.isInitialized = true;
      console.log('✅ Groq inicializado correctamente');
    } catch (error) {
      console.warn('⚠️ Groq no disponible, usando respuestas predefinidas');
      this.isInitialized = false;
    }
  }

  buildSystemPrompt() {
    const portfolioSummary = {
      servicios: projectTypes.map(pt => ({
        nombre: pt.name,
        descripcion: pt.description,
        precio_base: formatPrice(pt.basePrice)
      })),
      proyectos_destacados: [
        'Banking Web App - FinTech Guatemala (2024)',
        'E-commerce Platform - Fashion Forward (2024)', 
        'Restaurant Digital Experience - Sabor Auténtico (2023)'
      ],
      habilidades: ['React', 'Next.js', 'WordPress', 'Figma', 'UX/UI Design'],
      ubicacion: 'Guatemala City, Guatemala',
      experiencia: '5+ años, 50+ proyectos completados'
    };

    return `Eres Pablo (EKLISTA), un diseñador web y desarrollador guatemalteco. Actúas como un consultor amigable que ayuda a los clientes a entender sus necesidades y encontrar la mejor solución.

INFORMACIÓN SOBRE TI:
${JSON.stringify(portfolioSummary, null, 2)}

PERSONALIDAD:
- Conversacional y consultivo, no robótico
- Haces preguntas para entender mejor las necesidades del cliente
- Educas al cliente sobre las opciones disponibles
- Guatemalteco profesional pero cercano
- Usas ejemplos específicos de tus proyectos cuando es relevante

FILOSOFÍA DE CONVERSACIÓN:
1. ESCUCHA primero - haz preguntas para entender qué necesita el cliente
2. EDUCA - explica las opciones y diferencias entre servicios
3. RECOMIENDA - sugiere la mejor solución basada en sus necesidades
4. GUÍA - lleva al cliente paso a paso hacia la decisión correcta

REGLAS DE CONVERSACIÓN:
- NO menciones el cotizador inmediatamente - primero entiende qué necesita
- HAZ preguntas de seguimiento para clarificar necesidades
- USA ejemplos de tus proyectos cuando sea relevante al caso del cliente
- MENCIONA precios solo cuando el cliente los pregunte directamente
- MANTÉN la conversación fluida y natural
- TERMINA con preguntas que hagan avanzar la conversación

EJEMPLOS DE FLOW CONVERSACIONAL:

Cliente: "Necesito una página web"
TÚ: "¡Perfecto! Me encanta ayudar con proyectos web. Para poder recomendarte la mejor solución, cuéntame un poco más: ¿es para tu negocio personal, una empresa, o qué tipo de proyecto tienes en mente?"

Cliente: "¿Cuánto cuesta?"
TÚ: "Los precios varían bastante según lo que necesites. Por ejemplo, un sitio básico de WordPress puede empezar desde Q1,200, pero una aplicación web custom puede ser Q4,000+. ¿Qué tipo de funcionalidades tienes en mente? ¿Es más informativo, necesitas ventas online, o algo más específico?"

NUNCA respondas como FAQ - siempre mantén el tono conversacional y haz seguimiento.`;
  }

  // Respuestas rápidas para consultas comunes
  getQuickResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Saludos - más conversacional
    if (msg.includes('hola') || msg.includes('hello') || msg.includes('hi') || msg === 'hey') {
      return {
        isQuick: true,
        response: `¡Hola! 👋 Soy Pablo, pero puedes decirme EKLISTA.

Me dedico al diseño web y desarrollo aquí en Guatemala. Me encanta ayudar a empresarios y emprendedores a crear sus proyectos digitales.

¿En qué estás trabajando? ¿Tienes algún proyecto en mente o hay algo específico que te gustaría saber sobre lo que hago?`
      };
    }

    // Solo dar respuestas rápidas muy específicas, el resto que vaya a AI
    return null; // Dejar que AI maneje casi todo
  }

  // Clasificar el tipo de consulta para mejor contexto
  classifyIntent(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuanto')) {
      return 'pricing';
    }
    if (msg.includes('servicio') || msg.includes('qué haces')) {
      return 'services';
    }
    if (msg.includes('portfolio') || msg.includes('trabajo') || msg.includes('proyecto')) {
      return 'portfolio';
    }
    if (msg.includes('contacto') || msg.includes('email') || msg.includes('whatsapp')) {
      return 'contact';
    }
    if (msg.includes('cotiz') || msg.includes('presupuesto')) {
      return 'quote';
    }
    
    return 'general';
  }

  // Respuesta principal con Groq
  async respond(userMessage) {
    try {
      // 1. Verificar respuestas rápidas primero
      const quickResponse = this.getQuickResponse(userMessage);
      if (quickResponse?.isQuick) {
        return {
          content: quickResponse.response,
          source: 'quick',
          success: true
        };
      }

      // 2. Si Groq no está disponible, usar respuestas predefinidas mejoradas
      if (!this.isInitialized || !this.groq) {
        return {
          content: this.getFallbackResponse(userMessage),
          source: 'fallback',
          success: true
        };
      }

      // 3. Usar Groq para respuestas más complejas
      const intent = this.classifyIntent(userMessage);
      const systemPrompt = this.buildSystemPrompt();
      
      // Añadir contexto específico según el intent
      const contextualPrompt = this.addContextForIntent(intent, systemPrompt);

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: contextualPrompt },
          { role: "user", content: userMessage }
        ],
        model: "llama3-70b-8192", // Modelo más potente
        temperature: 0.7, // Balance entre creatividad y consistencia
        max_tokens: 400,
        top_p: 0.9
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from Groq');
      }

      return {
        content: response,
        source: 'groq',
        success: true
      };

    } catch (error) {
      console.error('Error en Groq Chat AI:', error);
      
      return {
        content: this.getFallbackResponse(userMessage),
        source: 'fallback',
        success: false,
        error: error.message
      };
    }
  }

  addContextForIntent(intent, basePrompt) {
    const contextAdditions = {
      pricing: `\n\nCONTEXTO: El usuario pregunta sobre precios. IMPORTANTE: NO menciones el cotizador inmediatamente. Primero pregunta qué tipo de proyecto tienen en mente, qué funcionalidades necesitan, o para qué negocio es. Da rangos de precios y explica por qué varían. Solo menciona el cotizador si insisten en un precio exacto.`,
      
      services: `\n\nCONTEXTO: El usuario quiere conocer servicios. Pregunta específicamente qué tipo de proyecto tienen en mente o qué problema quieren resolver. No hagas una lista de servicios - conversa sobre qué necesita.`,
      
      portfolio: `\n\nCONTEXTO: El usuario está interesado en trabajos anteriores. Pregunta qué tipo de proyectos les interesan más para poder mostrarles ejemplos relevantes.`,
      
      contact: `\n\nCONTEXTO: El usuario quiere información de contacto. Además de dar la info, pregunta si tienen algún proyecto específico en mente para poder ayudarles mejor.`,
      
      quote: `\n\nCONTEXTO: El usuario quiere cotización. ANTES de mencionar el cotizador, pregunta sobre su proyecto: ¿qué tipo de negocio?, ¿qué funcionalidades?, ¿tienen deadline?, etc. Solo después de 2-3 intercambios sugiere el cotizador.`,
      
      general: '\n\nCONTEXTO: Conversación general. Sé consultivo y haz preguntas para entender mejor qué necesita el cliente.'
    };

    return basePrompt + (contextAdditions[intent] || contextAdditions.general);
  }

  // Respuesta de respaldo cuando Groq no está disponible
  getFallbackResponse(message) {
    const intent = this.classifyIntent(message);
    
    const fallbackResponses = {
      pricing: `Mis precios son muy competitivos para Guatemala:

💰 **Diseño Gráfico**: ${formatPrice(500)} - ${formatPrice(1500)}
💰 **Sitios WordPress**: ${formatPrice(1200)} - ${formatPrice(4000)}  
💰 **UX/UI Design**: ${formatPrice(800)} - ${formatPrice(2500)}
💰 **Desarrollo Custom**: ${formatPrice(4000)}+

Los precios varían según la complejidad del proyecto. ¿Quieres una **cotización personalizada y exacta**?`,

      services: `¡Perfecto! Te cuento sobre mis servicios principales:

🎨 **Diseño Gráfico & Branding** - Desde ${formatPrice(500)}
• Logos e identidad visual
• Papelería corporativa  
• Packaging y material promocional

💻 **Desarrollo Web** - Desde ${formatPrice(1200)}
• Sitios WordPress personalizados
• Aplicaciones React/Next.js
• E-commerce y tiendas online

🎯 **UX/UI Design** - Desde ${formatPrice(800)}
• Investigación de usuarios
• Prototipos interactivos
• Interfaces web y móvil

¿Te interesa algún servicio en particular?`,

      portfolio: `¡Excelente pregunta! 🚀 Tengo más de 50 proyectos completados.

**Algunos destacados:**
• Banking App UI/UX - Interfaz moderna para fintech
• E-commerce Platform - Tienda completa con +250% en ventas
• Restaurant Website - Sistema de reservas que aumentó bookings +400%

Para ver **todos los detalles, mockups y casos de estudio**, explora las carpetas del escritorio haciendo doble clic. Están organizadas por categoría.

¿Hay algún tipo de proyecto que te llame más la atención?`,

      contact: `¡Perfecto! Aquí tienes toda mi información:

📧 **Email**: hello@eklista.com
📱 **WhatsApp**: +502 1234-5678
💼 **LinkedIn**: /in/eklista
🐙 **GitHub**: @eklista
📍 **Ubicación**: Guatemala City, GT

Prefiero **WhatsApp** para una respuesta más rápida. ¿Cuál es la mejor forma de contactarte?`,

      quote: `¡Excelente! Te voy a explicar sobre el cotizador personalizado:

✨ **¿Qué incluye?**
• Selección de tipo de proyecto
• Características personalizables  
• Servicios adicionales opcionales
• Cotización instantánea y detallada

El cotizador te tomará solo **2 minutos** y tendrás un precio exacto al final.

¿Estás listo para empezar? Puedo abrirte el cotizador ahora mismo.`,

      general: `Gracias por contactarme. Soy Pablo, también conocido como **EKLISTA**.

Soy diseñador gráfico y desarrollador web con **5+ años de experiencia** creando soluciones digitales para empresas en Guatemala y el extranjero.

**¿En qué puedo ayudarte hoy?**
• Ver mis servicios y precios
• Explorar mi portfolio de proyectos
• Obtener una cotización personalizada
• Información de contacto

¿Hay algo específico que te interese?`
    };

    return fallbackResponses[intent] || fallbackResponses.general;
  }

  // Método para verificar si el servicio está disponible
  isAvailable() {
    return this.isInitialized && this.groq !== null;
  }

  // Método para obtener estadísticas (opcional)
  getStats() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!import.meta.env.VITE_GROQ_API_KEY,
      quickResponsesCount: 8 // Número de respuestas rápidas definidas
    };
  }
}

// Singleton para usar en toda la aplicación
const chatAI = new EklistaChatAI();

export default chatAI;