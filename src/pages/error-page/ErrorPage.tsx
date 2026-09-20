import { Link } from "react-router-dom";

import { cn, useTheme } from "../../shared";

type ErrorPageProps = {
  redirectPath: "/" | "/admin";
};

export const ErrorPage = ({ redirectPath }: ErrorPageProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center gap-7 bg-surface text-xl font-bold",
        theme === "dark" && "dark",
      )}
    >
      <h1 className="text-ink">Došlo je do greške</h1>
      <Link
        to={redirectPath}
        className="rounded-lg bg-brand-yellow-500 px-5 py-2.5 font-semibold text-brand-black-900 transition-colors hover:bg-brand-yellow-600"
      >
        Vrati se na početnu stranu
      </Link>
    </div>
  );
};
