import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    fetch(`http://localhost:3001/products/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });

    alert("Product updated successfully!");
    navigate("/admin-products");
  };

  return (
    <div className="acontainer4" style={{ padding: "2rem" }}>
      <h2>Edit Product</h2>
      <br/>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <br />
      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <br />
      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      <br />
      <textarea
        placeholder="description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <br/>
      <button className="btn1" onClick={handleUpdate}>Update Product</button>
    </div>
  );
}

export default EditProduct;
