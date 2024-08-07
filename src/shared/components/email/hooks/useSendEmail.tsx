import emailjs from "@emailjs/browser";

import { formatFormValues, FormData } from "../../forms";

type SendEmailProps = {
  subject: string;
  formData: FormData;
};

type UseSendEmail = {
  sendEmail: () => Promise<void>;
};

export const useSendEmail = ({
  formData,
  subject,
}: SendEmailProps): UseSendEmail => {
  const formattedFormData = formatFormValues(formData);

  const sendEmail = async () => {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        ...formattedFormData,
        subject,
      },
      {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      },
    );
  };

  return { sendEmail };
};
