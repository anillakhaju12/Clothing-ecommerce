import React from "react";
import Layout from "./../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title="Dashboard - Clothes Shop App">
      <div className="container mx-auto my-3 p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <UserMenu />
          </div>

          {/* Main content */}
          <div className="md:w-3/4">
            <div className="bg-white shadow-md rounded p-6 w-3/4">
              <h3 className="mb-2">Name: {auth?.user?.name}</h3>
              <h3 className="mb-2">Email: {auth?.user?.email}</h3>
              <h3 className="mb-2">Address: {auth?.user?.address}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
