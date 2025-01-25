import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../contexts";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useUserContext();

  if (!isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return children;
};
