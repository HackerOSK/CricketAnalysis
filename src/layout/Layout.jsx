import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = [ "/", "/login", "/register"].includes(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Adjust main content based on sidebar state
  const mainContentClass = hideSidebar 
    ? "w-screen min-h-screen bg-black" 
    : `transition-all duration-300 ${
        isSidebarOpen 
          ? 'ml-64 w-[calc(100%-16rem)]' 
          : 'ml-20 w-[calc(100%-5rem)]'
      }`;

  return (
    <div className="w-screen flex min-h-screen bg-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        hideSidebar={hideSidebar}
      />
      <main className={mainContentClass}>
        {children}
      </main>
    </div>
  );
};

export default Layout;



