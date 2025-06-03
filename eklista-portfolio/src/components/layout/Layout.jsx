import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary">
      {children}
    </div>
  );
};

export default Layout;