import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MedicalCard from "./MedicalCard";

const QRResultPage = () => {
    const location = useLocation();
    const { userId } = useParams();
    const storedQrData = sessionStorage.getItem("qrData");
    const [qrData, setQrData] = useState(location.state?.qrData || (storedQrData ? JSON.parse(storedQrData) : null));

    console.log("📌 QRResult Page Received (location.state):", location.state);
    console.log("📌 Extracted qrData:", qrData);
    console.log("📌 Extracted userId from URL:", userId);
    console.log("📌 Stored QR Data from sessionStorage:", storedQrData);

    useEffect(() => {
      if (!userId) return;

      if (!qrData && userId) {
        const fetchData = async () => {
          try {
            const host = window.location.hostname;
            const response = await fetch(`http://${host}:5000/api/medical/qr-result/${userId}`);
            if (!response.ok) throw new Error("No data found");
            const data = await response.json();
            setQrData(data);
          } catch (error) {
            console.error("❌ API Fetch Error:", error.message);
          }
        };
        if (!qrData) {
          fetchData();
        }
      }
    }, [userId, qrData]);



    if (!qrData) {
        return <p className="text-red-500">⚠️ No QR Data Found</p>;
    }

    return <MedicalCard data={qrData} />;
};

export default QRResultPage;
