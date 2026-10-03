import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CartCard from "components/cart-card/cart-card.component";
import { RootState } from "store/store";
import { formatCurrency } from "helpers/global";
import { clearItems } from "store/slices/cartSlice";
import { Product } from "interfaces/products.model";
import Pagination from "components/pagination";
import * as ROUTES from "constants/routes";
import "./cart.scss";

const Cart = () => {
  const dispatch = useDispatch();
  const items: Product[] = useSelector((state: RootState) => state.cart.items);
  const searchQuery = useSelector((state: RootState) => state.search.query);

  const filteredProducts = items?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const getSubTotal = () => {
    let total = 0;
    for (let item of items) {
      total += Number(item.originalPrice) * Number(item.countInStock);
    }
    return total;
  };

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + Number(item.countInStock), 0);
  };

  const onClearCart = () => {
    dispatch(clearItems());
    toast.success("Cart Updated!");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div className="cart-header">
        <button className="continue-shopping">
          <i className="fas fa-arrow-left"></i>
          <Link to={ROUTES.PRODUCTS}>Continue Shopping</Link>
        </button>
      </div>
      <div className="cart-table">
        <div className="cart-table-header">
          <span>Image</span>
          <span>Item Description/Name</span>
          <span>Qty</span>
          <span>Item Price</span>
          <span>Subtotal</span>
        </div>
        {currentItems.map((item) => (
          <CartCard key={item._id} product={item} />
        ))}
      </div>
      <Pagination
        totalItems={filteredProducts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <div className="cart-summary">
        <div className="summary-details">
          <div className="summary-item">
            <span className="label">Total Items:</span>
            <span className="value">{filteredProducts.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Qty:</span>
            <span className="value">{getTotalQuantity()}</span>
          </div>
          <div className="summary-item subtotal">
            <span className="label">Sub Total:</span>
            <span className="value">{formatCurrency(getSubTotal())}</span>
          </div>
        </div>

        {items?.length > 0 && (
          <div className="action-buttons">
            <button className="clear-cart" onClick={onClearCart}>
              Clear
            </button>
            <Link to={ROUTES.CHECKOUT} className="checkout-btn">
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
