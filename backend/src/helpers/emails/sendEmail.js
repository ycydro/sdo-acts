import env from "../../configs/env.js";
import { mailTransporter } from "../../configs/mail.config.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const sendEmailEnabled = true;
    if (!sendEmailEnabled) {
      console.log("Email sending is disabled");
      return;
    }

    if (to.endsWith("email.com")) {
      console.log(`${to} is a test email, cancelling sending of email...`);
      return;
    }

    await mailTransporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
