/// <reference types="react-scripts" />

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}
declare module "react-file-picker";
declare module "react-animated-slider" {
  import { ComponentType } from "react";
  const AnimatedSlider: ComponentType<any>;
  export default AnimatedSlider;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
