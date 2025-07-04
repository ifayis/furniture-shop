import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", image: "" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3001/products")
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p.isActive !== false)));
  };

  const handleAdd = async () => {
    if (!form.name || !form.price || !form.category || !form.image) {
      alert("Fill all fields");
      return;
    }

    const duplicate = products.find(p => p.name.toLowerCase() === form.name.toLowerCase());
    if (duplicate) {
      alert("Product with same name already exists");
      return;
    }

    const newProduct = { ...form, price: Number(form.price), isActive: true };
    await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct)
    });

    fetchProducts();
    setForm({ name: "", category: "", price: "", image: "", description:'' });
  };

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    await fetch(`http://localhost:3001/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false })
    });

    fetchProducts();
  };

  const handleUpdate = (id) => {
    navigate(`/admin-edit-product/${id}`);
  };

  const filtered = products.filter(p => categoryFilter === "All" || p.category === categoryFilter);

  return (
    <div className='acontainer' style={{backgroundColor:'white'}} >
    <div style={{ padding: "2rem" }}>
      <h2>Manage Products</h2>

      <div className='acontainer2' style={{ margin: "1rem 0" }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Price" type="number" min='0' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <textarea placeholder='Description' value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button className='btn' style={{width:'23%'}} onClick={handleAdd}>Add Product</button>
        <button className='btn' style={{width:'20%'}} onClick={ () => navigate('/adminpage')} >Go Back</button>

      </div>

      <select className='btn' onChange={e => setCategoryFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="chair">Chair</option>
        <option value="table">Table</option>
        <option value="sofa">Sofa</option>
        <option value="sheorack">Sheo Rack</option>
        <option value="teapoy">Teapoy</option>
        <option value="shelves">Shelves</option>
        <option value="almirah">almirah</option>
        <option value="bench">Bench</option>
      </select>

      <div>
        {filtered.map(p => (
          <div key={p.id} style={{ padding: "1rem", margin: "1rem", display:'inline-block'}}>
            <p><strong>{p.name} - ₹{p.price} - {p.category}</strong></p><br/>
            <img src={`/images/${p.image}`} width="120px" height="150px" alt={p.name} />
            <br />
            <button className='btn' onClick={() => handleUpdate(p.id)}>Edit</button>{'\u00A0'}{'\u00A0'}
            <button className='btn' onClick={() => handleDelete(p.id)}>Delete (Soft)</button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default AdminProducts;
