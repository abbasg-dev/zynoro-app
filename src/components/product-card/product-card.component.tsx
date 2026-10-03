import { formatCurrency } from "helpers/global";
import { Product } from "interfaces/products.model";
import "./product-card.scss";

type ProductCardProps = {
  product: Product;
  quantities?: Record<string, string>;
  onAdd: (product: any) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    productId: string,
  ) => void;
  onProductClicked: (id: string) => void;
};

const ProductCard = (props: ProductCardProps) => {
  const { product, quantities, onAdd, handleChange, onProductClicked } = props;

  return (
    <div
      className="p-card w-100 d-flex flex-column justify-content-between h-100"
      onClick={() => onProductClicked(product._id)}
    >
      <div className="header d-flex">
        <img
          src={product?.image || ""}
          alt={product?.name}
          className="image img-fluid"
        />
        <div className="details flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="id">Item #: {product?._id}</div>
            <div className="badge badge--price">
              {formatCurrency(product?.originalPrice)}
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between gap-2 my-1">
            <div className="name">{product?.name}</div>
            {!product?.isFeatured && (
              <div className="badge badge--discount">
                {product?.discount}% off
              </div>
            )}
          </div>

          <div className="stock d-flex flex-column">
            <span>Qty: {Number(product?.countInStock)} in stock</span>
            <span>
              Category ID:{" "}
              {typeof product.category === "object"
                ? product.category._id
                : product.category}
            </span>
          </div>
        </div>
      </div>

      <div className="actions d-flex align-items-center">
        <input
          type="number"
          min="1"
          className="quantity-input"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleChange(e, product._id)}
          value={quantities?.[product._id] || ""}
        />
        <button
          className="add-button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
