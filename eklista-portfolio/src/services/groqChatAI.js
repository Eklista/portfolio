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

    return `Eres el asistente virtual de EKLISTA, un diseñador web y desarrollador guatemalteco especializado en crear experiencias digitales únicas.

INFORMACIÓN DEL PORTFOLIO:
${JSON.stringify(portfolioSummary, null, 2)}

PERSONALIDAD Y TONO:
- Profesional pero cercano y amigable
- Entusiasta por la tecnología y el diseño
- Responde en español guatemalteco
- Usa emojis ocasionalmente para ser más expresivo
- Enfócate en generar interés genuino en los servicios

REGLAS IMPORTANTES:
1. SIEMPRE menciona precios base cuando pregunten sobre costos
2. Para cotizaciones exactas, SIEMPRE invita a usar el cotizador personalizado
3. Si preguntan por proyectos específicos, menciona casos de éxito relevantes
4. No inventes información - si no sabes algo, di que pueden contactar directamente
5. Mantén respuestas concisas pero informativas (máximo 3-4 párrafos)
6. Siempre termina con una pregunta o call-to-action

EJEMPLOS DE RESPUESTAS ESPERADAS:
- Pregunta sobre precios → Mencionar rango + invitar al cotizador
- Pregunta sobre servicios → Explicar brevemente + mencionar tecnologías
- Pregunta sobre experiencia → Mencionar proyectos + años de experiencia
- Pregunta general → Respuesta útil + redireccionar a servicios relevantes`;
  }

  // Respuestas rápidas para consultas comunes
  getQuickResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Saludos
    if (msg.includes('hola') || msg.includes('hello') || msg.includes('hi') || msg === 'hey') {
      return {
        isQuick: true,
        response: `¡Hola! 👋 Soy tu asistente virtual de EKLISTA.

Estoy aquí para ayudarte con:
• Información sobre mis servicios de diseño y desarrollo
• Precios y cotizaciones personalizadas  
• Ver mi portfolio de trabajos
• Resolver cualquier duda sobre tu próximo proyecto

¿En qué puedo ayudarte hoy?`
      };
    }

    // Precios específicos
    if (msg.includes('precio') && msg.includes('wordpress')) {
      return {
        isQuick: true,
        response: `Los sitios WordPress empiezan desde **${formatPrice(1200)}** e incluyen:

✅ Diseño responsive y personalizado
✅ Optimización SEO básica  
✅ Panel de administración fácil de usar
✅ Instalación y configuración completa

El precio final depende de las funcionalidades específicas que necesites (tienda online, formularios avanzados, integraciones, etc.).

¿Te gustaría usar nuestro **cotizador personalizado** para obtener un presupuesto exacto en 2 minutos?`
      };
    }

    if (msg.includes('precio') && (msg.includes('ux') || msg.includes('ui') || msg.includes('diseño'))) {
      return {
        isQuick: true,
        response: `Los proyectos de UX/UI Design empiezan desde **${formatPrice(800)}** e incluyen:

🎨 Investigación de usuarios
🎯 Wireframes y prototipos
✨ Diseño de interfaz moderna
📱 Versión móvil optimizada

Para proyectos más complejos (design systems, testing de usabilidad) el precio puede aumentar según el alcance.

¿Quieres que calculemos el costo exacto de tu proyecto con nuestro cotizador?`
      };
    }

    // Servicios generales
    if (msg.includes('servicio') || msg.includes('qué haces') || msg.includes('que ofreces')) {
      return {
        isQuick: true,
        response: `Ofrezco tres servicios principales:

💻 **Desarrollo Web** (desde ${formatPrice(1200)})
• Sitios WordPress personalizados
• Aplicaciones React/Next.js
• E-commerce y tiendas online

🎨 **UX/UI Design** (desde ${formatPrice(800)})  
• Investigación de usuarios
• Prototipos interactivos
• Interfaces web y móvil

🎯 **Diseño Gráfico** (desde ${formatPrice(500)})
• Logos e identidad visual
• Branding completo
• Material publicitario

¿Te interesa algún servicio en particular?`
      };
    }

    // Portfolio/proyectos
    if (msg.includes('portfolio') || msg.includes('trabajo') || msg.includes('proyecto')) {
      return {
        isQuick: true,
        response: `¡Me encanta mostrar mi trabajo! 🚀 Algunos proyectos destacados:

🏦 **Banking Web App** - Aplicación financiera completa para FinTech guatemalteca
🛒 **E-commerce Platform** - Tienda online que aumentó ventas en +250%  
🍽️ **Restaurant Website** - Sitio con reservas que incrementó bookings en +400%

Para ver todos los detalles, mockups y casos de estudio, **haz doble clic en las carpetas del escritorio**. Ahí encontrarás mi portfolio completo organizado por categorías.

¿Hay algún tipo de proyecto específico que te interese?`
      };
    }

    // Contacto
    if (msg.includes('contacto') || msg.includes('email') || msg.includes('whatsapp') || msg.includes('teléfono')) {
      return {
        isQuick: true,
        response: `¡Perfecto! Aquí tienes toda mi información de contacto:

📧 **Email**: hello@eklista.com  
📱 **WhatsApp**: +502 1234-5678  
💼 **LinkedIn**: /in/eklista  
📍 **Ubicación**: Guatemala City, GT

**Prefiero WhatsApp** para una respuesta más rápida, pero cualquier canal funciona perfecto.

¿Tienes algún proyecto en mente que quieras discutir?`
      };
    }

    // Cotización
    if (msg.includes('cotiz') || msg.includes('presupuesto') || msg.includes('quote')) {
      return {
        isQuick: true,
        response: `¡Excelente! 🎯 Tengo un **cotizador personalizado** que te dará un precio exacto en solo 2 minutos.

**¿Qué incluye el cotizador?**
✅ Selección de tipo de proyecto  
✅ Características personalizables
✅ Servicios adicionales opcionales
✅ Precio final instant

Solo necesitas responder unas preguntas sobre tu proyecto y tendrás una cotización detallada.

¿Estás listo para empezar? Puedo abrirte el cotizador ahora mismo.`
      };
    }

    return null; // No hay respuesta rápida disponible
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
      pricing: `\nCONTEXTO ADICIONAL: El usuario está preguntando sobre precios. Siempre menciona los precios base y sugiere el cotizador personalizado para precios exactos.`,
      
      services: `\nCONTEXTO ADICIONAL: El usuario quiere conocer los servicios. Explica brevemente cada servicio y menciona las tecnologías clave que usas.`,
      
      portfolio: `\nCONTEXTO ADICIONAL: El usuario está interesado en ver trabajos. Menciona proyectos específicos y sugiere explorar las carpetas del escritorio.`,
      
      contact: `\nCONTEXTO ADICIONAL: El usuario quiere información de contacto. Proporciona todos los medios y menciona preferencia por WhatsApp.`,
      
      quote: `\nCONTEXTO ADICIONAL: El usuario quiere una cotización. Explica el cotizador personalizado y ofrece abrirlo.`,
      
      general: ''
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