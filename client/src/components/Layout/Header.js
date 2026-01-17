import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="bg-[#2874f0] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center text-white font-bold text-xl gap-2">
              <MdShoppingCart className="h-8 w-8" />
              <span className="hidden md:block">Clothes Shop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 justify-center">
            <SearchInput />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-gray-200 font-semibold transition">
              Home
            </Link>

            {/* Categories Dropdown */}
            <Menu>
              <MenuHandler>
                <Button className="bg-white text-black px-4 py-2 text-sm font-semibold rounded hover:bg-gray-100 transition">
                  {selectedCategory || "Categories"}
                </Button>
              </MenuHandler>
              <MenuList className="max-h-96 overflow-y-auto">
                <Link to="/categories">
                  <MenuItem onClick={() => setSelectedCategory("")}>
                    All Categories
                  </MenuItem>
                </Link>
                {categories?.map((c) => (
                  <Link key={c._id} to={`/category/${c.slug}`}>
                    <MenuItem onClick={() => setSelectedCategory(c.name)}>
                      {c.name}
                    </MenuItem>
                  </Link>
                ))}
              </MenuList>
            </Menu>

            {!auth?.user ? (
              <>
                <Link to="/register" className="text-white hover:text-gray-200 font-semibold transition">
                  Register
                </Link>
                <Link to="/login" className="text-white hover:text-gray-200 font-semibold transition">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="text-white hover:text-gray-200 font-bold capitalize transition"
                >
                  Hi, {auth?.user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200 transition"
                  title="Logout"
                >
                  <FiLogOut className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative text-white hover:text-gray-200 transition">
              <AiOutlineShoppingCart className="w-8 h-8" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-white">
              <AiOutlineShoppingCart className="w-7 h-7" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-200"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1e56a0] border-t border-blue-700">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <div className="mb-3">
              <SearchInput />
            </div>
            <Link
              to="/"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Categories
            </Link>
            {categories?.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md pl-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            {!auth?.user ? (
              <>
                <Link
                  to="/register"
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-white hover:bg-blue-700 px-3 py-2 rounded-md font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
