import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { CheckLg, ArrowRight } from "react-bootstrap-icons";
import * as ROUTES from "constants/routes";
import assets from "assets";
import "./not-found.scss";

const NotFound = () => {
  return (
    <div className="not-found-page-wrapper">
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          <Col
            lg={6}
            className="not-found-left-panel d-flex flex-column justify-content-center"
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
                Looking for something at Zynoro?
              </h2>
              <p className="branding-subheading">
                The page you are looking for might have been moved, removed, or
                is temporarily unavailable:
              </p>
              <ul className="branding-features-list">
                <li>
                  <CheckLg className="check-icon" />
                  <span>Check the URL address for any typing mistakes</span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Browse our latest tech deals and featured products
                  </span>
                </li>
                <li>
                  <CheckLg className="check-icon" />
                  <span>
                    Search across our catalog using the top search bar
                  </span>
                </li>
              </ul>
            </div>
          </Col>
          <Col
            lg={6}
            className="not-found-right-panel d-flex align-items-center justify-content-center"
          >
            <div className="not-found-card text-center">
              <div className="image-container mb-3">
                <img
                  src={assets.notFound}
                  alt="404 Not Found"
                  className="not-found-img"
                />
              </div>
              <h1 className="not-found-title">OOPS!</h1>
              <h3 className="not-found-subtitle">It looks like you're lost</h3>
              <p className="not-found-text mb-4">
                We couldn't find the page you were looking for. Let's get you
                back on track!
              </p>
              <Button
                as={Link as any}
                to={ROUTES.HOME}
                className="w-100 back-home-btn"
              >
                Go Back to Home <ArrowRight className="ms-2" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
