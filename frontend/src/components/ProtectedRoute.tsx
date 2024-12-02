// components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config";

type ProtectedRouteProps = {
  allowedRoles: ("ADMIN" | "STUDENT")[];
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
 
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (allowedRoles.includes(response.data.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }
    };
    fetchUserRole();
  }, [allowedRoles]);
  
  if (isAuthorized === null) return <div>Loading...</div>;
  return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
