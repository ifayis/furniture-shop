import { useParams, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "../css/productdetails.css"

function Productdetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

  // reviews
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()

  // Fetch single product
  useEffect(() => {
    fetch(`https://furniture-shop-asjh.onrender.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log("error fetching product: ", err))
  }, [id])

  // Fetch related products when product is loaded
  useEffect(() => {
    if (!product) return

    fetch("https://furniture-shop-asjh.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter(
          (p) =>
            p.isActive !== false &&
            p.id !== product.id &&
            p.category === product.category
        )
        setRelatedProducts(active.slice(0, 4)) // show max 4
      })
      .catch((err) => console.log("error fetching related products: ", err))
  }, [product])

  // Load reviews for this product from localStorage
  useEffect(() => {
    if (!id) return
    const key = `reviews-${id}`
    const stored = JSON.parse(localStorage.getItem(key)) || []
    setReviews(stored)
  }, [id])

  const saveReviews = (updated) => {
    const key = `reviews-${id}`
    setReviews(updated)
    localStorage.setItem(key, JSON.stringify(updated))
  }

  const addCart = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
      toast.warning("login to countinue.")
      navigate("/login")
      return
    } else {
      toast.info("item added to cart")
    }

    const key = `cart-${user.email}`
    const cart = JSON.parse(localStorage.getItem(key)) || []
    const existing = cart.find((item) => item.id === product.id)

    if (existing) {
      existing.qty += qty
    } else {
      cart.push({ ...product, qty })
    }

    localStorage.setItem(key, JSON.stringify(cart))
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!rating || !comment.trim()) {
      toast.warning("Please add rating and comment")
      return
    }

    let updated
    if (editingId) {
      updated = reviews.map((r) =>
        r.id === editingId ? { ...r, rating, comment } : r
      )
      toast.success("Review updated")
    } else {
      const newReview = {
        id: Date.now(),
        rating,
        comment,
        createdAt: new Date().toISOString(),
      }
      updated = [...reviews, newReview]
      toast.success("Review added")
    }

    saveReviews(updated)
    setRating(0)
    setComment("")
    setEditingId(null)
  }

  const handleEditReview = (review) => {
    setEditingId(review.id)
    setRating(review.rating)
    setComment(review.comment)
  }

  const handleDeleteReview = (reviewId) => {
    const updated = reviews.filter((r) => r.id !== reviewId)
    saveReviews(updated)
    toast.info("Review deleted")
  }

  if (!product) return <h2>loading...</h2>

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-inner">
          {/* Left - Main Image */}
          <div className="product-image-section">
            <img
              className="product-main-image"
              src={`/images/${product.image}`}
              alt={product.name}
              loading="eager"
            />
          </div>

          {/* Right - Info */}
          <div className="product-info-container">
            <h1 className="product-title">{product.name}</h1>

            <div className="price-category">
              <span className="product-price">
                ${product.price.toFixed(2)}
              </span>
              <span className="product-category">{product.category}</span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>
                {product.description || "No additional description available."}
              </p>
            </div>

            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="quantity-input"
              />
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={addCart}>
                <span>Add to Cart</span>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M6 2L3 6V20C3 21 4 22 5 22H19C20 22 21 21 21 20V6L18 2H6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M3 6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 10C16 11 15 12 14 13C13 14 12 14 11 14C10 14 9 14 8 13C7 12 7 11 7 10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>

              <button
                className="view-cart-btn"
                onClick={() => navigate("/cart")}
              >
                View Cart
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M9 20C9 21 10 22 11 22C12 22 13 21 13 20M9 20C9 19 10 18 11 18C12 18 13 19 13 20M9 20H3V4H6M13 20H21V4H14"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M6 4L6 1M14 4L14 1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M12 22C17 22 22 17 22 12C22 6 17 2 12 2C6 2 2 6 2 12C2 17 6 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 8V12L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Fast Delivery</span>
              </div>
              <div className="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22 12H18L15 21L9 3L6 12H2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="related-products-section">
        <h2>Related Products</h2>
        {relatedProducts.length === 0 ? (
          <p className="no-related-text">No related products available.</p>
        ) : (
          <div className="related-products-grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="related-product-card"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div className="related-image-wrapper">
                  <img
                    src={`/images/${p.image}`}
                    alt={p.name}
                    className="related-product-image"
                  />
                </div>
                <div className="related-info">
                  <h3>{p.name}</h3>
                  <p className="related-price">${p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        {/* Review Form */}
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="rating-input">
            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "star filled" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="comment-input">
            <label htmlFor="comment">Review</label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
            />
          </div>

          <button type="submit" className="submit-review-btn">
            {editingId ? "Update Review" : "Add Review"}
          </button>
        </form>

        {/* Review List */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews-text">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {Array.from({ length: 5 - r.rating }).map((_, i) => (
                      <span key={i} className="empty-star">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{r.comment}</p>
                <div className="review-actions">
                  <button
                    type="button"
                    className="review-edit-btn"
                    onClick={() => handleEditReview(r)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="review-delete-btn"
                    onClick={() => handleDeleteReview(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Productdetails
