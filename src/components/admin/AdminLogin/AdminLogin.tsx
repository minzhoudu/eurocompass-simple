import { isAxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../config/axiosInstance";
import { LoginResponse } from "../models";
import { useQuery } from "@tanstack/react-query";

export const AdminLogin = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      navigate("/admin/dashboard");
    } catch (error) {
      if (isAxiosError(error)) {
        setErrorMessage(error.response?.data.message);
      }
    }
  };

  const { status } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/me");

      return data;
    },
    retry: false,
  });

  useEffect(() => {
    if (status === "success") {
      navigate("/admin/dashboard");
    }
  }, [status, navigate]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-600">
      <div className="flex flex-col gap-5 rounded-xl bg-primaryBlue p-10 shadow-lg shadow-black">
        <h1 className="text-center text-2xl font-bold text-white">
          Admin Login
        </h1>

        <form onSubmit={handleOnSubmit} className="flex w-96 flex-col gap-5">
          <div>
            <label htmlFor="email" className="text-lg font-bold text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full rounded-lg px-4 py-2 text-primaryBlue"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-lg font-bold text-white">
              Lozinka
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full rounded-lg px-4 py-2 text-primaryBlue"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="self-center rounded-md border px-4 py-2 text-white transition-colors hover:bg-white hover:text-primaryBlue"
          >
            Uloguj se
          </button>
        </form>
      </div>
    </main>
  );
};
