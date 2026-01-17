import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { FiTrash2 } from "react-icons/fi";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //delete items
const removeCartItem = (pid) => {
  const updatedCart = cart.filter(item => item._id !== pid);
  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken); //clientToken API bata auxa
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout title="Shopping Cart - Clothes Shop">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {auth?.token && auth?.user?.name ? `Hello, ${auth.user.name}` : "Shopping Cart"}
          </h1>
          <h4 className="text-xl text-gray-600">
            {cart?.length
              ? `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart ${
                  auth?.token ? "" : "- Please login to checkout"
                }`
              : "Your Cart is Empty"}
          </h4>
        </div>

        {cart?.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="h3" className="text-gray-400 mb-4">
              Your cart is empty
            </Typography>
            <Button
              className="bg-primary"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart?.map((p) => (
                <Card key={p._id} className="shadow-md hover:shadow-xl transition-shadow">
                  <CardBody>
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="md:w-48 h-48 flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                          className="w-full h-full object-cover rounded-lg"
                          alt={p.name}
                          onError={(e) => {
                            e.target.src = "/images/fallback.jpg";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Typography variant="h4" className="text-gray-800 mb-2">
                          {p.name}
                        </Typography>
                        <Typography className="text-gray-600 mb-3">
                          {p.description.length > 100
                            ? `${p.description.substring(0, 100)}...`
                            : p.description}
                        </Typography>
                        <Typography variant="h5" className="text-green-600 font-bold mb-4">
                          ${p.price.toFixed(2)}
                        </Typography>

                        {/* Remove Button */}
                        <Button
                          color="red"
                          variant="outlined"
                          className="flex items-center gap-2"
                          onClick={() => removeCartItem(p._id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg sticky top-20">
                <CardBody className="space-y-6">
                  <Typography variant="h3" className="text-center text-primary">
                    Cart Summary
                  </Typography>
                  
                  <div className="border-t border-b py-4">
                    <div className="flex justify-between items-center mb-2">
                      <Typography className="text-gray-600">Subtotal:</Typography>
                      <Typography className="font-semibold">{totalPrice()}</Typography>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold">
                      <Typography>Total:</Typography>
                      <Typography className="text-green-600">{totalPrice()}</Typography>
                    </div>
                  </div>

                  {/* Address Section */}
                  {auth?.user?.address ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Typography variant="h6" className="mb-2">
                        Delivery Address
                      </Typography>
                      <Typography className="text-gray-700 mb-3">
                        {auth.user.address}
                      </Typography>
                      <Button
                        variant="outlined"
                        className="w-full"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      {auth?.token ? (
                        <>
                          <Typography className="text-gray-700 mb-3 text-center">
                            Please add a delivery address
                          </Typography>
                          <Button
                            className="w-full bg-yellow-600"
                            onClick={() => navigate("/dashboard/user/profile")}
                          >
                            Add Address
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography className="text-gray-700 mb-3 text-center">
                            Please login to checkout
                          </Typography>
                          <Button
                            className="w-full bg-primary"
                            onClick={() =>
                              navigate("/login", {
                                state: "/cart",
                              })
                            }
                          >
                            Login to Checkout
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Payment Section */}
                  {clientToken && cart?.length > 0 && (
                    <div className="space-y-4">
                      <Typography variant="h6" className="text-center">
                        Payment Method
                      </Typography>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />

                      <Button
                        className="w-full bg-green-600"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                            Processing...
                          </span>
                        ) : (
                          "Complete Payment"
                        )}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;

