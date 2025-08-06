import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../NavBar/NavBar";
import Footer from "./../Footer/Footer";
import { Outlet } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";

export default function Layout() {
  const { userToken, setUserToken } = useContext(userContext);
  const { i18n } = useTranslation();

  // Set dir attribute on html for RTL/LTR
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    // Initialize theme only - user token is handled by UserContext
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Global language toggle button
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  return (
    <div className="layout">
      <button
        onClick={toggleLanguage}
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 2000,
          padding: "8px 16px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
        aria-label="Toggle language"
      >
        {i18n.language === "en" ? "العربية" : "English"}
      </button>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
