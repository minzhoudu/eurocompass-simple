import { Link } from "react-router-dom";

type ErrorPageProps = {
  redirectPath: "/" | "/admin";
};

export const ErrorPage = ({ redirectPath }: ErrorPageProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-7 bg-gray-50 text-xl font-bold">
      <h1 className="text-brand-black-900">Došlo je do greške</h1>
      <Link
        to={redirectPath}
        className="rounded-lg bg-brand-yellow-500 px-5 py-2.5 font-semibold text-brand-black-900 transition-colors hover:bg-brand-yellow-600"
      >
        Vrati se na početnu stranu
      </Link>
    </div>
  );
};
