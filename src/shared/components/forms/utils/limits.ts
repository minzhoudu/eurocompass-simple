// Size limits shared by the booking form and the server-side checks, so a value
// the form accepts is never rejected later (and vice versa).
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 30;
export const MAX_NOTE_LENGTH = 1000;
export const MAX_TICKETS = 50;

// A human needs more than this to pick a station, a date and a time; a bot
// posting the form straight away does not.
export const MIN_FILL_TIME_MS = 3000;

// Name of the hidden bot-trap field. Deliberately not a word browsers or
// password managers recognise ("website", "url", "company"), or they could
// fill it for a real customer.
export const HONEYPOT_FIELD = "hp_ref_x7";
