import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


const Account = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeSection, setActiveSection] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionFromUrl = params.get("section");

    if (sectionFromUrl === "orders") {
      setActiveSection("orders");
    } else {
      setActiveSection("account");
    }
  }, [location]);
  useEffect(() => {
  if (activeSection === "account" ) {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      console.log(storedUserData);  
      setFormData({
        firstname: storedUserData.firstname || "",
        lastname: storedUserData.lastname || "",
        email: storedUserData.email || "",
      });
      setError("");
    } else {
      setError("No user data found. Please log in.");
    }
  } else {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
    });
    setError("");
    setSuccessMessage("");
  }
}, [activeSection]);
useEffect(() => {
  if (activeSection === "delete") {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.email) {
      setFormData({
        firstname: storedUserData.firstname || "",
        lastname: storedUserData.lastname || "",
        email: storedUserData.email || "",
      });
    } else {
      setError("No user data found. Please log in.");
    }
  }
}, [activeSection]);


  // useEffect(() => {
  //   if (activeSection === "account") {
  //     const storedUserData = JSON.parse(localStorage.getItem("userData"));
  //     if (storedUserData) {
  //       setFormData({
  //         firstname: storedUserData.firstname || "",
  //         lastname: storedUserData.lastname || "",
  //         email: storedUserData.email || "",
  //       });
  //       setError("");
  //     } else {
  //       setError("No user data found. Please log in.");
  //     }
  //   } else {
  //     setFormData({
  //       firstname: "",
  //       lastname: "",
  //       email: "",
  //     });
  //     setError("");
  //     setSuccessMessage("");
  //   }
  // }, [activeSection]);
  
  useEffect(() => {
    if (activeSection === "orders" && formData.email) {
      
      fetchOrders();
    }
  }, [activeSection, formData.email]);

  // const fetchOrders = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/get-orders?email=${formData.email}`);
  //     const data = await response.json();

  //     console.log("Raw API Response:", data);  
  //     if (response.ok) {
  //       setOrders(data || []);
  //     } else {
  //       setError("Failed to fetch orders.");
  //     }
  //   } catch (error) {
  //     setError("An error occurred while fetching orders.");
  //   }
  // };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/get-orders?email=${formData.email}`);
      const data = await response.json();
  
      console.log("Raw API Response:", data);
  
      if (response.ok) {
        // Sort the orders based on the status
        const sortedOrders = data.sort((a, b) => {
          const orderStatusPriority = {
            " Not Delivered": 1,   // Not Delivered comes first
            "Delivered": 2,       // Delivered comes next
            "Cancelled": 3,       // Cancelled comes last
          };
  
          return orderStatusPriority[a.status] - orderStatusPriority[b.status];
        });
  
        setOrders(sortedOrders || []);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (error) {
      setError("An error occurred while fetching orders.");
    }
  };
  
  

const handleCancelOrder = async (orderId) => {
  // Find the order to check its status
  const orderToCancel = orders.find(order => order.id === orderId);

  // If the order's status is 'Delivered', prevent cancellation
  if (orderToCancel && orderToCancel.status === "Delivered") {
    alert("This order has already been delivered and cannot be canceled.");
    return;
  }

  // Confirmation dialog before cancellation
  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  try {
    // Send POST request to cancel order
    const response = await fetch("http://localhost:5000/cancel-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),  // Sending the orderId to the backend
    });

    // Check if the response was successful
    if (response.ok) {
      // Update the status of the canceled order in the state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      ));
      alert("Order canceled successfully.");
    } else {
      // Parse the error from the server and show an alert
      const errorData = await response.json();
      alert(errorData.error || "Failed to cancel order.");
    }
  } catch (error) {
    // Handle network or other errors
    console.error("Error canceling order:", error);
    alert("An error occurred while canceling the order. Please try again.");
  }
};

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5000/update-account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setSuccessMessage("Account updated successfully.");
        setError(""); // Clear any previous errors
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update account.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }

    setIsLoading(false);
  };





  const handleDeleteAccount = async () => {
    console.log(formData.email);
    if (!formData.email) {
      alert("Email is required to delete your account.");
      return;
    }
  
    // Confirm before proceeding with account deletion
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("http://localhost:5000/delete-account", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        });
  
        if (response.ok) {
          // Clear localStorage to log the user out
          localStorage.removeItem("userToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userData");
  
          alert("Account deleted successfully.");
  
          // Redirect to the home page or login page (you can change this URL based on your app's structure)
          window.location.href = "http://localhost:3000/"; // Redirect to home or login page
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 p-6 bg-gray-200 rounded-lg shadow-md">
        <div
          onClick={() => setActiveSection("account")}
          className={`cursor-pointer py-3 px-4 rounded-md mb-4 ${
            activeSection === "account"
              ? "bg-green-500 text-white"
              : "text-gray-600 hover:bg-green-200"
          }`}
        >
          Account Details
        </div>
        <div
          onClick={() => setActiveSection("orders")}
          className={`cursor-pointer py-3 px-4 rounded-md mb-4 ${
            activeSection === "orders"
              ? "bg-green-500 text-white"
              : "text-gray-600 hover:bg-green-200"
          }`}
        >
          Order Details
        </div>
        <div
          onClick={() => setActiveSection("delete")}
          className={`cursor-pointer py-3 px-4 rounded-md ${
            activeSection === "delete"
              ? "bg-green-500 text-white"
              : "text-gray-600 hover:bg-green-200"
          }`}
        >
          Delete Account
        </div>
      </div>

      <div className="flex-1 p-6">
        {activeSection === "account" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstname" className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastname" className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className={`bg-green-500 text-white py-2 px-6 rounded-md ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Details"}
              </button>
            </form>
          </div>
        )}

{activeSection === "orders" && (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    {orders.length > 0 ? (
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
              <p className="text-sm text-gray-600">
                Delivery Date: {new Date(order.delivery_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Status: {order.status.trim()}</p>
              <p className="text-sm text-gray-600">
                Address: {order.address}, {order.town}, {order.postcode}
              </p>
              <p className="text-sm text-gray-600">
                Contact: {order.firstname} {order.lastname} ({order.mobile})
              </p>
            </div>
            <div className="mb-6">
              {order.cart_items && Array.isArray(order.cart_items) && order.cart_items.length > 0 ? (
                <div className="space-y-4">
                  {order.cart_items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items in this order.</p>
              )}
            </div>
            <div className="text-xl font-semibold">
              Total Cost: $
              {order.cart_items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </div>
            {order.status.toLowerCase() !== 'cancelled' && (
  <button
    onClick={() => handleCancelOrder(order.id)}
    className="bg-red-500 text-white py-2 px-6 rounded-md mt-4"
  >
    Cancel Order
  </button>
)}


          </div>
        ))}
      </div>
    ) : (
      <p>No orders found for this account.</p>
    )}
  </div>
)}


        {activeSection === "delete" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Delete Account</h2>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white py-2 px-6 rounded-md"
            >
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
