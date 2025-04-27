import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaHospital, FaQrcode, FaBell, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import Card from "../components/Card";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [qrData, setQrData] = useState(null);
    const [medicalInfo, setMedicalInfo] = useState(null);

    useEffect(() => {
        fetchMedicalInfo();
    }, []);

    const fetchMedicalInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/medical/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMedicalInfo(res.data);
        } catch (error) {
            console.error("Error fetching medical info", error);
        }
    };
    const [showReminder, setShowReminder] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Your insurance expires in 10 days!", read: false },
    ]);
    const [medicalInfoFilled, setMedicalInfoFilled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowReminder(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const dismissNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-gray-200/90 flex flex-col items-center text-center p-6 relative">
            <Card className="w-full max-w-lg bg-white/90 p-6 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all relative">
                <h2 className="text-2xl font-semibold text-gray-900 ">
                    Hey, {user?.name}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Stay prepared for emergencies. Keep your profile updated!
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300/50 rounded-full h-3 mt-4 overflow-hidden">
                    <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: "50%" }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Emergency readiness: <span className="font-medium text-blue-600">50% Complete</span></p>
            </Card>

            <div className="grid grid-cols-2 gap-4 max-w-md mt-6 w-full">
                <Card className="p-4 flex flex-col items-center bg-white/75 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105"
                    onClick={() => {
                        if (!medicalInfoFilled) {
                            alert("Please fill out your medical information first.");
                        } else {
                            window.location.href = "/generate-qr";
                        }
                    }}>
                    <FaQrcode size={26} className="text-blue-600" />
                    <p className="mt-2 text-sm font-semibold">Generate QR Code</p>
                </Card>
                <Card className="p-4 flex flex-col items-center bg-white/75 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105"
                    onClick={() => {
                        window.location.href = "/medical-profile";
                    }}>
                    <FaClipboardList size={26} className="text-green-600" />
                    <p className="mt-2 text-sm font-semibold">Medical Profile</p>
                </Card>
                <Card className="p-4 flex flex-col items-center bg-white/75 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-gray-300 hover:scale-105">
                    <FaHospital size={26} className="text-gray-700" />
                    <p className="mt-2 text-sm font-semibold">Emergency Services</p>
                </Card>
                <Card className="p-4 flex flex-col items-center bg-red-50/75 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border border-red-400 hover:scale-105">
                    <FaExclamationTriangle size={26} className="text-red-600" />
                    <p className="mt-2 text-sm font-semibold">Activate SOS</p>
                </Card>
            </div>

            <button 
                onClick={() => setShowReminder(true)} 
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
                <FaBell size={24} />
            </button>

            {showReminder && (
                <div className="fixed bottom-20 right-6 bg-white/90 shadow-lg rounded-lg p-4 w-80 border border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-600 text-sm">No new notifications</p>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification.id} className="p-3 bg-gray-100/80 rounded-md mb-2">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <div className="flex justify-between mt-3 gap-2">
                                    <button onClick={() => markAsRead(notification.id)} className="text-white bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded-md flex-1">Mark as Read</button>
                                    <button onClick={() => dismissNotification(notification.id)} className="text-white bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded-md flex-1">Dismiss</button>
                                </div>
                            </div>
                        ))
                    )}
                    <button onClick={() => setShowReminder(false)} className="mt-2 w-full bg-gray-200/80 text-gray-800 py-1 rounded-lg hover:bg-gray-300">Close</button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;