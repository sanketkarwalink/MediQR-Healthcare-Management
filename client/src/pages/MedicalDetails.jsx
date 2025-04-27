import MedicalInfoForm from "../components/MedicalInfo";
import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";
import { Toaster } from "react-hot-toast";

const MedicalDetails = () => {
  const {user} = useContext(AuthContext);
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
      <Toaster />
      <MedicalInfoForm userId={user?.id} />
    </div>
  );
};

export default MedicalDetails;
