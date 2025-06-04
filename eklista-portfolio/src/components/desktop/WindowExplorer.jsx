import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Maximize2, 
  ArrowLeft, 
  Home, 
  ChevronRight,
  Folder as FolderIcon,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Zap
} from 'lucide-react';
import { explorerStructure, projectsData } from '../../data/projects';
import TechCard from '../ui/TechCard';

const WindowExplorer = ({ 
  window, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  onBringToFront 
}) => {
  const [currentPath, setCurrentPath] = useState([window.id]);
  const [selectedProject, setSelectedProject] = useState(null);

  if (isMinimized) return null;

  // Obtener contenido actual basado en la ruta
  const getCurrentContent = () => {
    let current = explorerStructure[currentPath[0]];
    
    for (let i = 1; i < currentPath.length; i++) {
      current = current.children[currentPath[i]];
    }
    
    return current;
  };

  // Obtener proyectos si estamos en una carpeta de proyectos
  const getCurrentProjects = () => {
    const current = getCurrentContent();
    if (typeof current.children === 'string') {
      return projectsData[current.children] || [];
    }
    return null;
  };

  // Navegación
  const navigateTo = (pathSegment) => {
    setCurrentPath([...currentPath, pathSegment]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateHome = () => {
    setCurrentPath([window.id]);
  };

  // Generar breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let current = explorerStructure[currentPath[0]];
    breadcrumbs.push({ name: current.name, path: [currentPath[0]] });

    for (let i = 1; i < currentPath.length; i++) {
      current = current.children[currentPath[i]];
      breadcrumbs.push({ 
        name: current.name, 
        path: currentPath.slice(0, i + 1) 
      });
    }

    return breadcrumbs;
  };

  const currentContent = getCurrentContent();
  const currentProjects = getCurrentProjects();
  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <motion.div
        className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        style={{
          left: window.position.x,
          top: window.position.y,
          width: window.size.width,
          height: window.size.height,
          zIndex: window.zIndex || 100
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        drag={!window.isMaximized}
        dragMomentum={false}
        onMouseDown={() => onBringToFront(window.windowId)}
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Window Header */}
        <div className="bg-gray-100/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-200/50 cursor-move">
          {/* Navigation & Title */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Navigation buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={navigateBack}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atrás"
              >
                <ArrowLeft size={14} className="text-gray-600" />
              </button>
              <button
                onClick={navigateHome}
                disabled={currentPath.length <= 1}
                className="w-8 h-8 bg-white/60 hover:bg-blue-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Inicio"
              >
                <Home size={14} className="text-gray-600" />
              </button>
            </div>

            {/* Window icon and title */}
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentContent.color} flex items-center justify-center shadow-sm`}>
              <currentContent.icon size={18} className="text-white" />
            </div>
            
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPath(crumb.path)}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    {crumb.name}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Window controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onMinimize(window)}
              className="w-8 h-8 bg-white/60 hover:bg-yellow-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Minimizar"
            >
              <Minus size={14} className="text-gray-600 group-hover:text-yellow-600" />
            </button>
            
            <button 
              onClick={() => onMaximize && onMaximize(window.windowId)}
              className="w-8 h-8 bg-white/60 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors group" 
              title={window.isMaximized ? "Restaurar" : "Maximizar"}
            >
              {window.isMaximized ? (
                <Square size={14} className="text-gray-600 group-hover:text-green-600" />
              ) : (
                <Maximize2 size={14} className="text-gray-600 group-hover:text-green-600" />
              )}
            </button>
            
            <button
              onClick={() => onClose(window.windowId)}
              className="w-8 h-8 bg-white/60 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors group"
              title="Cerrar"
            >
              <X size={14} className="text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Content Header */}
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gray-50/50">
            <h2 className="font-bold text-gray-800 text-lg">{currentContent.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{currentContent.description}</p>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Si hay subcarpetas, mostrarlas */}
            {currentContent.children && typeof currentContent.children === 'object' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {Object.entries(currentContent.children).map(([key, folder]) => {
                  const IconComponent = folder.icon;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => navigateTo(key)}
                      className="group p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${folder.color} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                        <FolderIcon size={24} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{folder.name}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{folder.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Si hay proyectos, mostrarlos */}
            {currentProjects && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProjects.map((project, index) => {
                  const IconComponent = project.icon;
                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="group p-6 bg-white/60 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-200 text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Project Preview Image */}
                      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-2 right-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.color || 'from-gray-500 to-gray-700'} flex items-center justify-center shadow-sm`}>
                            <IconComponent size={16} className="text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors mt-1" />
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User size={10} />
                            <span>{project.client}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={10} />
                            <span>{project.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag size={10} />
                            <span>{project.category}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tech Stack Preview */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.technologies.slice(0, 3).map((tech, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Results/Impact */}
                        {project.results && (
                          <div className="flex items-center space-x-1 mt-2 p-2 bg-green-50 rounded-lg">
                            <Zap size={12} className="text-green-600" />
                            <span className="text-green-700 text-xs font-medium">
                              {project.results}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!currentContent.children && !currentProjects && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FolderIcon size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-600 font-medium mb-2">Carpeta vacía</h3>
                <p className="text-gray-500 text-sm">No hay contenido disponible en esta ubicación.</p>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="px-6 py-2 border-t border-gray-200/50 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {currentProjects && (
                <span>{currentProjects.length} elemento{currentProjects.length !== 1 ? 's' : ''}</span>
              )}
              {currentContent.children && typeof currentContent.children === 'object' && (
                <span>{Object.keys(currentContent.children).length} carpeta{Object.keys(currentContent.children).length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>EKLISTA Portfolio Explorer</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <TechCard 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
};

export default WindowExplorer;