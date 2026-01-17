import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMenu from "./../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/order-status/${orderId}`,
        { status: value }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="flex flex-col md:flex-row gap-6 px-4 py-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <AdminMenu />
        </div>

        {/* Orders Section */}
        <div className="w-full md:w-3/4">
          <h1 className="text-center text-2xl font-semibold mb-6">All Orders</h1>

          {orders?.map((o, i) => (
            <div key={i} className="border rounded-lg shadow mb-6 bg-white">
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Buyer</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Payment</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">{i + 1}</td>

                      <td className="px-4 py-2">
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                          className="w-40"
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>

                      <td className="px-4 py-2">{o?.buyer?.name}</td>
                      <td className="px-4 py-2">{moment(o?.createAt).fromNow()}</td>
                      <td className="px-4 py-2">
                        {o?.payment.success ? (
                          <span className="text-green-600 font-medium">Success</span>
                        ) : (
                          <span className="text-red-600 font-medium">Failed</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Products List */}
              <div className="p-4">
                {o?.products?.map((p) => (
                  <div
                    key={p._id}
                    className="flex gap-4 border rounded-lg p-4 mb-3 shadow-sm"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="w-28 h-28 rounded object-cover"
                    />

                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-gray-600">
                        {p.description.substring(0, 30)}...
                      </p>
                      <p className="text-blue-600 font-medium">Price: ${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
