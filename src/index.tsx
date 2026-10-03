import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "utils/stripe/stripe.utils";
import { store, persistor } from "store/store";
import { QueryClientProvider, QueryClient } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "styles/main.scss";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      structuralSharing: false,
    },
  },
});
root.render(
  <>
    {/* component makes the Redux store available to any nested components that need to access the Redux store */}
    <Provider store={store}>
      {/* persist our data on refresh */}
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </>,
);
