import React from "react";
import { MdSave } from "react-icons/md";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="categoryName"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Category Name
        </label>
        <input
          id="categoryName"
          type="text"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          placeholder="Enter category name (e.g., jeans, shirts)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <MdSave className="text-xl" />
        Submit
      </button>
    </form>
  );
};

export default CategoryForm;
