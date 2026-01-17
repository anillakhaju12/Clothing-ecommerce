import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Grid replacing Bootstrap row/col-md-6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((c) => (
            <div key={c._id} className="flex justify-center">
              <Link
                to={`/category/${c.slug}`}
                className="w-full sm:w-auto text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
              >
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
