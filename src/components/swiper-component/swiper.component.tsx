import { Carousel, Button, Row, Col } from "react-bootstrap";
import assets from "assets";
import "./swiper.scss";

const Swiper = () => {
  return (
    <div className="swiper-component">
      <Carousel interval={5000} controls={true}>
        {Array.from(Array(4).keys()).map((slide) => (
          <Carousel.Item key={slide}>
            <Row className="align-items-center h-100 swiper-content">
              <Col
                xs={12}
                md={6}
                className="text-center order-md-0 get-started"
              >
                <h2>Get Started with best place for best Products</h2>
                <h6>Safe and speed purchasing</h6>
                <Button variant="primary" size="lg" className="rounded-pill">
                  Get Started
                </Button>
              </Col>
              <Col
                xs={12}
                md={6}
                className="d-flex justify-content-center align-items-center mt-3 mt-md-0"
              >
                <img src={assets.laptop} alt="laptop" width={400} />
                <img src={assets.connector} alt="connector" />
                <img src={assets.drone} width="auto" height={300} alt="box" />
              </Col>
            </Row>
            <img src={assets.wave} alt="wave" className="swiper-wave" />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Swiper;
