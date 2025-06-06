// src/data/types.ts
// Tipos base que replican tu estructura de DB

export interface DepartmentType {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  abbreviation: string;
  description?: string;
  type_id: number;
  type?: DepartmentType;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  icon_name?: string;
}

export interface SubService {
  id: number;
  name: string;
  description?: string;
  service_id: number;
  icon?: string;
}

export interface ServicesStructured {
  [serviceId: string]: {
    service: Service;
    subServices: SubService[];
  };
}

export interface Career {
  id: number;
  name: string;
  department_id: number;
  department?: Department;
}

export interface LocationDetails {
  type: 'university' | 'external' | 'virtual';
  tower?: string;
  classroom?: string;
  externalAddress?: string;
  description?: string;
}

export interface RecurrencePattern {
  isRecurrent: boolean;
  type?: 'daily' | 'weekly' | 'monthly' | 'manual';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  weekDays?: string[];
  weekOfMonth?: 'first' | 'second' | 'third' | 'fourth' | 'last';
  dayOfMonth?: number;
  selectedDates?: string[];
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  department_id: number;
  position?: string;
  requestDate: string;
  additionalNotes?: string;
}

// Interfaces para diferentes tipos de requests (basadas en tus modelos)
export interface BaseRequestData {
  activity_type: 'single' | 'recurrent' | 'podcast' | 'course';
  requester: ContactInfo;
  location: LocationDetails;
  services: {
    mainServices: number[];
    subServices: { [serviceId: number]: number[] };
    details?: { [subServiceId: number]: string };
  };
}

export interface SingleEventData extends BaseRequestData {
  activity_type: 'single';
  activityName: string;
  department_id: number;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface RecurrentEventData extends BaseRequestData {
  activity_type: 'recurrent';
  activityName: string;
  department_id: number;
  recurrence: RecurrencePattern;
  description?: string;
}

export interface PodcastData extends BaseRequestData {
  activity_type: 'podcast';
  podcastName: string;
  department_id: number;
  description?: string;
  recurrence: RecurrencePattern;
  moderators: Array<{
    name: string;
    position: string;
    role: string;
  }>;
  episodes: Array<{
    title: string;
    topic: string;
    department_id?: number;
    description?: string;
    guests?: string[];
  }>;
}

export interface CourseData extends BaseRequestData {
  activity_type: 'course';
  careerName: string;
  department_id: number;
  description?: string;
  recurrence: RecurrencePattern;
  courses: Array<{
    name: string;
    professor: string;
    department_id?: number;
    duration: string;
    description?: string;
    recordingDates?: string[];
    recordingTime?: string;
  }>;
}

export type RequestData = SingleEventData | RecurrentEventData | PodcastData | CourseData;