import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
<Layout title="Your Orders">
  <div className="container mx-auto p-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4">
        <UserMenu />
      </div>
      <div className="md:w-3/4">
        <h1 className="text-2xl font-semibold text-center mb-6">All Orders</h1>

        {orders?.map((o, i) => (
          <div key={o._id} className="mb-6 border rounded shadow">
            {/* Order Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Buyer</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Payment</th>
                    <th className="px-4 py-2 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-4 py-2 border">{i + 1}</td>
                    <td className="px-4 py-2 border">{o?.status}</td>
                    <td className="px-4 py-2 border">{o?.buyer?.name}</td>
                    <td className="px-4 py-2 border">{moment(o?.createAt).fromNow()}</td>
                    <td className="px-4 py-2 border">
                      {o?.payment?.success ? (
                        <span className="text-green-600 font-semibold">Success</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Failed</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border">{o?.products?.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Products in the Order */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {o?.products?.map((p) => (
                <div key={p._id} className="flex border rounded shadow p-3 gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-gray-500">{p.description.substring(0, 50)}...</p>
                    <p className="text-green-600 font-medium">Price: ${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</Layout>

  );
};

export default Orders;
