const mongoose = require("mongoose");
const MedicalData = require("./models/MedicalData");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const migrateData = async () => {
    try {
        const allRecords = await MedicalData.find();
        for (let record of allRecords) {
            record.allergies = Array.isArray(record.allergies) ? record.allergies : [record.allergies].filter(Boolean);
            record.conditions = Array.isArray(record.conditions) ? record.conditions : [record.conditions].filter(Boolean);
            record.medications = Array.isArray(record.medications) ? record.medications : [record.medications].filter(Boolean);

            await record.save();
        }

        console.log("✅ Migration complete!");
        mongoose.disconnect();
    } catch (err) {
        console.error("❌ Migration failed:", err);
    }
};

migrateData();
