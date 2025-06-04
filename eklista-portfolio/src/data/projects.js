// src/data/projects.js - ACTUALIZADO con estructura de explorador

import { 
  Monitor, 
  Palette, 
  PenTool, 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Camera, 
  FileImage, 
  Folder,
  Image,
  Code,
  Briefcase
} from 'lucide-react';

// Estructura principal del explorador
export const explorerStructure = {
  'portfolio': {
    type: 'folder',
    name: 'Mi Portfolio',
    description: 'Explora mis trabajos organizados por categoría',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    children: {
      'diseno-web': {
        type: 'folder',
        name: 'Diseño Web',
        description: 'Sitios web y aplicaciones',
        icon: Globe,
        color: 'from-blue-500 to-cyan-500',
        children: 'web-projects' // Referencia a projectsData
      },
      'ux-ui-design': {
        type: 'folder',
        name: 'UX/UI Design',
        description: 'Interfaces y experiencias de usuario',
        icon: PenTool,
        color: 'from-purple-500 to-pink-500',
        children: 'ux-ui-projects'
      },
      'diseno-grafico': {
        type: 'folder',
        name: 'Diseño Gráfico',
        description: 'Branding e identidad visual',
        icon: Palette,
        color: 'from-orange-500 to-red-500',
        children: 'graphic-projects'
      },
      'fotografia': {
        type: 'folder',
        name: 'Fotografía',
        description: 'Sesiones y trabajos fotográficos',
        icon: Camera,
        color: 'from-pink-500 to-rose-500',
        children: 'photography-projects'
      }
    }
  },
  'servicios': {
    type: 'info',
    name: 'Mis Servicios',
    description: 'Todo lo que puedo hacer por tu proyecto',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    content: {
      title: 'Servicios Profesionales',
      sections: [
        {
          title: 'Desarrollo Web',
          icon: Globe,
          color: 'from-blue-500 to-cyan-500',
          description: 'Sitios web modernos y funcionales que convierten visitantes en clientes.',
          services: [
            'Sitios WordPress personalizados (desde Q1,200)',
            'Aplicaciones React/Next.js (desde Q4,000)',
            'E-commerce y tiendas online (desde Q2,500)',
            'Landing pages optimizadas (desde Q800)',
            'PWAs y aplicaciones móviles',
            'APIs y backend development'
          ],
          technologies: ['React', 'Next.js', 'WordPress', 'Node.js', 'MongoDB', 'Tailwind CSS'],
          deliveryTime: '2-8 semanas'
        },
        {
          title: 'UX/UI Design',
          icon: PenTool,
          color: 'from-purple-500 to-pink-500',
          description: 'Diseño de experiencias que los usuarios amarán y que generen resultados.',
          services: [
            'Investigación de usuarios (desde Q400)',
            'Wireframes y prototipos (desde Q600)',
            'Diseño de interfaces (desde Q800)',
            'Design systems (desde Q1,200)',
            'Testing de usabilidad (desde Q500)',
            'Optimización de conversiones'
          ],
          technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Miro', 'Maze'],
          deliveryTime: '1-4 semanas'
        },
        {
          title: 'Diseño Gráfico',
          icon: Palette,
          color: 'from-orange-500 to-red-500',
          description: 'Identidad visual que hace que tu marca sea memorable y profesional.',
          services: [
            'Logos e identidad corporativa (desde Q500)',
            'Branding completo (desde Q1,500)',
            'Papelería comercial (desde Q300)',
            'Packaging y etiquetas (desde Q400)',
            'Diseño para redes sociales (desde Q250)',
            'Material publicitario'
          ],
          technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'After Effects'],
          deliveryTime: '3-10 días'
        }
      ]
    }
  },
  'sobre-mi': {
    type: 'info',
    name: 'Sobre Mí',
    description: 'Conoce mi historia y experiencia',
    icon: Monitor,
    color: 'from-violet-500 to-purple-500',
    content: {
      title: 'Eduardo Klista - EKLISTA',
      sections: [
        {
          title: 'Mi Historia',
          description: 'Desarrollador Full-Stack y Diseñador con más de 5 años creando experiencias digitales únicas.',
          content: [
            '🚀 Más de 50 proyectos completados exitosamente',
            '🎯 Especializado en React, Next.js y WordPress',
            '🎨 Enfoque en diseño centrado en el usuario',
            '🇬🇹 Basado en Guatemala, proyectos internacionales',
            '⚡ Apasionado por las últimas tecnologías'
          ]
        },
        {
          title: 'Filosofía de Trabajo',
          description: 'Creo en crear soluciones que no solo se ven bien, sino que resuelven problemas reales.',
          content: [
            'Diseño funcional antes que decorativo',
            'Código limpio y mantenible',
            'Experiencia de usuario como prioridad',
            'Comunicación constante con el cliente',
            'Entrega de valor desde el primer día'
          ]
        },
        {
          title: 'Habilidades Técnicas',
          description: 'Stack tecnológico actualizado con las mejores herramientas del mercado.',
          skills: {
            'Frontend': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
            'Backend': ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Prisma'],
            'Design': ['Figma', 'Adobe Suite', 'Sketch', 'InVision', 'Principle'],
            'Tools': ['Git', 'Docker', 'AWS', 'Vercel', 'Netlify']
          }
        },
        {
          title: 'Logros Recientes',
          description: '2024 ha sido un año increíble lleno de proyectos desafiantes.',
          content: [
            '🏆 15+ proyectos entregados este año',
            '⭐ 5.0 estrellas promedio en testimonios',
            '🚀 3 startups lanzadas con mi ayuda',
            '📈 +200% aumento en conversiones (promedio)',
            '🎓 Certificaciones en UX/UI y React avanzado'
          ]
        }
      ]
    }
  }
};

// Datos específicos de proyectos
export const projectsData = {
  'web-projects': [
    {
      id: 'banking-webapp',
      title: 'Banking Web App',
      client: 'FinTech Guatemala',
      year: '2024',
      category: 'Aplicación Web',
      type: 'file',
      icon: Smartphone,
      description: 'Aplicación web bancaria completa con dashboard de administración, transferencias, historial y analíticas en tiempo real.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
      ],
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
      features: ['Dashboard administrativo', 'Transferencias P2P', 'Historial detallado', 'Notificaciones push', 'Multi-factor auth'],
      results: '+300% en tiempo de sesión, +150% en transacciones completadas',
      liveUrl: '#',
      caseStudy: '#'
    },
    {
      id: 'ecommerce-platform',
      title: 'E-commerce Platform',
      client: 'Fashion Forward',
      year: '2024',
      category: 'E-commerce',
      type: 'file',
      icon: ShoppingCart,
      description: 'Plataforma de e-commerce completa con carrito inteligente, pagos múltiples, inventario en tiempo real y panel de vendedor.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS S3', 'Redux'],
      features: ['Carrito inteligente', 'Múltiples métodos de pago', 'Gestión de inventario', 'Panel del vendedor', 'Reviews y ratings'],
      results: '+250% en ventas online, +80% en conversión',
      liveUrl: '#',
      caseStudy: '#'
    },
    {
      id: 'restaurant-website',
      title: 'Restaurant Digital Experience',
      client: 'Sabor Auténtico',
      year: '2023',
      category: 'WordPress',
      type: 'file',
      icon: Monitor,
      description: 'Sitio web para restaurante con menú digital interactivo, sistema de reservas, pedidos online y integración con redes sociales.',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=800&fit=crop'
      ],
      technologies: ['WordPress', 'WooCommerce', 'Custom PHP', 'MySQL', 'SCSS'],
      features: ['Menú digital', 'Sistema de reservas', 'Pedidos online', 'Galería interactiva', 'Blog gastronómico'],
      results: '+400% en reservas online, +180% en pedidos delivery',
      liveUrl: '#',
      caseStudy: '#'
    }
  ],
  
  'ux-ui-projects': [
    {
      id: 'health-app-ux',
      title: 'Health & Wellness App',
      client: 'WellBeing Tech',
      year: '2024',
      category: 'UX/UI Mobile',
      type: 'file',
      icon: Smartphone,
      description: 'Aplicación de salud y bienestar con seguimiento de hábitos, recordatorios inteligentes, gamificación y comunidad.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&h=800&fit=crop'
      ],
      technologies: ['Figma', 'Principle', 'InVision', 'Maze', 'Adobe XD'],
      features: ['User research', 'Journey mapping', 'Prototyping', 'Usability testing', 'Design system'],
      results: '+85% user retention, 4.8★ app store rating',
      liveUrl: '#',
      caseStudy: '#'
    },
    {
      id: 'dashboard-redesign',
      title: 'Analytics Dashboard Redesign',
      client: 'DataViz Pro',
      year: '2024',
      category: 'UX/UI Web',
      type: 'file',
      icon: Monitor,
      description: 'Rediseño completo de dashboard analítico con visualización de datos compleja, filtros avanzados y reportes automáticos.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop'
      ],
      technologies: ['Figma', 'Framer', 'D3.js concepts', 'Zeplin', 'Miro'],
      features: ['Data visualization', 'Interactive filters', 'Custom charts', 'Export functionality', 'Real-time updates'],
      results: '+60% time-to-insight, +200% daily active users',
      liveUrl: '#',
      caseStudy: '#'
    }
  ],
  
  'graphic-projects': [
    {
      id: 'cafe-branding',
      title: 'Café Origen - Branding Complete',
      client: 'Café Origen',
      year: '2024',
      category: 'Branding',
      type: 'file',
      icon: Palette,
      description: 'Identidad visual completa para café especializado incluyendo logo, papelería, packaging, señalética y manual de marca.',
      image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop'
      ],
      technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'After Effects'],
      features: ['Logo design', 'Brand guidelines', 'Packaging design', 'Stationery', 'Social media kit'],
      results: '+300% brand recognition, +150% customer engagement',
      liveUrl: '#',
      caseStudy: '#'
    },
    {
      id: 'cosmetics-packaging',
      title: 'Natural Beauty Packaging',
      client: 'Natural Beauty Co',
      year: '2023',
      category: 'Packaging',
      type: 'file',
      icon: Image,
      description: 'Diseño de packaging sostenible para línea de cosméticos naturales con enfoque minimalista y eco-friendly.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200&h=800&fit=crop'
      ],
      technologies: ['Adobe Illustrator', 'Photoshop', 'Dimension', 'InDesign'],
      features: ['Sustainable materials', 'Minimalist design', 'Product photography', 'Label design', 'Box structure'],
      results: '+400% shelf appeal, award-winning design',
      liveUrl: '#',
      caseStudy: '#'
    }
  ],
  
  'photography-projects': [
    {
      id: 'corporate-portraits',
      title: 'Corporate Portrait Series',
      client: 'Tech Startup Inc',
      year: '2024',
      category: 'Corporate',
      type: 'file',
      icon: Camera,
      description: 'Serie de retratos corporativos para startup tecnológica, enfocado en mostrar la personalidad y profesionalismo del equipo.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b332c788?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=800&fit=crop'
      ],
      technologies: ['Canon 5D IV', 'Lightroom', 'Photoshop', 'Studio lighting'],
      features: ['Professional headshots', 'Team photos', 'Behind-the-scenes', 'Brand photography', 'Social media content'],
      results: '25+ team members photographed, 100+ final images delivered',
      liveUrl: '#',
      caseStudy: '#'
    }
  ]
};