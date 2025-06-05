// src/components/index.js - ACTUALIZADO con WindowQuote

// ===== LAYOUT COMPONENTS =====
export { default as Taskbar } from './layout/Taskbar';

// ===== DESKTOP COMPONENTS =====
export { default as DesktopOS } from './desktop/DesktopOs';
export { default as Folder } from './desktop/Folder';
export { default as FolderWindow } from './desktop/FolderWindow';    // LEGACY - para compatibilidad
export { default as WindowExplorer } from './desktop/WindowExplorer'; // NUEVO
export { default as WindowInfo } from './desktop/WindowInfo';         // NUEVO
export { default as WindowContact } from './desktop/WindowContact';   // NUEVO
export { default as WindowQuote } from './desktop/WindowQuote';       // NUEVO

// ===== CHAT COMPONENTS =====
export { default as ModernChat } from './chat/ModernChat';
export { default as ChatTerminal } from './chat/ChatTerminal';   // LEGACY - para compatibilidad
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
export { default as DraggableTerminal } from './chat/ChatTerminal';