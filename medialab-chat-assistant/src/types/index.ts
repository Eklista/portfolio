// Tipos compartidos para toda la aplicación

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  error?: boolean;
}

export type ChatStatus = 'idle' | 'typing' | 'extracting' | 'error' | 'completed';

export interface FormData {
  activityType?: 'single' | 'recurrent' | 'podcast' | 'course';
  activityName?: string;
  faculty?: 'FISICC' | 'FACTI' | 'FACOM';
  date?: string;
  startTime?: string;
  endTime?: string;
  locationType?: 'university' | 'external' | 'virtual';
  location?: string;
  description?: string;
  services?: string[];
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  recurrencePattern?: string;
  moderators?: string[];
  guests?: string[];
  courses?: string[];
  professors?: string[];
  confidence?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  message: string;
}

export interface Progress {
  percentage: number;
  completedFields: number;
  totalFields: number;
  confidence: number;
}