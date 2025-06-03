import { Monitor, Palette, PenTool } from 'lucide-react';

export const serviceCategories = [
  {
    id: 'web-design',
    name: 'Diseño Web',
    description: 'Sitios web modernos y funcionales',
    icon: Monitor
  },
  {
    id: 'ux-ui',
    name: 'UX/UI Design',
    description: 'Experiencias de usuario excepcionales',
    icon: PenTool
  },
  {
    id: 'graphic-design',
    name: 'Diseño Gráfico',
    description: 'Identidad visual y branding',
    icon: Palette
  }
];

export const serviceDetails = {
  'web-design': {
    title: 'Diseño y Desarrollo Web',
    subtitle: 'Sitios web que combinan diseño atractivo con funcionalidad robusta. Desde landing pages hasta aplicaciones web complejas, utilizando las mejores tecnologías y prácticas.',
    features: [
      'Diseño responsive y mobile-first',
      'Desarrollo con React, Next.js y tecnologías modernas',
      'Integración con CMS (WordPress, Strapi, Contentful)',
      'Optimización SEO y performance',
      'E-commerce y tiendas online',
      'Aplicaciones web personalizadas',
      'Mantenimiento y soporte técnico',
      'Hosting y configuración de dominio'
    ],
    technologies: [
      'React', 'Next.js', 'TypeScript', 'Tailwind CSS',
      'WordPress', 'Strapi', 'Node.js', 'MongoDB',
      'Figma', 'Git', 'Vercel', 'AWS'
    ]
  },
  'ux-ui': {
    title: 'UX/UI Design',
    subtitle: 'Diseño de experiencias digitales centradas en el usuario. Desde la investigación hasta el prototipo final, creando interfaces intuitivas y atractivas.',
    features: [
      'Investigación de usuarios y análisis',
      'Arquitectura de información',
      'Wireframes y prototipos interactivos',
      'Diseño de interfaz de usuario (UI)',
      'Design systems y guías de estilo',
      'Testing de usabilidad',
      'Optimización de conversiones',
      'Diseño para móviles y tablets'
    ],
    technologies: [
      'Figma', 'Adobe XD', 'Sketch', 'InVision',
      'Miro', 'Principle', 'Framer', 'Maze',
      'Google Analytics', 'Hotjar'
    ]
  },
  'graphic-design': {
    title: 'Diseño Gráfico',
    subtitle: 'Identidad visual y materiales gráficos que comunican la esencia de tu marca de manera efectiva y memorable.',
    features: [
      'Diseño de logotipos e identidad corporativa',
      'Manual de marca y brand guidelines',
      'Papelería comercial y tarjetas',
      'Diseño editorial y publicaciones',
      'Packaging y etiquetas',
      'Diseño para redes sociales',
      'Ilustraciones personalizadas',
      'Presentaciones corporativas'
    ],
    technologies: [
      'Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign',
      'Figma', 'CorelDRAW', 'Canva Pro',
      'Adobe After Effects', 'Procreate'
    ]
  }
};