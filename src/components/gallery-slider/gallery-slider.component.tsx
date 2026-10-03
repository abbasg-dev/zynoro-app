import React from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import "./slider.scss";

interface GallerySliderProps {
  images?: any;
}

const GallerySlider: React.FC<GallerySliderProps> = ({ images }) => {
  return (
    <Slider className="slider" autoplay={3000}>
      {images?.map((image: any, index: any) => (
        <img src={image} alt="slide" key={index} />
      ))}
    </Slider>
  );
};

export default GallerySlider;
