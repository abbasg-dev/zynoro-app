import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, generatePath } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";

import { Container, Row, Col, Badge } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Product } from "interfaces/products.model";
import { Categories, Category } from "interfaces/categories.model";

import { getTopCategories } from "api/services/categories.services";
import {
  getFeaturedProducts,
  getTrendingProducts,
} from "api/services/products.services";

import Swiper from "components/swiper-component/swiper.component";
import ProductCard from "components/product-card/product-card.component";
import Loader from "components/loader/loader.component";
import Footer from "pages/Footer";

import { RootState } from "store/store";
import { addItem } from "store/slices/cartSlice";
import { setCategories } from "store/slices/categoriesSlice";

import * as ROUTES from "constants/routes";
import assets from "assets";
import "./home.scss";

const productsCount = 6;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery<Categories>({
      queryKey: ["categories", "top"],
      queryFn: getTopCategories,
    });

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [selectedCategory, setSelectedCategory] = useState<null | Category>(
    null,
  );

  const queryParams = selectedCategory
    ? `${productsCount}?category=${selectedCategory._id}`
    : `${productsCount}`;

  const { isLoading: isLoadingFeaturedProducts, data: featuredProducts } =
    useQuery<Product[]>({
      queryKey: ["home-products", queryParams],
      queryFn: () => getFeaturedProducts(queryParams),
    });

  const { isLoading: isLoadingTrendingProducts, data: trendingProducts } =
    useQuery<Product[]>({
      queryKey: ["trending-products", queryParams],
      queryFn: () => getTrendingProducts(queryParams),
    });

  const noProductsFound =
    !isLoadingFeaturedProducts && !featuredProducts?.length;

  const handleBadgeClick = (selected: Category) => {
    setSelectedCategory((prev) =>
      prev && prev._id === selected._id ? null : selected,
    );
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, productId: string) => {
      const value = event.target.value;
      setQuantities((prev) => ({
        ...prev,
        [productId]: value.trim() === "" || isNaN(Number(value)) ? "" : value,
      }));
    },
    [],
  );

  const onAddItem = useCallback(
    (product: any) => {
      const quantity = Number(quantities[product._id]) || 1;
      if (Number(product.countInStock) > 0) {
        dispatch(addItem({ ...product, countInStock: quantity }));
        setQuantities((prev) => ({ ...prev, [product._id]: "" }));
        toast.success("Cart Updated!");
      }
    },
    [dispatch, quantities],
  );

  const handleProductClick = (id: string) => {
    const path = generatePath(ROUTES.PRODUCT_DETAILS, { id });
    navigate(path);
  };

  useEffect(() => {
    if (!isLoggedIn) dispatch(setCategories([]));
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <Helmet>
        <title>Zynoro</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no"
        />
      </Helmet>
      <ToastContainer />
      <Swiper />
      <div className="home-container">
        <h2>
          <img src={assets.product} alt="product" />
          Featured Products
        </h2>
        {isLoadingFeaturedProducts || isLoadingCategories ? (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ minHeight: "300px" }}
          >
            <div className="text-center">
              <Loader />
            </div>
          </div>
        ) : (
          <>
            <div className="category-filters d-flex justify-content-center">
              {categories?.categories?.map((category: Category) => {
                return (
                  <div key={category._id}>
                    {category._id === selectedCategory?._id ? (
                      <Badge
                        key={category._id}
                        onClick={() => handleBadgeClick(category)}
                        bg={"success"}
                        className="px-3 py-2 mx-1 mb-4 text-white rounded-bg cat-selected"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {category.name}
                      </Badge>
                    ) : (
                      <Badge
                        key={category._id}
                        onClick={() => handleBadgeClick(category)}
                        bg={"primary"}
                        className="px-3 py-2 mx-1 mb-4 text-white rounded-bg"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {category.name}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="products-container">
              <Row className="justify-content-center align-items-start">
                {noProductsFound ? (
                  <p className="no-products">
                    No products found for selected categories.
                  </p>
                ) : (
                  featuredProducts?.map((product: Product) => (
                    <Col key={product._id} md={6} xs={12} className="my-2 px-2">
                      <ProductCard
                        key={product._id}
                        product={product}
                        quantities={quantities}
                        onAdd={() => onAddItem(product)}
                        handleChange={handleChange}
                        onProductClicked={() => handleProductClick(product._id)}
                      />
                    </Col>
                  ))
                )}
              </Row>
            </div>
            <div className="show-more">
              <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
                Explore More
              </Link>
            </div>
          </>
        )}
        <Container className="py-5 mb-8 stand-out" as="section">
          <h2>What Makes Us Stand Out</h2>
          <Row className="justify-content-center align-items-center">
            {[
              {
                icon: assets.global,
                text: "A global network of trustworthy drop shippers and wholesalers",
              },
              {
                icon: assets.box,
                text: "Fill your store with high-profit products in minutes",
              },
              {
                icon: assets.cost,
                text: "No startup costs, no risk, no monthly fees",
              },
            ].map(({ icon, text }, index) => (
              <Col
                key={index}
                xs={12}
                md={4}
                className="text-center mb-3 mb-md-0"
              >
                <div className="icon-circle">
                  <img src={icon} alt="feature-icon" />
                </div>
                <p className="max-width-text">{text}</p>
              </Col>
            ))}
          </Row>
        </Container>
        <Container className="mb-8" as="section">
          <h2>Trending Deals</h2>
          <Row className="justify-content-center align-items-start">
            {isLoadingTrendingProducts ? (
              <div
                className="d-flex justify-content-center align-items-center w-100"
                style={{ minHeight: "300px" }}
              >
                <div className="text-center">
                  <Loader />
                </div>
              </div>
            ) : noProductsFound ? (
              <p className="no-products">No trending deals found.</p>
            ) : (
              trendingProducts?.map((product: Product) => (
                <Col key={product._id} md={6} xs={12} className="my-2 px-2">
                  <ProductCard
                    product={product}
                    quantities={quantities}
                    onAdd={() => onAddItem(product)}
                    handleChange={handleChange}
                    onProductClicked={() => handleProductClick(product._id)}
                  />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Home;
