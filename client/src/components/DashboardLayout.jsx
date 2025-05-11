import { Outlet, useLocation, Navigate } from "react-router-dom";
import FloatingBar from "./FloatingBar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Lock } from "lucide-react";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
     <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/90 rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center max-w-md w-full border border-blue-100">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Lock size={36} className="text-blue-700" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight">Access Denied</h2>
          <p className="mb-8 text-gray-600 text-center text-lg">
            You must be logged in to view this page.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }
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

