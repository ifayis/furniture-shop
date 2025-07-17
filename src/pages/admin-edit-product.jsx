import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './admin-edit-product.css'

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description:''
  });

  useEffect(() => {
    fetch(`https://furniture-shop-asjh.onrender.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`https://furniture-shop-asjh.onrender.com/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    navigate("/admin-products");
  };

  return (
   <div className="product-edit-container">
  <div className="edit-header">
    <h2>Edit Product</h2>
  </div>

  <div className="edit-form">
    <div className="form-group">
      <label>Product Name</label>
      <input
        className="form-input"
        placeholder="Enter product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
    </div>

    <div className="form-group">
      <label>Category</label>
      <select
        className="form-input"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select a category</option>
        <option value="chair">Chair</option>
        <option value="table">Table</option>
        <option value="sofa">Sofa</option>
        <option value="sheorack">Shoe Rack</option>
        <option value="teapoy">Teapoy</option>
        <option value="shelves">Shelves</option>
        <option value="almirah">Almirah</option>
        <option value="bench">Bench</option>
      </select>
    </div>

    <div className="form-group">
      <label>Price (₹)</label>
      <input
        className="form-input"
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
    </div>

    <div className="form-group">
      <label>Image URL</label>
      <input
        className="form-input"
        placeholder="Enter image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        className="form-textarea"
        rows="4"
        placeholder="Enter product description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>

    <div className="form-actions">
      <button 
        className="update-btn"
        onClick={handleUpdate}
      >
        Update Product
      </button>
      <button 
        className="cancel-btn"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>
    </div>
  </div>
</div>
  );
}

export default EditProduct;
