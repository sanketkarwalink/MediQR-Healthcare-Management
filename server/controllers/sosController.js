import Twilio from "twilio";
import dotenv from "dotenv";
import User from "../models/User.js";
import MedicalData from "../models/MedicalData.js";
import insuranceSchema from "../models/insuranceSchema.js";
import nodemailer from "nodemailer";

dotenv.config();

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendSOSAlert = async (req, res) => {
  try {
      const { userId, latitude, longitude } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User Not found!" });
      }

      const medicalInfo = await MedicalData.findOne({ userId });
      const insuranceInfo = await insuranceSchema.findOne({ userId });

      if (!medicalInfo || !medicalInfo.emergencyContact?.length) {
        return res.status(400).json({ message: "No emergency contacts found!" });
      }

      const sortedContacts = medicalInfo.emergencyContact.sort((a, b) => a.priority - b.priority);

      const contact = sortedContacts[0];

      let emergencyPhone = contact.phone;

      if (!emergencyPhone.startsWith("+")) {
          emergencyPhone = "+91" + emergencyPhone;
      }
      console.log("📞 Emergency contact info:", medicalInfo.emergencyContact);

      console.log("📤 Sending Whatsapp SOS to:", emergencyPhone);

      const message = `🚨 SOS Alert: ${user.name} triggered an emergency!
      📍 Location: https://www.google.com/maps?q=${latitude},${longitude}`;


      await client.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NO,
        to: `whatsapp:${emergencyPhone}`,
      }).then((response) => {
          console.log('Twilio Response:', response);
      }).catch((error) => {
          console.error('Twilio API Error:', error);
          return res.status(500).json({ message: "Failed to send Whatsapp SOS alert", error: error.message });
      });

      console.log("✅ Whatsapp SOS Alert Sent Successfully!");

      if (insuranceInfo && insuranceInfo.email) {
        await transporter.sendMail({
          to: insuranceInfo.email,
          subject: "SOS Alert: Immediate Attention Needed",
          text: `🚨 SOS Alert for ${user.name}!\nLocation: https://maps.google.com/?q=${latitude},${longitude}\nContact: ${insuranceInfo.emergencyContact}`,
        });
      }

      // Send to emergency contact (if email exists)
      const emergencyEmail = contact.email; // assuming your contact object has an email field
      if (emergencyEmail) {
        await transporter.sendMail({
          to: emergencyEmail,
          subject: "SOS Alert: Immediate Attention Needed",
          text: `🚨 SOS Alert for ${user.name}!\nLocation: https://maps.google.com/?q=${latitude},${longitude}\nContact: ${contact.phone}`,
        });
      }

      return res.status(200).json({ message: "Whatsapp SOS alert sent successfully" });

  } catch (error) {
      console.error("❌ Twilio API Error:", error);
      return res.status(500).json({ message: "Failed to send Whatsapp SOS alert", error: error.message });
  }
};