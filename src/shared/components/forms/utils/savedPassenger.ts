import { CITIES } from "./constants";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from "./limits";

const STORAGE_KEY = "savedPassenger";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

// What "remember my details" keeps in this browser - nothing about the trip
// itself (date, time, note), which would just be stale next time.
export type SavedPassenger = {
  fullName: string;
  email: string;
  phone: string;
  // The usual departure station; "" if none was chosen.
  startingLocation: string;
};

const asText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

// Storage can be missing, full or blocked (private mode, site data cleared),
// and its contents can be edited by hand, so every access is guarded and the
// result is re-validated rather than trusted.
export const loadSavedPassenger = (): SavedPassenger | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed === null) return null;

    const stored = parsed as Record<string, unknown>;
    const savedAt = typeof stored.savedAt === "number" ? stored.savedAt : 0;

    if (Date.now() - savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);

      return null;
    }

    const passenger: SavedPassenger = {
      fullName: asText(stored.fullName, MAX_NAME_LENGTH),
      email: asText(stored.email, MAX_EMAIL_LENGTH),
      phone: asText(stored.phone, MAX_PHONE_LENGTH),
      startingLocation: CITIES.includes(String(stored.startingLocation))
        ? String(stored.startingLocation)
        : "",
    };

    return passenger.fullName || passenger.email || passenger.phone
      ? passenger
      : null;
  } catch {
    return null;
  }
};

export const savePassenger = (passenger: SavedPassenger) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...passenger, savedAt: Date.now() }),
    );
  } catch {
    // Storage unavailable - the form just won't be pre-filled next time.
  }
};

export const clearSavedPassenger = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage isn't available.
  }
};
