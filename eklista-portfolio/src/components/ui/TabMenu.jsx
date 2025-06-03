import React from 'react';
import { serviceCategories } from '../../data/services';

const TabMenu = ({ activeTab, onTabChange, showCounts = false, projects = null }) => {
  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden mb-6">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full bg-surface border-2 border-primary text-primary rounded-xl px-4 py-3 font-inter font-medium appearance-none cursor-pointer focus:border-accent focus:outline-none"
          >
            {serviceCategories.map((category) => {
              const projectCount = showCounts && projects ? (projects[category.id]?.length || 0) : null;
              return (
                <option key={category.id} value={category.id} className="bg-surface text-primary">
                  {category.name} {projectCount !== null ? `(${projectCount})` : ''}
                </option>
              );
            })}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Tabs (para casos donde se prefiera horizontal) */}
      <div className="hidden md:flex gap-3 justify-center">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon;
          const isActive = category.id === activeTab;
          const projectCount = showCounts && projects ? (projects[category.id]?.length || 0) : null;
          
          return (
            <button
              key={category.id}
              onClick={() => onTabChange(category.id)}
              className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 group ${
                isActive
                  ? 'border-accent bg-accent-surface shadow-accent'
                  : 'border-primary bg-surface hover:border-secondary card-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? 'bg-accent text-primary' 
                    : 'bg-primary text-accent group-hover:bg-accent group-hover:text-primary'
                } transition-colors duration-300`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="text-left">
                  <h4 className={`font-poppins font-semibold text-sm ${
                    isActive ? 'text-primary' : 'text-primary group-hover:text-accent'
                  } transition-colors duration-300`}>
                    {category.name}
                  </h4>
                  {projectCount !== null && (
                    <span className={`font-inter text-xs ${
                      isActive ? 'text-secondary' : 'text-muted'
                    }`}>
                      {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabMenu;