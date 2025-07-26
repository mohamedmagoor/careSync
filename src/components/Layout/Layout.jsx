import React, { useContext, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "./../Footer/Footer";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";

export default function Layout() {
  const { userToken, setUserToken } = useContext(userContext);

  useEffect(() => {
    // Initialize user token
    if (localStorage.getItem("userToken") !== null) {
      setUserToken(localStorage.getItem("userToken"));
    }
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [setUserToken]);

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
