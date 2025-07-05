import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

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
    <div className='container2'>
      <img className='img2' src={`/images/${product.image}`} alt={product.name} />
      <div>
        <h1 className='pdn'>{product.name}</h1>
        <h3 className='pdc'><strong>PRICE: {product.price},</strong>  CATEGORY: {product.category}</h3>
        <p className='pdd'>{product.description || "No more description"}</p>
        <label className='pdq'>Quantity </label>
        <input className='qty' type='number' min='1' value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        <br /><br />
        <button className='pdbtn1' onClick={addCart}>ADD TO CART</button>
        <button className="cbtn2" onClick={() => navigate("/cart")}>CART</button>
      </div>
    </div>
  )
}

export default Productdetails;
