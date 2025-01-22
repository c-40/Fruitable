import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const localStorageKey = `${userToken}_cart`;

  // Initialize cart from localStorage or an empty object
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem(localStorageKey)) || {}
  );

  useEffect(() => {
    // Update the cart when receiving updates from `Shop.js` via `location.state`
    if (location.state?.cart) {
      const incomingCart = location.state.cart;
      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        Object.keys(incomingCart).forEach((id) => {
          if (updatedCart[id]) {
            // Update existing item's quantity
            updatedCart[id].quantity += incomingCart[id].quantity;
          } else {
            // Add new item to cart
            updatedCart[id] = incomingCart[id];
          }
        });
        return updatedCart;
      });
    }
  }, [location.state]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (userToken) {
      localStorage.setItem(localStorageKey, JSON.stringify(cart));
      // Dispatch a `storage` event to notify other tabs/pages of the change
      window.dispatchEvent(new Event("storage"));
    }
  }, [cart, userToken, localStorageKey]);

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const { [productId]: _, ...updatedCart } = prevCart;
      return updatedCart;
    });
  };

  const handleSetQuantity = (productId, action) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      const currentItem = updatedCart[productId];

      if (currentItem) {
        // Adjust the quantity based on the action
        const newQuantity =
          action === "increase"
            ? currentItem.quantity + 1
            : currentItem.quantity - 1;

        if (newQuantity < 1) {
          // Remove item if quantity drops below 1
          delete updatedCart[productId];
        } else {
          updatedCart[productId] = {
            ...currentItem,
            quantity: newQuantity,
          };
        }
      }

      return updatedCart;
    });
  };

  const calculateTotals = () => {
    const subtotal = Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = 50;
console.log(shipping);


    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  };

  const totals = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-green-600 mb-6">Your Shopping Cart</h1>
      {Object.keys(cart).length > 0 ? (
        <>
          <table className="w-full border-collapse border border-green-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-green-300 px-4 py-2">Product</th>
                <th className="border border-green-300 px-4 py-2">Price</th>
                <th className="border border-green-300 px-4 py-2">Quantity</th>
                <th className="border border-green-300 px-4 py-2">Total</th>
                <th className="border border-green-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(cart).map((item) => (
                <tr key={item.id}>
                  <td className="border border-green-300 px-4 py-2 flex items-center space-x-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="border border-green-300 px-4 py-2">
                  ₹{item.price.toFixed(2)}
                  </td>
                  <td className="border border-green-300 px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSetQuantity(item.id, "increase")}
                        className="bg-green-600 text-white px-2 py-1 rounded-full"
                      >
                        +
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleSetQuantity(item.id, "decrease")}
                        className="bg-green-600 text-white px-2 py-1 rounded-full"
                      >
                        -
                      </button>
                    </div>
                  </td>
                  <td className="border border-green-300 px-4 py-2">
                  ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="border border-green-300 px-4 py-2">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-full"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end space-x-6">
            <div className="text-right">
              <p className="text-lg">
                <strong>Subtotal:</strong>₹ {totals.subtotal.toFixed(2)}
              </p>
              <p className="text-lg">
                <strong>Shipping:</strong> ₹{totals.shipping.toFixed(2)}
              </p>
              <p className="text-xl">
                <strong>Total:</strong> ₹{totals.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/checkout", { state: { cart } })}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 text-lg">Your cart is empty!</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300"
          >
            Back to Shop
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

