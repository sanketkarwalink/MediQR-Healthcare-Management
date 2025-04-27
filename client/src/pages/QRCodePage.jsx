import React, { useEffect, useState } from "react";

const QRCodePage = () => {
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const res = await fetch("http://localhost:5000/api/medical/qr", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("🔵 Fetched QR Data:", data); // Debugging
        if (res.ok) {
          setQrData(data.qrCodeUrl);
        } else {
          console.error("Failed to fetch QR data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching QR data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQRData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
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
