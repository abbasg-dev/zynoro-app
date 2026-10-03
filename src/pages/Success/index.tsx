import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  CheckLg,
  CheckCircleFill,
  ArrowRight,
  BagCheckFill,
} from "react-bootstrap-icons";
import { RootState } from "store/store";
import { resetOrderStatus } from "store/slices/cartSlice";
import * as ROUTES from "constants/routes";
import assets from "assets";
import "./success.scss";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderPlaced = useSelector((state: RootState) => state.cart.orderPlaced);

  useEffect(() => {
    if (!orderPlaced) {
      navigate(ROUTES.CHECKOUT);
    }
    return () => {
      dispatch(resetOrderStatus());
    };
  }, [orderPlaced, navigate, dispatch]);

  if (!orderPlaced) {
    return null;
  }

  return (
    <div className="success-page-wrapper">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          <Col
            lg={6}
            className="success-left-panel d-flex flex-column justify-content-center"
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
                Thank you for choosing Zynoro!
              </h2>

              <p className="branding-subheading">
                Your order is confirmed and being prepared for express dispatch:
              </p>

              <ul className="branding-features-list">
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Confirmation email &amp; digital receipt sent to your inbox
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>Real-time courier dispatch with SMS updates</span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>Guaranteed delivery within 3 business days</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col
            lg={6}
            className="success-right-panel d-flex align-items-center justify-content-center"
          >
            <div className="success-card text-center">
              <div className="icon-badge mb-3">
                <CheckCircleFill className="check-badge-icon" />
              </div>

              <h1 className="success-title">Order Confirmed!</h1>

              <p className="success-subtitle">
                We've received your payment. Your order is now in processing and
                will be delivered to your address within{" "}
                <strong>3 business days</strong>.
              </p>

              <div className="order-info-box mb-4">
                <div className="info-row">
                  <BagCheckFill className="info-icon me-2" />
                  <span>
                    Status: <strong>Processing</strong>
                  </span>
                </div>
                <div className="info-row">
                  <span>
                    Estimated Delivery: <strong>Within 3 Days</strong>
                  </span>
                </div>
              </div>

              <Button
                as={Link as any}
                to={ROUTES.HOME}
                className="w-100 shop-again-btn"
              >
                Back to Shop <ArrowRight className="ms-2" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Success;
