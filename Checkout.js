// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";

// // const Checkout = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     firstName: "",
// //     lastName: "",
// //     address: "",
// //     town: "",
// //     postcode: "",
// //     mobile: "",
// //     email: "",
// //     orderNotes: "",
// //     deliveryDate: "",
// //   });
// //   const [errors, setErrors] = useState({});


// //   const userToken = localStorage.getItem("userToken");
// //   const localCartKey = `${userToken}_cart`;
// //   const cart = JSON.parse(localStorage.getItem(localCartKey)) || {};
// //   const cartItems = Object.values(cart);
// //   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

// //   useEffect(() => {
// //     const storedUserData = JSON.parse(localStorage.getItem("userData"));
// //     if (storedUserData) {
// //       setFormData((prevState) => ({
// //         ...prevState,
// //         firstName: storedUserData.firstname,
// //         lastName: storedUserData.lastname,
// //         email: storedUserData.email,
// //       }));
// //     } else {
// //       navigate("/login");
// //     }
// //   }, [navigate]);

// //   if (!userToken) {
// //     navigate("/login");
// //     return null;
// //   }

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
// //   };

// //   // const handlePlaceOrder = async () => {
// //   //   if (!validateForm()) return;  
  
// //   //   const { firstName, lastName, address, town, postcode, mobile, email, deliveryDate } = formData;
// //   //   const orderData = {
// //   //     firstname: firstName,
// //   //     lastname: lastName,
// //   //     address,
// //   //     town,
// //   //     postcode,
// //   //     mobile,
// //   //     email,
// //   //     delivery_date: deliveryDate,
// //   //     cart_items: cartItems,
// //   //   };

// //   //   try {
// //   //     const response = await fetch("http://localhost:5000/add_order", {
// //   //       method: "POST",
// //   //       headers: {
// //   //         "Content-Type": "application/json",
// //   //       },
// //   //       body: JSON.stringify(orderData),
// //   //     });

// //   //     const contentType = response.headers.get("Content-Type");
// //   //     let data = {};

// //   //     if (contentType && contentType.includes("application/json")) {
// //   //       data = await response.json();
// //   //     } else {
// //   //       const text = await response.text();
// //   //       alert(`Unexpected response: ${text}`);
// //   //       return;
// //   //     }

// //   //     if (response.ok) {
// //   //       alert("Order placed successfully!");
// //   //       localStorage.removeItem(localCartKey);
// //   //       navigate("/account?section=orders");
// //   //     } else {
// //   //       alert(`Failed to place order: ${data.message || "Unknown error"}`);
// //   //     }
// //   //   } catch (error) {
// //   //     console.error("Error placing order:", error);
// //   //     alert("An error occurred while placing the order.");
// //   //   }
// //   // };
// //   const handlePlaceOrder = async () => {
// //     if (!validateForm()) return;
  
// //     const { firstName, lastName, address, town, postcode, mobile, email, deliveryDate } = formData;
// //     const orderData = {
// //       firstname: firstName,
// //       lastname: lastName,
// //       address,
// //       town,
// //       postcode,
// //       mobile,
// //       email,
// //       delivery_date: deliveryDate,
// //       cart_items: cartItems,
// //     };
  
// //     try {
// //       const response = await fetch("http://localhost:5000/add_order", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(orderData),
// //       });
  
// //       const contentType = response.headers.get("Content-Type");
// //       let data = {};
  
// //       if (contentType && contentType.includes("application/json")) {
// //         data = await response.json();
// //       } else {
// //         const text = await response.text();
// //         alert(`Unexpected response: ${text}`);
// //         return;
// //       }
  
// //       if (response.ok) {
// //         alert("Order placed successfully!");
// //         localStorage.removeItem(localCartKey);
// //         navigate("/account?section=orders");
  
// //         // Trigger the email functionality
// //         handleEmailOrder(orderData);
// //       } else {
// //         alert(`Failed to place order: ${data.message || "Unknown error"}`);
// //       }
// //     } catch (error) {
// //       console.error("Error placing order:", error);
// //       alert("An error occurred while placing the order.");
// //     }
// //   };
  
// //   const handleEmailOrder = async (orderData) => {
// //     try {
// //       const response = await fetch("http://localhost:5000/send_email_order", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(orderData),
// //       });
  
// //       const contentType = response.headers.get("Content-Type");
// //       let data = {};
  
// //       if (contentType && contentType.includes("application/json")) {
// //         data = await response.json();
// //       } else {
// //         const text = await response.text();
// //         alert(`Unexpected response: ${text}`);
// //         return;
// //       }
  
// //       if (response.ok) {
// //         console.log("Order email sent successfully!");
// //       } else {
// //         console.error(`Failed to send order email: ${data.message || "Unknown error"}`);
// //       }
// //     } catch (error) {
// //       console.error("Error sending email:", error);
// //       alert("An error occurred while sending the order confirmation email.");
// //     }
// //   };

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     town: "",
//     postcode: "",
//     mobile: "",
//     email: "",
//     orderNotes: "",
//     deliveryDate: "",
//   });
//   const [errors, setErrors] = useState({});

//   const userToken = localStorage.getItem("userToken");
//   const localCartKey = `${userToken}_cart`;
//   const cart = JSON.parse(localStorage.getItem(localCartKey)) || {};
//   const cartItems = Object.values(cart);
//   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("userData"));
//     if (storedUserData) {
//       setFormData((prevState) => ({
//         ...prevState,
//         firstName: storedUserData.firstname,
//         lastName: storedUserData.lastname,
//         email: storedUserData.email,
//       }));
//     } else {
//       navigate("/login");
//     }
//   }, [navigate]);

//   if (!userToken) {
//     navigate("/login");
//     return null;
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateForm()) return;

//     const { firstName, lastName, address, town, postcode, mobile, email, deliveryDate } = formData;
//     const orderData = {
//       firstname: firstName,
//       lastname: lastName,
//       address,
//       town,
//       postcode,
//       mobile,
//       email,
//       delivery_date: deliveryDate,
//       cart_items: cartItems,
//     };

//     try {
//       const response = await fetch("http://localhost:5000/add_order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       });

//       const contentType = response.headers.get("Content-Type");
//       let data = {};

//       if (contentType && contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         const text = await response.text();
//         alert(`Unexpected response: ${text}`);
//         return;
//       }

//       if (response.ok) {
//         alert("Order placed successfully!");
//         localStorage.removeItem(localCartKey);
//         navigate("/account?section=orders");

//         // Trigger the email functionality
//         handleEmailOrder(orderData);
//       } else {
//         alert(`Failed to place order: ${data.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       alert("An error occurred while placing the order.");
//     }
//   };

//   const handleEmailOrder = async (orderData) => {
//     try {
//       const response = await fetch("http://localhost:5000/send_email_order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       });

//       const contentType = response.headers.get("Content-Type");
//       let data = {};

//       if (contentType && contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         const text = await response.text();
//         alert(`Unexpected response: ${text}`);
//         return;
//       }

//       if (response.ok) {
//         console.log("Order email sent successfully!");
//       } else {
//         console.error(`Failed to send order email: ${data.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("Error sending email:", error);
//       alert("An error occurred while sending the order confirmation email.");
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.address) {
//       newErrors.address = 'Address is required';
//       alert("Address is required");
//     };
//     if (!formData.mobile) {
//       newErrors.mobile = 'Mobile number is required';
//     } else if (!/^\d{10}$/.test(formData.mobile)) {  // Example: check for 10 digits
//       newErrors.mobile = 'Invalid mobile number. It must be 10 digits.';
//     }
//     if (!formData.postcode || !/^\d{6}$/.test(formData.postcode)) {
//       newErrors.postcode = 'Valid postal code is required';
//       alert("Valid postal code is required");
//     }
//     if (!formData.deliveryDate) {
//       newErrors.deliveryDate = 'Delivery date is required';
//       alert('Delivery date is required');
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = ("0" + (today.getMonth() + 1)).slice(-2);
//     const day = ("0" + today.getDate()).slice(-2);
//     return `${year}-${month}-${day}`;
//   };

//   return (
//     <div className="container-fluid py-5">
//       <div className="container py-5">
//         <h1 className="mb-4">Billing Details</h1>
//         <form>
//           <div className="row g-5">
//             <div className="col-md-12 col-lg-6 col-xl-7">
//               {/* Form fields */}
//               {Object.entries(formData).map(([key, value]) => (
//                 <div key={key} className="form-item w-100 mb-3">
//                   <label className="form-label my-3">
//                     {key.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type={
//                       key === 'email'
//                         ? 'email'
//                         : key === 'deliveryDate'
//                           ? 'date'
//                           : key === 'postcode'
//                             ? 'text'
//                             : 'text'
//                     }
//                     name={key}
//                     value={value}
//                     onChange={handleInputChange}
//                     className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
//                     disabled={key === 'firstName' || key === 'lastName' || key === 'email'}
//                     min={key === 'deliveryDate' ? getTodayDate() : undefined}  // Restrict date to today or later
//                   />
//                   {errors[key] && (
//                     <div className="invalid-feedback">{errors[key]}</div>
//                   )}
//                 </div>
//               ))}
//               <textarea
//                 name="orderNotes"
//                 value={formData.orderNotes}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Order Notes (Optional)"
//               />
//             </div>
//             <div className="col-md-12 col-lg-6 col-xl-5">
//               {/* Cart summary */}
//               <div className="table-responsive">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Name</th>
//                       <th>Price</th>
//                       <th>Quantity</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cartItems.map((item) => (
//                       <tr key={item.id}>
//                         <td>
//                           <img
//                             src={item.img}
//                             alt={item.name}
//                             style={{ width: 50, height: 50 }}
//                           />
//                         </td>
//                         <td>{item.name}</td>
//                         <td>₹{item.price
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.address) {
//       newErrors.address = 'Address is required'
//       alert("Address is required")
//     };
//     if (!formData.mobile) {
//       newErrors.mobile = 'Mobile number is required';
//     } else if (!/^\d{10}$/.test(formData.mobile)) {  // Example: check for 10 digits
//       newErrors.mobile = 'Invalid mobile number. It must be 10 digits.';
//     }
//     if (!formData.postcode|| !/^\d{6}$/.test(formData.postcode))
//     {
//       newErrors.postalCode = 'Valid postal code is required';
//       alert("Valid postal code is required")
//     }
//     if (!formData.deliveryDate) {
//     newErrors.deliveryDate = 'Delivery date is required';
//     alert('Delivery date is required')
//   }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = ("0" + (today.getMonth() + 1)).slice(-2);
//     const day = ("0" + today.getDate()).slice(-2);
//     return `${year}-${month}-${day}`;
//   };
//   return (
//     <div className="container-fluid py-5">
//       <div className="container py-5">
//         <h1 className="mb-4">Billing Details</h1>
//         <form>
//           <div className="row g-5">
//             <div className="col-md-12 col-lg-6 col-xl-7">
//               {/* Form fields */}
//               {Object.entries(formData).map(([key, value]) => (
//                 <div key={key} className="form-item w-100 mb-3">
//                   <label className="form-label my-3">
//                     {key.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                 type={
//                   key === 'email'
//                     ? 'email'
//                     : key === 'deliveryDate'
//                     ? 'date'
//                     : key === 'postalCode'
//                     ? 'text'
//                     : 'text'
//                 }
//                 name={key}
//                 value={value}
//                 onChange={handleInputChange}
//                 className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
//                 disabled={key === 'firstName' || key === 'lastName' || key === 'email'}
//                 min={key === 'deliveryDate' ? getTodayDate() : undefined}  // Restrict date to today or later
//               />
//                   {errors[key] && (
//                     <div className="invalid-feedback">{errors[key]}</div>
//                   )}
//                 </div>
//               ))}
//               <textarea
//                 name="orderNotes"
//                 value={formData.orderNotes}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 placeholder="Order Notes (Optional)"
//               />
//             </div>
//             <div className="col-md-12 col-lg-6 col-xl-5">
//               {/* Cart summary */}
//               <div className="table-responsive">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Product</th>
//                       <th>Name</th>
//                       <th>Price</th>
//                       <th>Quantity</th>
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cartItems.map((item) => (
//                       <tr key={item.id}>
//                         <td>
//                           <img
//                             src={item.img}
//                             alt={item.name}
//                             style={{ width: 50, height: 50 }}
//                           />
//                         </td>
//                         <td>{item.name}</td>
//                         <td>₹{item.price.toFixed(2)}</td>
//                         <td>{item.quantity}</td>
//                         <td>₹{(item.price * item.quantity).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                     <tr>
//                       <td colSpan="4">Subtotal</td>
//                       <td>${subtotal.toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <button
//                 type="button"
//                 onClick={handlePlaceOrder}
//                 className="btn w-100 mt-3" style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}


//               >
//                 Place Order
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    town: "",
    postcode: "",
    mobile: "",
    email: "",
    orderNotes: "",
    deliveryDate: "",
  });
  const [errors, setErrors] = useState({});

  const userToken = localStorage.getItem("userToken");
  const localCartKey = `${userToken}_cart`;
  const cart = JSON.parse(localStorage.getItem(localCartKey)) || {};
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setFormData((prevState) => ({
        ...prevState,
        firstName: storedUserData.firstname,
        lastName: storedUserData.lastname,
        email: storedUserData.email,
      }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!userToken) {
    navigate("/login");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const { firstName, lastName, address, town, postcode, mobile, email, deliveryDate } = formData;
    const orderData = {
      firstname: firstName,
      lastname: lastName,
      address,
      town,
      postcode,
      mobile,
      email,
      delivery_date: deliveryDate,
      cart_items: cartItems,
    };

    try {
      const response = await fetch("http://localhost:5000/add_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("Content-Type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        alert(`Unexpected response: ${text}`);
        return;
      }

      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem(localCartKey);
        navigate("/account?section=orders");

        // Trigger the email functionality
        handleEmailOrder(orderData);
      } else {
        alert(`Failed to place order: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    }
  };

  const handleEmailOrder = async (orderData) => {
    try {
      const response = await fetch("http://localhost:5000/send_email_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("Content-Type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        alert(`Unexpected response: ${text}`);
        return;
      }

      if (response.ok) {
        console.log("Order email sent successfully!");
      } else {
        console.error(`Failed to send order email: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the order confirmation email.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {  // Example: check for 10 digits
      newErrors.mobile = 'Invalid mobile number. It must be 10 digits.';
    }
    if (!formData.postcode || !/^\d{6}$/.test(formData.postcode)) {
      newErrors.postcode = 'Valid postal code is required';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <h1 className="mb-4">Billing Details</h1>
        <form>
          <div className="row g-5">
            <div className="col-md-12 col-lg-6 col-xl-7">
              {/* Form fields */}
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="form-item w-100 mb-3">
                  <label className="form-label my-3">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={
                      key === 'email'
                        ? 'email'
                        : key === 'deliveryDate'
                          ? 'date'
                          : key === 'postcode'
                            ? 'text'
                            : 'text'
                    }
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                    disabled={key === 'firstName' || key === 'lastName' || key === 'email'}
                    min={key === 'deliveryDate' ? getTodayDate() : undefined}  // Restrict date to today or later
                  />
                  {errors[key] && (
                    <div className="invalid-feedback">{errors[key]}</div>
                  )}
                </div>
              ))}
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Order Notes (Optional)"
              />
            </div>
            <div className="col-md-12 col-lg-6 col-xl-5">
              {/* Cart summary */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{ width: 50, height: 50 }}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="4">Subtotal</td>
                      <td>₹{subtotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="btn w-100 mt-3"
                style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
