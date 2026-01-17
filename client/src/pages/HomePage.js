import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  // Get products with pagination
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setLoading(false);
      setProducts(page === 1 ? data.products : [...products, ...data.products]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  // Filter products
  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setLoading(false);
      setProducts(data?.products || []);
    } catch (error) {
      setLoading(false);
      console.error("Error filtering products:", error);
      toast.error("Failed to filter products");
    }
  };

  // Handle category filter
  const handleFilter = (value, id) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  // Reset filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    setProducts([]); // Clear products temporarily
    getAllProducts(); // Fetch all products again
  };

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Initial load
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  // Load products when page changes
  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [page]);

  // Apply filters
  useEffect(() => {
    if (checked.length || radio.length) {
      setPage(1);
      filterProduct();
    }
  }, [checked, radio]);

  return (
    <Layout title="All Products - Best Offer">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h4 className="text-2xl font-bold text-primary mb-4">Filters</h4>
              
              {/* Categories Filter */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-700 mb-3">Categories</h5>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                      checked={checked.includes(c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-gray-700 mb-3">Price Range</h5>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  value={radio}
                  className="flex flex-col gap-2"
                >
                  {Prices?.map((p) => (
                    <Radio key={p._id} value={p.array}>
                      {p.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>

              {/* Reset Button */}
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <section className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">All Products</h2>
            
            {loading && page === 1 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <Card key={p._id} className="hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader color="blue-gray" className="relative h-56">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "/images/fallback.jpg";
                          }}
                        />
                      </CardHeader>
                      <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                          {p.name}
                        </Typography>
                        <Typography className="text-gray-600 mb-2">
                          {p.description.length > 50
                            ? `${p.description.substring(0, 50)}...`
                            : p.description}
                        </Typography>
                        <Typography className="text-2xl font-bold text-green-600">
                          ${p.price.toFixed(2)}
                        </Typography>
                      </CardBody>
                      <CardFooter className="pt-0 flex gap-2">
                        <Button
                          size="sm"
                          variant="outlined"
                          className="flex-1"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-primary"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                            toast.success("Item Added to Cart");
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {products.length < total && (
                  <div className="flex justify-center mt-8">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => prev + 1);
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                          Loading...
                        </span>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
