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
      return res.status(404).json({ message: "No insurance information found. Please add details." });
    }

    res.json(insuranceData);
  } catch (error) {
    console.error("🔴 Error fetching insurance info:", error);
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
    const { provider, policyNumber, policyHolder, expiryDate, emergencyContact , email } = req.body;
    console.log("Received insurance data:", req.body);

    if (!req.user?.id) {
      console.log("🔴 User ID missing in request!");
      return res.status(400).json({ error: "User ID missing" });
    }

    let insuranceData = await Insurance.findOne({ userId: req.user.id });

    if (!insuranceData) {
      insuranceData = new Insurance({ userId: req.user.id });
    }

    if (provider !== undefined) insuranceData.provider = provider;
    if (policyNumber !== undefined) insuranceData.policyNumber = policyNumber;
    if (policyHolder !== undefined) insuranceData.policyHolder = policyHolder;
    if (emergencyContact !== undefined) insuranceData.emergencyContact = emergencyContact;
    if (email !== undefined) insuranceData.email = email;


    if (expiryDate) {
      const parsedDate = new Date(expiryDate);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid expiry date format." });
      }
      insuranceData.expiryDate = parsedDate;
    }

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
