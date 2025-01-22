import React from "react";

const Footer = () => {
  const shopInfoLinks = [
    "About Us",
    "Contact Us",
    "Privacy Policy",
    "Terms & Conditions",
    "Return Policy",
    "FAQs & Help",
  ];

  const accountLinks = [
    "My Account",
    "Shop Details",
    "Shopping Cart",
    "Order History",
  ];

  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-center border-b border-gray-600 pb-4 mb-6">
          <div className="w-full lg:w-1/4">
            <h1 className="text-green-400 text-2xl font-bold">Fruitables</h1>
            <p className="text-yellow-400 text-sm">Fresh products</p>
          </div>
          <div className="w-full lg:w-2/4 mt-4 lg:mt-0">
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full py-2 px-3 rounded-full text-gray-900 border border-gray-300 text-sm"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 py-2 px-5 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition text-sm"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/4 flex justify-end space-x-3 mt-4 lg:mt-0">
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <i className="fab fa-twitter text-white"></i>
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <i className="fab fa-facebook-f text-white"></i>
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <i className="fab fa-youtube text-white"></i>
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <i className="fab fa-linkedin-in text-white"></i>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Why People Like Us!</h4>
            <p className="text-sm mb-3">
              Typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with Aldus PageMaker.
            </p>
            <a
              href="#"
              className="text-green-400 hover:underline text-sm"
            >
              Read More
            </a>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Shop Info</h4>
            {shopInfoLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-400 hover:text-white mb-1 text-sm"
              >
                {link}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Account</h4>
            {accountLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="block text-gray-400 hover:text-white mb-1 text-sm"
              >
                {link}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-3">Contact</h4>
            <p className="text-sm">Address: Malad , Mumbai </p>
            <p className="text-sm">Email: abc@gmail.com</p>
            <p className="text-sm">Phone: +0123 4567 8910</p>
            <p className="mt-3 text-sm">Payment Accepted</p>
            <div className="flex space-x-2 mt-2">
            <div className="flex space-x-2 mt-2">
  <img
    src="/payment.png"
    alt="Visa"
    className="w-35  h-30  object-contain"
  />
</div>


</div>

          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>
            © <span className="text-green-400">Fruitables</span>, All rights
            reserved. Designed By{" "}
            <a
              href="#"
              className="text-green-400 hover:underline"
            >
             Bramheti
            </a>{" "}
            Distributed By{" "}
            <a
              href="#"
              className="text-green-400 hover:underline"
            >
              Bramheti
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
