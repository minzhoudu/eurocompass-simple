import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { setAccessToken } from "../config/axiosInstance";

const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export const UserContext = createContext<{
  user?: UserContextType;
  isLoggedIn: boolean;
}>({
  user: undefined,
  isLoggedIn: false,
});

export type UserContextType = {
  firstName: string;
  lastName: string;
  email: string;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserContextType>("/auth/me");

      return data;
    },
    retry: false,
    // Login lasts a day; re-check so a tab left open past that (and now
    // polling for new reservations) lands on the login page instead of
    // showing endless load errors.
    refetchInterval: SESSION_CHECK_INTERVAL_MS,
  });

  useEffect(() => {
    if (isError) {
      setAccessToken(null);
      navigate("/admin");
    }
  }, [isError, navigate]);

  return (
    <UserContext.Provider
      value={{
        user: data,
        isLoggedIn: !!data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
