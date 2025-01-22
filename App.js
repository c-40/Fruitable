import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Header from "./Header"; 
import Home from "./Home"; // Import Home component
import Shop from "./shop"; // Import Shop component
import Footer from "./Footer"; // Import Footer component
import Contact from "./contact"; // Import Contact component
import Login from "./Login"; // Import Login component
import 'font-awesome/css/font-awesome.min.css';
import Cart from "./cart"; // Import Cart
import Checkout from "./Checkout";
import AdminLogin from "./admin";
import AdminDashboard from "./admindashboard";
import Account from "./account"; // Import Account component
import { useState, useEffect } from 'react';


function App() {
   const [showScrollButton, setShowScrollButton] = useState(false);
    
      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 300) {
            setShowScrollButton(true);
          } else {
            setShowScrollButton(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };



  return (
    <Router>
      <Header /> {/* This Header will be visible across all pages */}
      <div className="mt-8"> {/* Add margin to prevent content from sticking to the header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminLogin/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        {showScrollButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            backgroundColor: "#006400",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
          }}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
      </div>
      <Footer /> {/* Footer will also be visible on all pages */}
    </Router>
    
  );
}

export default App;
