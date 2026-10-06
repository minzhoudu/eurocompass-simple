import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoAdd,
  IoKeyOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { AdminPageHeader } from "../../../components";
import { useUserContext } from "../../../contexts";
import {
  AdminUser,
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  getApiErrorMessage,
  IconButton,
  ROLE_LABELS,
  Skeleton,
  useAdminUsers,
  useDeleteAdminUser,
  useSaveAdminUser,
} from "../../../shared";
import { PasswordDialog } from "./PasswordDialog";
import { UserFormDialog } from "./UserFormDialog";

type DialogState =
  | { type: "form"; user?: AdminUser }
  | { type: "password"; user: AdminUser };

export const AdminUsers = () => {
  const { user: me } = useUserContext();
  const { data: users, isLoading, isError } = useAdminUsers();
  const {
    mutate: saveUser,
    isPending: isSaving,
    isError: isSaveError,
    error: saveError,
    reset: resetSaveError,
  } = useSaveAdminUser();
  const {
    mutate: deleteUser,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    reset: resetDeleteError,
  } = useDeleteAdminUser();

  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);

  const toggleActive = (user: AdminUser) => {
    resetDeleteError();
    saveUser({ id: user.id, user: { isActive: !user.isActive } });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    deleteUser(pendingDelete.id, {
      onSettled: () => setPendingDelete(null),
    });
  };

  const actionError = isSaveError
    ? getApiErrorMessage(saveError, "Izmena nije uspela. Pokušajte ponovo.")
    : isDeleteError
      ? getApiErrorMessage(
          deleteError,
          "Brisanje nije uspelo. Pokušajte ponovo.",
        )
      : null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Helmet>
        <title>Admin | Administratori</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Administratori"
        description="Nalozi koji mogu da se prijave u admin panel. Ovu stranicu vidi samo vlasnik."
      />

      <div>
        <Button
          type="button"
          onClick={() => {
            resetSaveError();
            resetDeleteError();
            setDialog({ type: "form" });
          }}
        >
          <IoAdd className="size-5" aria-hidden="true" />
          Novi administrator
        </Button>
      </div>

      {isError && (
        <Alert variant="error">
          Učitavanje naloga nije uspelo. Osvežite stranicu i pokušajte ponovo.
        </Alert>
      )}

      {actionError && <Alert variant="error">{actionError}</Alert>}

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          users?.map((user) => {
            const isSelf = user.id === me?.id;

            return (
              <Card key={user.id} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words text-lg font-bold text-ink">
                        {user.firstName} {user.lastName}
                      </p>
                      <Badge
                        variant={user.role === "owner" ? "yellow" : "outline"}
                      >
                        {ROLE_LABELS[user.role]}
                      </Badge>
                      {!user.isActive && (
                        <Badge variant="black">Deaktiviran</Badge>
                      )}
                      {isSelf && <Badge variant="outline">Vi</Badge>}
                    </div>

                    <p className="break-all text-ink-muted">{user.email}</p>
                    <p className="text-sm text-ink-subtle">
                      Poslednja prijava: {user.lastLogin || "još nije bilo"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1">
                  {!isSelf && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      onClick={() => toggleActive(user)}
                    >
                      {user.isActive ? "Deaktiviraj" : "Aktiviraj"}
                    </Button>
                  )}

                  <IconButton
                    label={`Nova lozinka: ${user.firstName} ${user.lastName}`}
                    onClick={() => setDialog({ type: "password", user })}
                  >
                    <IoKeyOutline className="size-[1.15rem]" />
                  </IconButton>

                  <IconButton
                    label={`Izmeni nalog: ${user.firstName} ${user.lastName}`}
                    onClick={() => {
                      resetSaveError();
                      setDialog({ type: "form", user });
                    }}
                  >
                    <IoPencilOutline className="size-[1.15rem]" />
                  </IconButton>

                  {!isSelf && (
                    <IconButton
                      label={`Obriši nalog: ${user.firstName} ${user.lastName}`}
                      tone="danger"
                      onClick={() => {
                        resetDeleteError();
                        setPendingDelete(user);
                      }}
                    >
                      <IoTrashOutline className="size-[1.15rem]" />
                    </IconButton>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <p className="text-sm text-ink-muted">
        Deaktiviran nalog se ne može prijaviti, ali ostaje sačuvan (i u istoriji
        izmena). Obrisan nalog se ne može vratiti.
      </p>

      {dialog?.type === "form" && (
        <UserFormDialog
          key={dialog.user?.id ?? "new"}
          user={dialog.user}
          isSelf={dialog.user?.id === me?.id}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.type === "password" && (
        <PasswordDialog
          key={dialog.user.id}
          user={dialog.user}
          isSelf={dialog.user.id === me?.id}
          onClose={() => setDialog(null)}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={
          pendingDelete
            ? `Obrisati nalog: ${pendingDelete.firstName} ${pendingDelete.lastName}?`
            : ""
        }
        description="Nalog će biti trajno obrisan i osoba se više ne može prijaviti. Ako je samo privremeno, deaktivirajte nalog."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};
