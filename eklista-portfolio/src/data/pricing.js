// src/data/pricing.js
import { Monitor, Palette, PenTool, Code } from 'lucide-react';

export const projectTypes = [
  {
    id: 'wordpress',
    name: 'Sitio WordPress',
    description: 'Sitios web profesionales con WordPress',
    icon: Monitor,
    basePrice: 1200, // Precio más realista para Guatemala
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ux-ui',
    name: 'UX/UI Design',
    description: 'Interfaces de usuario y experiencias',
    icon: PenTool,
    basePrice: 800,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'graphic-design',
    name: 'Diseño Gráfico',
    description: 'Identidad visual y branding',
    icon: Palette,
    basePrice: 500,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'custom-development',
    name: 'Desarrollo a Medida',
    description: 'Aplicaciones web personalizadas con React/Next.js',
    icon: Code,
    basePrice: 4000, // Aquí sí inflamos para desarrollo custom
    color: 'from-green-500 to-emerald-500'
  }
];

export const technologiesAndFeatures = {
  'wordpress': [
    {
      id: 'responsive',
      name: 'Diseño Responsive',
      description: 'Adaptable a móviles, tablets y desktop',
      price: 0, // Incluido en el precio base
      required: true,
      category: 'Diseño'
    },
    {
      id: 'theme-customization',
      name: 'Personalización de Tema',
      description: 'Modificación completa del diseño según tu marca',
      price: 400,
      required: false,
      category: 'Diseño'
    },
    {
      id: 'woocommerce',
      name: 'Tienda Online (WooCommerce)',
      description: 'Carrito de compras, pagos y gestión de productos',
      price: 800,
      required: false,
      category: 'E-commerce'
    },
    {
      id: 'seo-basic',
      name: 'SEO Básico',
      description: 'Optimización básica para motores de búsqueda',
      price: 200,
      required: false,
      category: 'SEO'
    },
    {
      id: 'seo-advanced',
      name: 'SEO Avanzado',
      description: 'Schema markup, sitemap XML, optimización completa',
      price: 500,
      required: false,
      category: 'SEO'
    },
    {
      id: 'contact-forms',
      name: 'Formularios de Contacto',
      description: 'Formularios personalizados con validación',
      price: 150,
      required: false,
      category: 'Funcionalidades'
    },
    {
      id: 'blog-setup',
      name: 'Blog Configurado',
      description: 'Sistema de blog con categorías y comentarios',
      price: 250,
      required: false,
      category: 'Contenido'
    },
    {
      id: 'multilanguage',
      name: 'Sitio Multiidioma',
      description: 'Español, inglés y más idiomas (WPML)',
      price: 600,
      required: false,
      category: 'Internacionalización'
    },
    {
      id: 'hosting-setup',
      name: 'Instalación y Hosting',
      description: 'Configuración completa en tu hosting',
      price: 200,
      required: false,
      category: 'Técnico'
    },
    {
      id: 'ssl-security',
      name: 'Seguridad y SSL',
      description: 'Certificado SSL y plugins de seguridad',
      price: 150,
      required: false,
      category: 'Seguridad'
    },
    {
      id: 'speed-optimization',
      name: 'Optimización de Velocidad',
      description: 'Caché, compresión de imágenes y optimización',
      price: 300,
      required: false,
      category: 'Performance'
    },
    {
      id: 'backup-system',
      name: 'Sistema de Respaldos',
      description: 'Respaldos automáticos configurados',
      price: 100,
      required: false,
      category: 'Seguridad'
    }
  ],
  
  'ux-ui': [
    {
      id: 'user-research',
      name: 'Investigación de Usuario',
      description: 'Análisis de audiencia y competencia',
      price: 400,
      required: false,
      category: 'Research'
    },
    {
      id: 'wireframes',
      name: 'Wireframes',
      description: 'Esquemas de navegación y estructura',
      price: 200,
      required: true,
      category: 'Diseño'
    },
    {
      id: 'mockups',
      name: 'Mockups de Alta Fidelidad',
      description: 'Diseños finales detallados',
      price: 400,
      required: false,
      category: 'Diseño'
    },
    {
      id: 'prototyping',
      name: 'Prototipo Interactivo',
      description: 'Demo navegable en Figma/Adobe XD',
      price: 300,
      required: false,
      category: 'Prototipado'
    },
    {
      id: 'design-system',
      name: 'Mini Design System',
      description: 'Guía de componentes y estilos básicos',
      price: 500,
      required: false,
      category: 'Sistemas'
    },
    {
      id: 'mobile-design',
      name: 'Versión Mobile',
      description: 'Diseño específico para móviles',
      price: 300,
      required: false,
      category: 'Móvil'
    },
    {
      id: 'usability-review',
      name: 'Revisión de Usabilidad',
      description: 'Análisis de flujos y mejoras UX',
      price: 250,
      required: false,
      category: 'Testing'
    }
  ],
  
  'graphic-design': [
    {
      id: 'logo-design',
      name: 'Diseño de Logo',
      description: 'Logo principal con 3 variaciones',
      price: 200,
      required: true,
      category: 'Identidad'
    },
    {
      id: 'brand-colors',
      name: 'Paleta de Colores',
      description: 'Colores primarios y secundarios',
      price: 100,
      required: false,
      category: 'Branding'
    },
    {
      id: 'brand-identity',
      name: 'Manual de Marca',
      description: 'Tipografías, usos del logo y aplicaciones',
      price: 400,
      required: false,
      category: 'Branding'
    },
    {
      id: 'business-cards',
      name: 'Tarjetas de Presentación',
      description: 'Diseño listo para imprimir',
      price: 100,
      required: false,
      category: 'Papelería'
    },
    {
      id: 'letterhead',
      name: 'Papelería Corporativa',
      description: 'Membrete, sobre y factura',
      price: 150,
      required: false,
      category: 'Papelería'
    },
    {
      id: 'social-media-kit',
      name: 'Kit Redes Sociales',
      description: '10 plantillas para Instagram y Facebook',
      price: 250,
      required: false,
      category: 'Digital'
    },
    {
      id: 'flyers-brochures',
      name: 'Flyers o Brochures',
      description: 'Hasta 3 piezas promocionales',
      price: 200,
      required: false,
      category: 'Promocional'
    },
    {
      id: 'packaging-basic',
      name: 'Diseño de Empaque Básico',
      description: 'Etiqueta o empaque simple',
      price: 300,
      required: false,
      category: 'Producto'
    }
  ],
  
  'custom-development': [
    {
      id: 'react-app',
      name: 'Aplicación React',
      description: 'SPA con React y componentes modernos',
      price: 2000,
      required: false,
      category: 'Frontend'
    },
    {
      id: 'nextjs-app',
      name: 'Aplicación Next.js',
      description: 'App con SSR/SSG y optimización avanzada',
      price: 3000,
      required: false,
      category: 'Frontend'
    },
    {
      id: 'admin-dashboard',
      name: 'Panel de Administración',
      description: 'Dashboard completo con autenticación',
      price: 2500,
      required: false,
      category: 'Backend'
    },
    {
      id: 'api-integration',
      name: 'Integración de APIs',
      description: 'Conexión con servicios externos',
      price: 800,
      required: false,
      category: 'Integración'
    },
    {
      id: 'database-design',
      name: 'Base de Datos',
      description: 'Diseño e implementación de BD',
      price: 1000,
      required: false,
      category: 'Backend'
    },
    {
      id: 'authentication',
      name: 'Sistema de Usuarios',
      description: 'Login, registro y roles de usuario',
      price: 1200,
      required: false,
      category: 'Seguridad'
    },
    {
      id: 'payment-gateway',
      name: 'Pasarela de Pagos',
      description: 'Integración con Stripe, PayPal, etc.',
      price: 1500,
      required: false,
      category: 'Pagos'
    },
    {
      id: 'responsive-advanced',
      name: 'Responsive Avanzado',
      description: 'Diseño adaptativo premium',
      price: 600,
      required: false,
      category: 'Frontend'
    },
    {
      id: 'performance-optimization',
      name: 'Optimización de Performance',
      description: 'Lazy loading, code splitting, etc.',
      price: 800,
      required: false,
      category: 'Performance'
    },
    {
      id: 'testing-setup',
      name: 'Setup de Testing',
      description: 'Jest, Testing Library, Cypress',
      price: 1000,
      required: false,
      category: 'Calidad'
    }
  ]
};

export const additionalServices = {
  // Servicios para WordPress
  'wordpress': [
    {
      id: 'express-delivery',
      name: 'Entrega Express',
      description: 'Reducir tiempo de entrega en 50%',
      multiplier: 1.4,
      category: 'Tiempo'
    },
    {
      id: 'content-creation',
      name: 'Creación de Contenido',
      description: 'Textos profesionales para tu sitio web',
      price: 400,
      category: 'Contenido'
    },
    {
      id: 'photography',
      name: 'Sesión Fotográfica',
      description: 'Fotos profesionales para tu sitio',
      price: 800,
      category: 'Contenido'
    },
    {
      id: 'training-session',
      name: 'Capacitación WordPress',
      description: 'Aprende a actualizar tu sitio web',
      price: 300,
      category: 'Educación'
    },
    {
      id: 'maintenance-6m',
      name: 'Mantenimiento 6 meses',
      description: 'Updates de WordPress, respaldos y soporte',
      price: 600,
      category: 'Mantenimiento'
    },
    {
      id: 'maintenance-12m',
      name: 'Mantenimiento 1 año',
      description: 'Updates de WordPress, respaldos y soporte',
      price: 1000,
      category: 'Mantenimiento'
    },
    {
      id: 'social-media-setup',
      name: 'Setup Redes Sociales',
      description: 'Configuración de perfiles y primeras publicaciones',
      price: 300,
      category: 'Marketing'
    },
    {
      id: 'google-ads-setup',
      name: 'Configuración Google Ads',
      description: 'Campaña inicial y configuración de anuncios',
      price: 500,
      category: 'Marketing'
    }
  ],

  // Servicios para UX/UI
  'ux-ui': [
    {
      id: 'express-delivery',
      name: 'Entrega Express',
      description: 'Reducir tiempo de entrega en 50%',
      multiplier: 1.4,
      category: 'Tiempo'
    },
    {
      id: 'additional-screens',
      name: 'Pantallas Adicionales',
      description: 'Hasta 5 pantallas extra del diseño',
      price: 200,
      category: 'Diseño'
    },
    {
      id: 'design-handoff',
      name: 'Entrega para Desarrollo',
      description: 'Specs técnicas y assets organizados',
      price: 150,
      category: 'Técnico'
    },
    {
      id: 'presentation-deck',
      name: 'Presentación del Proyecto',
      description: 'Deck profesional para mostrar el diseño',
      price: 200,
      category: 'Presentación'
    },
    {
      id: 'user-testing',
      name: 'Testing con Usuarios',
      description: 'Pruebas del prototipo con usuarios reales',
      price: 400,
      category: 'Validación'
    }
  ],

  // Servicios para Diseño Gráfico
  'graphic-design': [
    {
      id: 'express-delivery',
      name: 'Entrega Express',
      description: 'Reducir tiempo de entrega en 50%',
      multiplier: 1.4,
      category: 'Tiempo'
    },
    {
      id: 'additional-concepts',
      name: 'Conceptos Adicionales',
      description: '3 propuestas extra de diseño',
      price: 150,
      category: 'Diseño'
    },
    {
      id: 'print-ready-files',
      name: 'Archivos Listos para Imprimir',
      description: 'CMYK, sangrados y especificaciones técnicas',
      price: 100,
      category: 'Producción'
    },
    {
      id: 'mockups-presentation',
      name: 'Mockups de Presentación',
      description: 'Visualización realista de tus diseños',
      price: 150,
      category: 'Presentación'
    },
    {
      id: 'brand-guidelines',
      name: 'Guía de Aplicación',
      description: 'Manual de cómo usar tu marca correctamente',
      price: 250,
      category: 'Documentación'
    },
    {
      id: 'social-media-adaptation',
      name: 'Adaptación Redes Sociales',
      description: 'Versiones para todas las redes sociales',
      price: 200,
      category: 'Digital'
    }
  ],

  // Servicios para Desarrollo Custom
  'custom-development': [
    {
      id: 'express-delivery',
      name: 'Entrega Express',
      description: 'Reducir tiempo de entrega en 50%',
      multiplier: 1.4,
      category: 'Tiempo'
    },
    {
      id: 'code-documentation',
      name: 'Documentación del Código',
      description: 'Documentación técnica completa',
      price: 400,
      category: 'Documentación'
    },
    {
      id: 'deployment-setup',
      name: 'Setup de Deployment',
      description: 'CI/CD y configuración de servidores',
      price: 600,
      category: 'DevOps'
    },
    {
      id: 'training-technical',
      name: 'Capacitación Técnica',
      description: 'Training para tu equipo de desarrollo',
      price: 800,
      category: 'Educación'
    },
    {
      id: 'maintenance-6m',
      name: 'Soporte Técnico 6 meses',
      description: 'Bug fixes y actualizaciones menores',
      price: 1200,
      category: 'Mantenimiento'
    },
    {
      id: 'maintenance-12m',
      name: 'Soporte Técnico 1 año',
      description: 'Bug fixes y actualizaciones menores',
      price: 2000,
      category: 'Mantenimiento'
    },
    {
      id: 'monitoring-setup',
      name: 'Monitoreo y Analytics',
      description: 'Configuración de métricas y alertas',
      price: 500,
      category: 'Monitoreo'
    },
    {
      id: 'security-audit',
      name: 'Auditoría de Seguridad',
      description: 'Revisión completa de vulnerabilidades',
      price: 800,
      category: 'Seguridad'
    }
  ]
};

// Utilidad para calcular precio total
export const calculateTotalPrice = (selections) => {
  const { projectType, features, additionalServices: services } = selections;
  
  let total = projectType?.basePrice || 0;
  
  // Sumar características seleccionadas
  features.forEach(feature => {
    total += feature.price;
  });
  
  // Aplicar multiplicadores primero (como entrega express)
  services.forEach(service => {
    if (service.multiplier) {
      total *= service.multiplier;
    }
  });
  
  // Luego sumar servicios con precio fijo
  services.forEach(service => {
    if (service.price) {
      total += service.price;
    }
  });
  
  return Math.round(total);
};

// Utilidad para formatear precio en quetzales
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Utility para obtener estimación de tiempo
export const getEstimatedTime = (selections) => {
  const { projectType, features, additionalServices: services } = selections;
  
  let baseDays = 0;
  
  switch (projectType?.id) {
    case 'wordpress':
      baseDays = 7;
      break;
    case 'ux-ui':
      baseDays = 5;
      break;
    case 'graphic-design':
      baseDays = 3;
      break;
    case 'custom-development':
      baseDays = 21;
      break;
    default:
      baseDays = 7;
  }
  
  // Agregar días por características complejas
  const complexFeatures = features.filter(f => 
    ['woocommerce', 'multilanguage', 'design-system', 'nextjs-app', 'admin-dashboard'].includes(f.id)
  );
  baseDays += complexFeatures.length * 3;
  
  // Reducir tiempo si hay entrega express
  const hasExpress = services.some(s => s.id === 'express-delivery');
  if (hasExpress) {
    baseDays = Math.ceil(baseDays * 0.5);
  }
  
  return baseDays;
};