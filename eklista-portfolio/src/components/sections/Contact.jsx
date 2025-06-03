import React from 'react';
import { Mail, MessageCircle, Sparkles, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const Contact = () => {
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

          {/* Main CTA */}
          <div className="mb-12">
            <a 
              href="mailto:eklista@eklista.com"
              className="btn-accent px-10 py-5 rounded-full font-poppins font-semibold text-xl inline-flex items-center gap-3 group"
            >
              <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              eklista@eklista.com
            </a>
          </div>

          {/* Secondary info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-muted">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Respuesta en 24h</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Consulta gratuita</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-border-secondary rounded-full"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="font-inter text-sm">Sin compromiso</span>
            </div>
          </div>
        </div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          
          {/* Quick Project */}
          <div className="bg-surface rounded-2xl p-8 border border-primary card-hover">
            <div className="w-12 h-12 bg-accent-surface rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            
            <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
              Proyecto Rápido
            </h3>
            
            <p className="font-inter text-muted mb-6 leading-relaxed">
              ¿Necesitas algo específico y directo? Perfecto para ajustes, fixes o 
              implementaciones puntuales.
            </p>
            
            <ul className="space-y-2 mb-6">
              {[
                'Respuesta inmediata',
                'Presupuesto en 24h',
                'Desarrollo ágil'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <a
              href="mailto:eklista@eklista.com?subject=Proyecto Rápido - Consulta"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-inter font-semibold transition-colors"
            >
              Enviar consulta rápida
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Custom Project */}
          <div className="bg-surface rounded-2xl p-8 border border-primary card-hover">
            <div className="w-12 h-12 bg-accent-surface rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            
            <h3 className="font-poppins text-xl font-semibold text-primary mb-4">
              Proyecto Personalizado
            </h3>
            
            <p className="font-inter text-muted mb-6 leading-relaxed">
              ¿Tienes una idea más compleja? Hablemos en detalle sobre tu visión 
              y cómo hacerla realidad.
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
              Agendar conversación
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
                description: 'Hablamos sobre tu proyecto, objetivos y necesidades específicas.'
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
          <h3 className="font-poppins text-xl font-semibold text-primary mb-8">
            Preguntas frecuentes
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Cuánto tiempo toma un proyecto',
              'Formas de pago disponibles',
              'Incluye mantenimiento',
              'Trabajas con equipos remotos'
            ].map((faq, index) => (
              <a
                key={index}
                href={`mailto:eklista@eklista.com?subject=Pregunta: ${faq}`}
                className="px-4 py-2 bg-primary border border-secondary text-secondary hover-border-accent hover-text-accent rounded-full font-inter transition-colors"
              >
                {faq}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;