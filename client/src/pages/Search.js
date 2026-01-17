import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { Button, CardFooter } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [values, setValues] = useSearch();

  return (
    <Layout title={"Search results"}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold">Search Results</h1>

        <h6 className="text-gray-600 mt-1">
          {values?.results.length < 1
            ? "No product Found"
            : `Found ${values?.results.length}`}
        </h6>

        {/* Grid layout replacing Bootstrap row/columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {values?.results.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <img
                src={`${
                  import.meta.env.VITE_API_URL
                }/api/v1/product/product-photo/${p._id}`}
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

                {/* Buttons */}
                <CardFooter className="pt-0 flex gap-2">
                  <Button
                    size="sm"
                    variant="outlined"
                    className="flex-1"
                    onClick={() => navigate(`/product/${p.slug}`)}>
                    Details
                  </Button>
                </CardFooter>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
