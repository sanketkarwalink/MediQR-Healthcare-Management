import {Schema, model } from "mongoose";

const SOSAlertSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  triggeredAt: { type: Date, default: Date.now },
  location: {
      lat: Number,
      lng: Number,
      city: String,
  },
  contacts: [{
      name: String,
      phone: String,
      relation: String,
      city: String,
      priority: Number,
      token: String,
      status: { type: String, enum: ["pending", "acknowledged", "skipped"], default: "pending" },
      ackTime: Date
  }]
}, { timestamps: true });

export const SOSAlert = model("SOSAlert", SOSAlertSchema);
