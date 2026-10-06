import axios from "axios";
import { formatFormValues, FormData } from "../../forms";

const FALLBACK_ERROR = "Došlo je do greške prilikom slanja emaila!";

type SendEmailProps = {
  subject: string;
  formData: FormData;
};

// Bot checks sent along with the booking: the value of the hidden trap field
// and how long (ms) the form was open.
type BotChecks = { hp: string; elapsedMs: number };

type UseSendEmail = {
  sendEmail: (botChecks: BotChecks) => Promise<void>;
};

// The message to show the customer: the server's own text when it rejected the
// request for a reason they can act on (too fast, too many attempts, a field
// that failed validation), otherwise the generic one.
export const getSendEmailErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if ((status === 400 || status === 413 || status === 429) && message) {
      return String(message);
    }
  }

  return FALLBACK_ERROR;
};

export const useSendEmail = ({
  formData,
  subject,
}: SendEmailProps): UseSendEmail => {
  const formattedFormData = formatFormValues(formData);

  const sendEmail = async ({ hp, elapsedMs }: BotChecks) => {
    await axios.post("/.netlify/functions/send-email", {
      formData: formattedFormData,
      subject,
      hp,
      elapsedMs,
    });
  };

  return { sendEmail };
};
