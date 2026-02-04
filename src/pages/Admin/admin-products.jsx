import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/Admin-Side//admin-products.css";

import {
  getAllProducts,
  addProduct,
  activateProduct,
  deactivateProduct,
  deleteProduct,
} from "@/api/productApi";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category || !form.image) return;

    const duplicate = products.find(
      (p) => p.name.toLowerCase() === form.name.toLowerCase()
    );
    if (duplicate) {
      alert("Product with same name already exists");
      return;
    }

    try {
      await addProduct({
        ...form,
        price: Number(form.price),
      });

      await loadProducts();
      setForm({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Add product failed", err);
    }
  };

  const handleToggleVisibility = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      if (product.isActive === false) {
        await activateProduct(id);
      } else {
        await deactivateProduct(id);
      }
      await loadProducts();
    } catch (err) {
      console.error("Toggle visibility failed", err);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = (id) => {
    setEditingId(id);
    navigate(`/admin-edit-product/${id}`);
  };

  const filtered = products.filter(
    (p) => categoryFilter === "All" || p.category === categoryFilter
  );

  const activeCount = products.filter((p) => p.isActive !== false).length;

  return (
    <div className="admin-products-container">
      <div className="admin-products-content">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h2 className="admin-title">Product Management</h2>
            <p className="admin-subtitle">
              Add, edit, hide or unhide products in your LuxeLiving catalog.
            </p>
          </div>
          <div className="admin-badge">
            Active: <span>{activeCount}</span> / {products.length}
          </div>
        </div>

        {/* Form */}
        <div className="product-form">
          <div className="form-title-row">
            <h3 className="section-title">Add / Update Product</h3>
            <span className="section-hint">
              Fill in the details and click{" "}
              {editingId ? "Update Product" : "Add Product"}.
            </span>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
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
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Image Name</label>
              <input
                type="text"
                placeholder="eg. chair1.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                rows="3"
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>
              {editingId ? "Update Product" : "Add Product"}
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/adminpage")}
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <label>Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
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

        {/* Product Grid */}
        <div className="products-grid">
          {filtered.map((p) => {
            const isHidden = p.isActive === false;
            return (
              <div key={p.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={`/images/${p.image}`}
                    alt={p.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/product-placeholder.png";
                    }}
                  />
                </div>
                <div className="product-info">
                  <div className="product-header-row">
                    <h3>{p.name}</h3>
                    <span className="product-price">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="product-meta-row">
                    <span className="product-category">{p.category}</span>
                    <span
                      className={`status-pill ${isHidden ? "status-hidden" : "status-active"
                        }`}
                    >
                      {isHidden ? "Hidden" : "Visible"}
                    </span>
                  </div>

                  <p className="product-description">
                    {p.description || "No description provided."}
                  </p>
                </div>

                <div className="product-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleUpdate(p.id)}
                  >
                    Edit
                  </button>

                  <button
                    className={`toggle-btn ${isHidden ? "toggle-unhide" : "toggle-hide"}`}
                    onClick={() => handleToggleVisibility(p.id)}
                  >
                    {isHidden ? "Unhide" : "Hide"}
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    className="delete-icon-btn"
                    onClick={() => handlePermanentDelete(p.id)}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="no-products-text">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
