import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { IoArrowBack, IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../../config/axiosInstance";
import { Alert, Button, Card, cn, FormInput, useTheme } from "../../../shared";
import { ThemeToggle } from "../../header/components/theme-toggle";
import { LoginResponse } from "../models";
import logo from "/images/eurocompass_logo.webp";

const DEFAULT_ERROR_MESSAGE =
  "Prijava nije uspela. Proverite podatke i pokušajte ponovo.";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await axiosInstance.post<LoginResponse>("/auth/login", credentials);

      navigate("/admin/dashboard");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setErrorMessage(
        typeof message === "string" ? message : DEFAULT_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col bg-surface text-ink",
        theme === "dark" && "dark",
      )}
    >
      <Helmet>
        <title>Admin | Prijava</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-ink-muted transition-colors hover:text-accent-ink"
        >
          <IoArrowBack className="size-5" />
          Nazad na sajt
        </Link>

        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <Card className="flex w-full max-w-md flex-col gap-8 p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={logo} alt="Eurocompass" className="w-40" />

            <div>
              <h1 className="text-2xl font-bold text-ink">Prijava</h1>
              <p className="text-ink-muted">Admin panel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              name="email"
              text="Email"
              type="email"
              autoComplete="username"
              icon={<IoMailOutline className="size-5" />}
              value={credentials.email}
              onChange={handleChange}
              required
            />

            <FormInput
              name="password"
              text="Lozinka"
              type="password"
              autoComplete="current-password"
              icon={<IoLockClosedOutline className="size-5" />}
              value={credentials.password}
              onChange={handleChange}
              required
            />

            {errorMessage && (
              <Alert variant="error" role="alert">
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !credentials.email || !credentials.password}
            >
              {isSubmitting ? "PRIJAVA..." : "ULOGUJ SE"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
};
