// src/services/groqChatAI.js - IA REAL: Sin detectores manuales, pura inteligencia artificial
import { projectTypes, calculateTotalPrice, formatPrice } from '../data/pricing.js';
import { explorerStructure, projectsData } from '../data/projects.js';

class EklistaChatAI {
  constructor() {
    this.isInitialized = false;
    this.groq = null;
    this.conversationHistory = [];
    this.sessionState = {
      userName: null,
      conversationStage: 'greeting', // greeting -> brief -> estimate -> pre_quote_ready -> final
      briefData: {
        summary: '', // ✅ NUEVO: Resumen libre de lo que entendió la IA
        projectType: null, // Solo para calcular precio al final
        estimate: null,
        aiAnalysis: '' // ✅ NUEVO: Análisis detallado para el formulario
      },
      contactMethod: null,
      contactInfo: {},
      questionCount: 0,
      maxQuestions: 3,
      shouldOpenPreQuote: false // ✅ NUEVO: Flag para abrir PreQuoteForm
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
      console.log('✅ Groq IA Real inicializada');
    } catch (error) {
      console.warn('⚠️ Groq no disponible, usando fallback básico');
      this.isInitialized = false;
    }
  }

  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: new Date(),
      stage: this.sessionState.conversationStage
    });
    
    // Mantener historial relevante
    if (this.conversationHistory.length > 12) {
      this.conversationHistory = this.conversationHistory.slice(-12);
    }
  }

  getConversationContext() {
    if (this.conversationHistory.length === 0) return '';
    
    let context = '\n\nCONVERSACIÓN HASTA AHORA:\n';
    this.conversationHistory.forEach(msg => {
      context += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
    
    return context;
  }

  // ✅ SISTEMA DE PROMPTS INTELIGENTE - DEJA QUE LA IA PIENSE
  buildSmartPrompt() {
    const { userName, conversationStage, questionCount, maxQuestions, briefData } = this.sessionState;
    
    let basePrompt = `Eres Pablo, diseñador web guatemalteco de EKLISTA. Eres inteligente, amigable y eficiente.

SERVICIOS QUE OFRECES:
• Diseño Gráfico/Branding: Desde ${formatPrice(500)} (logos, identidad visual)
• Sitios WordPress: Desde ${formatPrice(1200)} (webs profesionales, portfolios)  
• UX/UI Design: Desde ${formatPrice(800)} (interfaces, prototipos)
• Desarrollo Custom: Desde ${formatPrice(4000)} (apps, sistemas complejos)

CONTEXTO DE SESIÓN:
- Cliente: ${userName || 'Sin identificar'}
- Etapa actual: ${conversationStage}
- Preguntas hechas: ${questionCount}/${maxQuestions}
- Resumen del proyecto: ${briefData.summary || 'Aún recopilando información'}

CONVERSACIÓN PREVIA:${this.getConversationContext()}

INSTRUCCIONES ESPECÍFICAS PARA ESTA ETAPA:`;

    switch(conversationStage) {
      case 'greeting':
        basePrompt += `
ETAPA: SALUDO Y PRESENTACIÓN
- Si es el primer mensaje, pregunta el nombre Y pide que cuente sobre su proyecto
- Si te dan nombre + info del proyecto, extrae lo que puedas entender y haz UNA pregunta inteligente
- NO uses frases robóticas o listas de opciones
- Sé conversacional y natural`;
        break;

      case 'brief':
        basePrompt += `
ETAPA: RECOPILAR INFORMACIÓN (MÁXIMO ${maxQuestions} PREGUNTAS)
- Ya hiciste ${questionCount} de ${maxQuestions} preguntas
- Analiza lo que YA SABES de la conversación anterior
- NO repitas preguntas sobre información que ya tienes
- Haz UNA pregunta inteligente para completar el entendimiento
- Si tienes suficiente información para dar un estimado, hazlo
- Preguntas restantes: ${maxQuestions - questionCount}`;
        break;

      case 'estimate':
        basePrompt += `
ETAPA: DAR COTIZACIÓN FINAL
- Analiza TODA la conversación para entender el proyecto
- Da un rango de precio realista basado en lo conversado
- IMPORTANTE: Aclara que NO incluye hosting
- Explica que es solo un ESTIMADO (puede ser menos o más)
- Menciona que Pablo revisará la solicitud y se comunicará para dudas
- Al final, di que vas a abrir el formulario de precotización para completar datos
- NO pidas datos de contacto manualmente, solo menciona que se abrirá el formulario`;
        break;

      case 'pre_quote_ready':
        basePrompt += `
ETAPA: PREPARAR FORMULARIO
- Confirma que vas a abrir el formulario de precotización
- Resume brevemente lo conversado
- Menciona que el formulario ya viene pre-llenado con la información`;
        break;

      case 'final':
        basePrompt += `
ETAPA: CONFIRMACIÓN FINAL
- Resume la información recopilada
- Confirma que Pablo revisará la precotización y se comunicará pronto
- Menciona el tiempo estimado de respuesta (24-48 horas)
- Agradece y cierra profesionalmente`;
        break;
    }

    basePrompt += `

REGLAS CRÍTICAS:
1. PIENSA antes de responder - analiza qué información ya tienes
2. NO hagas preguntas sobre cosas que ya sabes
3. Sé inteligente - si alguien dice "soy fotógrafo y quiero mostrar mi trabajo" entiendes que quiere un portfolio
4. Máximo ${maxQuestions} preguntas en brief, úsalas sabiamente
5. Respuestas cortas y naturales (2-4 líneas máximo)
6. Precios siempre en quetzales: Q1,200 no "1200"
7. Si ya tienes suficiente info para estimar, hazlo aunque no hayas hecho todas las preguntas
8. SIEMPRE aclara que precios NO incluyen hosting
9. SIEMPRE menciona que es un estimado que puede variar
10. En contacto, pide: presupuesto, datos completos y método preferido

IMPORTANTE: Eres una IA inteligente, no un bot con script. Adapta tus respuestas al contexto de la conversación.`;

    return basePrompt;
  }

  // ✅ MÉTODO PRINCIPAL SIMPLIFICADO - DEJA QUE GROQ PIENSE
  async respond(userMessage) {
    try {
      if (userMessage !== 'inicio') {
        this.addToHistory('user', userMessage);
      }

      // ✅ SOLO USAR IA - NO MÁS LÓGICA MANUAL
      if (!this.isInitialized || !this.groq) {
        return this.getBasicFallback(userMessage);
      }

      // ✅ CONSTRUIR MENSAJES PARA GROQ
      const systemPrompt = this.buildSmartPrompt();
      
      const messages = [
        { role: "system", content: systemPrompt }
      ];
      
      // Agregar conversación reciente
      const recentHistory = this.conversationHistory.slice(-6);
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

      // ✅ LLAMADA A GROQ SIN RESTRICCIONES
      const completion = await this.groq.chat.completions.create({
        messages,
        model: "llama3-70b-8192",
        temperature: 0.7, // Un poco más de creatividad
        max_tokens: 400,
        top_p: 0.9
      });

      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from Groq');
      }

      // ✅ ACTUALIZAR ESTADO BASADO EN LA RESPUESTA DE LA IA
      await this.updateStateFromAIResponse(userMessage, aiResponse);
      
      this.addToHistory('assistant', aiResponse);

      return {
        content: aiResponse,
        source: 'groq-real-ai',
        success: true,
        sessionState: this.sessionState
      };

    } catch (error) {
      console.error('Error en IA Real:', error);
      
      const fallbackResponse = this.getBasicFallback(userMessage);
      this.addToHistory('assistant', fallbackResponse);
      
      return {
        content: fallbackResponse,
        source: 'fallback',
        success: false,
        error: error.message
      };
    }
  }

  // ✅ ACTUALIZAR ESTADO INTELIGENTEMENTE
  async updateStateFromAIResponse(userMessage, aiResponse) {
    // Incrementar preguntas si estamos en brief
    if (this.sessionState.conversationStage === 'brief') {
      this.sessionState.questionCount++;
    }

    // ✅ EXTRAER NOMBRE SI NO LO TENEMOS (simple)
    if (!this.sessionState.userName && this.sessionState.conversationStage === 'greeting') {
      const nameMatch = userMessage.match(/(?:soy|me llamo|mi nombre es)\s+([a-záéíóúñ]+)/i);
      if (nameMatch) {
        this.sessionState.userName = nameMatch[1];
        this.sessionState.conversationStage = 'brief';
      }
    }

    // ✅ ACTUALIZAR RESUMEN DEL PROYECTO
    if (this.sessionState.conversationStage === 'brief') {
      // Agregar nueva información al resumen
      this.sessionState.briefData.summary += ` ${userMessage}`;
    }

    // ✅ DETECTAR CUANDO DAR ESTIMADO Y PREPARAR FORMULARIO
    const response = aiResponse.toLowerCase();
    
    if (this.sessionState.conversationStage === 'brief' && 
        (response.includes('estimado') || response.includes('precio') || 
         this.sessionState.questionCount >= this.sessionState.maxQuestions)) {
      this.sessionState.conversationStage = 'estimate';
      
      // ✅ GENERAR ANÁLISIS PARA EL FORMULARIO
      await this.generateProjectAnalysis();
    }
    
    // ✅ DETECTAR CUANDO ABRIR FORMULARIO
    if (this.sessionState.conversationStage === 'estimate' && 
        (response.includes('formulario') || response.includes('completar') || 
         response.includes('datos') || response.includes('abrir'))) {
      this.sessionState.conversationStage = 'pre_quote_ready';
      this.sessionState.shouldOpenPreQuote = true;
    }

    // ✅ AUTO-AVANZAR SI YA USÓ TODAS LAS PREGUNTAS
    if (this.sessionState.conversationStage === 'brief' && 
        this.sessionState.questionCount >= this.sessionState.maxQuestions) {
      this.sessionState.conversationStage = 'estimate';
    }
  }

  // ✅ ESTIMADOR INTELIGENTE BASADO EN CONVERSACIÓN
  async generateIntelligentEstimate() {
    const conversation = this.getConversationContext();
    
    // ✅ USAR IA PARA GENERAR ESTIMADO
    try {
      const estimatePrompt = `Como Pablo de EKLISTA, analiza esta conversación y da un estimado de precio realista:

CONVERSACIÓN: ${conversation}

PRECIOS DE REFERENCIA:
- Diseño Gráfico: ${formatPrice(500)} - ${formatPrice(1500)}
- WordPress básico: ${formatPrice(1200)} - ${formatPrice(3000)}
- WordPress complejo: ${formatPrice(3000)} - ${formatPrice(6000)}
- UX/UI: ${formatPrice(800)} - ${formatPrice(2500)}
- Desarrollo Custom: ${formatPrice(4000)} - ${formatPrice(12000)}

Da un rango realista y explica brevemente por qué, basado en lo que entendiste del proyecto.
Formato: "Q[min] - Q[max]"`;

      const estimateCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: estimatePrompt }],
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 200
      });

      return estimateCompletion.choices[0]?.message?.content || this.getBasicEstimate();
      
    } catch (error) {
      return this.getBasicEstimate();
    }
  }

  // ✅ NUEVO: GENERAR ANÁLISIS COMPLETO PARA EL FORMULARIO
  async generateProjectAnalysis() {
    const conversation = this.getConversationContext();
    
    try {
      const analysisPrompt = `Basado en esta conversación con ${this.sessionState.userName}, genera un análisis completo del proyecto:

CONVERSACIÓN: ${conversation}

Necesito que generes:
1. Resumen del proyecto (1-2 oraciones)
2. Tipo de proyecto detectado (ej: "Portfolio web profesional", "Sitio WordPress corporativo")
3. Estimado de precio (rango en quetzales)
4. Análisis detallado (qué funcionalidades necesita, para qué tipo de negocio, etc.)

Responde en formato JSON:
{
  "summary": "resumen del proyecto",
  "projectType": "tipo detectado",
  "estimate": "Q1,500 - Q3,200",
  "analysis": "análisis detallado"
}`;

      const analysisCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: analysisPrompt }],
        model: "llama3-70b-8192",
        temperature: 0.4,
        max_tokens: 300
      });

      const analysisResponse = analysisCompletion.choices[0]?.message?.content;
      
      try {
        const analysisData = JSON.parse(analysisResponse);
        
        this.sessionState.briefData.summary = analysisData.summary || 'Proyecto analizado en conversación';
        this.sessionState.briefData.projectType = analysisData.projectType || 'Proyecto web';
        this.sessionState.briefData.estimate = analysisData.estimate || 'Q1,200 - Q3,500';
        this.sessionState.briefData.aiAnalysis = analysisData.analysis || 'Análisis basado en conversación con IA';
        
      } catch (parseError) {
        // Fallback si no puede parsear JSON
        this.setFallbackAnalysis();
      }
      
    } catch (error) {
      this.setFallbackAnalysis();
    }
  }

  // ✅ ANÁLISIS FALLBACK
  setFallbackAnalysis() {
    const conversation = this.sessionState.briefData.summary;
    
    this.sessionState.briefData.summary = conversation || 'Proyecto discutido en conversación con IA';
    this.sessionState.briefData.projectType = 'Proyecto web personalizado';
    this.sessionState.briefData.estimate = 'Q1,500 - Q3,500';
    this.sessionState.briefData.aiAnalysis = `Proyecto analizado automáticamente basado en conversación. Usuario: ${this.sessionState.userName}. Requerimientos discutidos en chat interactivo.`;
  }

  // ✅ FALLBACK BÁSICO MEJORADO
  getBasicFallback(userMessage) {
    const { userName, conversationStage } = this.sessionState;
    
    if (conversationStage === 'greeting' && userMessage === 'inicio') {
      return `¡Hola! 👋 Soy Pablo de EKLISTA.

Antes de empezar, ¿cómo te llamas? Y cuéntame un poco sobre tu proyecto o la idea que tienes en mente.`;
    }

    if (conversationStage === 'brief' || conversationStage === 'greeting') {
      const name = userName ? `${userName}, ` : '';
      return `${name}cuéntame más sobre tu proyecto.

Trabajo con:
• **Sitios web** - Desde ${formatPrice(1200)}
• **Diseño gráfico** - Desde ${formatPrice(500)}
• **Apps/sistemas** - Desde ${formatPrice(4000)}

¿Qué tienes en mente?`;
    }

    return `${userName ? userName + ', ' : ''}¿en qué puedo ayudarte?

Contacto directo: hello@eklista.com`;
  }

  getBasicEstimate() {
    return `Basado en lo que me contaste, estimo entre ${formatPrice(1200)} - ${formatPrice(3500)}.

**Importante:**
• Estimado inicial (puede variar según detalles finales)
• NO incluye hosting
• Pablo revisará tu solicitud y se comunicará para dudas

Te voy a abrir el formulario de precotización para que completes tus datos de contacto.`;
  }

  // ✅ MÉTODOS DE UTILIDAD
  isAvailable() {
    return this.isInitialized && this.groq !== null;
  }

  getSessionState() {
    return this.sessionState;
  }

  resetSession() {
    this.conversationHistory = [];
    this.sessionState = {
      userName: null,
      conversationStage: 'greeting',
      briefData: {
        summary: '',
        projectType: null,
        estimate: null,
        aiAnalysis: ''
      },
      contactMethod: null,
      contactInfo: {},
      questionCount: 0,
      maxQuestions: 3,
      shouldOpenPreQuote: false
    };
  }

  getStats() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!import.meta.env.VITE_GROQ_API_KEY,
      sessionState: this.sessionState,
      conversationLength: this.conversationHistory.length,
      currentStage: this.sessionState.conversationStage,
      questionsUsed: `${this.sessionState.questionCount}/${this.sessionState.maxQuestions}`,
      aiMode: 'real-intelligence',
      shouldOpenPreQuote: this.sessionState.shouldOpenPreQuote
    };
  }

  // ✅ NUEVO: OBTENER DATOS PARA EL FORMULARIO
  getPreQuoteData() {
    return {
      userName: this.sessionState.userName,
      summary: this.sessionState.briefData.summary,
      projectType: this.sessionState.briefData.projectType,
      estimate: this.sessionState.briefData.estimate,
      aiAnalysis: this.sessionState.briefData.aiAnalysis,
      conversationHistory: this.conversationHistory
    };
  }

  // ✅ NUEVO: RESET FLAG DEL FORMULARIO
  resetPreQuoteFlag() {
    this.sessionState.shouldOpenPreQuote = false;
  }
}

// Singleton
const chatAI = new EklistaChatAI();

export default chatAI;