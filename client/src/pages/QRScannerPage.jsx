import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScannerPage = () => {
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📌 Initializing QR Scanner...");

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    console.log("📌 Scanner Initialized");

    scanner.render(
      (decodedText) => {
        console.log("✅ Scanned Raw Data:", decodedText);
        try {
          let userId = null;
          let parsedData = null;

          // Case 1: JSON QR Code
          if (decodedText.startsWith("{") && decodedText.endsWith("}")) {
            parsedData = JSON.parse(decodedText);
            userId = parsedData?.userId;
          }
          // Case 2: URL QR Code
          else if (decodedText.startsWith("http")) {
            const url = new URL(decodedText);
            const pathParts = url.pathname.split("/");
            userId = pathParts[pathParts.length - 1];
            parsedData = { userId };
          }
          // let cleanUrl = decodedText.trim(); // Remove extra spaces

          // // Force HTTPS if missing
          // if (!cleanUrl.startsWith("https://")) {
          //   cleanUrl = "https://" + cleanUrl.replace(/^http:\/\//, "");
          // }

          // console.log("🚀 Navigating to:", cleanUrl);
          // window.location.href = cleanUrl;

          if (!userId) {
            throw new Error("Invalid QR Code: No userId found.");
          }
          sessionStorage.setItem("qrData", JSON.stringify(parsedData));
          console.log("📌 QR Data stored in sessionStorage:", parsedData);

          console.log("🚀 Navigating to /qr-result with:", { userId, parsedData });

          scanner.clear();
          navigate(`/qr-result/${userId}`);
        } catch (error) {
          console.error("❌ QR Code Error:", error.message);
          alert("Invalid QR Code. Please scan a valid medical QR.");
        }
      },
      (error) => console.warn("⚠️ QR Scan Error:", error)
    );

    scannerRef.current = scanner;

    return () => {
      console.log("🛑 Stopping scanner...");
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current.stop().catch((err) => console.warn("⚠️ Scanner stop error:", err));
      }
    };
  }, [navigate]);

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold">Scan a QR Code</h2>
      <div id="qr-reader" className="mt-4" />
    </div>
  );
};

export default QRScannerPage;