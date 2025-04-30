import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as QRCode from "qrcode.react";
import { AuthContext } from "../context/AuthContext";
import MedicalInfoForm from "../components/MedicalInfo";
import { FaHospital, FaQrcode, FaBell, FaExclamationTriangle, FaClipboardList, FaExclamationCircle } from "react-icons/fa";
import Card from "../components/Card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [qrData, setQrData] = useState(null);
    const [showPopUp, setShowPopUp] = useState("");
    const [showMedicalForm, setShowMedicalForm] = useState(false);
    const [medicalInfo, setMedicalInfo] = useState(null);
    const sosSound = useRef(new Audio("/alert-85101.mp3"));
    const recognitionRef = useRef(null);
    const confirmationPendingRef = useRef(false);

    useEffect(() => {
        fetchMedicalInfo();
    }, []);

    const fetchMedicalInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/medical/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if(res.data){
                setMedicalInfo(res.data);
            }
        } catch (error) {
            console.error("Error fetching medical info", error);
        }
    };

    const generateQR = async (updatedMedicalInfo) => {
        try {
            const res = await axios.post("http://localhost:5000/api/medical/generate-qr", {
                userId: user?.id,
                ...updatedMedicalInfo,
            });
            setQrData(res.data.qrCodePath);
            setMedicalInfo(updatedMedicalInfo);
            setShowMedicalForm(false);
        } catch (error) {
            console.error(error.response?.data?.message || "Error generating QR code");
        }
    };
    const handleCard = (redirectPath, message) => {
        if (!medicalInfo) {
            toast.warn(
                <div className="flex items-center justify-between gap-4">
                        <p className="text-gray-900 font-medium">{message}
                        </p>
                        <button
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition"
                            onClick={() => navigate(redirectPath)}
                        >
                            Fill Now
                        </button>
                </div>,
                {
                    position: "top-center",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    className: "bg-white shadow-lg rounded-lg p-4 border-l-4 border-yellow-500",
                }
            );
        } else {
            navigate("/dashboard/qr-code");
        }
    };

    const speak = (message, lang = "en-US", voiceType = "female") => {
        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = lang;
        speech.rate = 1;
        speech.pitch = 1;

        // Select specific voice type (male/female)
        const voices = window.speechSynthesis.getVoices();
        speech.voice = voices.find(voice =>
            voice.name.toLowerCase().includes(voiceType.toLowerCase())
        ) || voices[0];

        window.speechSynthesis.speak(speech);
    };

    const promptConfirmation = () => {
        confirmationPendingRef.current = true;

        speak("Did you mean to trigger SOS? Say Confirm or Cancel.", "en-US", "female");
        // speak("क्या आप आपातकालीन सहायता सक्रिय करना चाहते हैं? 'Confirm' या 'Cancel' कहें।", "hi-IN", "male");

    };

    const activateSOS = async () => {
        sosSound.current.play().catch(err => console.error("Audio play error:", err));

        speak("SOS activated. Help is on the way.", "en-US", "female");

        if (medicalInfo) {
            navigate("/dashboard/qr-code");
        } else {
            toast.warn("Medical Info Required to generate QR!!");
        }

        if (!navigator.geolocation) {
            speak("Geolocation not supported. Sending SOS without location.", "en-US", "female");
            sendSOS(null, null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log("✅ Location fetched:", latitude, longitude);
                sendSOS(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                speak("Unable to fetch location. Sending SOS without location.", "en-US", "female");
                sendSOS(null, null);
            }
        );
    };

    const sendSOS = async (latitude, longitude) => {
        console.log("📍 Sending SOS with location:", latitude, longitude);
        try {
            const emergencyContact = medicalInfo?.emergencyContact || "9914416768";
            const message = `🚨 SOS Alert! ${user.name} needs help! Last known location: https://maps.google.com/?q=${latitude},${longitude}`;

            await axios.post("http://localhost:5000/api/sos", {
                userId: user.id,
                latitude,
                longitude,
            });

            setQrData(`http://localhost:5173/api/medical/qr/${user.id}`);
            speak("SOS alert sent successfully.", "en-US", "female");
            toast.success("🚨 SOS sent to emergency contact!");
        } catch (error) {
            console.error("Error triggering SOS:", error);
            speak("SOS activation failed. Please try again.", "en-US", "female");
        }
    };

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            toast.error("❌ Speech recognition not supported.");
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
                console.log("🗣️ Heard:", transcript);
                console.log("confirmationPending:", confirmationPendingRef.current);

                if (transcript.includes("help me") || transcript.includes("emergency")) {
                    console.log("⚠️ Detected emergency keyword. Triggering promptConfirmation.");
                    promptConfirmation();
                } else if (transcript.includes("confirm") && confirmationPendingRef.current) {
                        console.log("✅ Confirming SOS...");
                        confirmationPendingRef.current = false;
                        activateSOS();
                } else if (transcript.includes("cancel")) {
                    console.log("❌ Cancelling SOS...");
                    confirmationPendingRef.current = false;
                    speak("SOS request canceled.");
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                toast.error(`❌ Speech recognition error: ${event.error}`);
            };
        }

        // Start listening
        recognitionRef.current.start();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center text-center p-6 relative">
            <Card className="w-full max-w-lg p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-all relative m-5 ">
                <h2 className="text-2xl font-semibold text-gray-900 ">
                    Hey, {user?.name}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Stay prepared for emergencies. Keep your profile updated!
                </p>
                <button id="start-btn" onClick={startListening} className="mt-4 px-4 py-2 bg-blue-800 text-white rounded">Start Voice Recognition</button>
            </Card>
            <div className="grid grid-cols-2 gap-4 max-w-md mt-6 w-full">
                <Card className="p-4 flex flex-col items-center rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105"
                    onClick={() => {
                        if (!medicalInfo) {
                            handleCard("/dashboard/medical-info", "Medical Info Required to generate QR!!");
                        } else {
                            navigate("/dashboard/qr-code");
                        }
                    }}>
                    <FaQrcode size={26} className="text-blue-600" />
                    <p className="mt-2 text-sm font-semibold">Generate QR Code</p>
                </Card>
                <Card className="p-4 flex flex-col items-center rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105"
                    onClick={() => {
                        if (!medicalInfo) {
                            handleCard("/dashboard/medical-info", "Medical Info Required to Access Profile");
                        } else {
                            navigate("/medical-card", { state: { data: medicalInfo } });
                        }
                    }}>
                    <FaClipboardList size={26} className="text-green-600" />
                    <p className="mt-2 text-sm font-semibold">Medical Profile</p>
                </Card>
                <Card className="p-4 flex flex-col items-center rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105">
                    <FaHospital size={26} className="text-gray-700" />
                    <p className="mt-2 text-sm font-semibold">Emergency Services</p>
                </Card>
                <Card className="p-4 flex flex-col items-center bg-red-50/75 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-red-400 hover:scale-105">
                    <FaExclamationTriangle size={26} className="text-red-600" />
                    <p className="mt-2 text-sm font-semibold">Activate SOS</p>
                </Card>
            </div>

            {/* Medical Info Form */}
            {showMedicalForm && (
                <MedicalInfoForm userId={user?.id} onSave={generateQR} />
            )}

            {/* QR Code Display */}
            {qrData && (
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Your QR Code:</h3>
                    <QRCode value={qrData} className="mt-2 mx-auto" />
                </div>
            )}

            {/* Pop-Ups */}
            {showPopUp === "insurance" && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold">Contact Insurance</h3>
                        <p>Call: +1800-INSURANCE</p>
                        <button onClick={() => setShowPopUp("")} className="mt-3 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
