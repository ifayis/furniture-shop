import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//productdetails.css";

import { getProductById, getAllProducts } from "@/api/productApi";

function Productdetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const loadRelated = async () => {
      try {
        const data = await getAllProducts();

        const related = data.filter(
          (p) =>
            p.isActive === true &&
            p.id !== product.id &&
            p.categoryId === product.categoryId
        );

        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    loadRelated();
  }, [product]);

  useEffect(() => {
    if (!id) return;
    const key = `reviews-${id}`;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setReviews(stored);
  }, [id]);

  const saveReviews = (updated) => {
    const key = `reviews-${id}`;
    setReviews(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const addCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Login to continue.");
      navigate("/login");
      return;
    }

    toast.info("Item added to cart");

    const key = `cart-${user.email}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem(key, JSON.stringify(cart));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.warning("Please add rating and comment");
      return;
    }

    let updated;
    if (editingId) {
      updated = reviews.map((r) =>
        r.id === editingId ? { ...r, rating, comment } : r
      );
      toast.success("Review updated");
    } else {
      const newReview = {
        id: Date.now(),
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      updated = [...reviews, newReview];
      toast.success("Review added");
    }

    saveReviews(updated);
    setRating(0);
    setComment("");
    setEditingId(null);
  };

  const handleEditReview = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDeleteReview = (reviewId) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    saveReviews(updated);
    toast.info("Review deleted");
  };

  if (!product) return <h2 className="loading-text">Loading product...</h2>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-inner">
          <div className="product-image-section">
            <img
              className="product-main-image"
              src={`/images/${product.image}`}
              alt={product.name}
            />
          </div>

          <div className="product-info-container">
            <h1 className="product-title">{product.name}</h1>

            <div className="price-category">
              <span className="product-price">
                ₹{product.price.toFixed(2)}
              </span>
            </div>

            <div className="quantity-row">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                max="10"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>

            <div className="action-buttons">
              <button className="primary-btn" onClick={addCart}>
                Add to Cart
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="related-products-section">
        <h2>Related Products</h2>

        {relatedProducts.length === 0 ? (
          <p>No related products available.</p>
        ) : (
          <div className="related-products-grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="related-product-card"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <img src={`/images/${p.image}`} alt={p.name} />
                <h3>{p.name}</h3>
                <p>₹{p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Productdetails;
