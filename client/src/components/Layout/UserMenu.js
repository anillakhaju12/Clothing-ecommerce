import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  const activeClass = "bg-blue-500 text-white rounded px-4 py-2";
  const normalClass = "px-4 py-2 rounded hover:bg-blue-100";

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-semibold mb-2">Dashboard</h4>
      <NavLink
        to="/dashboard/user/profile"
        className={({ isActive }) => (isActive ? activeClass : normalClass)}
      >
        Profile
      </NavLink>
      <NavLink
        to="/dashboard/user/orders"
        className={({ isActive }) => (isActive ? activeClass : normalClass)}
      >
        Orders
      </NavLink>
    </div>
  );
};

export default UserMenu;
