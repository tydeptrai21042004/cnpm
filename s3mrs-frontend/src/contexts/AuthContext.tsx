// src/contexts/AuthContext.tsx
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api";
import { User } from "../types";

interface State {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<State | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt")
  );
  const [user, setUser] = useState<User | null>(null);

  // Decode token on mount or when it changes
  useEffect(() => {
    if (!token) {
      console.log("AuthContext: no token, clearing user");
      setUser(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("AuthContext: payload on init", payload);

      // user ID is in sub, role is a top-level claim now
      const id = payload.sub as string;
      const roleClaim = payload.role as string;
      const role = roleClaim === "admin" ? "admin" : "student";
      setUser({ id, role });
      console.log("AuthContext: user set to", { id, role });
    } catch (err) {
      console.error("AuthContext: failed to decode token", err);
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    console.log("AuthContext.login: logging in", email);
    const { data } = await api.post("/auth/login", { email, password });
    console.log("AuthContext.login: received token", data.access_token);
    localStorage.setItem("jwt", data.access_token);
    setToken(data.access_token);

    const payload = JSON.parse(atob(data.access_token.split(".")[1]));
    console.log("AuthContext.login: payload", payload);

    const id = payload.sub as string;
    const roleClaim = payload.role as string;
    const role = roleClaim === "admin" ? "admin" : "student";
    const u: User = { id, role };
    setUser(u);
    console.log("AuthContext.login: user state set to", u);
    return u;
  };

  const register = async (email: string, password: string) => {
    console.log("AuthContext.register: registering", email);
    await api.post("/auth/register", { email, password });
    console.log("AuthContext.register: registered, logging in");
    await login(email, password);
  };

  const logout = () => {
    console.log("AuthContext.logout: clearing token and user");
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
