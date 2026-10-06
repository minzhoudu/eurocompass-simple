import { useState } from "react";
import {
  IoAlertCircleOutline,
  IoClose,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

import {
  cn,
  NoticeSeverity,
  PublicNotice,
  useActiveNotices,
} from "../../shared";

const DISMISSED_KEY = "dismissedNotices";

const severityStyles: Record<
  NoticeSeverity,
  { classes: string; icon: typeof IoInformationCircleOutline }
> = {
  info: {
    classes: "border-line bg-sunken text-ink",
    icon: IoInformationCircleOutline,
  },
  warning: {
    classes: "border-brand-yellow-600 bg-brand-yellow-500 text-brand-black-900",
    icon: IoWarningOutline,
  },
  danger: {
    classes: "border-red-700 bg-red-600 text-white",
    icon: IoAlertCircleOutline,
  },
};

// Includes updatedAt so editing a notice shows it again to people who closed
// the old wording.
const getNoticeKey = (notice: Pick<PublicNotice, "id" | "updatedAt">) =>
  `${notice.id}:${notice.updatedAt}`;

const readDismissed = (): string[] => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(DISMISSED_KEY) ?? "[]");

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const saveDismissed = (keys: string[]) => {
  try {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(keys));
  } catch {
    // Storage unavailable (e.g. private mode) - it just comes back next visit.
  }
};

type NoticeMessageProps = {
  notice: Pick<PublicNotice, "message" | "severity">;
  onDismiss?: () => void;
};

// Also used by the admin form as a live preview.
export const NoticeMessage = ({ notice, onDismiss }: NoticeMessageProps) => {
  const { classes, icon: Icon } = severityStyles[notice.severity];

  return (
    <div className={cn("w-full border-b px-4 py-2.5", classes)}>
      <div className="mx-auto flex w-full max-w-6xl items-start gap-3 lg:px-6">
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

        <p className="flex-1 whitespace-pre-line text-sm font-semibold leading-relaxed">
          {notice.message}
        </p>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Zatvori obaveštenje"
            className="-m-1 shrink-0 rounded-md p-1 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            <IoClose className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export const NoticeBanner = () => {
  const { data: notices } = useActiveNotices();
  const [dismissed, setDismissed] = useState(readDismissed);

  const visibleNotices = (notices ?? []).filter(
    (notice) => !dismissed.includes(getNoticeKey(notice)),
  );

  if (visibleNotices.length === 0) return null;

  const dismiss = (notice: PublicNotice) => {
    const next = [...dismissed, getNoticeKey(notice)];

    setDismissed(next);
    saveDismissed(next);
  };

  return (
    <section aria-label="Obaveštenja" className="w-full">
      {visibleNotices.map((notice) => (
        <NoticeMessage
          key={notice.id}
          notice={notice}
          onDismiss={() => dismiss(notice)}
        />
      ))}
    </section>
  );
};
