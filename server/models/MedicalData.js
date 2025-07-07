import { Schema, model } from "mongoose";

const EmergencyContactSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    relation: { type: String, required: true },
    city: { type: String },
    priority: { type: Number, default: 1 }
}, { _id: false });

const MedicalDataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodGroup: { type: String, required: true },
    allergies: { type: [String], default: [] },
    conditions: { type: [String], default: [], required: true },
    medications: { type: [String],default: [] ,required: true },
    emergencyContact: {
        type: [EmergencyContactSchema],
        required: true
    },
}, { timestamps: true });

export default model("MedicalData", MedicalDataSchema);

