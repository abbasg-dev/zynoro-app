import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Form, Card, Row, Col, Image, Button } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { ToastContainer, toast } from "react-toastify";
import {
  PencilSquare,
  Trash,
  SendFill,
  HandThumbsUpFill,
  HandThumbsDownFill,
  PlusLg,
} from "react-bootstrap-icons";
import "react-toastify/dist/ReactToastify.css";

import GallerySlider from "components/gallery-slider/gallery-slider.component";
import Loader from "components/loader/loader.component";
import CustomBreadcrumb from "components/custom-breadcrumb/custom-breadcrumb.component";
import SlickCarousel from "components/slick-carousel/slick-carousel.component";

import { Product } from "interfaces/products.model";
import { Rate } from "interfaces/review.model";
import { Brand } from "interfaces/brands.model";
import { AxiosError } from "interfaces/errors.model";
import { addItem } from "store/slices/cartSlice";

import { getBrandById } from "api/services/brands.services";
import { getProduct } from "api/services/products.services";
import {
  getReviews,
  createReview,
  getReviewByUser,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
} from "api/services/reviews.services";
import {
  getUserInfo,
  formatCurrency,
  dateFormatterWithTime,
} from "helpers/global";
import * as ROUTES from "constants/routes";
import assets from "assets";
import "./product-details.scss";

type ProductDetailsProps = {
  product?: Product;
  refetchProduct?: () => void;
  refetchRating?: () => void;
};

const EMPTY_REVIEW = {
  _id: "",
  user: "",
  rating: 0,
  comment: "",
  likes: [],
  dislikes: [],
  createdAt: "",
  updatedAt: "",
};

const ProductDetails = (props: ProductDetailsProps) => {
  const queryClient = useQueryClient();
  const { id: paramProductId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = getUserInfo();

  const { refetchProduct, refetchRating } = props;

  const { data: fetchedProductData, isLoading: isLoadingFetchedProduct } =
    useQuery(
      ["product", paramProductId],
      () => getProduct(paramProductId as string),
      { enabled: !!paramProductId && !props.product },
    );

  const product = props.product || fetchedProductData?.product;
  const productId = product?._id;

  const [loading, setLoading] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);

  const brandId =
    typeof product?.brand === "object"
      ? (product.brand as Brand)?._id
      : product?.brand || "";

  const { isLoading: isLoadingBrand, data: fetchedBrand } = useQuery<Brand>({
    queryKey: [brandId],
    queryFn: async (context) => {
      const id = context.queryKey[0];
      return getBrandById(id as any);
    },
    enabled: brandId !== "",
  });

  const brandName =
    typeof product?.brand === "object"
      ? (product.brand as Brand)?.name
      : fetchedBrand?.name;

  const { isLoading: isLoadingReviews, data: reviewsData } = useQuery({
    queryKey: [productId],
    queryFn: () => getReviews(productId as string),
    enabled: !!productId,
  });

  const reviews: Rate[] = reviewsData?.reviews || reviewsData || [];

  const methods = useForm<Product>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      reviews: [EMPTY_REVIEW],
    },
  });

  const { control, handleSubmit, watch, setValue, getValues, register } =
    methods;

  useEffect(() => {
    setLoading(isLoadingFetchedProduct || isLoadingBrand || isLoadingReviews);
  }, [isLoadingFetchedProduct, isLoadingBrand, isLoadingReviews]);

  const breadcrumbItems = [
    {
      label: !loading ? "Home" : "",
      onClick: () => navigate(ROUTES.PRODUCTS, { state: null, replace: true }),
    },
    {
      label: product?.name,
    },
  ].filter((item) => item.label);

  const notifications = [
    { icon: assets.car, message: "Free Delivery" },
    { icon: assets.sellOut, message: "Selling out Fast" },
  ];

  const onAddItem = useCallback(
    (prod: Product) => {
      const quantity = Number(quantities[prod._id]) || 1;
      if (Number(prod.countInStock) > 0) {
        dispatch(addItem({ ...prod, countInStock: quantity }));
        setQuantities((prev) => ({ ...prev, [prod._id]: "" }));
        toast.success("Cart Updated!");
      }
    },
    [dispatch, quantities],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, prodId: string) => {
      const value = event.target.value;
      setQuantities((prev) => ({
        ...prev,
        [prodId]: value.trim() === "" || isNaN(Number(value)) ? "" : value,
      }));
    },
    [],
  );

  const refreshReviewsAndRatings = () => {
    queryClient.invalidateQueries([productId]);
    refetchProduct?.();
    refetchRating?.();
  };

  const getReviewFunc = useMutation(getReviewByUser, {
    onSuccess: (response: any) => {
      const defaultReview = {
        _id: response?.review?._id || response?._id || "",
        user:
          response?.review?.user ||
          response?.user ||
          authUser?.id ||
          authUser?._id ||
          "",
        rating: response?.review?.rating ?? response?.rating ?? 0,
        comment: response?.review?.comment ?? response?.comment ?? "",
        likes: response?.review?.likes ?? response?.likes ?? [],
        dislikes: response?.review?.dislikes ?? response?.dislikes ?? [],
        createdAt: response?.review?.createdAt ?? response?.createdAt ?? "",
        updatedAt: response?.review?.updatedAt ?? response?.updatedAt ?? "",
      };
      setValue("reviews", [defaultReview]);
    },
    onError: () => {
      setValue("reviews", [EMPTY_REVIEW]);
    },
  });

  const deleteReviewFunc = useMutation(deleteReview, {
    onSuccess: (response: any) => {
      setValue("reviews", [EMPTY_REVIEW]);
      setIsEditingReview(false);
      toast.success(response?.message || "Review deleted successfully");
      refreshReviewsAndRatings();
    },
    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete review",
      );
    },
  });

  const addReviewFunc = useMutation(createReview, {
    onSuccess: (response: any) => {
      toast.success(response?.message || "Review submitted successfully!");
      setIsEditingReview(false);
      refreshReviewsAndRatings();
      if (productId) getReviewFunc.mutate(productId);
    },
    onError(error: AxiosError<{ message?: string; error?: string }>) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit review";
      toast.error(errorMessage);
    },
  });

  const updateReviewFunc = useMutation(updateReview, {
    onSuccess: (response: any) => {
      toast.success(response?.message || "Review updated successfully");
      setIsEditingReview(false);
      refreshReviewsAndRatings();
    },
    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update review",
      );
    },
  });

  const likeMutation = useMutation(likeReview, {
    onSuccess: () => queryClient.invalidateQueries([productId]),
  });

  const dislikeMutation = useMutation(dislikeReview, {
    onSuccess: () => queryClient.invalidateQueries([productId]),
  });

  const handleToggleLike = (reviewId: string) => {
    if (!productId || !authUser) {
      toast.info("Please sign in to rate reviews.");
      return;
    }
    likeMutation.mutate({ productId, reviewId });
  };

  const handleToggleDislike = (reviewId: string) => {
    if (!productId || !authUser) {
      toast.info("Please sign in to rate reviews.");
      return;
    }
    dislikeMutation.mutate({ productId, reviewId });
  };

  const submitAddReview = (data: Product) => {
    const review = data.reviews?.[0];
    if (!review || !productId || !authUser) return;

    addReviewFunc.mutate({
      productId,
      rating: review.rating ?? 0,
      comment: review.comment ?? "",
    });
  };

  const submitUpdateReview = () => {
    const currentReviews = getValues("reviews");
    if (productId && currentReviews && currentReviews.length > 0) {
      updateReviewFunc.mutate({
        productId,
        reviewId: currentReviews[0]._id,
        data: currentReviews[0],
      });
    }
  };

  const onSubmit = (data: any) => {
    const existingReviewId = getValues("reviews")?.[0]?._id;

    if (existingReviewId && existingReviewId !== "") {
      submitUpdateReview();
    } else {
      submitAddReview(data);
    }
  };

  const onDeleteReview = () => {
    const currentReviewId = getValues("reviews")?.[0]?._id;
    if (productId && currentReviewId) {
      deleteReviewFunc.mutate({
        productId,
        reviewId: currentReviewId,
      });
    }
  };

  useEffect(
    () => {
      const authUserId = authUser?._id || authUser?.id;
      if (productId && authUserId && !getReviewFunc.isLoading) {
        const currentReviewId = getValues("reviews.0._id");
        if (!currentReviewId) {
          getReviewFunc.mutate(productId);
        }
      }
    },
    // eslint-disable-next-line
    [productId, authUser?._id, authUser?.id],
  );

  const userExistingReviewId = watch("reviews.0._id");

  const getReviewMetaData = (item: Rate) => {
    const userObj =
      typeof item.user === "object" && item.user !== null
        ? (item.user as unknown as {
            _id?: string;
            username?: string;
            displayName?: string;
            photoURL?: string;
          })
        : null;

    const reviewUserId =
      userObj?._id || (typeof item.user === "string" ? item.user : "");
    const currentUserId = authUser?._id || authUser?.id || "";

    const isOwner = Boolean(
      (currentUserId &&
        reviewUserId &&
        String(currentUserId) === String(reviewUserId)) ||
      item.isOwner,
    );

    const isLiked = Boolean(
      item.isLiked ||
      (currentUserId &&
        item.likes?.some((id) => String(id) === String(currentUserId))),
    );

    const isDisliked = Boolean(
      item.isDisliked ||
      (currentUserId &&
        item.dislikes?.some((id) => String(id) === String(currentUserId))),
    );

    const userName = userObj?.displayName || userObj?.username || "Anonymous";
    const userAvatar = userObj?.photoURL || assets.user;
    const likesCount = item.likes?.length || 0;
    const dislikesCount = item.dislikes?.length || 0;

    return {
      userName,
      userAvatar,
      isOwner,
      isLiked,
      isDisliked,
      likesCount,
      dislikesCount,
    };
  };

  return (
    <>
      <ToastContainer />
      <div className="product-details-container">
        <CustomBreadcrumb items={breadcrumbItems} />
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="text-center">
              <Loader />
            </div>
          </div>
        ) : (
          <Row className="p_info mt-4">
            <Col lg={6} className="align-content-center">
              <Controller
                name="images"
                control={control}
                defaultValue={[]}
                render={() => (
                  <GallerySlider
                    images={product?.images || [product?.image || ""]}
                  />
                )}
              />
            </Col>
            <Col lg={6}>
              <div className="p_info_brand">{brandName}</div>
              <h1 className="p_info_name">{product?.name}</h1>
              <div className="d-flex align-items-center">
                <div className="d-flex gap-2 align-items-center mt-3">
                  <span className="p_info_rate">{product?.rating}</span>
                  <Rating
                    initialValue={product?.rating}
                    allowFraction
                    readonly
                    size={20}
                    fillColor={"#80AE04"}
                  />
                  <span className="p_info_reviews_num">
                    {product?.numReviews} Ratings
                  </span>
                </div>
                <div className="p_info_statistics mt-auto ps-4">
                  {product?.orderCount || 0} Sold
                </div>
              </div>
              <div className="p_info_price">
                <div>{formatCurrency(product?.priceAfterDiscount || 0)}</div>
                <div>{formatCurrency(product?.originalPrice || 0)}</div>
                <div className="p_info_price_vat">Inclusive of VAT</div>
              </div>
              <div className="p_info_saving">
                <div>
                  <span className="saving-text">Saving:</span>{" "}
                  <span className="saving-amount">
                    {formatCurrency(
                      Number(product?.originalPrice || 0) -
                        Number(product?.priceAfterDiscount || 0),
                    )}
                  </span>
                </div>
                <div className="discount-info">{product?.discount}% Off</div>
              </div>
              <div className="p_info_stock">
                {Number(product?.countInStock) > 0
                  ? "In stock"
                  : "Not available"}
              </div>
              <div className="p_info_details">
                <h3>
                  Size: <strong>{product?.sizes?.join(", ")}</strong>
                </h3>
                <h3>
                  Weight: <strong>{product?.weight?.join(", ")}</strong>
                </h3>
                <h3>
                  RAM: <strong>{product?.ram?.join(", ")}</strong>
                </h3>
                <h3>
                  Color: <strong>{product?.color?.join(", ")}</strong>
                </h3>
              </div>
              <div className="p_info_power">
                <div className="p_info_power_sale">Power Sale</div>
                <SlickCarousel
                  notifications={notifications?.map((item, index) => (
                    <div className="notification" key={index}>
                      <img src={item.icon} alt="icon" /> {item.message}
                    </div>
                  ))}
                />
              </div>
              <div className="p_info_ship_info mt-4">
                <img src={assets?.express} alt={"express"} />
                {product?.shippingInfo}
              </div>
              {product?.returnable && (
                <div className="p_info_policy">
                  <img src={assets.returnIcn} alt={"returnIcn"} />
                  Can be returned within {product?.returnPeriod} of purchase.
                </div>
              )}
              <div className="actions d-flex align-items-center">
                <input
                  type="number"
                  min="1"
                  className="quantity-input"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (product) {
                      handleChange(e, product._id);
                    }
                  }}
                  value={(product && quantities?.[product._id]) || ""}
                />
                <button
                  className="add-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product) onAddItem(product);
                  }}
                >
                  + ADD TO CART
                </button>
              </div>
            </Col>

            <Row className="mt-5">
              <h3 className="p_overview">Product Overview</h3>
              <Col lg={6}>
                <span className="p_info_title">Highlights</span>
                <ul className="p_info_description">
                  {product?.description?.split("\n").map((item, index) => (
                    <li key={index} className="mb-0">
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col lg={6}>
                <span className="p_info_title">Specifications</span>
                <div
                  className="p_info_rich_description"
                  dangerouslySetInnerHTML={{
                    __html: (product?.richDescription as string) || "",
                  }}
                />
              </Col>
            </Row>

            <Col xs={12} className="reviews-section">
              <div className="reviews-header">
                <h3 className="p_overview">Product Ratings & Reviews</h3>
                {authUser && !userExistingReviewId && !isEditingReview && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-flex align-items-center gap-2 rounded-2 fw-semibold px-3"
                    onClick={() => setIsEditingReview(true)}
                  >
                    <PlusLg size={13} /> Write a Review
                  </Button>
                )}
              </div>

              {reviews.length > 0 ? (
                reviews.map((item: Rate) => {
                  const {
                    userName,
                    userAvatar,
                    isOwner,
                    likesCount,
                    dislikesCount,
                    isLiked,
                    isDisliked,
                  } = getReviewMetaData(item);

                  return (
                    <Card key={item._id} className="review-card mb-3">
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <Image
                              src={userAvatar}
                              className="review-user-avatar"
                              alt={userName}
                            />
                            <div>
                              <div className="review-user-name">{userName}</div>
                              <div className="review-timestamp">
                                {dateFormatterWithTime(item?.createdAt)}
                              </div>
                            </div>
                          </div>

                          <Rating
                            initialValue={item?.rating || 0}
                            readonly
                            allowFraction
                            size={18}
                            fillColor="#FFA439"
                          />
                        </div>

                        <p className="review-body-text">{item?.comment}</p>
                        {authUser && (
                          <div className="review-card-footer">
                            <div className="like-dislike-group">
                              <button
                                type="button"
                                className={`action-pill-btn ${isLiked ? "active-like" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (item._id) handleToggleLike(item._id);
                                }}
                              >
                                <HandThumbsUpFill size={13} /> {likesCount}
                              </button>
                              <button
                                type="button"
                                className={`action-pill-btn ${isDisliked ? "active-dislike" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (item._id) handleToggleDislike(item._id);
                                }}
                              >
                                <HandThumbsDownFill size={13} /> {dislikesCount}
                              </button>
                            </div>

                            {authUser && isOwner && (
                              <div className="owner-control-group">
                                <button
                                  type="button"
                                  className="btn-link-action edit-action"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingReview(true);
                                  }}
                                >
                                  <PencilSquare size={14} /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn-link-action delete-action"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteReview();
                                  }}
                                  disabled={deleteReviewFunc.isLoading}
                                >
                                  <Trash size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  );
                })
              ) : (
                <Card className="border-0 shadow-sm text-center py-5 my-3 rounded-3 bg-light">
                  <Card.Body>
                    <p className="text-muted mb-2 fw-medium fs-6">
                      There are no reviews for this product yet.
                    </p>
                    <p className="text-secondary small mb-3">
                      Be the first to share your thoughts with other customers!
                    </p>
                  </Card.Body>
                </Card>
              )}

              {authUser && isEditingReview && (
                <FormProvider {...methods}>
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className="review-form-card mt-3"
                  >
                    <div className="form-heading">
                      {userExistingReviewId
                        ? "Edit Your Review"
                        : "Write a Review"}
                    </div>
                    <input className="d-none" {...register("reviews.0._id")} />

                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                      <Form.Label className="text-muted small mb-0 me-2">
                        Your Rating:
                      </Form.Label>
                      <Controller
                        name="reviews.0.rating"
                        control={control}
                        render={({ field }) => (
                          <Rating
                            key={field.value ?? 0}
                            initialValue={field.value ?? 0}
                            onClick={field.onChange}
                            allowFraction
                            size={22}
                            fillColor="#FFA439"
                          />
                        )}
                      />
                    </Form.Group>

                    <Form.Group controlId="comment" className="mb-3">
                      <Controller
                        name="reviews.0.comment"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write your detailed review here..."
                            className="review-textarea-custom"
                            {...field}
                          />
                        )}
                      />
                    </Form.Group>

                    <div className="form-action-row">
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        className="px-3"
                        onClick={() => setIsEditingReview(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="px-3 d-flex align-items-center gap-2"
                        disabled={
                          addReviewFunc.isLoading || updateReviewFunc.isLoading
                        }
                      >
                        <SendFill size={12} />
                        {userExistingReviewId
                          ? "Update Review"
                          : "Submit Review"}
                      </Button>
                    </div>
                  </Form>
                </FormProvider>
              )}
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
