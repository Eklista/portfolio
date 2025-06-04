import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Wifi, 
  Battery, 
  Volume2,
  User,
  MessageSquare
} from 'lucide-react';

const Taskbar = ({ 
  openWindows = [], 
  onWindowToggle, 
  onChatToggle, 
  isChatOpen = false,
  showNotifications = false,
  onNotificationsToggle
}) => {
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [batteryLevel] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Taskbar principal */}
      <motion.div 
        className="bg-surface/95 backdrop-blur-xl border-t border-primary h-16 flex items-center justify-between px-3 md:px-6 shadow-large"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Lado izquierdo */}
        <div className="flex items-center space-x-3">
          {/* Start Button */}
          <motion.button
            onClick={() => setShowStartMenu(!showStartMenu)}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-medium hover:shadow-accent transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-primary font-bold text-sm">EK</div>
          </motion.button>

          {/* Separator */}
          <div className="w-px h-8 bg-border-primary hidden md:block"></div>

          {/* Terminal Button */}
          <motion.button
            onClick={onChatToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isChatOpen 
                ? 'bg-accent-primary text-primary shadow-accent' 
                : 'bg-transparent hover:bg-hover-overlay text-muted hover:text-accent'
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Terminal"
          >
            {isChatOpen ? (
              <MessageSquare size={18} className="fill-current" />
            ) : (
              <Terminal size={18} />
            )}
          </motion.button>
        </div>

        {/* Centro - Windows abiertas */}
        <div className="flex-1 flex items-center justify-center space-x-2 mx-2 md:mx-4 overflow-x-auto max-w-xl">
          <AnimatePresence>
            {openWindows.map((window) => (
              <motion.button
                key={window.windowId || window.id}
                onClick={() => onWindowToggle(window)}
                className={`flex items-center space-x-2 px-2 md:px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-shrink-0 ${
                  window.isMinimized 
                    ? 'bg-border-primary hover:bg-border-secondary' 
                    : 'bg-accent-surface hover:bg-accent-primary/20 border border-accent-primary/30'
                }`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                title={window.content?.title || window.name || 'Ventana'}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center bg-gradient-to-br ${window.color || 'from-gray-500 to-gray-700'}`}>
                  {window.icon && <window.icon size={10} className="text-white" />}
                </div>
                <span className="text-xs font-medium text-secondary truncate max-w-24 hidden sm:block">
                  {window.content?.title || window.name || 'Ventana'}
                </span>
                {!window.isMinimized && (
                  <div className="w-1 h-1 rounded-full bg-accent-primary"></div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Lado derecho - System tray */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* System Icons - Solo en desktop */}
          <div className="hidden md:flex items-center space-x-2 text-muted">
            <Wifi size={16} className="hover:text-accent transition-colors cursor-pointer" />
            <Volume2 size={16} className="hover:text-accent transition-colors cursor-pointer" />
            <div className="flex items-center space-x-1 hover:text-accent transition-colors cursor-pointer">
              <Battery size={16} />
              <span className="text-xs font-mono">{batteryLevel}%</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-border-primary hidden md:block"></div>

          {/* Date & Time */}
          <motion.button
            onClick={() => onNotificationsToggle && onNotificationsToggle()}
            className="text-right hover:bg-hover-overlay px-2 py-1 rounded transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xs md:text-sm font-medium text-secondary">
              {time.toLocaleTimeString('es-GT', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })}
            </div>
            <div className="text-xs text-muted hidden md:block">
              {time.toLocaleDateString('es-GT', { 
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })}
            </div>
          </motion.button>

          {/* Show Desktop Button */}
          <div className="w-3 h-full border-l border-border-primary hover:bg-accent-primary/20 transition-colors cursor-pointer"></div>
        </div>
      </motion.div>

      {/* Start Menu */}
      <AnimatePresence>
        {showStartMenu && (
          <motion.div
            className="absolute bottom-16 left-4 w-80 bg-secondary/95 backdrop-blur-xl rounded-2xl border border-primary shadow-large overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-primary">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <div className="font-poppins font-bold text-primary">EKLISTA</div>
                  <div className="text-xs text-muted">Creative Portfolio OS</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: User, label: 'Perfil', color: 'from-blue-500 to-cyan-500' },
                  { icon: Terminal, label: 'Terminal', color: 'from-gray-500 to-gray-700' },
                  { icon: MessageSquare, label: 'Chat', color: 'from-purple-500 to-pink-500' }
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-hover-overlay transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowStartMenu(false)}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon size={16} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-secondary">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="absolute bottom-16 right-4 w-80 md:w-96 bg-secondary/95 backdrop-blur-xl rounded-2xl border border-primary shadow-large overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <h3 className="font-poppins font-bold text-primary mb-4">Notificaciones</h3>
              <div className="space-y-3">
                <div className="p-3 bg-surface rounded-lg border border-primary">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-accent-primary mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-secondary">Sistema actualizado</div>
                      <div className="text-xs text-muted mt-1">Portfolio OS v2.0 - Terminal integrada</div>
                      <div className="text-xs text-subtle mt-1">Hace 2 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar menús */}
      {(showStartMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            e.stopPropagation();
            setShowStartMenu(false);
            // Solo cerrar notificaciones si no viene de onNotificationsToggle
            if (showNotifications && onNotificationsToggle) {
              onNotificationsToggle();
            }
          }}
        />
      )}
    </div>
  );
};

export default Taskbar;