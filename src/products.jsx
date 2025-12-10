import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./css/products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://furniture-shop-asjh.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        const active = data.filter((p) => p.isActive !== false)
        const unique = Array.from(
          new Map(active.map((p) => [p.name, p])).values()
        )
        setProducts(unique)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filterProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category)
    )
    .sort((a, b) => {
      if (sort === "high") return b.price - a.price
      if (sort === "low") return a.price - b.price
      return 0
    })

  return (
    <div className="product-listing-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1>Transform Your Space with LUXLIVING</h1>
        <p>Premium Furniture. Timeless Style.</p>
      </div>

      {/* Search & Filters */}
      <div className="search-filter-container">
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search furniture..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="chair">Chairs</option>
            <option value="table">Tables</option>
            <option value="sofa">Sofas</option>
            <option value="sheorack">Racks</option>
            <option value="teapoy">Teapoys</option>
            <option value="bench">Benches</option>
            <option value="almirah">Almirahs</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="sort-select"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Posters */}
      <h4>Recommended interior designs for you</h4>
      <br />
      <div className="poster-row">
        <img src="/images/banner-sofa.jpg" alt="sofa" />
        <img src="/images/banner-table.webp" alt="table" />
        <img src="/images/banner-interior.jpeg" alt="interior" />
        <img src="/images/banner1.webp" alt="interior" />
        <img src="/images/banner2.webp" alt="interior" />
        <img src="/images/banner3.webp" alt="interior" />
        <img src="/images/banner4.jpeg" alt="interior" />
      </div>

      {/* Horizontal Product Scroll */}
      <div className="product-scroll">
        {loading ? (
          <p className="loading-text">
            Loading products
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        ) : (
          filterProducts.map((p) => (
            <div className="product-card" key={p.id}>
              <Link to={`/products/${p.id}`} className="product-link">
                <div className="product-image-container">
                  <img
                    className="product-image"
                    src={`/images/${p.image}`}
                    alt={p.name}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-price">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <h2>🎉 Mid-Year Mega Sale!</h2>
          <p>
            Get up to <span>40% OFF</span> on selected items. Hurry, limited
            stock!
          </p>
          <Link to="/" className="promo-btn">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 LuxeLiving. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Products
