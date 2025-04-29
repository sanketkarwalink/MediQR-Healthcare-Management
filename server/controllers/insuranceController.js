import Insurance from '../models/insuranceSchema.js';

/**
 * @desc   Get logged-in user's insurance info
 * @route  GET /api/insurance/me
 * @access Private
 */
export const getInsuranceInfo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    let insuranceData = await Insurance.findOne({ userId: req.user.id });
    if (!insuranceData) {
      insuranceData = new Insurance({ userId: req.user.id });
      await insuranceData.save();
    }

    res.json(insuranceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc   Add or update insurance information (merged add & edit)
 * @route  POST /api/insurance/update
 * @access Private
 */
export const updateInsuranceInfo = async (req, res) => {
  try {
    const { provider, policyNumber, policyHolder, expiryDate, emergencyContact } = req.body;
    console.log("Received insurance data:", req.body); // Log the incoming data

    if (!req.user?.id) {
      console.log("🔴 User ID missing in request!");
      return res.status(400).json({ error: "User ID missing" });
    }

    let insuranceData = await Insurance.findOne({ userId: req.user.id });

    if (!insuranceData) {
      insuranceData = new Insurance({ userId: req.user.id });
    }

    insuranceData.provider = provider ?? insuranceData.provider;
    insuranceData.policyNumber = policyNumber ?? insuranceData.policyNumber;
    insuranceData.policyHolder = policyHolder ?? insuranceData.policyHolder;
    insuranceData.expiryDate = expiryDate ?? insuranceData.expiryDate;
    insuranceData.emergencyContact = emergencyContact ?? insuranceData.emergencyContact;

    await insuranceData.save();

    res.status(200).json({
      message: "Insurance info updated successfully!",
      data: insuranceData,
    });
  } catch (error) {
    console.error("🔴 Error updating insurance info:", error);
    res.status(500).json({ error: "Server error" });
  }
};
