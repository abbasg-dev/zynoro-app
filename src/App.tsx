import { Routes, Route } from "react-router-dom";
import Layout from "pages/Layout";
import Home from "pages/Home";
import ProductLanding from "pages/ProductLanding";
import ProductDetails from "pages/ProductDetails";
import Cart from "pages/Cart";
import Checkout from "pages/Checkout";
import Success from "pages/Success";
import Login from "pages/AuthLayout/Login";
import Register from "pages/AuthLayout/Register";
import Orders from "pages/Orders";
import NotFound from "pages/NotFound";
import AuthSession from "components/auth/auth-session.component";
import AuthLayout from "pages/AuthLayout";
import { LoggedOutRoute, ProtectedRoute } from "helpers/routes";
import * as ROUTES from "constants/routes";

const App = () => {
  return (
    <>
      <AuthSession />
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path={ROUTES.LOGIN}
            element={
              <LoggedOutRoute
                outlet={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                }
              />
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <LoggedOutRoute
                outlet={
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                }
              />
            }
          />
          <Route path={ROUTES.PRODUCTS} element={<ProductLanding />} />
          <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route
            path={ROUTES.CHECKOUT}
            element={<ProtectedRoute outlet={<Checkout />} />}
          />
          <Route
            path={ROUTES.SUCCESS}
            element={<ProtectedRoute outlet={<Success />} />}
          />
          <Route
            path={ROUTES.ORDERS}
            element={<ProtectedRoute outlet={<Orders />} />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
