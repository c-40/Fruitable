// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     firstName: "",
//     lastName: "",
//     confirmPassword: "",
//   });
//   const [status, setStatus] = useState("");
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     });
//     setStatus("");
//   }, [isLogin]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     return passwordRegex.test(password);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("");
//     setIsLoading(true);

//     if (!formData.email || !formData.password) {
//       setStatus("Please fill in all required fields.");
//       setIsLoading(false);
//       return;
//     }

//     if (!validateEmail(formData.email)) {
//       setStatus("Please enter a valid email address.");
//       setIsLoading(false);
//       return;
//     }

//     if (!validatePassword(formData.password)) {
//       setStatus("Password must be at least 8 characters long, with at least one letter and one number.");
//       setIsLoading(false);
//       return;
//     }

//     if (!isLogin) {
//       if (!formData.firstName || !formData.lastName) {
//         setStatus("First and Last Name are required for Sign Up.");
//         setIsLoading(false);
//         return;
//       }
//       if (formData.password !== formData.confirmPassword) {
//         setStatus("Passwords do not match.");
//         setIsLoading(false);
//         return;
//       }
//     }

//     try {
//       const endpoint = isLogin ? "/login" : "/signup";
//       const response = await fetch(`http://localhost:5000${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           isLogin
//             ? { email: formData.email, password: formData.password }
//             : {
//                 firstname: formData.firstName,
//                 lastname: formData.lastName,
//                 email: formData.email,
//                 password: formData.password,
//               }
//         ),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         if (isLogin) {
//           const { token, user } = result;
//           localStorage.setItem("userToken", token);
//           localStorage.setItem("userData", JSON.stringify(user));
//           alert("Login successful! Redirecting...");
//           navigate("/shop");
//         } else {
//           alert("Sign-up successful! Please log in.");
//           setIsLogin(true); 
//           setFormData({
//             email: "",
//             password: "",
//             firstName: "",
//             lastName: "",
//             confirmPassword: "",
//           }); // Clear form fields
//         }
//       } else {
//         setStatus(result.error || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       setStatus("An error occurred. Please try again later.");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-semibold text-center mb-6">
//           {isLogin ? "Login" : "Sign Up"}
//         </h1>
//         {status && <p className="text-center text-red-500 mt-4">{status}</p>}
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <div className="mb-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 className="w-full p-3 border border-gray-300 rounded-md"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="w-full p-3 border border-gray-300 rounded-md mt-4"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           )}
//           <div className="mb-4">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="w-full p-3 border border-gray-300 rounded-md"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full p-3 border border-gray-300 rounded-md"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           {!isLogin && (
//             <div className="mb-4">
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 className="w-full p-3 border border-gray-300 rounded-md"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           )}
//           <button
//             type="submit"
//             className={`w-full py-3 bg-green-500 text-white font-semibold rounded-md ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? (isLogin ? "Logging In..." : "Signing Up...") : isLogin ? "Login" : "Sign Up"}
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <span>
//             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//             <button
//               type="button"
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-blue-500"
//             >
//               {isLogin ? "Sign Up" : "Login"}
//             </button>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility


  // Reset form on toggle between Login and Sign Up
  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setStatus("");
  }, [isLogin]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const performLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const { token, user } = result;
        localStorage.setItem("userToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
        alert("Login successful! Redirecting...");
        navigate("/shop");
      } else {
        setStatus(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred during login. Please try again later.");
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsLoading(true);

    // Validation checks
    if (!formData.email || !formData.password) {
      setStatus("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setStatus("Password must be at least 8 characters long, with at least one letter and one number.");
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        setStatus("First and Last Name are required for Sign Up.");
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setStatus("Passwords do not match.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: formData.email, password: formData.password }
            : {
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                password: formData.password,
              }
        ),
      });

      const result = await response.json();

      if (response.ok) {
        if (isLogin) {
          const { token, user } = result;
          localStorage.setItem("userToken", token);
          localStorage.setItem("userData", JSON.stringify(user));
          alert("Login successful! Redirecting...");
          navigate("/shop");
        } else {
          // Auto-login after sign-up
          await performLogin(formData.email, formData.password);
        }
      } else {
        setStatus(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        {status && <p className="text-center text-red-500 mt-4">{status}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md mt-4"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {/* <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button> */}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-3 bg-green-500 text-white font-semibold rounded-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (isLogin ? "Logging In..." : "Signing Up...") : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

