export const USER_ROLES = ["owner", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Vlasnik",
  admin: "Administrator",
};

// An admin account as the owner sees it (never includes the password).
export type AdminUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  // Already formatted by the server (sr-RS); empty if never logged in.
  lastLogin: string;
};
