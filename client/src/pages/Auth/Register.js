import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !address || !answer) {
      setError(true);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        { name, email, password, phone, address, answer }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Register - Clothes Shop">
      <div className="flex flex-col justify-center items-center min-h-[80vh] py-8 px-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 lg:p-12">
          <h1 className="text-center text-4xl lg:text-5xl font-bold text-primary mb-8">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-gray-700 font-semibold">
                Full Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter your full name"
              />
              {error && !name && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Name is Required
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-gray-700 font-semibold">
                Email Address:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter email address"
              />
              {error && !email && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Email is Required
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-gray-700 font-semibold">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter password"
              />
              {error && !password && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Password is Required
                </span>
              )}
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-gray-700 font-semibold">
                Phone Number:
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter phone number"
              />
              {error && !phone && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Phone is Required
                </span>
              )}
            </div>

            {/* Address Input */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="address" className="text-gray-700 font-semibold">
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter your address"
              />
              {error && !address && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Address is Required
                </span>
              )}
            </div>

            {/* Security Question */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="answer" className="text-gray-700 font-semibold">
                What is Your Favorite Sport?
              </label>
              <input
                type="text"
                name="answer"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="outline-none border-b-2 border-gray-300 focus:border-blue-500 px-3 py-2 rounded-md shadow-sm transition"
                placeholder="Enter your favorite sport"
              />
              {error && !answer && (
                <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                  Answer is Required
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
              >
                Register
              </button>
            </div>

            {/* Login Link */}
            <div className="md:col-span-2 text-center mt-2">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 underline font-semibold"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
