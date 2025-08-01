import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userToken, userType, isLoading } = useContext(userContext);

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    userToken: userToken ? 'Token exists' : 'No token',
    userType: userType,
    allowedRoles: allowedRoles,
    localStorageToken: localStorage.getItem('userToken'),
    localStorageType: localStorage.getItem('userType')
  });

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  // Check if user is authenticated
  if (!userToken) {
    console.log('Redirecting to login: No userToken');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userType)) {
    console.log('Redirecting to home: User type', userType, 'not in allowed roles', allowedRoles);
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to protected route');
  return children;
}