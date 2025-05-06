import Twilio from "twilio";
import dotenv from "dotenv";
import User from "../models/User.js";
import MedicalData from "../models/MedicalData.js";

dotenv.config();

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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

      if (!medicalInfo || !medicalInfo.emergencyContact?.length) {
        return res.status(400).json({ message: "No emergency contacts found!" });
      }

      const sortedContacts = medicalInfo.emergencyContact.sort((a, b) => a.priority - b.priority).slice(0, 2);

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
          from: process.env.TWILIO_PHONE_NO,
          to: `whatsapp:${emergencyPhone}`,
      });

      console.log("✅ Whatsapp SOS Alert Sent Successfully!");
      return res.status(200).json({ message: "Whatsapp SOS alert sent successfully" });

  } catch (error) {
      console.error("❌ Twilio API Error:", error);
      return res.status(500).json({ message: "Failed to send Whatsapp SOS alert", error: error.message });
  }
};