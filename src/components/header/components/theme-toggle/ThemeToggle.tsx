import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

import { useTheme } from "../../../../shared";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Uključi svetlu temu" : "Uključi tamnu temu"}
      className="flex size-10 items-center justify-center rounded-md text-ink transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500/10 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
    >
      {isDark ? (
        <IoSunnyOutline className="size-6" />
      ) : (
        <IoMoonOutline className="size-6" />
      )}
    </button>
  );
};
