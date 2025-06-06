// src/data/departments.ts
import type { DepartmentType, Department, Career } from './types';

export const DEPARTMENT_TYPES: DepartmentType[] = [
  { id: 1, name: 'Facultad' },
  { id: 2, name: 'Escuela' },
  { id: 3, name: 'Instituto' },
  { id: 4, name: 'Centro' }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: 'Facultad de Ingeniería, Sistemas, Informática y Ciencias de la Computación',
    abbreviation: 'FISICC',
    description: 'Facultad especializada en tecnología e ingeniería',
    type_id: 1
  },
  {
    id: 2,
    name: 'Facultad de Ciencias y Tecnologías de la Información',
    abbreviation: 'FACTI',
    description: 'Facultad enfocada en tecnologías de la información',
    type_id: 1
  },
  {
    id: 3,
    name: 'Facultad de Comunicaciones',
    abbreviation: 'FACOM',
    description: 'Facultad de ciencias de la comunicación',
    type_id: 1
  },
  {
    id: 4,
    name: 'Facultad de Ciencias Médicas y de la Salud',
    abbreviation: 'FACIMED',
    description: 'Facultad de medicina y ciencias de la salud',
    type_id: 1
  },
  {
    id: 5,
    name: 'Facultad de Humanidades',
    abbreviation: 'FAHUM',
    description: 'Facultad de humanidades y ciencias sociales',
    type_id: 1
  },
  {
    id: 6,
    name: 'Facultad de Ciencias Económicas',
    abbreviation: 'FACE',
    description: 'Facultad de ciencias económicas y empresariales',
    type_id: 1
  },
  {
    id: 7,
    name: 'Facultad de Ciencias Jurídicas y Sociales',
    abbreviation: 'FACJUR',
    description: 'Facultad de derecho y ciencias jurídicas',
    type_id: 1
  },
  {
    id: 8,
    name: 'Facultad de Arquitectura',
    abbreviation: 'FAARQ',
    description: 'Facultad de arquitectura y diseño',
    type_id: 1
  },
  {
    id: 9,
    name: 'Centro de Estudios de Postgrado',
    abbreviation: 'CEPOG',
    description: 'Centro especializado en estudios de postgrado',
    type_id: 4
  },
  {
    id: 10,
    name: 'Instituto de Investigaciones',
    abbreviation: 'IDI',
    description: 'Instituto de investigación científica',
    type_id: 3
  }
];

export const CAREERS: Career[] = [
  // FISICC (id: 1)
  { id: 1, name: 'Ingeniería en Sistemas de Información y Ciencias de la Computación', department_id: 1 },
  { id: 2, name: 'Ingeniería en Sistemas de Información', department_id: 1 },
  { id: 3, name: 'Licenciatura en Informática y Administración de Negocios', department_id: 1 },
  { id: 4, name: 'Licenciatura en Tecnología y Administración de Redes de Computadoras', department_id: 1 },
  { id: 5, name: 'Técnico en Redes de Computadoras', department_id: 1 },
  { id: 6, name: 'Técnico en Sistemas de Computación', department_id: 1 },
  
  // FACTI (id: 2)
  { id: 7, name: 'Ingeniería en Tecnologías de la Información y Comunicaciones', department_id: 2 },
  { id: 8, name: 'Licenciatura en Tecnologías de la Información', department_id: 2 },
  { id: 9, name: 'Licenciatura en Ciberseguridad', department_id: 2 },
  { id: 10, name: 'Técnico en Desarrollo de Software', department_id: 2 },
  
  // FACOM (id: 3)
  { id: 11, name: 'Licenciatura en Ciencias de la Comunicación', department_id: 3 },
  { id: 12, name: 'Licenciatura en Publicidad y Diseño Gráfico Publicitario', department_id: 3 },
  { id: 13, name: 'Licenciatura en Comunicación y Producción Audiovisual', department_id: 3 },
  { id: 14, name: 'Técnico en Comunicación Digital', department_id: 3 },
  { id: 15, name: 'Técnico en Producción Audiovisual', department_id: 3 },
  
  // FACIMED (id: 4)
  { id: 16, name: 'Médico y Cirujano', department_id: 4 },
  { id: 17, name: 'Licenciatura en Enfermería', department_id: 4 },
  { id: 18, name: 'Licenciatura en Nutrición', department_id: 4 },
  { id: 19, name: 'Técnico en Emergencias Médicas', department_id: 4 },
  
  // FAHUM (id: 5)
  { id: 20, name: 'Licenciatura en Psicología', department_id: 5 },
  { id: 21, name: 'Licenciatura en Educación', department_id: 5 },
  { id: 22, name: 'Profesorado en Enseñanza Media', department_id: 5 },
  
  // FACE (id: 6)
  { id: 23, name: 'Licenciatura en Administración de Empresas', department_id: 6 },
  { id: 24, name: 'Licenciatura en Contaduría Pública y Auditoría', department_id: 6 },
  { id: 25, name: 'Licenciatura en Mercadotecnia', department_id: 6 },
  { id: 26, name: 'Licenciatura en Economía Empresarial', department_id: 6 },
  
  // FACJUR (id: 7)
  { id: 27, name: 'Licenciatura en Ciencias Jurídicas y Sociales', department_id: 7 },
  { id: 28, name: 'Licenciatura en Criminología', department_id: 7 },
  
  // FAARQ (id: 8)
  { id: 29, name: 'Arquitectura', department_id: 8 },
  { id: 30, name: 'Licenciatura en Diseño Industrial', department_id: 8 }
];

// Funciones de utilidad
export const getDepartmentById = (id: number): Department | undefined => {
  return DEPARTMENTS.find(dept => dept.id === id);
};

export const getDepartmentByAbbreviation = (abbreviation: string): Department | undefined => {
  return DEPARTMENTS.find(dept => dept.abbreviation === abbreviation);
};

export const getCareersByDepartment = (departmentId: number): Career[] => {
  return CAREERS.filter(career => career.department_id === departmentId);
};

export const getDepartmentOptions = () => {
  return DEPARTMENTS.map(dept => ({
    value: dept.id,
    label: `${dept.abbreviation} - ${dept.name}`,
    abbreviation: dept.abbreviation
  }));
};

export const getCareerOptions = () => {
  return CAREERS.map(career => {
    const department = getDepartmentById(career.department_id);
    return {
      value: career.id,
      label: career.name,
      department: department?.abbreviation || 'N/A',
      department_id: career.department_id
    };
  });
};