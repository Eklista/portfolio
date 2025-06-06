
// src/data/locations.ts
export interface Tower {
  id: string;
  name: string;
  description?: string;
  floors: number;
}

export interface Classroom {
  id: string;
  name: string;
  tower_id: string;
  floor: number;
  capacity: number;
  type: 'aula' | 'auditorio' | 'laboratorio' | 'sala_conferencias' | 'estudio' | 'cabina_audio';
  equipment?: string[];
  isPopular?: boolean;
}

export const TOWERS: Tower[] = [
  {
    id: 'T1',
    name: 'Torre 1',
    description: 'Torre principal con salones académicos',
    floors: 6
  },
  {
    id: 'T2', 
    name: 'Torre 2',
    description: 'Torre académica - Incluye MediaLab y estudios',
    floors: 6
  },
  {
    id: 'T3',
    name: 'Torre 3',
    description: 'Torre con salones en nivel superior',
    floors: 6
  }
];

// Generar salones automáticamente para Torre 1 y Torre 2
const generateClassrooms = (): Classroom[] => {
  const classrooms: Classroom[] = [];
  
  // Torre 1 - 6 niveles, ~20 salones por nivel
  for (let floor = 1; floor <= 6; floor++) {
    for (let room = 1; room <= 20; room++) {
      const roomNumber = room.toString().padStart(2, '0');
      const id = `T1-${floor}${roomNumber}`;
      const name = `Salón ${floor}${roomNumber}`;
      
      // Marcar salones populares
      const isPopular = (floor === 5 && roomNumber === '11') || (floor === 4 && roomNumber === '01');
      
      classrooms.push({
        id,
        name,
        tower_id: 'T1',
        floor,
        capacity: Math.floor(Math.random() * 30) + 25, // 25-55 personas
        type: 'aula',
        isPopular
      });
    }
  }
  
  // Torre 2 - 6 niveles, ~20 salones por nivel + MediaLab
  for (let floor = 1; floor <= 6; floor++) {
    for (let room = 1; room <= 20; room++) {
      const roomNumber = room.toString().padStart(2, '0');
      const id = `T2-${floor}${roomNumber}`;
      const name = `Salón ${floor}${roomNumber}`;
      
      classrooms.push({
        id,
        name,
        tower_id: 'T2',
        floor,
        capacity: Math.floor(Math.random() * 30) + 25, // 25-55 personas
        type: 'aula'
      });
    }
  }
  
  // Torre 3 - Solo nivel 6 con salones
  for (let room = 1; room <= 10; room++) {
    const roomNumber = room.toString().padStart(2, '0');
    const id = `T3-6${roomNumber}`;
    const name = `Salón 6${roomNumber}`;
    
    classrooms.push({
      id,
      name,
      tower_id: 'T3',
      floor: 6,
      capacity: Math.floor(Math.random() * 25) + 20, // 20-45 personas
      type: 'aula'
    });
  }
  
  return classrooms;
};

export const CLASSROOMS: Classroom[] = [
  ...generateClassrooms(),
  
  // MediaLab - Torre 2 (ubicación específica del departamento)
  {
    id: 'T2-MEDIALAB-E1',
    name: 'Estudio 1 - MediaLab',
    tower_id: 'T2',
    floor: 2, // Ajustar según ubicación real
    capacity: 15,
    type: 'estudio',
    equipment: ['cámaras_profesionales', 'iluminación_led', 'chroma_key', 'teleprompter']
  },
  {
    id: 'T2-MEDIALAB-E2',
    name: 'Estudio 2 - MediaLab',
    tower_id: 'T2',
    floor: 2, // Ajustar según ubicación real
    capacity: 12,
    type: 'estudio',
    equipment: ['cámaras_profesionales', 'iluminación_básica', 'fondo_neutro']
  },
  {
    id: 'T2-MEDIALAB-C1',
    name: 'Cabina de Audio 1',
    tower_id: 'T2',
    floor: 2, // Ajustar según ubicación real
    capacity: 4,
    type: 'cabina_audio',
    equipment: ['micrófonos_profesionales', 'consola_audio', 'tratamiento_acústico', 'escritorio']
  },
  {
    id: 'T2-MEDIALAB-C2',
    name: 'Cabina de Audio 2',
    tower_id: 'T2',
    floor: 2, // Ajustar según ubicación real
    capacity: 4,
    type: 'cabina_audio',
    equipment: ['micrófonos_profesionales', 'consola_audio', 'tratamiento_acústico', 'escritorio']
  },
  {
    id: 'T2-MEDIALAB-C3',
    name: 'Cabina de Audio 3',
    tower_id: 'T2',
    floor: 2, // Ajustar según ubicación real
    capacity: 4,
    type: 'cabina_audio',
    equipment: ['micrófonos_básicos', 'interface_audio', 'escritorio', 'uso_general']
  }
];

// Ubicaciones externas actualizadas
export const EXTERNAL_LOCATIONS = [
  'Hotel Westin Camino Real',
  'Hotel Hilton Guatemala City',
  'Hotel Barceló Guatemala City',
  'Hotel Real InterContinental',
  'Hotel Villa Colonial',
  'Hotel Clarion Suites',
  'Casa Santo Domingo',
  'Centro de Convenciones Grand Tikal Futura',
  'Centro Cultural Miguel Ángel Asturias',
  'Oakland Mall',
  'Centro Comercial Miraflores',
  'Instalaciones del cliente',
  'Ubicación por definir'
];

// Funciones de utilidad
export const getTowerById = (id: string): Tower | undefined => {
  return TOWERS.find(tower => tower.id === id);
};

export const getClassroomById = (id: string): Classroom | undefined => {
  return CLASSROOMS.find(classroom => classroom.id === id);
};

export const getClassroomsByTower = (towerId: string): Classroom[] => {
  return CLASSROOMS.filter(classroom => classroom.tower_id === towerId);
};

export const getClassroomsByType = (type: Classroom['type']): Classroom[] => {
  return CLASSROOMS.filter(classroom => classroom.type === type);
};

export const getPopularClassrooms = (): Classroom[] => {
  return CLASSROOMS.filter(classroom => classroom.isPopular);
};

export const getMediaLabSpaces = (): Classroom[] => {
  return CLASSROOMS.filter(classroom => classroom.id.includes('MEDIALAB'));
};

export const getLocationOptions = () => {
  // Organizar por torres
  const towerOptions = TOWERS.map(tower => ({
    label: tower.name,
    value: tower.id,
    children: getClassroomsByTower(tower.id).map(classroom => ({
      value: classroom.id,
      label: `${classroom.name} (Cap: ${classroom.capacity})`,
      capacity: classroom.capacity,
      type: classroom.type,
      isPopular: classroom.isPopular
    }))
  }));
  
  return towerOptions;
};

export const getQuickLocationOptions = () => {
  // Salones más populares + MediaLab
  const popular = getPopularClassrooms();
  const medialab = getMediaLabSpaces();
  
  return [
    ...popular.map(room => ({
      value: room.id,
      label: `${room.name} - ${room.tower_id} (Popular)`,
      type: room.type,
      isPopular: true
    })),
    ...medialab.map(room => ({
      value: room.id,
      label: `${room.name} - MediaLab`,
      type: room.type,
      isMediaLab: true
    }))
  ];
};

export const searchClassrooms = (query: string): Classroom[] => {
  const lowerQuery = query.toLowerCase();
  return CLASSROOMS.filter(classroom => 
    classroom.name.toLowerCase().includes(lowerQuery) ||
    classroom.id.toLowerCase().includes(lowerQuery) ||
    classroom.type.toLowerCase().includes(lowerQuery)
  );
};