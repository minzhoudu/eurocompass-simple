import { useState } from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";

import { promptInstall, useInstallState } from "../../pwa";

const linkClasses =
  "inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-accent-ink";

// "Install the app" in the footer. Only appears where it can work: the
// browser offered installation (Chrome, Edge, Android), or an iPhone / iPad
// where it has to be done by hand. Hidden once the site runs as an installed
// app.
export const InstallApp = () => {
  const state = useInstallState();
  const [isHintOpen, setIsHintOpen] = useState(false);

  if (state === "none") return null;

  return (
    <div className="flex flex-col items-center gap-1 sm:items-start">
      <button
        type="button"
        className={linkClasses}
        aria-expanded={state === "ios" ? isHintOpen : undefined}
        onClick={() =>
          state === "prompt" ? void promptInstall() : setIsHintOpen((o) => !o)
        }
      >
        <IoPhonePortraitOutline className="size-4" aria-hidden="true" />
        Instaliraj aplikaciju
      </button>

      {state === "ios" && isHintOpen && (
        <p className="max-w-xs text-center text-ink-muted sm:text-left">
          U pregledaču dodirnite „Podeli“, zatim „Dodaj na početni ekran“.
        </p>
      )}
    </div>
  );
};
