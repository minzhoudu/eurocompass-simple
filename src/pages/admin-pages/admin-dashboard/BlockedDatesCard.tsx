import { useState } from "react";
import { IoAdd, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import {
  Alert,
  BlockedDate,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  getBlockScopeText,
  getCurrentDate,
  getFormattedDate,
  IconButton,
  Skeleton,
  useAllBlockedDates,
  useDeleteBlockedDate,
} from "../../../shared";
import { BlockedDateFormDialog } from "./BlockedDateFormDialog";

const getDateRangeText = ({ startsOn, endsOn }: BlockedDate) =>
  startsOn === endsOn
    ? getFormattedDate(startsOn)
    : `${getFormattedDate(startsOn)} – ${getFormattedDate(endsOn)}`;

type FormState = { blockedDate?: BlockedDate } | null;

export const BlockedDatesCard = () => {
  const { data: blockedDates, isLoading, isError } = useAllBlockedDates();
  const { mutate: deleteBlockedDate, isPending: isDeleting } =
    useDeleteBlockedDate();

  const [formState, setFormState] = useState<FormState>(null);
  const [pendingDelete, setPendingDelete] = useState<BlockedDate | null>(null);
  const [showPast, setShowPast] = useState(false);

  const today = getCurrentDate();
  const current = (blockedDates ?? []).filter((block) => block.endsOn >= today);
  // Most recent first.
  const past = (blockedDates ?? [])
    .filter((block) => block.endsOn < today)
    .reverse();

  const confirmDelete = () => {
    if (!pendingDelete) return;

    deleteBlockedDate(pendingDelete.id, {
      onSettled: () => setPendingDelete(null),
    });
  };

  const renderRow = (block: BlockedDate) => {
    const isActiveNow = block.startsOn <= today && today <= block.endsOn;
    const isPast = block.endsOn < today;

    return (
      <li
        key={block.id}
        className="flex items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-ink">
              {getDateRangeText(block)}
            </span>
            {isActiveNow && <Badge variant="yellow">Trenutno blokirano</Badge>}
          </div>

          <p className="text-sm text-ink-muted">{getBlockScopeText(block)}</p>

          {block.reason && (
            <p className="text-sm italic text-ink-muted">{block.reason}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center">
          {!isPast && (
            <IconButton
              label="Izmeni blokadu"
              onClick={() => setFormState({ blockedDate: block })}
            >
              <IoPencilOutline className="size-[1.15rem]" />
            </IconButton>
          )}

          <IconButton
            label="Obriši blokadu"
            tone="danger"
            onClick={() => setPendingDelete(block)}
          >
            <IoTrashOutline className="size-[1.15rem]" />
          </IconButton>
        </div>
      </li>
    );
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Blokirani datumi</h2>
          <p className="text-sm text-ink-muted">
            Dani (ili pojedinačni polasci) na koje se ne može rezervisati. Na
            sajtu su prikazani kao nedostupni.
          </p>
        </div>

        <Button type="button" size="sm" onClick={() => setFormState({})}>
          <IoAdd className="size-5" aria-hidden="true" />
          Nova blokada
        </Button>
      </div>

      {isError && (
        <Alert variant="error">
          Učitavanje blokiranih datuma nije uspelo. Osvežite stranicu i
          pokušajte ponovo.
        </Alert>
      )}

      {isLoading ? (
        <Skeleton className="h-20" />
      ) : current.length > 0 ? (
        <ul className="divide-y divide-line">{current.map(renderRow)}</ul>
      ) : (
        !isError && (
          <p className="text-sm text-ink-muted">
            Nema blokiranih datuma. Svi polasci su dostupni za rezervaciju.
          </p>
        )
      )}

      {past.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <button
            type="button"
            aria-expanded={showPast}
            onClick={() => setShowPast((open) => !open)}
            className="self-start text-sm font-semibold text-accent-ink hover:underline"
          >
            {showPast ? "Sakrij prošle" : `Prikaži prošle (${past.length})`}
          </button>

          {showPast && (
            <ul className="divide-y divide-line opacity-75">
              {past.map(renderRow)}
            </ul>
          )}
        </div>
      )}

      {formState && (
        <BlockedDateFormDialog
          key={formState.blockedDate?.id ?? "new"}
          blockedDate={formState.blockedDate}
          onClose={() => setFormState(null)}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Obrisati blokadu?"
        description={
          pendingDelete
            ? `${getDateRangeText(pendingDelete)} - ${getBlockScopeText(pendingDelete)}. Polasci će ponovo biti dostupni za rezervaciju.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </Card>
  );
};
