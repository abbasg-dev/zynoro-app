import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { Row, Col, Accordion } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getProducts, getHighestPrice } from "api/services/products.services";
import { getCategories } from "api/services/categories.services";
import { getBrands } from "api/services/brands.services";

import { Categories, Category } from "interfaces/categories.model";
import { Brand, Brands } from "interfaces/brands.model";
import { Product } from "interfaces/products.model";

import ProductCard from "components/product-card/product-card.component";
import PriceFilter from "components/price-filter/price-filter.component";
import Pagination from "components/pagination";
import Footer from "pages/Footer";
import Loader from "components/loader/loader.component";

import { addItem } from "store/slices/cartSlice";
import { RootState } from "store/store";
import * as ROUTES from "constants/routes";
import assets from "assets";
import "./product-landing.scss";

const ProductLanding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state: RootState) => state.search.query);

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number>(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(
    undefined,
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const { data: highestPrice, isLoading: isLoadingHighestPrice } = useQuery({
    queryKey: ["highest-price"],
    queryFn: getHighestPrice,
  });

  useEffect(() => {
    if (highestPrice?.highestPrice !== undefined) {
      setSelectedMaxPrice(highestPrice.highestPrice);
    }
  }, [highestPrice]);

  const queryParams = useMemo(() => {
    const params: string[] = [];

    if (selectedCategory) params.push(`category=${selectedCategory._id}`);
    if (selectedBrand) params.push(`brand=${selectedBrand._id}`);
    if (selectedMinPrice !== undefined)
      params.push(`minPrice=${selectedMinPrice}`);
    if (selectedMaxPrice !== undefined)
      params.push(`maxPrice=${selectedMaxPrice}`);

    return params.length > 0 ? `?${params.join("&")}` : "";
  }, [selectedCategory, selectedBrand, selectedMinPrice, selectedMaxPrice]);

  const { isLoading: isLoadingProducts, data: productsList } = useQuery<
    Product[]
  >(["products-list", queryParams], () => getProducts(queryParams));

  const { data: brands, isLoading: isLoadingBrands } = useQuery<Brands>(
    ["brands"],
    getBrands,
  );

  const { data: categories, isLoading: isLoadingCategories } =
    useQuery<Categories>(["categories"], getCategories);

  const isLoading =
    isLoadingProducts ||
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingHighestPrice;

  const filteredProducts = useMemo(() => {
    if (!productsList) return [];
    return productsList.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [productsList, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

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
    (product: Product) => {
      const quantity = Number(quantities[product._id]) || 1;
      if (Number(product.countInStock) > 0) {
        dispatch(addItem({ ...product, countInStock: quantity }));
        setQuantities((prev) => ({ ...prev, [product._id]: "" }));
        toast.success("Cart Updated!");
      }
    },
    [dispatch, quantities],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategory((prev) =>
      prev?._id === category._id ? null : category,
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (brand: Brand) => {
    setSelectedBrand((prev) => (prev?._id === brand._id ? null : brand));
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setSelectedMinPrice(min);
    setSelectedMaxPrice(max);
    setCurrentPage(1);
  };

  const handleProductClick = (id: string) => {
    const path = generatePath(ROUTES.PRODUCT_DETAILS, { id });
    navigate(path);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
      />
      <section className="products-container">
        <Row className="p-0 m-0">
          <Col lg={3} className="p-0 sidebar-column">
            <div className="d-lg-none p-3 text-center border-bottom bg-white">
              <button
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                onClick={() => setIsMobileFilterOpen((prev) => !prev)}
                type="button"
              >
                <img src={assets.category} alt="filter" width={20} />
                <span>
                  {isMobileFilterOpen ? "Hide Filters" : "Filter Products"}
                </span>
              </button>
            </div>
            <div
              className={`sidebar-wrapper ${isMobileFilterOpen ? "is-open" : ""}`}
            >
              <div className="filters_menu">
                <img src={assets.category} alt="category" width={30} />
                <span className="filters_menu_title">Categories</span>
              </div>
              <Accordion
                defaultActiveKey={["0"]}
                alwaysOpen
                className="my-3 px-2"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="d-flex align-items-center">
                    <img
                      src={assets.rightward}
                      className="me-2"
                      alt="Toggle Arrow"
                    />
                    All Categories
                  </Accordion.Header>
                  <Accordion.Body className="ms-1">
                    <Accordion>
                      {categories?.categories?.map((category: Category) => (
                        <Accordion.Item
                          key={category._id}
                          eventKey={category._id}
                          className={
                            selectedCategory?._id === category._id
                              ? "selected-category"
                              : ""
                          }
                        >
                          <Accordion.Header
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryToggle(category);
                            }}
                            className="d-flex align-items-center"
                          >
                            <img
                              src={assets.rightward}
                              className="me-2"
                              alt="Toggle Arrow"
                            />
                            {category.name}
                          </Accordion.Header>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="filters_menu">
                <img src={assets.brand} alt="brand" width={30} />
                <span className="filters_menu_title">Brands</span>
              </div>
              <Accordion
                defaultActiveKey={["0"]}
                alwaysOpen
                className="my-3 px-2"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="d-flex align-items-center">
                    <img
                      src={assets.rightward}
                      className="me-2"
                      alt="Toggle Arrow"
                    />
                    All Brands
                  </Accordion.Header>
                  <Accordion.Body className="ms-1">
                    <Accordion>
                      {brands?.brands?.map((brand: Brand) => (
                        <Accordion.Item
                          key={brand._id}
                          eventKey={brand._id}
                          className={
                            selectedBrand?._id === brand._id
                              ? "selected-brand"
                              : ""
                          }
                        >
                          <Accordion.Header
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBrandToggle(brand);
                            }}
                            className="d-flex align-items-center"
                          >
                            <img
                              src={assets.rightward}
                              className="me-2"
                              alt="Toggle Arrow"
                            />
                            {brand.name}
                          </Accordion.Header>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="filters_menu">
                <img src={assets.coin} alt="coin" width={30} />
                <span className="filters_menu_title">Price</span>
              </div>
              <div className="my-3 px-2 pb-3">
                {highestPrice && selectedMaxPrice !== undefined && (
                  <PriceFilter
                    minPrice={0}
                    maxPrice={highestPrice.highestPrice}
                    selectedMinPrice={selectedMinPrice}
                    selectedMaxPrice={selectedMaxPrice}
                    onPriceChange={handlePriceChange}
                  />
                )}
              </div>
            </div>
          </Col>
          <Col lg={9} style={{ background: "#F1F1F1", position: "relative" }}>
            <p className="client-heading-p mt-3 mb-0">Our Products</p>
            <Row className="justify-content-center">
              {isLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 2,
                    background: "#F1F1F1",
                  }}
                >
                  <Loader />
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No products match your selected filters.</h5>
                </div>
              ) : (
                currentProducts.map((product: Product) => (
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

            <Pagination
              totalItems={filteredProducts ? filteredProducts.length : 0}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      </section>
      <Footer />
    </>
  );
};

export default ProductLanding;
