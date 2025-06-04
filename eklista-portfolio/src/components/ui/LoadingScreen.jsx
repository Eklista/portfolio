import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesktopOS } from '..';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    // Tiempo de carga más largo: 3 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Pequeño delay para la transición suave
      setTimeout(() => {
        setShowDesktop(true);
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Si ya terminó de cargar, mostrar el desktop
  if (showDesktop) {
    return <DesktopOS />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Mismo wallpaper que el desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/wallpaper.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo EKLISTA */}
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight font-poppins mb-4">
                EKLISTA
              </h1>
              <motion.div
                className="w-32 h-1 bg-accent-primary mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
            </motion.div>

            {/* Spinner simple y elegante */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mb-8"
            >
              <div className="relative">
                {/* Círculo de fondo */}
                <div className="w-16 h-16 border-4 border-white/10 rounded-full" />
                
                {/* Círculo de progreso */}
                <motion.div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-primary border-r-accent-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                
                {/* Punto central pulsante */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-3 h-3 bg-accent-primary rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Texto de carga */}
            <motion.p
              className="text-white/90 text-lg font-inter font-medium mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              Cargando Portfolio
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="text-white/60 text-sm font-inter font-light text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              Preparando experiencia creativa
            </motion.p>

            {/* Barra de progreso minimalista */}
            <motion.div
              className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transición suave al desktop */}
      <AnimatePresence>
        {!isLoading && !showDesktop && (
          <motion.div
            className="absolute inset-0 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;