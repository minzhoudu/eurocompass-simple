import { useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import { AdminPageHeader } from "../../../components";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  getCurrentDate,
  getFormattedDate,
  IconButton,
  Notice,
  NoticeSeverity,
  Skeleton,
  useDeleteNotice,
  useNotices,
  useSaveNotice,
} from "../../../shared";
import { NoticeFormDialog } from "./NoticeFormDialog";

type NoticeStatus = "active" | "scheduled" | "expired" | "disabled";

const STATUS_LABELS: Record<NoticeStatus, string> = {
  active: "Aktivno",
  scheduled: "Zakazano",
  expired: "Isteklo",
  disabled: "Isključeno",
};

const SEVERITY_LABELS: Record<NoticeSeverity, string> = {
  info: "Obaveštenje",
  warning: "Upozorenje",
  danger: "Hitno",
};

const getStatus = (notice: Notice, today: string): NoticeStatus => {
  if (!notice.isEnabled) return "disabled";
  if (notice.endsOn && notice.endsOn < today) return "expired";
  if (notice.startsOn && notice.startsOn > today) return "scheduled";

  return "active";
};

const getScheduleText = ({ startsOn, endsOn }: Notice) => {
  if (startsOn && endsOn) {
    return `${getFormattedDate(startsOn)} – ${getFormattedDate(endsOn)}`;
  }
  if (startsOn) return `Od ${getFormattedDate(startsOn)}, bez datuma završetka`;
  if (endsOn) return `Do ${getFormattedDate(endsOn)}`;

  return "Prikazuje se stalno";
};

type FormState = { notice?: Notice } | null;

export const AdminNotices = () => {
  const { data: notices, isLoading, isError } = useNotices();
  const { mutate: saveNotice, isPending: isSaving } = useSaveNotice();
  const { mutate: deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const [formState, setFormState] = useState<FormState>(null);
  const [pendingDelete, setPendingDelete] = useState<Notice | null>(null);

  const today = getCurrentDate();

  const toggleEnabled = (notice: Notice) =>
    saveNotice({
      id: notice.id,
      notice: {
        message: notice.message,
        severity: notice.severity,
        startsOn: notice.startsOn,
        endsOn: notice.endsOn,
        isEnabled: !notice.isEnabled,
      },
    });

  const confirmDelete = () => {
    if (!pendingDelete) return;

    deleteNotice(pendingDelete.id, {
      onSettled: () => setPendingDelete(null),
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Helmet>
        <title>Admin | Obaveštenja</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Obaveštenja"
        description="Poruke koje se prikazuju na vrhu sajta, stalno ili u zadatom periodu."
      />

      <div>
        <Button type="button" onClick={() => setFormState({})}>
          <IoAdd className="size-5" aria-hidden="true" />
          Novo obaveštenje
        </Button>
      </div>

      {isError && (
        <Alert variant="error">
          Učitavanje obaveštenja nije uspelo. Osvežite stranicu i pokušajte
          ponovo.
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : notices && notices.length > 0 ? (
          notices.map((notice) => {
            const status = getStatus(notice, today);

            return (
              <Card key={notice.id} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={status === "active" ? "yellow" : "outline"}>
                    {STATUS_LABELS[status]}
                  </Badge>
                  <Badge variant="outline">
                    {SEVERITY_LABELS[notice.severity]}
                  </Badge>
                  <span className="text-sm text-ink-muted">
                    {getScheduleText(notice)}
                  </span>
                </div>

                <p className="whitespace-pre-line text-ink">{notice.message}</p>

                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSaving}
                    onClick={() => toggleEnabled(notice)}
                  >
                    {notice.isEnabled ? "Isključi" : "Uključi"}
                  </Button>

                  <IconButton
                    label="Izmeni obaveštenje"
                    onClick={() => setFormState({ notice })}
                  >
                    <IoPencilOutline className="size-[1.15rem]" />
                  </IconButton>

                  <IconButton
                    label="Obriši obaveštenje"
                    tone="danger"
                    onClick={() => setPendingDelete(notice)}
                  >
                    <IoTrashOutline className="size-[1.15rem]" />
                  </IconButton>
                </div>
              </Card>
            );
          })
        ) : (
          !isError && (
            <Card>
              <p className="text-center text-ink-muted">
                Još uvek nema obaveštenja.
              </p>
            </Card>
          )
        )}
      </div>

      {formState && (
        <NoticeFormDialog
          key={formState.notice?.id ?? "new"}
          notice={formState.notice}
          onClose={() => setFormState(null)}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Obrisati obaveštenje?"
        description="Obaveštenje će odmah nestati sa sajta i biće trajno obrisano."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
