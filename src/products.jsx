import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import './products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then(res => res.json())
      .then(data => {
        const active = data.filter(p=> p.isActive !== false)
        const unique = Array.from(new Map(active.map(p => [p.name, p])).values());
        setProducts(unique);
      })
  }, []);

  const filterProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) && (category === "All" || p.category === category)
    )
    .sort((a, b) => {
      if (sort === "high") return b.price - a.price;
      if (sort === "low") return a.price - b.price;
      return 0
    })

  return (
     <div className="product-listing-container">
  <header className="product-header">
    <nav className="product-nav">
      <img className="logo-img" src="./images/furniture.png" alt="Furniture Store Logo" />
    </nav>
    
    <div className="search-filter-container">
      <div className="search-container">
        <input
          className="search-input"
          placeholder="Search furniture..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="filter-controls">
        <div className="select-wrapper">
          <select className="filter-select" onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="chair">Chairs</option>
            <option value="table">Tables</option>
            <option value="sofa">Sofas</option>
            <option value="sheorack">Racks</option>
            <option value="teapoy">Teapoys</option>
            <option value="bench">Benches</option>
            <option value="almirah">Almirahs</option>
          </select>
          <span className="dropdown-icon">▼</span>
        </div>

        <div className="select-wrapper">
          <select className="sort-select" onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
          </select>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </div>
  </header>
  

  <div className="product-grid">
    {filterProducts.map(p => (
      <div className="product-card" key={p.id}>
        <Link to={`/products/${p.id}`} className="product-link">
          <div className="product-image-container">
            <img 
              className="product-image" 
              src={`/images/${p.image}`} 
              alt={p.name} 
              loading="lazy"
            />
            
          </div>
          <div className="product-info">
            <h3 className="product-name">{p.name}</h3>
            <p className="product-price">${p.price.toFixed(2)}</p>
          </div>
        </Link>
      </div>
    ))}
  </div>
</div>
  )
}

export default Products