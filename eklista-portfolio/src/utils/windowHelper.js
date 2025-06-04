// src/utils/windowHelpers.js
export const getWindowDimensions = (windowType = 'default') => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Configuraciones base por tipo de ventana
  const windowConfigs = {
    explorer: {
      mobile: {
        width: screenWidth - 32, // 16px margin cada lado
        height: screenHeight - 160, // Espacio para header y taskbar
        position: { x: 16, y: 80 }
      },
      tablet: {
        width: Math.min(900, screenWidth - 80),
        height: Math.min(700, screenHeight - 160),
        position: { x: 40, y: 80 }
      },
      desktop: {
        width: Math.min(1200, screenWidth - 200),
        height: Math.min(800, screenHeight - 200),
        position: { x: 100, y: 100 }
      }
    },
    contact: {
      mobile: {
        width: screenWidth - 32,
        height: screenHeight - 160,
        position: { x: 16, y: 80 }
      },
      tablet: {
        width: Math.min(800, screenWidth - 80),
        height: Math.min(600, screenHeight - 160),
        position: { x: 40, y: 80 }
      },
      desktop: {
        width: Math.min(1000, screenWidth - 200),
        height: Math.min(700, screenHeight - 200),
        position: { x: 150, y: 120 }
      }
    },
    info: {
      mobile: {
        width: screenWidth - 32,
        height: screenHeight - 160,
        position: { x: 16, y: 80 }
      },
      tablet: {
        width: Math.min(800, screenWidth - 80),
        height: Math.min(650, screenHeight - 160),
        position: { x: 40, y: 80 }
      },
      desktop: {
        width: Math.min(1000, screenWidth - 200),
        height: Math.min(750, screenHeight - 200),
        position: { x: 120, y: 100 }
      }
    },
    techcard: {
      mobile: {
        width: screenWidth - 32,
        height: screenHeight - 160,
        position: { x: 16, y: 80 }
      },
      tablet: {
        width: Math.min(900, screenWidth - 80),
        height: Math.min(700, screenHeight - 160),
        position: { x: 40, y: 80 }
      },
      desktop: {
        width: Math.min(1200, screenWidth - 200),
        height: Math.min(800, screenHeight - 200),
        position: { x: 100, y: 80 }
      }
    }
  };

  // Seleccionar configuración según dispositivo
  const config = windowConfigs[windowType] || windowConfigs.explorer;
  
  if (isMobile) {
    return {
      ...config.mobile,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      deviceType: 'mobile'
    };
  } else if (isTablet) {
    return {
      ...config.tablet,
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      deviceType: 'tablet'
    };
  } else {
    return {
      ...config.desktop,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      deviceType: 'desktop'
    };
  }
};

export const getMaximizedDimensions = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;

  return {
    width: isMobile ? screenWidth : screenWidth - 40,
    height: isMobile ? screenHeight - 80 : screenHeight - 120,
    position: { x: isMobile ? 0 : 20, y: isMobile ? 0 : 20 }
  };
};

export const getDragConstraints = (windowSize, isMaximized = false) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 768;

  if (isMaximized || isMobile) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
  }

  return {
    left: 0,
    right: Math.max(0, screenWidth - windowSize.width),
    top: 0,
    bottom: Math.max(0, screenHeight - windowSize.height - 80) // 80px para taskbar
  };
};

// Hook personalizado para dimensiones de ventana
export const useWindowDimensions = (windowType = 'default') => {
  const [dimensions, setDimensions] = React.useState(() => getWindowDimensions(windowType));

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions(getWindowDimensions(windowType));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowType]);

  return dimensions;
};