import { useEffect, useState } from "react";
import { RangeSlider } from "react-double-range-slider";
import "react-double-range-slider/dist/cjs/index.css";
import { formatCurrency } from "helpers/global";
import "./price-filter.scss";

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (min: number, max: number) => void;
};

const PriceFilter = ({
  minPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  onPriceChange,
}: PriceFilterProps) => {
  const [range, setRange] = useState({
    min: selectedMinPrice,
    max: selectedMaxPrice,
  });

  useEffect(() => {
    setRange({ min: selectedMinPrice, max: selectedMaxPrice });
  }, [selectedMinPrice, selectedMaxPrice]);

  const handleChange = (e: any) => {
    setRange(e);
  };

  const handleFilterClick = () => {
    onPriceChange(range.min, range.max);
  };

  return (
    <div className="price-filter">
      <RangeSlider
        value={{
          min: minPrice,
          max: maxPrice,
        }}
        from={formatCurrency(range.min)}
        to={formatCurrency(range.max)}
        onChange={handleChange}
        tooltipPosition="over"
        tooltipVisibility="always"
        formatter={(x: any) => `AED${x}`}
      />
      <div className="range-labels">
        <span>{formatCurrency(range.min)}</span>
        <span>{formatCurrency(range.max)}</span>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span className="selected-range">
          Between {formatCurrency(range.min)} to {formatCurrency(range.max)}
        </span>
        <button className="filter-button" onClick={handleFilterClick}>
          Filter
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
