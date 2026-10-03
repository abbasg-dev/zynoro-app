import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CheckLg } from "react-bootstrap-icons";
import assets from "assets";
import "./auth.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-wrapper">
      <Container fluid className="auth-container p-0">
        <Row className="g-0 min-vh-100">
          <Col
            lg={6}
            className="auth-left-panel d-flex flex-column justify-content-center"
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
                Experience seamless e-commerce with Zynoro
              </h2>

              <p className="branding-subheading">
                Discover tailored shopping, premium selections, and instant
                access to top tech:
              </p>

              <ul className="branding-features-list">
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Curated products with exclusive deals and discounts
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Secure authentication &amp; express checkout experience
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Real-time order tracking and dedicated customer support
                  </span>
                </li>
              </ul>
            </div>
          </Col>
          <Col
            lg={6}
            className="auth-right-panel d-flex align-items-center justify-content-center"
          >
            <div className="auth-form-card">{children}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;
