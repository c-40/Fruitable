import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import  { useState, useEffect } from "react";


const Home = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle scroll event to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/lowest-items");
        if (!response.ok) throw new Error("Network response was not ok");
  
        const data = await response.json(); // The array is directly the response
        console.log("Fetched Data:", data); // Debugging line
  
        const fetchedProducts = data.map(item => ({
          id: item.id,
          name: item.name,
          img: item.img,
          price: item.price,
          description: item.description,
        }));
        console.log("Mapped Products:", fetchedProducts); // Debugging line
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(err); // Debugging line
        setError("Error fetching items: " + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {/* Hero Section */}
      <div
        className="container-fluid py-5 mb-5 hero-header"
        style={{
          backgroundImage: `url('/img/hero-img.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      >
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-7">
              <h4 className="mb-3 text-success">100% Organically Grown</h4>
              <h1
                className="mb-5 display-3 text-success"
                style={{ transition: "transform 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Fruits Straight From Farm
              </h1>
              <h4 className="mb-3 text-success">Healthy and Nutritious</h4>
            </div>
            <div className="col-md-12 col-lg-5">
              <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img
                      src="/img/hero-img-1.png"
                      className="img-fluid w-100 h-100 bg-secondary rounded"
                      alt="First slide"
                      style={{ transition: "transform 0.5s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src="/img/hero-img-2.jpg"
                      className="img-fluid w-100 h-100 rounded"
                      alt="Second slide"
                      style={{ transition: "transform 0.5s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Features Section */}
     {/* Features Section */}
<div className="container-fluid features py-0" style={{ marginTop: '-180px' }}>
  <div className="container py-5">
    <div className="row g-4">
      {[{ icon: "fas fa-car-side", title: "Free Shipping", description: "Free on orders over $300" },
        { icon: "fas fa-user-shield", title: "Secure Payment", description: "100% secure payment" },
        { icon: "fas fa-exchange-alt", title: "30-Day Return", description: "30-day money-back guarantee" },
        { icon: "fas fa-phone-alt", title: "24/7 Support", description: "Support anytime, fast response" }]
        .map((feature, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div
              className="features-item text-center rounded p-4 position-relative"
              style={{
                backgroundColor: "#006400",
                color: "white",
                transition: "transform 0.3s, background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#228B22";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#006400";
              }}
            >
              <div
                className="features-icon btn-circle rounded-circle text-white mb-4 mx-auto"
                style={{
                  backgroundColor: "#32CD32",
                  width: "120px",
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                  transition: "box-shadow 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.2)")
                }
              >
                <i className={`${feature.icon} fa-4x`}></i>
              </div>
              <div className="features-content text-center">
                <h5>{feature.title}</h5>
                <p className="mb-0">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>

  
      {/* Product Grid Section */}
      {loading ? (
        <div className="text-center text-green-600 text-xl font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4" style={{ marginTop: '50px' }}>
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mx-2">
              <div className="relative">
                <img
                  src={product.img}
                  className="w-full h-48 object-cover rounded-t-lg"
                  alt={product.name}
                  onError={(e) => (e.target.src = "/img/default-image.jpg")}
                />
              </div>
              <div className="p-6 border-t-2 border-green-100">
                <h4 className="text-green-600 text-xl font-bold">{product.name}</h4>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-green-600 text-lg font-bold">₹{product.price.toFixed(2)}</p>
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => window.location.href = '/shop'}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 shadow-md transition duration-300"
                  >
                    Go to Shop
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {/* Banner Section */}
      <div
  className="container-fluid banner my-5"
  style={{
    backgroundColor: "orange",
    backgroundImage: "linear-gradient(to right,rgb(90, 126, 62),rgb(35, 81, 33))", // Gradient background
    borderRadius: "10px", // Smooth rounded corners
  }}
>
  <div className="container py-5">
    <div className="row g-4 align-items-center">
      <div className="col-lg-6">
        <h1
          className="display-3 text-white"
          style={{
            transition: "color 0.3s, transform 0.3s",
            fontWeight: "bold", // Bold font for emphasis
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", // Shadow for the text
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "yellow";
            e.currentTarget.style.transform = "translateY(-10px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Fresh Exotic Fruits
        </h1>
        <p
          className="fw-normal display-3 text-green mb-4"
          style={{
            transition: "transform 0.3s, color 0.3s",
            fontStyle: "italic", // Italic style for text emphasis
            fontSize: "1.5rem", // Larger text size for emphasis
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(10px)";
            e.currentTarget.style.color = "#32CD32"; // Green color on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
            e.currentTarget.style.color = "green"; // Original color
          }}
        >
          In Our Store
        </p>
      </div>
      <div className="col-lg-6">
        <img
          src="/img/baner-1.png"
          className="img-fluid w-100 rounded shadow-lg"
          alt="Banner"
          style={{
            transition: "transform 0.3s, box-shadow 0.3s",
            borderRadius: "15px", // More rounded corners for the image
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Soft shadow effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
          }}
        />
      </div>
    </div>
  </div>
</div>

    </>
  );
  
// return (
//   <>
    
//     <div
//       className="container-fluid py-5 mb-5 hero-header"
//       style={{
//         backgroundImage: `url('/img/hero-img.jpg')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         height: "100vh",
//       }}
//     >
//       <div className="container py-5">
//         <div className="row g-5 align-items-center">
//           <div className="col-md-12 col-lg-7">
//             <h4 className="mb-3 text-success">100% Organically Grown</h4>
//             <h1
//               className="mb-5 display-3 text-success"
//               style={{ transition: "transform 0.3s" }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             >
//               Fruits Straight From Farm
//             </h1>
//             <h4 className="mb-3 text-success">Healthy and Nutritious</h4>
//           </div>
//           <div className="col-md-12 col-lg-5">
//             <div
//               id="carouselId"
//               className="carousel slide position-relative"
//               data-bs-ride="carousel"
//             >
//               <div className="carousel-inner" role="listbox">
//                 <div className="carousel-item active rounded">
//                   <img
//                     src="/img/hero-img-1.png"
//                     className="img-fluid w-100 h-100 bg-secondary rounded"
//                     alt="First slide"
//                     style={{
//                       transition: "transform 0.5s",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//                     onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                   />
//                 </div>
//                 <div className="carousel-item rounded">
//                   <img
//                     src="/img/hero-img-2.jpg"
//                     className="img-fluid w-100 h-100 rounded"
//                     alt="Second slide"
//                     style={{
//                       transition: "transform 0.5s",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//                     onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                   />
//                   {/* <a
//                     href="#"
//                     className="btn px-4 py-2 text-white rounded"
//                     style={{
//                       backgroundColor: "#32CD32",
//                       transition: "background-color 0.3s, transform 0.3s",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = "#228B22";
//                       e.currentTarget.style.t
//                   >
//                   </a> */}
//                 </div>
//               </div>
//               <button
//                 className="carousel-control-prev"
//                 type="button"
//                 data-bs-target="#carouselId"
//                 data-bs-slide="prev"
//               >
//                 <span
//                   className="carousel-control-prev-icon"
//                   aria-hidden="true"
//                 ></span>
//                 <span className="visually-hidden">Previous</span>
//               </button>
//               <button
//                 className="carousel-control-next"
//                 type="button"
//                 data-bs-target="#carouselId"
//                 data-bs-slide="next"
//               >
//                 <span
//                   className="carousel-control-next-icon"
//                   aria-hidden="true"
//                 ></span>
//                 <span className="visually-hidden">Next</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container-fluid features py-0 ">
//       <div className="container py-5">
//         <div className="row g-4">
//           {[
//             {
//               icon: "fas fa-car-side",
//               title: "Free Shipping",
//               description: "Free on orders over $300",
//             },
//             {
//               icon: "fas fa-user-shield",
//               title: "Secure Payment",
//               description: "100% secure payment",
//             },
//             {
//               icon: "fas fa-exchange-alt",
//               title: "30-Day Return",
//               description: "30-day money-back guarantee",
//             },
//             {
//               icon: "fas fa-phone-alt",
//               title: "24/7 Support",
//               description: "Support anytime, fast response",
//             },
//           ].map((feature, index) => (
//             <div key={index} className="col-md-6 col-lg-3">
//               <div
//                 className="features-item text-center rounded p-4 position-relative"
//                 style={{
//                   backgroundColor: "#006400",
//                   color: "white",
//                   transition: "transform 0.3s, background-color 0.3s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "scale(1.05)";
//                   e.currentTarget.style.backgroundColor = "#228B22";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "scale(1)";
//                   e.currentTarget.style.backgroundColor = "#006400";
//                 }}
//               >
//                 <div
//                   className="features-icon btn-circle rounded-circle text-white mb-4 mx-auto"
//                   style={{
//                     backgroundColor: "#32CD32",
//                     width: "120px",
//                     height: "120px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
//                     transition: "box-shadow 0.3s, transform 0.3s",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.boxShadow =
//                       "0px 8px 16px rgba(0, 0, 0, 0.3)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.boxShadow =
//                       "0px 6px 12px rgba(0, 0, 0, 0.2)")
//                   }
//                 >
//                   <i className={`${feature.icon} fa-4x`}></i>
//                 </div>
//                 <div className="features-content text-center">
//                   <h5>{feature.title}</h5>
//                   <p className="mb-0">{feature.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//     </div>

    
//     {loading ? (
//   <div className="text-center text-green-600 text-xl font-semibold">Loading...</div>
// ) : error ? (
//   <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
// ) : (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
//     {products.map((product) => (
//       <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mx-2">
//         <div className="relative">
//           <img
//             src={product.img}
//             className="w-full h-48 object-cover rounded-t-lg"
//             alt={product.name}
//             onError={(e) => (e.target.src = "/img/default-image.jpg")}
//           />
//         </div>
//         <div className="p-6 border-t-2 border-green-100">
//           <h4 className="text-green-600 text-xl font-bold">{product.name}</h4>
//           <p className="text-gray-600 text-sm mt-2">{product.description}</p>
//           <div className="flex justify-between items-center mt-4">
//             <p className="text-green-600 text-lg font-bold">₹{product.price.toFixed(2)}</p>
//           </div>
//           <div className="mt-4 text-center">
//             <button
//               onClick={() => window.location.href = '/shop'}
//               className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 shadow-md transition duration-300"
//             >
//               Go to Shop
//             </button>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// )}


//     {/* Banner Section */}
//     <div
//       className="container-fluid banner my-5"
//       style={{ backgroundColor: "orange" }}
//     >
//       <div className="container py-5">
//         <div className="row g-4 align-items-center">
//           <div className="col-lg-6">
//             <h1
//               className="display-3 text-white"
//               style={{ transition: "color 0.3s" }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "yellow")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
//             >
//               Fresh Exotic Fruits
//             </h1>
//             <p
//               className="fw-normal display-3 text-green mb-4"
//               style={{ transition: "transform 0.3s" }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(10px)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
//             >
//               in Our Store
//             </p>
//           </div>
//           <div className="col-lg-6">
//             <img
//               src="/img/baner-1.png"
//               className="img-fluid w-100 rounded"
//               alt="Banner"
//               style={{ transition: "transform 0.3s" }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );

};

export default Home;
