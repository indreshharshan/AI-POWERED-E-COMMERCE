import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Chatbot from "./Components/Chatbot";
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ScrollToTop from "./ScrollTop";


const AppLayout = () => {
  const location = useLocation();
 
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <ScrollToTop/>
      <Outlet />
      {location.pathname !== '/seller' && location.pathname !== '/login' && <Chatbot />}
      <Footer />
    </div>
  );
};

export default AppLayout;
