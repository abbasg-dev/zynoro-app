import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useMutation } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { clearItems, placeOrderSuccess } from "store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "store/store";
import * as ROUTES from "constants/routes";
import { createOrder, markOrderAsPaid } from "api/services/order.services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreateOrderPayload } from "interfaces/orders.model";
import { AxiosError } from "interfaces/errors.model";
import { getUserInfo, formatCurrency } from "helpers/global";
import { Product } from "interfaces/products.model";
import {
  CheckLg,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "react-bootstrap-icons";
import assets from "assets";
import "./checkout.scss";

const stripeElementStyles = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#1f2937",
      color: "#1f2937",
      fontWeight: "500",
      fontFamily: "'Inter', sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      iconColor: "#dc2626",
      color: "#dc2626",
    },
  },
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const items: Product[] = useSelector((state: RootState) => state.cart?.items);
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.auth?.isAuthenticated,
  );
  const userInfo = getUserInfo();

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    formState: { errors },
    reset,
    handleSubmit,
  } = methods;

  const getSubTotal = (): number => {
    let total = 0;
    for (let item of items) {
      total +=
        Number(item.priceAfterDiscount || item.originalPrice) *
        Number(item.countInStock);
    }
    return total;
  };

  const clearOrderFrm = () => {
    reset();
  };

  const newOrder = useMutation(createOrder, {
    async onSuccess(response: any) {
      const { order, paymentIntent } = response;
      const secret =
        paymentIntent?.clientSecret || paymentIntent?.client_secret;

      if (!paymentIntent || !secret) {
        toast.error("Payment intent or client secret is missing.");
        setIsProcessingPayment(false);
        return;
      }

      const cardElement = elements?.getElement(CardElement);

      if (!cardElement) {
        toast.error("Card element is not available.");
        setIsProcessingPayment(false);
        return;
      }

      try {
        const paymentResult = await stripe?.confirmCardPayment(secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: userInfo
                ? userInfo?.displayName || userInfo?.username
                : "Guest",
            },
          },
        });

        if (paymentResult?.error) {
          setIsProcessingPayment(false);
          toast.error(
            paymentResult?.error.message || "An error occurred during payment.",
          );
        } else if (paymentResult?.paymentIntent?.status === "succeeded") {
          if (order?._id || order?.id) {
            await markOrderAsPaid({
              orderId: order._id || order.id,
              paymentIntentId: paymentResult.paymentIntent.id,
            });
          }

          setIsProcessingPayment(false);
          clearOrderFrm();
          dispatch(clearItems());
          dispatch(placeOrderSuccess());
          navigate(ROUTES.SUCCESS);
        }
      } catch (error) {
        setIsProcessingPayment(false);
        toast.error("An error occurred during payment processing.");
      }
    },
    onError(error: AxiosError<{ error: string }>) {
      setIsProcessingPayment(false);
      toast.error(error.response?.data.error || "Failed to create order");
    },
  });

  const onSubmit = async (data: CreateOrderPayload) => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Card details incomplete");
      return;
    }

    setIsProcessingPayment(true);

    const submitData = {
      items: items?.map((item) => ({
        productId: item._id,
        quantity: Number(item.countInStock) || 1,
      })),
      createPaymentIntent: true,
    };
    newOrder.mutate(submitData);
  };

  return (
    <div className="checkout-page-wrapper">
      <ToastContainer />
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col
            lg={6}
            className="checkout-left-panel d-flex flex-column justify-content-center"
          >
            <div className="branding-content">
              <div className="logo-container mb-4">
                <img
                  src={assets.logo}
                  alt="Zynoro Logo"
                  className="zynoro-logo"
                />
              </div>

              <h2 className="branding-headline">
                Complete your purchase with Zynoro
              </h2>

              <p className="branding-subheading">
                Enjoy seamless processing, guaranteed payment safety, and
                express fulfillment:
              </p>

              <ul className="branding-features-list">
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    256-Bit SSL Encrypted &amp; Secure Payment Processing
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Free Express Delivery &amp; Real-time Shipment Tracking
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Buyer Protection &amp; Easy 30-Day Return Guarantee
                  </span>
                </li>
              </ul>
            </div>
          </Col>

          <Col
            lg={6}
            className="checkout-right-panel d-flex align-items-center justify-content-center"
          >
            <div className="checkout-form-card">
              <div className="checkout-header mb-4">
                <Link to={ROUTES.CART} className="back-to-cart-link">
                  <ArrowLeft size={16} /> Back to Cart
                </Link>
                <h1 className="checkout-title mt-3">Checkout</h1>
              </div>

              <FormProvider {...methods}>
                <Form onSubmit={handleSubmit(onSubmit as any)}>
                  <div className="card-section mb-4">
                    <label className="card-input-label">
                      <CreditCard className="me-2" /> Credit or Debit Card
                    </label>
                    <div className="stripe-card-element">
                      <CardElement options={stripeElementStyles as any} />
                    </div>
                  </div>

                  <div className="order-summary-card mb-4">
                    <h3 className="summary-title">Order Summary</h3>

                    <div className="order-item">
                      <span className="label">Order Total</span>
                      <span className="value">
                        {formatCurrency(getSubTotal())}
                      </span>
                    </div>

                    <div className="order-item">
                      <span className="label">Packing &amp; Shipping</span>
                      <span className="value text-success fw-semibold">
                        Free
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 place-order-btn"
                    disabled={
                      newOrder?.isLoading ||
                      isProcessingPayment ||
                      items?.length === 0 ||
                      Object.keys(errors).length > 0 ||
                      !isLoggedIn ||
                      userInfo === null
                    }
                  >
                    {newOrder?.isLoading || isProcessingPayment
                      ? "Processing Payment..."
                      : "Place Order"}
                  </Button>

                  <div className="security-note mt-3 text-center">
                    <ShieldCheck size={16} className="me-1 text-muted" />
                    <span className="text-muted small">
                      Your transaction is encrypted and 100% secure.
                    </span>
                  </div>
                </Form>
              </FormProvider>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
