import { Link } from "react-router-dom";

type ErrorPageProps = {
  redirectPath: "/" | "/admin";
};

export const ErrorPage = ({ redirectPath }: ErrorPageProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-7 bg-slate-500 text-xl font-bold">
      <h1 className="text-white">Došlo je do greške</h1>
      <Link to={redirectPath} className="rounded-lg bg-primaryYellow p-2">
        Vrati se na početnu stranu
      </Link>
    </div>
  );
};
