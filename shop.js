import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortOption, setSortOption] = useState("low-to-high"); // State for sorting option

  // Cart State and Syncing
  const userToken = localStorage.getItem('userToken');
  const localCartKey = `${userToken}_cart`;
  const [cart, setCart] = useState({});
  // const [showScrollButton, setShowScrollButton] = useState(false);
  
  //   useEffect(() => {
  //     const handleScroll = () => {
  //       if (window.scrollY > 300) {
  //         setShowScrollButton(true);
  //       } else {
  //         setShowScrollButton(false);
  //       }
  //     };
  
  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, []);
  
  //   const scrollToTop = () => {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   };
  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const insertResponse = await fetch("http://localhost:5000/items-fetch"); 
        if (!insertResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await insertResponse.json();

        const fetchedProducts = data.data.map(item => ({
          id: item.id,
          name: item.name,
          img: item.img, 
          price: item.price,
          category: item.category,
          description: item.description,
        }));
        setProducts(fetchedProducts); 
        setLoading(false);
      } catch (error) {
        setError('Error fetching items: ' + error.message);
        setLoading(false);
      }
    };

    fetchItems();

    const savedCart = JSON.parse(localStorage.getItem(localCartKey)) || {};
    setCart(savedCart);

    const syncCart = () => {
      const updatedCart = JSON.parse(localStorage.getItem(localCartKey)) || {};
      setCart(updatedCart);
    };

    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, [localCartKey]);

  const handleAddToCart = (product) => {
    if (!userToken) {
      navigate('/login');
    } else {
      const updatedCart = { ...cart };
      if (updatedCart[product.id]) {
        updatedCart[product.id].quantity += 1;
      } else {
        updatedCart[product.id] = { ...product, quantity: 1 };
      }
      setCart(updatedCart);
      localStorage.setItem(localCartKey, JSON.stringify(updatedCart));
    }
  };

  const handleSetQuantity = (product, quantity) => {
    const updatedCart = { ...cart };
    if (quantity < 1) {
      delete updatedCart[product.id];
    } else {
      updatedCart[product.id].quantity = quantity;
    }
    setCart(updatedCart);
    localStorage.setItem(localCartKey, JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (product) => {
    const updatedCart = { ...cart };
    delete updatedCart[product.id];
    setCart(updatedCart);
    localStorage.setItem(localCartKey, JSON.stringify(updatedCart));
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products by price
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "low-to-high") {
      return a.price - b.price;
    } else if (sortOption === "high-to-low") {
      return b.price - a.price;
    }
    return 0;
  });
//   return (
//     <div
//       className="h-screen overflow-y-auto bg-gray-50 text-gray-800 container mx-auto px-4 py-6"
//       style={{
//         backgroundImage: 'url(/path-to-background-image.jpg)', // Optional background image for a fresh feel
//         backgroundSize: 'cover',
//         backgroundAttachment: 'fixed',
//       }}
//     >
//      {Object.keys(cart).length > 0 && (
//   <div className="fixed top-4 right-10 z-10">
//     <button
//       onClick={() => navigate('/cart')}
//       className="bg-white text-green-600 p-3 rounded-full hover:bg-gray-100 shadow-md transition duration-300 relative flex items-center justify-center"
//     >
//       {/* Cart Icon */}
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//         strokeWidth={2}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M3 3h2l.4 2M7 13h10l1-5H6.4M7 13l-4-8M7 13L5 21M16 16a2 2 0 104 0m-4 0H8m8 0a2 2 0 11-4 0"
//         />
//       </svg>

//       {/* Badge for Number of Unique Items */}
//       <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//         {Object.keys(cart).length}
//       </span>
//     </button>
//   </div>
// )}




  
//       <h1 className="mb-8 text-green-600 text-center text-3xl font-bold tracking-wider">
//         Fresh Fruits Shop
//       </h1>
  
//       {loading ? (
//         <div className="text-center text-green-600 text-xl font-semibold">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
//             >
//               <div className="relative">
//                 <img
//                   src={product.img}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                   alt={product.name}
//                 />
//               </div>
//               <div className="p-6 border-t-2 border-green-100">
//                 <h4 className="text-green-600 text-xl font-bold">{product.name}</h4>
//                 <p className="text-gray-600 text-sm mt-2">{product.description}</p>
//                 <div className="flex justify-between items-center mt-4">
//                   <p className="text-green-600 text-lg font-bold">${product.price.toFixed(2)}</p>
//                   <div>
//                     {!cart[product.id] ? (
//                       <button
//                         onClick={() => handleAddToCart(product)}
//                         className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md transition duration-300"
//                       >
//                         Add to Cart
//                       </button>
//                     ) : (
//                       <div className="flex flex-col items-center space-y-2">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() =>
//                               handleSetQuantity(product, cart[product.id].quantity - 1)
//                             }
//                             className="bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700 shadow"
//                             disabled={cart[product.id].quantity <= 1}
//                           >
//                             -
//                           </button>
//                           <span className="text-sm text-gray-700 font-semibold">
//                             {cart[product.id].quantity}
//                           </span>
//                           <button
//                             onClick={() =>
//                               handleSetQuantity(product, cart[product.id].quantity + 1)
//                             }
//                             className="bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700 shadow"
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveFromCart(product)}
//                           className="bg-red-600 text-white px-3 py-1 text-sm rounded-full hover:bg-red-700 shadow transition duration-300"
//                         >
//                           Remove from Cart
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
return (
  <div className="h-screen overflow-y-auto bg-gray-50 text-gray-800 container mx-auto px-4 py-6">
    {Object.keys(cart).length > 0 && (
      <div className="fixed top-4 right-10 z-10">
        <button
          onClick={() => navigate('/cart')}
          className="bg-white text-green-600 p-3 rounded-full hover:bg-gray-100 shadow-md transition duration-300 relative flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l1-5H6.4M7 13l-4-8M7 13L5 21M16 16a2 2 0 104 0m-4 0H8m8 0a2 2 0 11-4 0" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {Object.keys(cart).length}
          </span>
        </button>
      </div>
    )}

    <h1 className="mb-8 text-green-600 text-center text-3xl font-bold tracking-wider">Fresh Fruits Shop</h1>

    {/* Search Bar and Sort by Price Dropdown */}
<div className="mb-6 flex justify-start items-center space-x-4">
  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search for products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="px-4 py-2 border border-green-600 rounded-full"
  />

  {/* Sort by Price Dropdown */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="px-4 py-2 border border-green-600 rounded-full"
  >
    <option value="low-to-high">Price: Low to High</option>
    <option value="high-to-low">Price: High to Low</option>
  </select>
</div>

    {loading ? (
      <div className="text-center text-green-600 text-xl font-semibold">Loading...</div>
    ) : error ? (
      <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img src={product.img} className="w-full h-48 object-cover rounded-t-lg" alt={product.name} />
            </div>
            <div className="p-6 border-t-2 border-green-100">
              <h4 className="text-green-600 text-xl font-bold">{product.name}</h4>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-green-600 text-lg font-bold">₹{product.price.toFixed(2)}</p>
                <div>
                  {!cart[product.id] ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md transition duration-300"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleSetQuantity(product, cart[product.id].quantity - 1)
                          }
                          className="bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700 shadow"
                          disabled={cart[product.id].quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-sm text-gray-700 font-semibold">
                          {cart[product.id].quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleSetQuantity(product, cart[product.id].quantity + 1)
                          }
                          className="bg-green-600 text-white px-2 py-1 rounded-full hover:bg-green-700 shadow"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded-full hover:bg-red-700 shadow transition duration-300"
                      >
                        Remove from Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  
);
  
};

export default Shop;
