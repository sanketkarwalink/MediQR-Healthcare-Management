import { Outlet, useLocation } from "react-router-dom";
import FloatingBar from "./FloatingBar";

const DashboardLayout = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <header className="bg-blue-800 text-white p-4 text-center font-bold text-lg sticky top-0 w-full z-10  shadow-md rounded-2xl mb-4">
        MediQR
      </header>

      {/* Page Content */}
      <main className="flex-grow p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <Outlet />
      </main>

      <div className="fixed bottom-0 w-full bg-white shadow-md py-2">
        <FloatingBar />
      </div>
    </div>
  );
};

export default DashboardLayout;

