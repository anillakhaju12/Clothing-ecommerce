import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/cart";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import ReactImageMagnify from "react-image-magnify";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (p) => {
    setCart([...cart, p]);
    localStorage.setItem("cart", JSON.stringify([...cart, p]));
    toast.success("Product Added to Cart");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Product Image with Magnify */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: product.name,
                    isFluidWidth: true,
                    src: `${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`,
                  },
                  largeImage: {
                    src: `${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${product._id}`,
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImagePosition: "over",
                  isHintEnabled: true,
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
              {product.name}
            </h1>

            <div className="space-y-3">
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Category:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {product.category?.name}
                </span>
              </div>

              <div className="py-4">
                <p className="text-red-500 font-bold text-4xl">
                  ${product.price}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-12" />

        {/* Similar Products Section */}
        <div className="mt-8">
          <h3 className="text-center text-4xl font-bold text-gray-800 mb-8">
            You May Also Like
          </h3>

          {relatedProducts.length < 1 ? (
            <p className="text-center text-gray-500">No Similar Products found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <Card
                  key={item._id}
                  className="relative w-full cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <CardHeader color="blue-gray" className="relative h-56">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${item._id}`}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                    <p className="absolute top-2 right-3 rounded-full text-white bg-red-500 px-3 py-1 text-sm">
                      {item.category?.name}
                    </p>
                  </CardHeader>

                  <CardBody
                    className="text-center cursor-pointer"
                    onClick={() => navigate(`/product/${item.slug}`)}
                  >
                    <Typography variant="h5" className="mb-2">
                      {item.name}
                    </Typography>
                    <Typography className="text-gray-600">
                      {item.description?.length > 40
                        ? item.description.slice(0, 40) + "...Read More"
                        : item.description}
                    </Typography>
                  </CardBody>

                  <CardFooter
                    divider
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex flex-col">
                      <Typography variant="small" className="font-bold">
                        ${item.price}
                      </Typography>
                      <Typography variant="small" className="text-gray-600">
                        {item.quantity} pcs
                      </Typography>
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-500"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
