import { Schema, model } from "mongoose";

const insuranceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  policyNumber: { type: String, required: true },
  policyHolder: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  emergencyContact: { type: String, required: true },
});

export default model('Insurance', insuranceSchema);

