import { ReactNode } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-carousel.scss";

type SlickCarouselProps = {
  notifications?: ReactNode;
};

const SlickCarousel = (props: SlickCarouselProps) => {
  const { notifications } = props;
  const settings = {
    vertical: true,
    infinite: true,
    slidesToShow: 1,
    speed: 2000,
    arrows: false,
    swipe: true,
    dots: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return <Slider {...settings}>{notifications}</Slider>;
};

export default SlickCarousel;
