export const AUDIT_ENTITY_TYPES = [
  "auth",
  "reservation",
  "notice",
  "blocked_date",
  "information",
  "user",
] as const;

export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number];

export type AuditLogEntry = {
  id: number;
  createdAt: string;
  // Null for automatic jobs and for failed logins (nobody was signed in).
  actorEmail: string | null;
  actorName: string | null;
  action: string;
  entityType: AuditEntityType;
  entityId: string | null;
  summary: string;
  // `changes`: field -> [before, after]. `snapshot`: the record as it was
  // added or removed.
  details: {
    changes?: Record<string, [unknown, unknown]>;
    snapshot?: Record<string, unknown>;
  } | null;
  ipAddress: string | null;
};

export type AuditLogActor = {
  email: string;
  name: string | null;
};

export type PaginatedAuditLog = {
  items: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  actors: AuditLogActor[];
};

export type AuditLogFilters = {
  entityType: "" | AuditEntityType;
  actor: string;
  // Inclusive "YYYY-MM-DD" days; empty = no limit.
  from: string;
  to: string;
};

export const DEFAULT_AUDIT_LOG_FILTERS: AuditLogFilters = {
  entityType: "",
  actor: "",
  from: "",
  to: "",
};

export const countActiveAuditFilters = (filters: AuditLogFilters) =>
  [filters.entityType, filters.actor, filters.from || filters.to].filter(
    Boolean,
  ).length;
