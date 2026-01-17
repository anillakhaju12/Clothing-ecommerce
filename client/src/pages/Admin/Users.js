import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import { Modal } from "antd";
import {
  MdPerson,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdPersonAdd,
  MdClose,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAdminPanelSettings,
  MdSearch,
} from "react-icons/md";

const Users = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Edit form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: 0,
  });

  // Fetch all users
  const getAllUsers = async () => {
    try {
      setLoading(true);

      if (!auth?.token) {
        toast.error("Please login to view users");
        return;
      }

      if (auth?.user?.role !== 1) {
        toast.error("Admin access required to view users");
        return;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/all-users`
      );

      if (data?.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
        toast.success(`Loaded ${data.users.length} users successfully`);
      } else {
        toast.error(data?.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Unauthorized: Please login as admin");
        } else if (error.response.status === 403) {
          toast.error("Forbidden: Admin access required");
        } else {
          toast.error(`Error: ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Fetch users on component mount
  useEffect(() => {
    if (auth?.token) {
      getAllUsers();
    }
  }, [auth?.token]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get role badge
  const getRoleBadge = (role) => {
    if (role === 1) {
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
          <MdAdminPanelSettings className="text-sm" />
          Admin
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
        <MdPerson className="text-sm" />
        User
      </span>
    );
  };

  // Handle View User
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Handle Edit User - Open Modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
      role: user.role,
    });
    setShowEditModal(true);
  };

  // Handle Update User - Submit
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/update-user/${selectedUser._id}`,
        editForm
      );

      if (data?.success) {
        toast.success(data.message);
        setShowEditModal(false);
        getAllUsers();
      } else {
        toast.error(data?.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${userName}"?`
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/delete-user/${userId}`
      );

      if (data?.success) {
        toast.success(data.message);
        getAllUsers();
      } else {
        toast.error(data?.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          {/* <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <MdPerson className="text-blue-600" />
              Manage Users
            </h1>
            <p className="text-gray-600">
              View and manage all registered users
            </p>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-semibold">Total Users</p>
                      <h3 className="text-3xl font-bold mt-1">{users.length}</h3>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                      <MdPerson className="text-4xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-semibold">Regular Users</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {users.filter(user => user.role === 0).length}
                      </h3>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                      <MdPerson className="text-4xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-semibold">Admins</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {users.filter(user => user.role === 1).length}
                      </h3>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                      <MdAdminPanelSettings className="text-4xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MdSearch className="text-3xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Search Users</h2>
                    <p className="text-sm text-gray-600">Find users by name, email, or phone</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <MdClose className="text-xl" />
                    </button>
                  )}
                </div>
              </div>

              {/* Users List Card */}
              {loading ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <MdPerson className="text-3xl" />
                      All Users ({filteredUsers.length})
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Manage user accounts and permissions
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-12">
                        <MdPerson className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                          {searchTerm ? "No users found matching your search" : "No users found"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm ? "Try a different search term" : "Users will appear here"}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Joined Date
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredUsers.map((user, index) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 p-2 rounded-lg">
                                    <MdPerson className="text-blue-600 text-xl" />
                                  </div>
                                  <span className="text-gray-800 font-semibold">
                                    {user.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MdEmail className="text-gray-400" />
                                  <a href={`mailto:${user.email}`} className="hover:text-blue-600 transition-colors">
                                    {user.email}
                                  </a>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MdPhone className="text-gray-400" />
                                  {user.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {getRoleBadge(user.role)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleViewUser(user)}
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                    title="View Details"
                                  >
                                    <MdVisibility className="text-lg" />
                                  </button>
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                    title="Edit User"
                                  >
                                    <MdEdit className="text-lg" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                    disabled={user._id === auth?.user?._id}
                                    className={`p-2 rounded-lg transition-colors shadow-md hover:shadow-lg ${
                                      user._id === auth?.user?._id
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}
                                    title={user._id === auth?.user?._id ? "Cannot delete yourself" : "Delete User"}
                                  >
                                    <MdDelete className="text-lg" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <MdVisibility className="text-green-600 text-2xl" />
            User Details
          </div>
        }
        open={showViewModal}
        onCancel={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        footer={null}
        closeIcon={<MdClose className="text-2xl" />}
        width={600}
      >
        {selectedUser && (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                <MdPerson className="text-5xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">
                {selectedUser.name}
              </h3>
              <div className="flex justify-center mt-2">
                {getRoleBadge(selectedUser.role)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MdEmail className="text-xl" />
                  <label className="font-semibold">Email</label>
                </div>
                <p className="text-gray-800 ml-7">
                  <a href={`mailto:${selectedUser.email}`} className="hover:text-blue-600 transition-colors">
                    {selectedUser.email}
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MdPhone className="text-xl" />
                  <label className="font-semibold">Phone</label>
                </div>
                <p className="text-gray-800 ml-7">{selectedUser.phone}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MdLocationOn className="text-xl" />
                  <label className="font-semibold">Address</label>
                </div>
                <p className="text-gray-800 ml-7">
                  {selectedUser.address || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MdPersonAdd className="text-xl" />
                  <label className="font-semibold">Joined</label>
                </div>
                <p className="text-gray-800 ml-7">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <MdEdit className="text-blue-600 text-2xl" />
            Update User
          </div>
        }
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setEditForm({
            name: "",
            email: "",
            phone: "",
            address: "",
            role: 0,
          });
          setSelectedUser(null);
        }}
        footer={null}
        closeIcon={<MdClose className="text-2xl" />}
        width={600}
      >
        <div className="py-4">
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                rows="3"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role *
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: parseInt(e.target.value) })}
                required
              >
                <option value={0}>User</option>
                <option value={1}>Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditForm({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    role: 0,
                  });
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Layout>
  );
};

export default Users;
