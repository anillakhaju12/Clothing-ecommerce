import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/auth/layout.jsx";
import Login from "../pages/auth/login.jsx";
import Register from "../pages/auth/register.jsx";
import AdminLayout from "../components/admin-view/layout.jsx";
import AdminDashboard from "../pages/admin-view/dashboard.jsx";
import AdminFeatures from "../pages/admin-view/features.jsx";
import AdminOrders from "../pages/admin-view/orders.jsx";
import AdminProducts from "../pages/admin-view/products.jsx";
import ShoppingLayout from "../components/shopping-view/layout.jsx";
import NotFound from "../pages/not-found-pages/index.jsx";
import ShoppingHome from "../pages/shopping-view/home.jsx";
import UserProfile from "../pages/shopping-view/account.jsx";
import ShoppingList from "../pages/shopping-view/listing.jsx";
import ShoppingCheckout from "../pages/shopping-view/checkout.jsx";
import CheckAuth from "../components/common/check-auth.jsx";
import UnauthPage from "../pages/unauth-page/index.jsx";

function Routers() {

  const isAuthenticated = true;
  const user = {
    role: "admin"
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route
        path="/admin"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="features" element={<AdminFeatures />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
      <Route
        path="/shop"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }
      >
        <Route path="home" element={<ShoppingHome />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={<UserProfile />} />
        <Route path="listing" element={<ShoppingList />} />
      </Route>
      <Route path="/unauth-page" element={<UnauthPage />} />
      <Route path="*" element={<NotFound />} />
       {console.log(isAuthenticated, user?.role)}
    </Routes>
  );
}

export default Routers;
