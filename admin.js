import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkLoggedInStatus = () => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    return loggedIn === "true";
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkLoggedInStatus);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin-dashboard"); // Redirect to admin dashboard if logged in
    } else {
      navigate("/admin"); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (email === "admin@gmail.com" && password === "1234") {
      setError("");
      alert("Login successful!");
      localStorage.setItem("adminLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    alert("You are logged out!");
    setIsLoggedIn(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
            >
              Login
            </button>
          </form>
        ) : (
          <div>
            <button
              onClick={handleLogout}
              className="w-full py-3 mt-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
