export type NoticeSeverity = "info" | "warning" | "danger";

// What the public banner needs.
export type PublicNotice = {
  id: number;
  message: string;
  severity: NoticeSeverity;
  updatedAt: string;
};

export type Notice = PublicNotice & {
  // Inclusive "YYYY-MM-DD" days; null = no limit.
  startsOn: string | null;
  endsOn: string | null;
  isEnabled: boolean;
  createdAt: string;
};
