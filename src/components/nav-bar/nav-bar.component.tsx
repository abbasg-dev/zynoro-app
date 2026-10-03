import { useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store/store";
import { logout } from "store/slices/authSlice";
import { getUserInfo } from "helpers/global";
import { Link } from "react-router-dom";
import { Navbar, Button } from "react-bootstrap";
import SearchBar from "components/search-bar/search-bar.component";
import { Product } from "interfaces/products.model";
import * as ROUTES from "constants/routes";
import assets from "assets";
import "./nav-bar.scss";
import { logoutUser } from "api/services/auth.services";

type NavbarProps = {
  setIsOpen?: () => void;
};

const NavBar = (props: NavbarProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items: Product[] = useSelector((state: RootState) => state?.cart.items);
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.auth?.isAuthenticated,
  );

  const authuser = useSelector((state: RootState) => state.auth.user);

  const userInfo = getUserInfo();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <Navbar expand="lg" className="custom-navbar">
      {/* Brand Logo */}
      <Navbar.Brand>
        <span onClick={() => navigate("/", { state: null, replace: true })}>
          <img src={assets.logo} alt="logo" />
        </span>
      </Navbar.Brand>

      {/* Right side icons (Cart & Profile) always visible on mobile */}
      <div className="nav-actions-mobile d-flex align-items-center gap-3">
        <Link to={ROUTES.CART} className="cart">
          <i className="fas fa-shopping-cart icon"></i>
          {items.length > 0 && <span className="badge">{items.length}</span>}
        </Link>
        <div className="user-menu" ref={dropdownRef}>
          {isLoggedIn ? (
            <>
              {userInfo ? (
                <img
                  src={authuser?.photoURL || assets.user}
                  alt="user-profile"
                  className="user-profile"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                />
              ) : (
                <i
                  className="fas fa-user-circle icon"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                ></i>
              )}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate(ROUTES.ORDERS)}>
                    My Orders
                  </button>
                  <button onClick={() => handleLogout()}>Logout</button>
                </div>
              )}
            </>
          ) : (
            <Button
              variant="link"
              className="login-button p-0"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              <img src={assets.user} alt="user" className="user-icon" />
            </Button>
          )}
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </div>

      {/* Collapsible content (Search bar & Country info) */}
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
      >
        <div className="search-wrapper my-2 my-lg-0">
          <SearchBar />
        </div>
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center country-stack"
        >
          <Stack direction="horizontal" gap={1} className="align-items-center">
            <img src={assets.flag} alt="flag" width={32} />
            <span className="flag-text">UAE</span>
          </Stack>
          <div className="divider" />
          <Stack direction="horizontal" gap={1} className="align-items-center">
            <img src={assets.coin} width={24} alt="coin" />
            <span className="currency-text">Currency\UAE Dirhams</span>
          </Stack>
        </Stack>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
