import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/admin-products.css'

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", image: "" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("https://furniture-shop-asjh.onrender.com/products")
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p.isActive !== false)));
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category || !form.image) {
      return;
    }

    const duplicate = products.find(p => p.name.toLowerCase() === form.name.toLowerCase());
    if (duplicate) {
      alert("Product with same name already exists");
      return;
    }

    const newProduct = { ...form, price: Number(form.price), isActive: true };
    await     fetch("https://furniture-shop-asjh.onrender.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    fetchProducts();
    setForm({ name: "", category: "", price: "", image: "", description: '' });
  };

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    await fetch(`https://furniture-shop-asjh.onrender.com/products${id}`
, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false })
    });

    fetchProducts();
  };

  const handleUpdate = (id) => {
    setEditingId(id);
    navigate(`/admin-edit-product/${id}`);
  };

  const filtered = products.filter(p => categoryFilter === "All" || p.category === categoryFilter);

  return (
    <div className="admin-products-container">
      <div className="admin-products-content">
        <div className="admin-header">
          <h2 className="admin-title">Manage Products</h2>
        </div>

        <div className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
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
              <label>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                placeholder="Enter image URL"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                rows="3"
                placeholder="Enter product description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            <button className="secondary-btn" onClick={() => navigate('/adminpage')}>
              Go Back
            </button>
          </div>
        </div>

        <div className="filter-section">
          <label>Filter by Category:</label>
          <select onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
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

        <div className="products-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={`/images/${p.image}`}
                  alt={p.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/product-placeholder.png'
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{p.name}</h3>
                <p className="product-price">${p.price.toLocaleString()}</p>
                <span className="product-category">{p.category}</span>
                <p className="product-description">{p.description}</p>
              </div>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => handleUpdate(p.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
