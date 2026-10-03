import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import assets from "assets";
import * as ROUTES from "constants/routes";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="pt-4">
        <Row className="py-0 align-items-start">
          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
            <img src={assets.zynoro} alt="logo" className="footer-logo" />
          </Col>

          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
            <div className="footer-contact text-start">
              <Button variant="link" className="footer-link p-0 mb-2 border-0">
                Contact us{" "}
                <img src={assets.arrow} alt="arrow" className="ms-1" />
              </Button>
              <p className="footer-text mb-0">
                Keep in touch by sending a message and give us a follow
              </p>
            </div>
          </Col>

          <Col xs={12} md={4} className="text-center">
            <div className="footer-menu">
              <div className="text-start">
                <h6 className="footer-heading">Menu</h6>
                <Link to={ROUTES.HOME} className="d-block footer-menu-link">
                  Home
                </Link>
                <Link to={ROUTES.PRODUCTS} className="d-block footer-menu-link">
                  Products
                </Link>
              </div>
              <div className="text-start">
                <h6 className="footer-heading invisible">Menu</h6>
                <Link to={ROUTES.ORDERS} className="d-block footer-menu-link">
                  My orders
                </Link>
                <Link to={ROUTES.CART} className="d-block footer-menu-link">
                  Cart
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="footer-social">
              <Button variant="link" className="social-btn">
                <img src={assets.facebook} alt="facebook" />
              </Button>
              <Button variant="link" className="social-btn">
                <img src={assets.twitter} alt="twitter" />
              </Button>
              <Button variant="link" className="social-btn">
                <img src={assets.instagram} alt="instagram" />
              </Button>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="footer-bottom">
          <p>Terms &amp; conditions</p>
          <p>Settings</p>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </Container>

      <div className="footer-wave" />
    </footer>
  );
};

export default Footer;
