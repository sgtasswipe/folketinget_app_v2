// AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState(null); // store uuid, token, etc.

  const login = (sessionData) => {
    setIsLoggedIn(true);
    setSession(sessionData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
