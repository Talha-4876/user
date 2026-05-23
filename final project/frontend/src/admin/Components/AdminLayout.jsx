import React from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children, handleLogout }) => {
  return (
    <div className="flex bg-[#0b0b0d]">

      {/* Sidebar (fixed) */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="ml-60 w-full min-h-screen overflow-y-auto">
        {children}
      </div>

    </div>
  );
};

export default AdminLayout;