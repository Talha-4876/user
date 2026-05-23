import React from "react";

const Loader = ({ text = "Loading...", size = 60 }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* Spinner */}
      <div
        className="border-8 border-t-orange-500 border-gray-200 rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>

      {/* Optional text */}
      <p className="mt-4 text-lg font-semibold text-gray-700">{text}</p>
    </div>
  );
};

export default Loader;
