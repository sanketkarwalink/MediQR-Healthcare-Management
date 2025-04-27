import React, { useState, useEffect } from "react";

const MedicalInfoCard = ({ qrData }) => {
  const [medicalInfo, setMedicalInfo] = useState(null);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(qrData);
      setMedicalInfo(parsedData);
    } catch (error) {
      console.error("Error parsing QR data:", error);
    }
  }, [qrData]);

  if (!medicalInfo) {
    return <p className="text-center text-red-500">Invalid QR data</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-center text-blue-700">🚑 Emergency Medical Info</h2>
      <div className="mt-4 text-gray-700">
        <p><strong>🩸 Blood Group:</strong> {medicalInfo.bloodGroup}</p>
        <p><strong>🌿 Allergies:</strong> {medicalInfo.allergies?.join(", ") || "None"}</p>
        <p><strong>💊 Medications:</strong> {medicalInfo.medications?.join(", ") || "None"}</p>
        <p><strong>🏥 Conditions:</strong> {medicalInfo.conditions?.join(", ") || "None"}</p>
        <p><strong>📞 Emergency Contact:</strong> {medicalInfo.emergencyContact || "Not Available"}</p>
      </div>
    </div>
  );
};

export default MedicalInfoCard;
