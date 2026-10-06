import { isAxiosError } from "axios";

// The server's own (Serbian) message when it sent one, else the fallback.
// class-validator sends an array of messages; the first is enough.
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) return fallback;

  const message: unknown = error.response?.data?.message;

  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") {
    return message[0];
  }

  return fallback;
};
