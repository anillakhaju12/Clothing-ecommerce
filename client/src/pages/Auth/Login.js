import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        { email, password }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Clothes Shop">
      <div className="flex flex-col justify-center items-center min-h-[80vh] py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative hidden lg:flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-700">
            <img 
              className="w-full h-full object-cover" 
              src="https://www.go.ooo/img/bg-img/Login.jpg" 
              alt="Login"
            />
          </div>

          {/* Form Section */}
          <div className="p-8 lg:p-12">
            <h1 className="text-center text-4xl lg:text-5xl font-bold text-primary mb-8">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
              >
                Login
              </button>

              {/* Forgot Password Link */}
              <div className="text-center mt-4">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Register Link */}
              <div className="text-center mt-2">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
