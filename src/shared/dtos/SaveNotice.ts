import { NoticeSeverity } from "../models";

export type SaveNoticeDto = {
  message: string;
  severity: NoticeSeverity;
  startsOn: string | null;
  endsOn: string | null;
  isEnabled: boolean;
};
