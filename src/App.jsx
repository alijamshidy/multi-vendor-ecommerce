import { Route, Routes } from "react-router-dom";
import ChangePassword from "./components/dashboard/ChangePassword";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Order";
import OrderDetails from "./components/dashboard/OrderDetails";
import Wishlist from "./components/dashboard/Wishlist";
import ProductDetails from "./components/ProductDetails";
import Card from "./pages/Card";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductsDisplay from "./pages/ProductsDisplay";
import Shipping from "./pages/Shipping";

function App() {
  return (
    <Routes>
      <Route
        path="/product/:slug"
        element={<ProductDetails />}
      />
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/search/:type/:slug"
        element={<ProductsDisplay />}
      />
      <Route
        path="/products-discount/:type"
        element={<ProductsDisplay />}
      />
      <Route
        path="/display-products/:type"
        element={<ProductsDisplay />}
      />
      <Route
        path="/card"
        element={<Card />}
      />
      <Route
        path="/shipping"
        element={<Shipping />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}>
        <Route
          path=""
          element={<Index />}
        />
        <Route
          path="my-orders"
          element={<Orders />}
        />
        <Route
          path="change-password"
          element={<ChangePassword />}
        />
        <Route
          path="my-wishlist"
          element={<Wishlist />}
        />
        <Route
          path="order/details/:orderId"
          element={<OrderDetails />}
        />
      </Route>
    </Routes>
  );
}

export default App;
