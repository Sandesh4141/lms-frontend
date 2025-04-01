import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define types
type AuthContextType = {
  token: string | null;
  role: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  username: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const login = async (username: string, password: string, role: string) => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password,
        role,
      });

      const token = res.data.token;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      // Update state
      setToken(token);
      setRole(role);
      setUsername(username);

      // Redirect
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUsername(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
