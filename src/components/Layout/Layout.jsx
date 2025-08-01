import React, { useContext, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "./../Footer/Footer";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";

export default function Layout() {
  const { userToken, setUserToken } = useContext(userContext);

  useEffect(() => {
    // Initialize theme only - user token is handled by UserContext
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
