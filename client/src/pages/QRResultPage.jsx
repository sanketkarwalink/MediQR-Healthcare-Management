import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import MedicalCard from "./MedicalCard";
import api from '../services/api.js';

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
            const response = await api.get(`/api/medical/qr-result/${userId}`);
            setQrData(response.data);
          } catch (error) {
            console.error("❌ API Fetch Error:", error.response?.data?.message || error.message);
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
