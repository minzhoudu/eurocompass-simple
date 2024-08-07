import axios from "axios";
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
    await axios.post("/.netlify/functions/send-email", {
      formData: formattedFormData,
      subject,
    });
  };

  return { sendEmail };
};
