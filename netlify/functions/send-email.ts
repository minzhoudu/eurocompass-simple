import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { formData, subject } = JSON.parse(event.body || "{}");

    if (!formData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_EMAIL_HOST,
      port: Number(process.env.SMTP_EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: formData.email,
      to: process.env.SMTP_EMAIL_USER,
      replyTo: formData.email,
      subject: subject,
      html: `
        <html>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
                <h2 style="color: #0056b3; font-size: 24px; margin-bottom: 20px;">Podaci za rezervaciju</h2>
                <p style="margin: 10px 0;"><strong style="color: #333;">Prezime i ime:</strong> ${formData.fullName}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${formData.email}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Telefon:</strong> ${formData.phone}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Polazna lokacija:</strong> ${formData.startingLocation}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Datum polaska:</strong> ${formData.date}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Vreme polaska:</strong> ${formData.time}</p>
                <p style="margin: 10px 0;"><strong style="color: #333;">Napomena:</strong> ${formData.note}</p>
                </div>
            </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully by user:", formData.email);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error:", error }),
    };
  }
};

export { handler };
