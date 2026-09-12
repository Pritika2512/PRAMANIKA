import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService.js";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser);
  const login = async (values) => {
    const next = await authService.login(values);
    setUser(next);
    return next;
  };
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  const refreshUser = () => setUser(authService.getCurrentUser());
  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
