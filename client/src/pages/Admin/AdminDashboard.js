import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import { Link } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdVerifiedUser,
  MdTrendingUp,
  MdShoppingCart,
  MdInventory,
  MdPeople
} from "react-icons/md";


const AdminDasboard = () => {
  const [auth] = useAuth();

  const stats = [
    {
      icon: <MdShoppingCart className="text-4xl" />,
      label: "Total Orders",
      value: "124",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <MdInventory className="text-4xl" />,
      label: "Products",
      value: "45",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: <MdPeople className="text-4xl" />,
      label: "Total Users",
      value: "3",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: <MdTrendingUp className="text-4xl" />,
      label: "Revenue",
      value: "$500",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <Layout title="Admin Dashboard - Clothes Shop">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Admin Profile Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <MdVerifiedUser className="text-5xl text-white" />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">Administrator</h2>
                      <p className="text-blue-100">System Admin Account</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <MdPerson className="text-2xl text-blue-600" />
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        Name
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {auth?.user?.name || "N/A"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <MdEmail className="text-2xl text-green-600" />
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        Email
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 truncate">
                      {auth?.user?.email || "N/A"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <MdPhone className="text-2xl text-purple-600" />
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        Contact
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {auth?.user?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`bg-gradient-to-r ${stat.color} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-white">{stat.icon}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdTrendingUp className="text-green-500" />
                        <span>+12% from last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <Link
                   to="/dashboard/admin/create-product"
                   className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold">
                    Add New Product
                  </Link>
                  <Link
                   to="/dashboard/admin/orders"
                   className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold">
                    View Orders
                  </Link>
                  <Link 
                  to="/dashboard/admin/users"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold">
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDasboard;
