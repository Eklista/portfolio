// src/components/index.js

// ===== LAYOUT COMPONENTS =====
export { default as Taskbar } from './layout/Taskbar';

// ===== DESKTOP COMPONENTS =====
export { default as DesktopOS } from './desktop/DesktopOs';
export { default as Folder } from './desktop/Folder';
export { default as FolderWindow } from './desktop/FolderWindow';

// ===== CHAT COMPONENTS =====
export { default as ChatTerminal } from './chat/ChatTerminal';
export { default as ChatMessage } from './chat/ChatMessage';
export { default as ChatInput } from './chat/ChatInput';

// ===== UI COMPONENTS =====
export { default as TechCard } from './ui/TechCard';
export { default as LoadingSpinner } from './ui/LoadingSpinner';
export { default as Button } from './ui/Button';
export { default as Modal } from './ui/Modal';

// ===== PAGES =====
export { default as QuotePage } from './pages/QuotePage';

// ===== LEGACY (para compatibilidad) =====
// Estos exports mantendrán el código existente funcionando
export { default as DraggableTerminal } from './chat/ChatTerminal'; // Alias para compatibilidad