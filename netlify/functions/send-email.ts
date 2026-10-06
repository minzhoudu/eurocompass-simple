import { Handler, HandlerEvent } from "@netlify/functions";
import nodemailer from "nodemailer";

import { MIN_FILL_TIME_MS } from "../../src/shared/components/forms/utils";
import { createRateLimiter } from "./lib/rateLimiter";
import {
  getBelgradeToday,
  validateReservation,
  ValidReservation,
} from "./lib/validateReservation";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

// Subject is fixed here - never taken from the request.
const EMAIL_SUBJECT = "Rezervacija karte";
const MAX_BODY_BYTES = 10_000;
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;

const json = (
  statusCode: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
) => ({ statusCode, headers, body: JSON.stringify(body) });

type Mail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
};

type HandlerDeps = {
  sendMail: (mail: Mail) => Promise<unknown>;
  now?: () => number;
};

const renderEmail = (data: ValidReservation) => `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                <h2 style="color: #0056b3; font-size: 24px; margin-bottom: 20px;">Podaci za rezervaciju</h2>
                <p style="margin: 10px 0;"><strong style="color: #333;">Prezime i ime:</strong> ${escapeHtml(data.fullName)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${escapeHtml(data.email)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Telefon:</strong> ${escapeHtml(data.phone)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Polazna lokacija:</strong> ${escapeHtml(data.startingLocation)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Datum polaska:</strong> ${escapeHtml(data.date)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Vreme polaska:</strong> ${escapeHtml(data.time)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Broj mesta:</strong> ${escapeHtml(data.numberOfTickets)}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Napomena:</strong> ${escapeHtml(data.note).replace(/\r?\n/g, "<br />")}</p>
                </div>
            </body>
        </html>
        `;

// Built from a factory so the checks can be exercised without sending mail.
export const createHandler = ({
  sendMail,
  now = Date.now,
}: HandlerDeps): Handler => {
  // Per visitor and per customer address; see rateLimiter.ts for the caveat.
  const ipLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000, now });
  const emailLimiter = createRateLimiter({
    limit: 3,
    windowMs: 60 * 60_000,
    now,
  });

  return async (event: HandlerEvent) => {
    if (event.httpMethod !== "POST") {
      return json(405, { message: "Method Not Allowed" });
    }

    if ((event.body ?? "").length > MAX_BODY_BYTES) {
      return json(413, { code: "too_large", message: "Zahtev je prevelik." });
    }

    // Set by Netlify itself, so a caller cannot choose it.
    const ip = event.headers["x-nf-client-connection-ip"] ?? "unknown";
    const ipResult = ipLimiter.check(ip);

    if (!ipResult.allowed) {
      return json(
        429,
        {
          code: "rate_limited",
          message:
            "Previše pokušaja za kratko vreme. Pokušajte ponovo za nekoliko minuta.",
        },
        { "Retry-After": String(ipResult.retryAfterSeconds) },
      );
    }

    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { code: "invalid", message: "Podaci nisu ispravni." });
    }

    // Bot trap: a real visitor never sees or fills this field. Answer as if it
    // worked so the bot gets no signal, but send nothing.
    const honeypot = (payload.hp as unknown) ?? "";

    if (typeof honeypot !== "string" || honeypot !== "") {
      return json(200, { message: "Email sent successfully" });
    }

    // How long the form was open. A missing value also fails: only a page
    // from before this check (or a script) omits it.
    const elapsed = payload.elapsedMs;

    if (
      typeof elapsed !== "number" ||
      !Number.isFinite(elapsed) ||
      elapsed < 0 ||
      elapsed > MAX_FILL_TIME_MS
    ) {
      return json(400, {
        code: "outdated",
        message: "Osvežite stranicu i pokušajte ponovo.",
      });
    }

    if (elapsed < MIN_FILL_TIME_MS) {
      return json(400, {
        code: "too_fast",
        message: "Molimo sačekajte nekoliko sekundi pa pokušajte ponovo.",
      });
    }

    const result = validateReservation(
      payload.formData,
      getBelgradeToday(new Date(now())),
    );

    if (!result.ok) {
      return json(400, { code: "invalid", message: result.message });
    }

    const emailResult = emailLimiter.check(result.data.email.toLowerCase());

    if (!emailResult.allowed) {
      return json(
        429,
        {
          code: "rate_limited",
          message:
            "Sa ove email adrese je već poslato više rezervacija. Pokušajte ponovo kasnije.",
        },
        { "Retry-After": String(emailResult.retryAfterSeconds) },
      );
    }

    try {
      await sendMail({
        // Our own mailbox is the sender (a caller can't forge it); the
        // customer's address is where a reply goes.
        from: process.env.SMTP_EMAIL_USER ?? "",
        to: process.env.SMTP_EMAIL_USER ?? "",
        replyTo: result.data.email,
        subject: EMAIL_SUBJECT,
        html: renderEmail(result.data),
      });

      console.log("Reservation email sent");

      return json(200, { message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);

      return json(500, { message: "Internal Server Error" });
    }
  };
};

const sendWithSmtp = (mail: Mail) =>
  nodemailer
    .createTransport({
      host: process.env.SMTP_EMAIL_HOST,
      port: Number(process.env.SMTP_EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    })
    .sendMail(mail);

const handler = createHandler({ sendMail: sendWithSmtp });

export { handler };
