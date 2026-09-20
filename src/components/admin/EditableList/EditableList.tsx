import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import {
  IoAdd,
  IoCheckmark,
  IoClose,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { Button, cn, ConfirmDialog, IconButton } from "../../../shared";

type EditableListProps = {
  items: string[];
  onChange: (items: string[]) => Promise<unknown>;
  inputType: "time" | "text";
  layout: "chips" | "rows";
  sort?: boolean;
  emptyText: string;
  addLabel: string;
  placeholder?: string;
  emptyMessage: string;
  duplicateMessage: string;
  confirmTitle: (item: string) => string;
  confirmDescription: string;
};

const SAVE_ERROR_MESSAGE = "Čuvanje nije uspelo. Pokušajte ponovo.";

const inputClasses =
  "h-11 min-w-0 rounded-lg border border-line-strong bg-raised px-3 text-ink focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200";

export const EditableList = ({
  items,
  onChange,
  inputType,
  layout,
  sort = false,
  emptyText,
  addLabel,
  placeholder,
  emptyMessage,
  duplicateMessage,
  confirmTitle,
  confirmDescription,
}: EditableListProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();

  const displayItems = useMemo(() => {
    const trimmed = items.map((item) => item.trim());

    return sort ? trimmed.sort() : trimmed;
  }, [items, sort]);

  const commit = async (next: string[]) => {
    setIsSaving(true);

    try {
      await onChange(sort ? [...next].sort() : next);
      setError(undefined);

      return true;
    } catch {
      setError(SAVE_ERROR_MESSAGE);

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const validate = (value: string, ignoreIndex?: number) => {
    const trimmed = value.trim();

    if (!trimmed) return emptyMessage;

    const isDuplicate = displayItems.some(
      (item, index) =>
        index !== ignoreIndex && item.toLowerCase() === trimmed.toLowerCase(),
    );

    return isDuplicate ? duplicateMessage : undefined;
  };

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();

    const message = validate(newValue);

    if (message) {
      setError(message);
      return;
    }

    if (await commit([...displayItems, newValue.trim()])) setNewValue("");
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(displayItems[index]);
    setError(undefined);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setError(undefined);
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;

    const trimmed = editValue.trim();

    if (trimmed === displayItems[editingIndex]) {
      cancelEdit();
      return;
    }

    const message = validate(editValue, editingIndex);

    if (message) {
      setError(message);
      return;
    }

    const next = displayItems.map((item, index) =>
      index === editingIndex ? trimmed : item,
    );

    if (await commit(next)) cancelEdit();
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit();
    }

    if (event.key === "Escape") cancelEdit();
  };

  const confirmDelete = async () => {
    if (pendingDelete === null) return;

    await commit(displayItems.filter((_, index) => index !== pendingDelete));
    setPendingDelete(null);
  };

  const pendingItem =
    pendingDelete !== null ? displayItems[pendingDelete] : undefined;

  const itemClasses = cn(
    "flex items-center gap-1 border bg-raised",
    layout === "chips"
      ? "justify-between rounded-xl py-1 pl-4 pr-1 sm:justify-start sm:rounded-full"
      : "rounded-xl px-4 py-1.5",
  );

  return (
    <div className="flex flex-col gap-4" aria-busy={isSaving}>
      {displayItems.length > 0 ? (
        <ul
          className={cn(
            "flex flex-col gap-2",
            layout === "chips" && "sm:flex-row sm:flex-wrap",
          )}
        >
          {displayItems.map((item, index) =>
            editingIndex === index ? (
              <li
                key={`${item}-${index}`}
                className={cn(itemClasses, "border-brand-yellow-500 p-1")}
              >
                <input
                  type={inputType}
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  onKeyDown={handleEditKeyDown}
                  aria-label={`Izmena: ${item}`}
                  maxLength={inputType === "text" ? 300 : undefined}
                  autoFocus
                  className={cn(inputClasses, "h-9 flex-1 sm:flex-none")}
                />
                <IconButton
                  label="Sačuvaj izmenu"
                  tone="accent"
                  onClick={saveEdit}
                  disabled={isSaving}
                >
                  <IoCheckmark className="size-5" />
                </IconButton>
                <IconButton
                  label="Otkaži izmenu"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  <IoClose className="size-5" />
                </IconButton>
              </li>
            ) : (
              <li
                key={`${item}-${index}`}
                className={cn(itemClasses, "border-line-strong")}
              >
                <span
                  className={cn(
                    "text-ink",
                    layout === "chips"
                      ? "mr-1 font-semibold tabular-nums"
                      : "min-w-0 flex-1 break-words py-1.5",
                  )}
                >
                  {item}
                </span>
                <IconButton
                  label={`Izmeni: ${item}`}
                  onClick={() => startEdit(index)}
                  disabled={isSaving || editingIndex !== null}
                >
                  <IoPencilOutline className="size-[1.15rem]" />
                </IconButton>
                <IconButton
                  label={`Obriši: ${item}`}
                  tone="danger"
                  onClick={() => setPendingDelete(index)}
                  disabled={isSaving || editingIndex !== null}
                >
                  <IoTrashOutline className="size-[1.15rem]" />
                </IconButton>
              </li>
            ),
          )}
        </ul>
      ) : (
        <p className="text-ink-muted">{emptyText}</p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type={inputType}
          value={newValue}
          onChange={(event) => {
            setNewValue(event.target.value);
            setError(undefined);
          }}
          aria-label={addLabel}
          placeholder={placeholder}
          maxLength={inputType === "text" ? 300 : undefined}
          className={cn(inputClasses, "flex-1 sm:flex-none", inputType === "text" && "sm:flex-1")}
        />
        <Button type="submit" disabled={isSaving || editingIndex !== null}>
          <IoAdd className="size-5" />
          Dodaj
        </Button>
      </form>

      {error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingItem ? confirmTitle(pendingItem) : ""}
        description={confirmDescription}
        isLoading={isSaving}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
