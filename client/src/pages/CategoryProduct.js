import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold">Category</h1>

        <h4 className="text-center text-xl font-medium mt-2">
          Category - {category?.name}
        </h4>

        <h6 className="text-center text-gray-600 mt-1">
          {products?.length} result found
        </h6>

        {/* Grid layout replacing Bootstrap row/columns */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.target.src = "/path/to/fallback-image.jpg";
                }}
              />

              <div className="p-4">
                <h5 className="text-lg font-semibold">{p.name}</h5>

                <p className="text-gray-600 mt-1">
                  {p.description.length > 30
                    ? p.description.substring(0, 30) + "..."
                    : p.description}
                </p>

                <h6 className="text-blue-600 font-semibold mt-2">
                  $ {p.price}
                </h6>

                <div className="flex justify-between mt-4">
                  <button
                    className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
{/* 
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More (if needed in future)
        <div className="text-center mt-6">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Load More
          </button>
        </div>
        */}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
