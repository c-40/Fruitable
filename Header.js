import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Navigation links for all users
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/shop" },
    { name: "Contact", to: "/contact" },
  ];

  // Redirect to the admin login page and start a session
  const handleAdminRedirect = () => {
    sessionStorage.setItem("adminSessionActive", true); // Start admin session
    navigate("/admin"); // Navigate to admin login page
  };

  // Logout: Clear admin and user tokens from storage
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Remove user token
    localStorage.removeItem("adminLoggedIn"); // Remove admin login flag
    sessionStorage.removeItem("adminSessionActive"); // End admin session
    navigate("/"); // Redirect to the home page
  };

  // Check login statuses
  const isLoggedIn = localStorage.getItem("userToken"); // User logged in
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn"); // Admin logged in
  const isAdminSessionActive = sessionStorage.getItem("adminSessionActive"); // Admin session active

  // Validate session when component mounts
  useEffect(() => {
    if (isAdminLoggedIn && !isAdminSessionActive) {
      handleLogout(); // Logout if session is invalid
    }
  }, [isAdminLoggedIn, isAdminSessionActive]);

  return (
    <header className="bg-green-600 text-white py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center"> 
             <img
              src="/Green_Black_White_Circle_Badge_Illustration_Minimalist_Movement_Logo-removebg-preview.png"
              alt="Logo"
              className="w-12 h-12 mr-4"
              style={{ filter: "invert(0)" }}
            /> 
           </div>
          <div className="flex space-x-6 ">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="text-white text-lg font-semibold hover:text-yellow-400 transition no-underline"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Admin/User Section */}
          <div className="flex items-center space-x-4">
            {isAdminLoggedIn ? (
              <>
                {/* Admin Dashboard Link */}
                <Link
                  to="/admin-dashboard"
                  className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition no-underline"
                >
                  Admin Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition no-underline"
                >
                  Log Out
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                {/* User Account Link */}
                <Link
                  to="/account"
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition no-underline"
                >
                  Account
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition no-underline"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                {/* User Login Icon */}
                <Link to="/login">
                  <i className="fas fa-user fa-2x text-white"></i>
                </Link>

                {/* Admin Login Button */}
                <button
                  onClick={handleAdminRedirect}
                  className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition no-underline"
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
