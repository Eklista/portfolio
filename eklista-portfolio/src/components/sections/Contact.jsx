import React from 'react';
import { Mail, MessageCircle, Sparkles, Clock, CheckCircle, ArrowRight, Calculator } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

const Contact = () => {
  const { openChat, openQuote } = useChatContext();

  return (
    <section id="contacto" className="py-20 bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Main Contact Area */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full border border-primary mb-8">
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="font-inter font-medium text-sm text-secondary">Conversemos</span>
          </div>

          <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-light text-primary mb-6 leading-tight">
            ¿Tienes un proyecto
            <span className="block">
              <span className="font-medium text-accent">
                en mente?
              </span>
            </span>
          </h2>

          <p className="font-inter text-xl md:text-2xl text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            Conversemos sobre cómo puedo ayudarte a materializar tus ideas 
            y llevar tu proyecto al siguiente nivel.
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {/* Cotizador CTA - Principal */}
            <button 
              onClick={openQuote}
              className="btn-accent px-10 py-5 rounded-full font-poppins font-semibold text-xl inline-flex items-center gap-3 group"
            >
              <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Cotizar proyecto
            </button>

            {/* Chat CTA - Secundario */}
            <button 
              onClick={openChat}
              className="px-10 py-5 rounded-full font-poppins font-semibold text-xl inline-flex items-center gap-3 border-2 border-secondary text-secondary hover-border-accent hover-text-accent transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              Chat rápido
            </button>

            {/* Email CTA - Terciario */}
            <a 
              href="mailto:eklista@eklista.com"
              className="px-8 py-4 rounded-full font-inter font-medium text-lg inline-flex items-center gap-3 border border-primary text-muted hover-border-secondary hover-text-secondary transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Email directo
            </a>
          </div>

          {/* Secondary info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-muted">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Cotizador: Precio inmediato</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Chat: Dudas rápidas</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Email: Respuesta en 24h</span>
            </div>
          </div>
        </div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          
          {/* Quick Project */}
          <div className="bg-surface rounded-2xl p-8 border border-primary card-hover">
            <div className="w-12 h-12 bg-accent-surface rounded-xl flex items-center justify-center mb-6">
              <Calculator className="w-6 h-6 text-accent" />
            </div>
            
            <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
              Cotizador Automático
            </h3>
            
            <p className="font-inter text-muted mb-6 leading-relaxed">
              Obtén un presupuesto detallado al instante. Selecciona tu tipo de proyecto
              y características para ver el precio en tiempo real.
            </p>
            
            <ul className="space-y-2 mb-6">
              {[
                'Precio inmediato',
                'Selección de características',
                'Cotización detallada por email'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <button
              onClick={openQuote}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-inter font-semibold transition-colors"
            >
              Abrir cotizador
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Custom Project */}
          <div className="bg-surface rounded-2xl p-8 border border-primary card-hover">
            <div className="w-12 h-12 bg-accent-surface rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            
            <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
              Chat de Consultas
            </h3>
            
            <p className="font-inter text-muted mb-6 leading-relaxed">
              ¿Tienes dudas específicas? Nuestro chat te ayuda con preguntas rápidas
              sobre servicios, tiempos o cualquier consulta.
            </p>
            
            <ul className="space-y-2 mb-6">
              {[
                'Respuesta inmediata',
                'Consultas sin compromiso',
                'Disponible 24/7'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <button
              onClick={openChat}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-inter font-semibold transition-colors"
            >
              Abrir chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-primary card-hover">
          <div className="w-12 h-12 bg-accent-surface rounded-xl flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-accent" />
          </div>
          
          <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
            Proyecto Personalizado
          </h3>
          
          <p className="font-inter text-muted mb-6 leading-relaxed">
            ¿Tienes una idea compleja? Conversemos en detalle por email sobre
            tu visión y cómo hacerla realidad.
          </p>
          
          <ul className="space-y-2 mb-6">
            {[
              'Consulta estratégica',
              'Propuesta detallada',
              'Seguimiento personalizado'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-secondary">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                {item}
              </li>
            ))}
          </ul>
          
          <a
            href="mailto:eklista@eklista.com?subject=Proyecto Personalizado - Conversemos"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-inter font-semibold transition-colors"
          >
            Enviar email detallado
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        </div>

        {/* Process Steps */}
        <div className="bg-surface rounded-2xl p-8 md:p-12 border border-primary">
          <div className="text-center mb-10">
            <h3 className="font-poppins text-2xl font-semibold text-primary mb-4">
              Cómo trabajamos juntos
            </h3>
            <p className="font-inter text-muted">
              Un proceso transparente y colaborativo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Conversación inicial',
                description: 'Chat rápido o email detallado según la complejidad de tu proyecto.'
              },
              {
                step: '02',
                title: 'Propuesta detallada',
                description: 'Te envío una propuesta completa con alcance, tiempos y presupuesto.'
              },
              {
                step: '03',
                title: 'Desarrollo colaborativo',
                description: 'Trabajamos juntos con revisiones constantes y comunicación fluida.'
              },
              {
                step: '04',
                title: 'Entrega y soporte',
                description: 'Entregamos el proyecto y te acompañamos en el lanzamiento.'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 font-poppins font-bold text-primary">
                  {process.step}
                </div>
                <h4 className="font-poppins font-semibold text-primary mb-2">
                  {process.title}
                </h4>
                <p className="font-inter text-sm text-muted leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Quick Items */}
        <div className="mt-16 text-center">
          <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
            Preguntas frecuentes
          </h3>
          <p className="font-inter text-muted text-sm mb-8">
            Haz clic para preguntar en el chat o enviar por email
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Cuánto tiempo toma un proyecto',
              'Formas de pago disponibles',
              'Incluye mantenimiento',
              'Trabajas con equipos remotos'
            ].map((faq, index) => (
              <button
                key={index}
                onClick={openChat}
                className="px-4 py-2 bg-primary border border-secondary text-secondary hover-border-accent hover-text-accent rounded-full font-inter transition-colors"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>
    </section>
  );
};

export default Contact;