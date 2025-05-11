// src/components/AuthRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode, useState, useEffect } from "react";

interface Props {
  children: ReactNode;
  role?: "admin";
}

export default function AuthRoute({ children, role }: Props) {
  const { user } = useAuth();
  const loc = useLocation();
  const [ready, setReady] = useState(false);

  // Delay decision until after first render so AuthContext can hydrate user
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    // Still initializing; don’t redirect yet
    return null;
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (role && user.role !== role) {
    // Logged in but wrong role
    return <Navigate to="/rooms" replace />;
  }

  // Authorized
  return <>{children}</>;
}
