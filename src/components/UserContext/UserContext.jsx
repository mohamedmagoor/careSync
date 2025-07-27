import React, { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export default function UserContextProvider(props) {
  // Track if authentication is being initialized
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from localStorage or default to null
  const [userToken, setUserToken] = useState(() => {
    try {
      return localStorage.getItem("userToken") || null;
    } catch (error) {
      console.error("Error reading userToken from localStorage:", error);
      return null;
    }
  });

  const [userType, setUserType] = useState(() => {
    try {
      return localStorage.getItem("userType") || null;
    } catch (error) {
      console.error("Error reading userType from localStorage:", error);
      return null;
    }
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("userToken");
        const type = localStorage.getItem("userType");

        if (token && type) {
          setUserToken(token);
          setUserType(type);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Persist userToken to localStorage whenever it changes
  useEffect(() => {
    try {
      if (userToken) {
        localStorage.setItem("userToken", userToken);
      } else {
        localStorage.removeItem("userToken");
      }
    } catch (error) {
      console.error("Error saving userToken to localStorage:", error);
    }
  }, [userToken]);

  // Persist userType to localStorage whenever it changes
  useEffect(() => {
    try {
      if (userType) {
        localStorage.setItem("userType", userType);
      } else {
        localStorage.removeItem("userType");
      }
    } catch (error) {
      console.error("Error saving userType to localStorage:", error);
    }
  }, [userType]);

  // Enhanced logout function to clear all auth data
  const logout = () => {
    try {
      setUserToken(null);
      setUserType(null);
      localStorage.removeItem("userToken");
      localStorage.removeItem("userType");
      // Clear any other auth-related data
      localStorage.removeItem("user");
      localStorage.removeItem("authData");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <userContext.Provider
        value={{
          userToken,
          setUserToken,
          userType,
          setUserType,
          isLoading,
          logout,
        }}
      >
        {props.children}
      </userContext.Provider>
    </>
  );
}
