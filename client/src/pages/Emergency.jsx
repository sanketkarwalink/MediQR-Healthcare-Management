const EmergencySettings = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
          Verify Your Emergency Contact via QR
        </h2>
        <p className="mb-4 text-gray-700 text-justify">
          Please share this QR code image with your emergency contacts. They should scan it and send the given code to verify themselves & allow permissions so they can be contacted quickly in case of an emergency.
        </p>
        <img
          src="/image.png"
          alt="Emergency QR"
          className="mb-4 w-48 h-48 object-contain rounded-xl shadow"
        />
        <p className="text-xs text-gray-500 text-center m-2">
          Your emergency contacts can scan this QR using any QR scanner app
        </p>
        <h1>OR</h1>
        <div className="w-full rounded p-4 mb-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img src="/whatsapp-logo.svg" alt="WhatsApp" className="w-6 h-6" />
            <p className="mb-4 text-gray-700 text-justify"> They can Send a WhatsApp message to <b>+1 415 523 8886</b> with code <b><i>join grown-local</i></b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySettings;