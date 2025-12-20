import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavRoutes = ['/', '/login'];

  if (noNavRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 ml-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;