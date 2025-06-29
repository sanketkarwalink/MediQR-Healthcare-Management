import { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import Input from '../components/Input';
import api from '../services/api.js';

function InsurancePage() {
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    policyNumber: '',
    policyHolder: '',
    expiryDate: '',
    emergencyContact: '',
    email: '', // Added email field
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await api.get('/api/insurance/me');
        const fetchedData = response.data;
        const formattedExpiryDate = fetchedData.expiryDate
          ? new Date(fetchedData.expiryDate).toISOString().split('T')[0]
          : '';
        setInsuranceData({
          provider: fetchedData.provider || '',
          policyNumber: fetchedData.policyNumber || '',
          policyHolder: fetchedData.policyHolder || '',
          expiryDate: formattedExpiryDate,
          emergencyContact: fetchedData.emergencyContact || '',
          email: fetchedData.email || '', // Set email
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching insurance data:", error);
        setLoading(false);
      }
    };

    fetchInsuranceData();
  }, []);

  // Make email mandatory for completeness
  const isComplete = insuranceData.provider && insuranceData.policyNumber && insuranceData.expiryDate && insuranceData.emergencyContact && insuranceData.email;

  const handleChange = (e) => {
    setInsuranceData({ ...insuranceData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.post('/api/insurance/update', insuranceData);
      setEditing(false);
      toast('Insurance info saved successfully!');
    } catch (error) {
      console.error('Error saving insurance data:', error);
      toast.error('Failed to save insurance info');
    }
  };

  if (loading) {
    return <p>Loading insurance data...</p>;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-5 w-95'>
      <div className="w-90 max-w-lg bg-white/80 rounded-2xl shadow-2xl p-8 transition-all duration-300">
      <div className="flex-col items-center justify-center mb-4">
        <h2 className="text-xl font-bold">Insurance Information</h2>
        <span className={`text-md font-semibold ${isComplete ? 'text-green-600' : 'text-red-500'}`}>
          {isComplete ? 'Keep this updated' : 'Incomplete'}
        </span>
      </div>

      {!editing ? (
        <div>
          <p><strong>Provider:</strong> {insuranceData.provider || 'Not provided'}</p>
          <p><strong>Policy Number:</strong> {insuranceData.policyNumber || 'Not provided'}</p>
          <p><strong>Policy Holder:</strong> {insuranceData.policyHolder || 'Not provided'}</p>
          <p><strong>Expiry Date:</strong> {insuranceData.expiryDate || 'Not provided'}</p>
          <p><strong>Email:</strong> {insuranceData.email || 'Not provided'}</p>
          <p>
            <strong>Emergency Contact:</strong>{' '}
            📞
            {insuranceData.emergencyContact ? (
              <a
                href={`tel:+91${insuranceData.emergencyContact}`}
                className="text-blue-600 underline hover:text-blue-800 m-1"
              >
                {insuranceData.emergencyContact}
              </a>
            ) : (
              'Not provided'
            )}
          </p>


          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Info
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            name="provider"
            placeholder="Insurance Provider"
            value={insuranceData.provider}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <Input
            type="text"
            name="policyNumber"
            placeholder="Policy Number"
            value={insuranceData.policyNumber}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <Input
            type="text"
            name="policyHolder"
            placeholder="Policy Holder Name"
            value={insuranceData.policyHolder}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <Input
            type="date"
            name="expiryDate"
            placeholder="Expiry Date"
            value={insuranceData.expiryDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <Input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Insurance Helpline"
            value={insuranceData.emergencyContact}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <Input
            type="email"
            name="email"
            placeholder="Insurance Email"
            value={insuranceData.email}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
     </div>
    </div>
  );
}

export default InsurancePage;