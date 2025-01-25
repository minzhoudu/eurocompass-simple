import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

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
  });

  useEffect(() => {
    if (isError) {
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
