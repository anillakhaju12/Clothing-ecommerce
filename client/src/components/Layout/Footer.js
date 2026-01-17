import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0f3e8a] text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">© Copyright Clothes Shop 2025</h3>
          <p className="flex items-center justify-center gap-4 text-sm">
            <Link to="/about" className="hover:text-gray-300 transition">About</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
            <span>|</span>
            <Link to="/policy" className="hover:text-gray-300 transition">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
