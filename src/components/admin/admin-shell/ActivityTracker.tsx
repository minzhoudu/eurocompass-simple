import { useActivityPing } from "../../../shared";

// Renders nothing; mounted only for a signed-in admin so the pings carry a
// valid session.
export const ActivityTracker = () => {
  useActivityPing();

  return null;
};
