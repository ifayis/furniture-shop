import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/css/Admin-Side//admin-edit-product.css";

import { getProductById, updateProduct } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);


  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const loadProductAndCategories = async () => {
      try {
        const [product, cats] = await Promise.all([
          getProductById(id),
          getAllCategories(),
        ]);

        setCategories(cats);

        setForm({
          name: product.name || "",
          category: product.categoryId || product.category || "",
          price: product.price ?? "",
          image: product.image || "",
          description: product.description || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadProductAndCategories();
  }, [id]);

  const handleUpdate = async () => {

    if (!form.name || !form.category || !form.price) {
      return;
    }

    try {

      const res = await updateProduct(id, {
        name: form.name,
        categoryId: form.category,
        price: Number(form.price),
        image: form.image,
        description: form.description,
      });

      navigate("/admin-products");
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err);
    }
  };

  return (
    <div className="product-edit-page">
      <div className="product-edit-card">
        {/* Header */}
        <div className="edit-header">
          <p className="pill-label">Admin · Edit Product</p>
          <h2 className="edit-title">Edit product</h2>
          <p className="edit-subtitle">
            Update product details and keep your LuxeLiving catalog fresh.
          </p>
        </div>

        <div className="edit-layout">
          {/* Form */}
          <div className="edit-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                className="form-input"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Image Url</label>
              <input
                className="form-input"
                placeholder="eg. chair1.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button type="button" className="primary-btn" onClick={handleUpdate}>
                Update Product
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="preview-panel">
            <h3 className="preview-title">Live preview</h3>
            <div className="preview-card">
              <div className="preview-image-wrapper">
                {form.image ? (
                  <img
                    src={`/images/${form.image}`}
                    alt={form.name || "Preview"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/product-placeholder.png";
                    }}
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span>No image selected</span>
                  </div>
                )}
              </div>
              <div className="preview-info">
                <h4>{form.name || "Product name"}</h4>
                <p className="preview-price">
                  {form.price
                    ? `₹${Number(form.price).toLocaleString()}`
                    : "Price"}
                </p>
                {form.category && (
                  <span className="preview-category">
                    {form.category}
                  </span>
                )}
                <p className="preview-description">
                  {form.description ||
                    "Product description will appear here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
