// src/services/groqChatAI.js - ARREGLADO: Memoria persistente + Contexto claro
import { projectTypes, calculateTotalPrice, formatPrice } from '../data/pricing.js';
import { explorerStructure, projectsData } from '../data/projects.js';

class EklistaChatAI {
  constructor() {
    this.isInitialized = false;
    this.groq = null;
    this.conversationHistory = []; // ✅ NUEVA: Historial completo de conversación
    this.sessionState = {
      userName: null,
      hasAskedName: false,
      conversationStage: 'greeting',
      briefData: {
        projectType: null,
        businessType: null,
        features: [],
        budget: null,
        timeline: null,
        needsHelp: false
      },
      messageCount: 0,
      lastResponse: null // Para evitar repeticiones
    };
    this.initializeGroq();
  }

  async initializeGroq() {
    try {
      const { Groq } = await import('groq-sdk');
      this.groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });
      this.isInitialized = true;
      console.log('✅ Groq inicializado correctamente');
    } catch (error) {
      console.warn('⚠️ Groq no disponible, usando respuestas predefinidas');
      this.isInitialized = false;
    }
  }

  // ✅ NUEVO: Agregar mensaje al historial
  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date(),
      stage: this.sessionState.conversationStage
    });
    
    // Mantener solo últimos 10 mensajes para no exceder límites
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  // ✅ NUEVO: Obtener contexto de conversación
  getConversationContext() {
    if (this.conversationHistory.length === 0) return '';
    
    let context = '\n\nHISTORIAL DE CONVERSACIÓN:\n';
    this.conversationHistory.slice(-6).forEach(msg => {
      context += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
    
    return context;
  }

  // Detectar nombre (mejorado)
  extractNameFromMessage(message) {
    const msg = message.trim();
    
    const namePatterns = [
      /mi nombre es ([a-záéíóúñ\s]+)/i,
      /me llamo ([a-záéíóúñ\s]+)/i,
      /soy ([a-záéíóúñ\s]+)/i,
      /^([a-záéíóúñ]+)$/i,
    ];

    for (const pattern of namePatterns) {
      const match = msg.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (name.length > 1 && !['hola', 'hello', 'hi', 'buenas', 'que tal', 'precio', 'servicio'].includes(name.toLowerCase())) {
          return name.split(' ')[0];
        }
      }
    }
    return null;
  }

  // Detectar intención de pricing
  detectsPricingIntent(message) {
    const pricingKeywords = [
      'precio', 'costo', 'cuanto', 'cotiz', 'presupuesto', 
      'tarifa', 'valor', 'cuesta', 'cobras', 'factur'
    ];
    
    return pricingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  // Detectar tipo de proyecto
  detectProjectType(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('logo') || msg.includes('identidad') || msg.includes('marca') || msg.includes('branding')) {
      return 'graphic-design';
    }
    if (msg.includes('pagina') || msg.includes('sitio') || msg.includes('web') || msg.includes('wordpress')) {
      return 'wordpress';
    }
    if (msg.includes('app') || msg.includes('aplicacion') || msg.includes('sistema') || msg.includes('custom')) {
      return 'custom-development';
    }
    if (msg.includes('diseño') || msg.includes('interfaz') || msg.includes('ux') || msg.includes('ui')) {
      return 'ux-ui';
    }
    
    return null;
  }

  // ✅ NUEVO: Sistema prompt MUCHO más claro y con memoria
  buildSystemPrompt() {
    const { userName, conversationStage, briefData } = this.sessionState;
    
    // ✅ INFORMACIÓN CORREGIDA DE PRECIOS
    const servicesInfo = `
SERVICIOS Y PRECIOS (EN QUETZALES GUATEMALTECOS):
• Diseño Gráfico/Branding: Desde ${formatPrice(500)} 
• Sitios WordPress: Desde ${formatPrice(1200)}
• UX/UI Design: Desde ${formatPrice(800)}  
• Desarrollo Custom: Desde ${formatPrice(4000)}

EJEMPLOS DE PROYECTOS COMPLETADOS:
• Banking Web App para FinTech (2024)
• E-commerce Platform para Fashion Forward (2024)
• Restaurant Website para Sabor Auténtico (2023)`;

    let systemPrompt = `Eres Pablo de EKLISTA, diseñador web guatemalteco profesional pero amigable.

${servicesInfo}

DATOS DE SESIÓN ACTUAL:
- Cliente: ${userName || 'Sin identificar'}
- Etapa: ${conversationStage}
- Proyecto detectado: ${briefData.projectType || 'No definido'}
- Tipo de negocio: ${briefData.businessType || 'No definido'}
- Características: ${briefData.features.join(', ') || 'Ninguna'}

CONTEXTO HISTÓRICO:${this.getConversationContext()}

INSTRUCCIONES ESPECÍFICAS PARA ESTA ETAPA:`;

    // ✅ PROMPTS ESPECÍFICOS SIN REPETIR SALUDOS
    if (conversationStage === 'greeting' && !userName) {
      systemPrompt += `
ETAPA: SALUDO INICIAL
- Pregunta amablemente el nombre del usuario
- NO digas "hola de nuevo" o "por acá de nuevo"
- Sé directo: "¿Cómo te llamas?"`;
      
    } else if (conversationStage === 'helping') {
      systemPrompt += `
ETAPA: AYUDA GENERAL  
- El usuario es ${userName}
- Responde preguntas sobre servicios, portfolio, precios
- SI mencionan precios/cotización, pasa a hacer preguntas sobre su proyecto
- NO repitas saludos, ya se presentaron
- Usa el nombre solo ocasionalmente, no en cada mensaje`;
      
    } else if (conversationStage === 'briefing') {
      systemPrompt += `
ETAPA: RECOLECTANDO INFORMACIÓN DEL PROYECTO
- Ya sabes que es ${userName}
- Haz 1-2 preguntas específicas sobre su proyecto
- NO repitas información que ya tienes
- Enfócate en completar el brief`;
      
    } else if (conversationStage === 'pricing') {
      const estimate = this.calculateBriefEstimate(briefData);
      systemPrompt += `
ETAPA: COTIZACIÓN
- Da precio estimado basado en la información recolectada
- Estimación sugerida: ${estimate ? `${formatPrice(estimate.min)} - ${formatPrice(estimate.max)}` : 'Por definir'}
- Ofrece continuar con cotizador detallado`;
    }

    systemPrompt += `

REGLAS IMPORTANTES:
1. NO repitas saludos o presentaciones
2. NO digas "hola de nuevo" o similares  
3. USA el nombre del cliente solo cuando sea natural
4. CUANDO MENCIONES PRECIOS, siempre usa formato de quetzales (Q1,200 NO "1200 proyectos")
5. SÉ CONVERSACIONAL pero conciso
6. RECUERDA el contexto de mensajes anteriores
7. NO hagas las mismas preguntas dos veces`;

    return systemPrompt;
  }

  // Calcular estimación de precio
  calculateBriefEstimate(briefData) {
    const baseProject = projectTypes.find(pt => pt.id === briefData.projectType);
    if (!baseProject) return null;

    let estimatedPrice = baseProject.basePrice;
    
    if (briefData.features.includes('e-commerce') || briefData.features.includes('tienda')) {
      estimatedPrice += 800;
    }
    if (briefData.features.includes('reservas') || briefData.features.includes('booking')) {
      estimatedPrice += 400;
    }
    if (briefData.features.includes('multiidioma')) {
      estimatedPrice += 600;
    }
    
    const range = {
      min: Math.round(estimatedPrice * 0.8),
      max: Math.round(estimatedPrice * 1.3)
    };
    
    return range;
  }

  // ✅ MÉTODO PRINCIPAL MEJORADO CON MEMORIA
  async respond(userMessage) {
    try {
      this.sessionState.messageCount++;
      
      // ✅ AGREGAR MENSAJE DEL USUARIO AL HISTORIAL
      if (userMessage !== 'inicio') {
        this.addToHistory('user', userMessage);
      }
      
      // 1. ETAPA GREETING - Capturar nombre
      if (this.sessionState.conversationStage === 'greeting') {
        if (!this.sessionState.hasAskedName && userMessage === 'inicio') {
          this.sessionState.hasAskedName = true;
          const response = `¡Hola! 👋 Soy Pablo de EKLISTA.

¿Cómo te llamas? Me gusta conocer a las personas con las que trabajo 😊`;
          
          this.addToHistory('assistant', response);
          return {
            content: response,
            source: 'greeting',
            success: true
          };
        } else {
          // Intentar extraer nombre
          const extractedName = this.extractNameFromMessage(userMessage);
          if (extractedName) {
            this.sessionState.userName = extractedName;
            this.sessionState.conversationStage = 'helping';
            
            const response = `¡Perfecto, ${extractedName}! 🚀 Encantado de conocerte.

¿En qué puedo ayudarte hoy?

🎨 **Servicios** - Desarrollo web, UX/UI, diseño gráfico
📁 **Portfolio** - Ver mis trabajos anteriores  
💰 **Precios** - Información de costos
💬 **Pregunta libre** - Lo que tengas en mente`;

            this.addToHistory('assistant', response);
            return {
              content: response,
              source: 'name-captured',
              success: true
            };
          } else {
            const response = `No pude captar tu nombre bien 😅 ¿Podrías decírmelo de nuevo?

Por ejemplo: "Me llamo María" o simplemente "Carlos"`;

            this.addToHistory('assistant', response);
            return {
              content: response,
              source: 'name-retry',
              success: true
            };
          }
        }
      }

      // 2. DETECTAR CAMBIO A ETAPA DE PRICING
      if (this.detectsPricingIntent(userMessage) && this.sessionState.conversationStage === 'helping') {
        this.sessionState.conversationStage = 'briefing';
        
        const projectType = this.detectProjectType(userMessage);
        if (projectType) {
          this.sessionState.briefData.projectType = projectType;
        }
      }

      // 3. USAR GROQ O FALLBACK
      if (!this.isInitialized || !this.groq) {
        const response = this.getFallbackResponse(userMessage);
        this.addToHistory('assistant', response);
        return {
          content: response,
          source: 'fallback',
          success: true
        };
      }

      // 4. ✅ RESPUESTA CON GROQ + HISTORIAL COMPLETO
      const systemPrompt = this.buildSystemPrompt();
      
      // ✅ CREAR MENSAJES CON HISTORIAL COMPLETO
      const messages = [
        { role: "system", content: systemPrompt }
      ];
      
      // Agregar historial reciente (últimos 8 mensajes)
      const recentHistory = this.conversationHistory.slice(-8);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
      
      // Si no hay historial, agregar mensaje actual
      if (recentHistory.length === 0 && userMessage !== 'inicio') {
        messages.push({ role: "user", content: userMessage });
      }

      const completion = await this.groq.chat.completions.create({
        messages,
        model: "llama3-70b-8192",
        temperature: 0.6, // ✅ Bajado para más consistencia
        max_tokens: 300, // ✅ Reducido para respuestas más concisas
        top_p: 0.8
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from Groq');
      }

      // 5. ✅ AGREGAR RESPUESTA AL HISTORIAL Y ACTUALIZAR ESTADO
      this.addToHistory('assistant', response);
      this.updateSessionState(userMessage, response);
      this.sessionState.lastResponse = response;

      return {
        content: response,
        source: 'groq',
        success: true,
        sessionState: this.sessionState
      };

    } catch (error) {
      console.error('Error en Groq Chat AI:', error);
      
      const response = this.getFallbackResponse(userMessage);
      this.addToHistory('assistant', response);
      
      return {
        content: response,
        source: 'fallback',
        success: false,
        error: error.message
      };
    }
  }

  // Actualizar estado de sesión
  updateSessionState(userMessage, aiResponse) {
    const features = [];
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('reservas') || msg.includes('booking')) features.push('reservas');
    if (msg.includes('tienda') || msg.includes('e-commerce') || msg.includes('venta')) features.push('e-commerce');
    if (msg.includes('multiidioma') || msg.includes('idiomas')) features.push('multiidioma');
    if (msg.includes('blog')) features.push('blog');
    
    this.sessionState.briefData.features = [...new Set([...this.sessionState.briefData.features, ...features])];
    
    if (msg.includes('restaurante') || msg.includes('comida')) {
      this.sessionState.briefData.businessType = 'restaurante';
    } else if (msg.includes('tienda') || msg.includes('venta')) {
      this.sessionState.briefData.businessType = 'comercio';
    } else if (msg.includes('empresa') || msg.includes('corporativ')) {
      this.sessionState.briefData.businessType = 'corporativo';
    }
  }

  // ✅ RESPUESTAS DE FALLBACK MEJORADAS (SIN REPETICIONES)
  getFallbackResponse(userMessage) {
    const { userName, conversationStage } = this.sessionState;
    const namePrefix = userName && conversationStage !== 'greeting' ? `${userName}, ` : '';
    
    if (conversationStage === 'briefing' || this.detectsPricingIntent(userMessage)) {
      return `${namePrefix}para darte un precio preciso, necesito saber:

¿Qué tipo de proyecto tienes en mente?
• **Sitio web** (WordPress) - Desde ${formatPrice(1200)}
• **Diseño gráfico** (logo, branding) - Desde ${formatPrice(500)}
• **UX/UI** (interfaz) - Desde ${formatPrice(800)}
• **Desarrollo custom** (aplicación) - Desde ${formatPrice(4000)}

¿Para qué tipo de negocio es?`;
    }

    if (conversationStage === 'helping') {
      return `${namePrefix}te ayudo con:

🎨 **Diseño Gráfico** - Desde ${formatPrice(500)}
💻 **Desarrollo Web** - Desde ${formatPrice(1200)}  
🎯 **UX/UI Design** - Desde ${formatPrice(800)}
⚡ **Desarrollo Custom** - Desde ${formatPrice(4000)}

¿Cuál te interesa para tu proyecto?`;
    }

    return `¡Hola! Soy Pablo de EKLISTA, diseñador y desarrollador web en Guatemala.

¿En qué puedo ayudarte hoy?`;
  }

  // ✅ MÉTODOS DE UTILIDAD MEJORADOS
  isAvailable() {
    return this.isInitialized && this.groq !== null;
  }

  getSessionState() {
    return this.sessionState;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  resetSession() {
    this.conversationHistory = [];
    this.sessionState = {
      userName: null,
      hasAskedName: false,
      conversationStage: 'greeting',
      briefData: {
        projectType: null,
        businessType: null,
        features: [],
        budget: null,
        timeline: null,
        needsHelp: false
      },
      messageCount: 0,
      lastResponse: null
    };
  }

  getStats() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!import.meta.env.VITE_GROQ_API_KEY,
      sessionState: this.sessionState,
      conversationLength: this.conversationHistory.length,
      currentStage: this.sessionState.conversationStage
    };
  }
}

// Singleton
const chatAI = new EklistaChatAI();

export default chatAI;