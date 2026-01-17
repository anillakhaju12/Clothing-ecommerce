import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdSort,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdInventory,
  MdAttachMoney,
  MdCategory,
  MdShoppingCart,
} from "react-icons/md";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setProducts(data.products);
      setFilteredProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (product) => product.category._id === selectedCategory
      );
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.quantity - b.quantity);
        break;
      case "stock-desc":
        result.sort((a, b) => b.quantity - a.quantity);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${productToDelete._id}`
      );
      if (data.success) {
        toast.success("Product deleted successfully");
        setShowDeleteModal(false);
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
    }
  };

  // Lifecycle
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Stock badge
  const getStockBadge = (quantity) => {
    if (quantity === 0)
      return (
        <span className="px-2 py-1 rounded text-white bg-red-600 text-sm">
          Out of Stock
        </span>
      );
    if (quantity < 10)
      return (
        <span className="px-2 py-1 rounded text-black bg-yellow-400 text-sm">
          Low Stock ({quantity})
        </span>
      );
    return (
      <span className="px-2 py-1 rounded text-white bg-green-600 text-sm">
        In Stock ({quantity})
      </span>
    );
  };

  return (
    <Layout title="Dashboard - All Products">
      <div className="flex flex-wrap gap-4 p-4">
        {/* Admin Menu */}
        <div className="w-full md:w-1/4">
          <AdminMenu />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 space-y-6 ml-3">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MdInventory size={28} /> All Products
            </h1>
            <Link
              to="/dashboard/admin/create-product"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <i className="fas fa-plus"></i> Add Product
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white rounded-lg p-4 text-center shadow">
              <MdShoppingCart size={32} className="mx-auto mb-2" />
              <h5>Total Products</h5>
              <h3 className="text-xl font-bold">{products.length}</h3>
            </div>
            <div className="bg-green-600 text-white rounded-lg p-4 text-center shadow">
              <MdInventory size={32} className="mx-auto mb-2" />
              <h5>In Stock</h5>
              <h3 className="text-xl font-bold">
                {products.filter((p) => p.quantity > 0).length}
              </h3>
            </div>
            <div className="bg-yellow-400 text-black rounded-lg p-4 text-center shadow">
              <MdCategory size={32} className="mx-auto mb-2" />
              <h5>Categories</h5>
              <h3 className="text-xl font-bold">{categories.length}</h3>
            </div>
            <div className="bg-blue-400 text-white rounded-lg p-4 text-center shadow">
              <MdFilterList size={32} className="mx-auto mb-2" />
              <h5>Filtered</h5>
              <h3 className="text-xl font-bold">{filteredProducts.length}</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded shadow p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">
                  <MdSearch /> Search Products
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className=" font-semibold mb-1 flex items-center gap-1">
                  <MdFilterList /> Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Categories</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className=" font-semibold mb-1 flex items-center gap-1">
                  <MdSort /> Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="stock-asc">Stock (Low to High)</option>
                  <option value="stock-desc">Stock (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory || sortBy !== "newest") && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSortBy("newest");
                  }}
                  className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <MdInventory size={64} className="text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-400">No products found</h4>
              <p className="text-gray-400">
                {searchTerm || selectedCategory
                  ? "Try adjusting your filters"
                  : "Start by adding your first product"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/250")
                      }
                    />
                    <div className="absolute top-2 right-2">{getStockBadge(product.quantity)}</div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="inline-block bg-gray-300 text-gray-800 px-2 py-1 rounded mb-2 text-sm">
                      {product.category?.name}
                    </span>
                    <h5 className="font-semibold text-lg truncate" title={product.name}>
                      {product.name}
                    </h5>
                    <p className="text-gray-500 text-sm flex-grow">
                      {product.description.substring(0, 80)}
                      {product.description.length > 80 ? "..." : ""}
                    </p>
                    <div className="flex justify-between items-center mt-3 mb-2">
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <MdAttachMoney /> {formatPrice(product.price)}
                      </span>
                      <span className="text-gray-500 text-sm">Stock: {product.quantity}</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Link
                        to={`/dashboard/admin/product/${product.slug}`}
                        className="flex-1 px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white text-center text-sm"
                      >
                        <MdEdit className="inline mr-1" /> Edit
                      </Link>
                      <Link
                        to={`/product/${product.slug}`}
                        target="_blank"
                        className="flex-1 px-3 py-1 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white text-center text-sm"
                      >
                        <MdVisibility className="inline mr-1" /> View
                      </Link>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white text-center text-sm"
                      >
                        <MdDelete className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center bg-red-600 text-white px-4 py-2 rounded-t-lg">
              <h5>Confirm Delete</h5>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <div className="p-4 text-center space-y-2">
              <MdDelete size={48} className="text-red-600 mx-auto" />
              <p>
                Are you sure you want to delete{" "}
                <strong>{productToDelete.name}</strong>?
              </p>
              <p className="text-gray-500 text-sm">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Products;
