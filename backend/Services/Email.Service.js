// Email.Service.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.EMAIL_TOKEN;
if (!TOKEN) console.warn("EMAIL_TOKEN not set in env");

const client = new MailtrapClient({ token: TOKEN });

const DEFAULT_SENDER = {
  email: process.env.EMAIL_SENDER_EMAIL || "hello@loopnow.in",
  name: process.env.EMAIL_SENDER_NAME || "Leave Management",
};

export async function sendEmail({
  to = [],
  subject = "",
  text = "",
  category = "Notification",
}) {
  if (!Array.isArray(to) || to.length === 0) {
    throw new Error("No recipients provided");
  }

  const recipients = to.map((email) => ({ email }));

  try {
    const res = await client.send({
      from: DEFAULT_SENDER,
      to: recipients,
      subject,
      text,
      category,
    });
    console.log("Email sent:", subject, "->", to);
    return res;
  } catch (err) {
    console.error("Error sending email:", err);
    // bubble up so caller can decide — we will catch in controllers
    throw err;
  }
}
