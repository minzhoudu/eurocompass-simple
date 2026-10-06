import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useUserContext } from "../../contexts";

type OwnerRouteProps = {
  children: ReactNode;
};

// Pages only the owner may open. The server refuses the data to anyone else
// too; this just keeps admins from landing on an empty error page.
export const OwnerRoute = ({ children }: OwnerRouteProps) => {
  const { user } = useUserContext();

  // The account is still loading (or the session ended and the provider is
  // already sending the visitor to the login page).
  if (!user) return null;

  if (user.role !== "owner") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
