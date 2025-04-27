import { FaFileMedical, FaQrcode, FaShieldAlt, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FloatingBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 flex space-x-6 items-center z-50">
      <button onClick={() => navigate("/dashboard/medical-info")} className="flex flex-col items-center text-gray-700 hover:text-blue-500 w-12">
        <FaFileMedical size={24} />
        <span className="text-xs">Medical</span>
      </button>
      <button onClick={() => navigate("/dashboard/qr-code")} className="flex flex-col items-center text-gray-700 hover:text-blue-500 w-12">
        <FaQrcode size={24} />
        <span className="text-xs">QR Code</span>
      </button>
      <button onClick={() => navigate("/dashboard/insurance")} className="flex flex-col items-center text-gray-700 hover:text-blue-500 w-12">
        <FaShieldAlt size={24} />
        <span className="text-xs">Insurance</span>
      </button>
      <button onClick={() => navigate("/dashboard/profile")} className="flex flex-col items-center text-gray-700 hover:text-blue-500 w-12">
        <FaUserEdit size={24} />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};

export default FloatingBar;
