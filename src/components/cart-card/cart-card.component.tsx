import { Product } from "interfaces/products.model";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeItem, changeItemQuantity } from "store/slices/cartSlice";
import { formatCurrency } from "helpers/global";
import "./cart-card.scss";

type Props = {
  product: Product;
};

const CartCard = (props: Props) => {
  const { product } = props;
  const dispatch = useDispatch();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value.trim() === "" ||
      !isNaN(Number(event.target.value))
    ) {
      dispatch(
        changeItemQuantity({
          ...product,
          countInStock: Number(event.target.value),
        }),
      );
    }
  };

  const onRemoveItem = () => {
    dispatch(removeItem({ ...product }));
    toast.success("Cart Updated!");
  };

  return (
    <div className="cart-card">
      <img
        src={
          product?.image && typeof product.image === "string"
            ? product.image
            : ""
        }
        alt={product?.name}
        className="product-image"
      />
      <div className="product-name">{product?.name}</div>
      <div className="quantity">
        <div className="quantity-wrapper">
          <input
            type="number"
            value={(product?.countInStock as number) ?? ""}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button className="remove-product" onClick={onRemoveItem}>
            REMOVE
          </button>
        </div>
      </div>
      <div className="product-price">
        {formatCurrency(product?.originalPrice)}
      </div>
      <div className="subtotal">
        {formatCurrency(product?.originalPrice * product?.countInStock)}
      </div>
    </div>
  );
};

export default CartCard;
