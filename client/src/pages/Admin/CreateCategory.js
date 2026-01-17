import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import {
  MdEdit,
  MdDelete,
  MdCategory,
  MdAdd,
  MdClose,
} from "react-icons/md";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Handle create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/category/create-category`,
        { name }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updatedName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while updating Category");
    }
  };

  // Delete category
  const handleDelete = async (pId, categoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${categoryName}" category?`
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`${categoryName} is deleted`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting Category");
    }
  };

  return (
    <Layout title="Dashboard - Manage Categories">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          {/* <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <MdCategory className="text-blue-600" />
              Manage Categories
            </h1>
            <p className="text-gray-600">
              Create, update, and manage product categories
            </p>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Category Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MdAdd className="text-3xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Create New Category
                    </h2>
                    <p className="text-sm text-gray-600">
                      Add a new category to organize your products
                    </p>
                  </div>
                </div>
                <CategoryForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
              </div>

              {/* Categories List Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MdCategory className="text-3xl" />
                    All Categories ({categories.length})
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Manage existing categories
                  </p>
                </div>

                <div className="overflow-x-auto">
                  {categories.length === 0 ? (
                    <div className="text-center py-12">
                      <MdCategory className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No categories found
                      </p>
                      <p className="text-gray-400 text-sm">
                        Create your first category above
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
                            Category Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Slug
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {categories?.map((c, index) => (
                          <tr
                            key={c._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <MdCategory className="text-blue-600 text-xl" />
                                </div>
                                <span className="text-gray-800 font-semibold">
                                  {c.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {c.slug}
                              </code>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    setVisible(true);
                                    setUpdatedName(c.name);
                                    setSelected(c);
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                >
                                  <MdEdit className="text-lg" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(c._id, c.name)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                                >
                                  <MdDelete className="text-lg" />
                                  Delete
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
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <MdEdit className="text-blue-600 text-2xl" />
            Update Category
          </div>
        }
        open={visible}
        onCancel={() => {
          setVisible(false);
          setUpdatedName("");
          setSelected(null);
        }}
        footer={null}
        closeIcon={<MdClose className="text-2xl" />}
      >
        <div className="py-4">
          <CategoryForm
            value={updatedName}
            setValue={setUpdatedName}
            handleSubmit={handleUpdate}
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateCategory;
