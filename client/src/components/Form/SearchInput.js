import React, { useState } from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/search/${
          values.keyword
        }`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="border rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          type="submit"
          className="border border-blue-500 text-blue-500 bg-blue-200 hover:bg-blue-900 hover:text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
