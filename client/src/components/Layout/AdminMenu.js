import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdCategory,
  MdAddBox,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdDashboard
} from "react-icons/md";

const AdminMenu = () => {
  const menuItems = [
    {
      to: "/dashboard/admin",
      icon: <MdDashboard className="text-xl" />,
      label: "Dashboard",
      exact: true
    },
    {
      to: "/dashboard/admin/create-category",
      icon: <MdCategory className="text-xl" />,
      label: "Create Category"
    },
    {
      to: "/dashboard/admin/create-product",
      icon: <MdAddBox className="text-xl" />,
      label: "Create Product"
    },
    {
      to: "/dashboard/admin/products",
      icon: <MdInventory className="text-xl" />,
      label: "Products"
    },
    {
      to: "/dashboard/admin/orders",
      icon: <MdShoppingCart className="text-xl" />,
      label: "Orders"
    },
    {
      to: "/dashboard/admin/users",
      icon: <MdPeople className="text-xl" />,
      label: "Users"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <MdDashboard className="text-3xl" />
          Admin Panel
        </h2>
        <p className="text-blue-100 text-sm mt-1">Manage your store</p>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:pl-6"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Stats */}
      <div className="bg-gray-50 p-4 mt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Quick Access
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {menuItems.length - 1} Management Tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
