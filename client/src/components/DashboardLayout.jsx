import { Outlet, useLocation } from "react-router-dom";
import FloatingBar from "./FloatingBar";

const DashboardLayout = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100 relative w-full max-w-screen-lg sm:max-w-screen-xl mx-auto">
      <header className="bg-blue-800 text-white p-4 text-center font-bold text-lg sticky top-0 w-full z-10  shadow-md rounded-2xl mb-4">
        MediQR
      </header>

      {/* Page Content */}
      <main className="flex-grow p-8 sm:p-6 max-w-screen-xl mx-auto bg-gradient-to-br from-blue-100 to-purple-100">
        <Outlet />
      </main>

      <div className="fixed bottom-0 w-full shadow-md py-2">
        <FloatingBar />
      </div>
    </div>
  );
};

export default DashboardLayout;

