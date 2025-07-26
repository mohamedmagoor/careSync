import React, { createContext, useState,useEffect } from "react";

export const userContext = createContext();

export default function UserContextProvider(props) {
  const [userToken, setUserToken] = useState(null);
  const [userType, setUserType] = useState(null);


  return (
    <>
      <userContext.Provider value={{ userToken, setUserToken, userType, setUserType }}>
      {props.children}
      </userContext.Provider>
    </>
  );
}
