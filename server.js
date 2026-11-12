const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" || !name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || name.length > 100 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ success: false, error: "Please provide valid contact details" });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return res.status(500).json({ success: false, error: "Email not configured. Set EMAIL_USER and EMAIL_PASS in .env" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass }
    });

    await transporter.sendMail({
      from: emailUser,
      replyTo: email.trim(),
      to: emailUser,
      subject: `Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).json({ success: false, error: "Failed to send message. Check your app password." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
