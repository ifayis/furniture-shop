import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import './productdetails.css'

function Productdetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log("error fetching product: ", err))
  }, [id]);

  const addCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Kindly login first");
      navigate("/register");
      return;
    }

    const key = `cart-${user.email}`;
    const cart = JSON.parse(localStorage.getItem(key)) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    alert("Added to cart");
  };
  if (!product) return <h2>loading...</h2>

  return (
    // <div className='container2'>
    //   <img className='img2' src={`/images/${product.image}`} alt={product.name} />
    //   <div>
    //     <h1 className='pdn'>{product.name}</h1>
    //     <h3 className='pdc'><strong>PRICE: {product.price},</strong>  CATEGORY: {product.category}</h3>
    //     <p className='pdd'>{product.description || "No more description"}</p>
    //     <label className='pdq'>Quantity </label>
    //     <input className='qty' type='number' min='1' value={qty} onChange={(e) => setQty(Number(e.target.value))} />
    //     <br /><br />
    //     <button className='pdbtn1' onClick={addCart}>ADD TO CART</button>
    //     <button className="cbtn2" onClick={() => navigate("/cart")}>CART</button>
    //   </div>
    // </div>

    <div className="product-detail-container">
      <div>
    <img 
      className="product-main-image" 
      src={`/images/${product.image}`} 
      alt={product.name} 
      loading="eager"  // Important image, load immediately
      width="600"
      height="600"
    />
    <div className="image-thumbnails">
      {/* Add thumbnail images here if available */}
    </div>
  </div>

  <div className="product-info-container">
    <h1 className="product-title">{product.name}</h1>
    
    <div className="price-category">
      <span className="product-price">${product.price.toFixed(2)}</span>
      <span className="product-category">{product.category}</span>
    </div>

    <div className="product-description">
      <h3>Description</h3>
      <p>{product.description || "No additional description available."}</p>
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="view-cart-btn" onClick={() => navigate("/cart")}>
        View Cart
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 20C9 20.5304 9.21071 21.0391 9.58579 21.4142C9.96086 21.7893 10.4696 22 11 22C11.5304 22 12.0391 21.7893 12.4142 21.4142C12.7893 21.0391 13 20.5304 13 20M9 20C9 19.4696 9.21071 18.9609 9.58579 18.5858C9.96086 18.2107 10.4696 18 11 18C11.5304 18 12.0391 18.2107 12.4142 18.5858C12.7893 18.9609 13 19.4696 13 20M9 20H3V4H6M13 20H21V4H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 4L6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 4L14 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>

    <div className="product-meta">
      <div className="meta-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Fast Delivery</span>
      </div>
      <div className="meta-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Quality Guarantee</span>
      </div>
    </div>
  </div>
</div>
  )
}

export default Productdetails;
