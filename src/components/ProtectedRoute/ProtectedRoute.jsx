import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "../UserContext/UserContext";

export default function ProtectedRoute(props) {
  const { userToken, isLoading } = useContext(userContext);

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
  if (userToken) {
    return props.children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
