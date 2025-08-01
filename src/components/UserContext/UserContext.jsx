import React, { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export default function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    console.log('UserContext: Initializing from localStorage...');
    const token = localStorage.getItem("userToken");
    const type = localStorage.getItem("userType");
    console.log('UserContext: Found in localStorage:', { token: token ? 'exists' : 'null', type });
    if (token && type) {
      setUserToken(token);
      setUserType(type);
      console.log('UserContext: Set user data from localStorage');
    }
    setIsLoading(false);
    console.log('UserContext: Finished initialization');
  }, []);

  const login = (token, type) => {
    setUserToken(token);
    setUserType(type);
    localStorage.setItem("userToken", token);
    localStorage.setItem("userType", type);
  };

  const logout = () => {
    setUserToken(null);
    setUserType(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
  };

  const value = {
    userToken,
    setUserToken,
    userType,
    setUserType,
    login,
    logout,
    isLoading,
    setIsLoading,
    theme,
    setTheme,
    toggleTheme,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}
