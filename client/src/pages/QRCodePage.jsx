import React, { useEffect, useState } from "react";
import api from '../services/api.js';

const QRCodePage = () => {
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRData = async () => {
      try {
        const res = await api.get("/api/medical/qr");
        console.log("🔵 Fetched QR Data:", res.data); // Debugging
        setQrData(res.data.qrCodeUrl);
      } catch (error) {
        console.error("Error fetching QR data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQRData();
  }, []);

  return (
    <div className="p-6 max-w-2xl w-95 mx-auto text-center">
      <h2 className="text-2xl font-bold">Your QR Code</h2>
      {loading ? (
        <p>Loading QR code...</p>
      ) : qrData ? (
        <>
          <img src={qrData} alt="QR Code" className="mt-4 mx-auto w-48 h-48" />
          <p className="mt-2 text-sm text-gray-500">Scan this QR code to access your data.</p>
        </>
      ) : (
        <p className="text-red-500">⚠️ Failed to load QR code</p>
      )}
    </div>
  );
};

export default QRCodePage;
