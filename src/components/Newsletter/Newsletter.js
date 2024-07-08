// src/Newsletter.js
import React from "react";

const Newsletter = () => {
  return (
    <div className="flex   justify-center items-center">
      <div className="bg-[#F1F9FF] rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
        <h2 className="lg:text-[32px] md:text-[30px] text-[25px] font-bold text-gray-800 mb-4">
          Join our newsletter
        </h2>
        <p className="text-[#095D7E] mb-10 text-[14px] ">
          Join over half a million vitamin lovers and get our latest deals,
          articles, and resources!
        </p>
        <div className="relative w-full max-w-[403px] flex items-center">
          <input
            type="email"
            placeholder="Enter your Email Address"
            className="w-full py-2 pl-3 pr-32 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="absolute right-0 bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-700 transform -translate-y-1/2"
            style={{ top: "50%" }}
          >
            Subscribe
          </button>
        </div>

      </div>
    </div>
  );
};

export default Newsletter;
