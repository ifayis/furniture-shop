import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

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
      <div className="container3">
         <nav className="heading">
          <img className="h1" src="./images/furniture.png" alt="furniture" />
          {/* <Link to='/cart'className="img1" ><img src="./images/carticon.png"/></Link> */}
         </nav>

        <input
          className="search"
          placeholder="search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="filter" onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="chair">CHAIRS</option>
          <option value="table">TABLES</option>
          <option value="sofa">SOFAS</option>
          <option value="sheorack">RACKS</option>
          <option value="teapoy">TEAPOYS</option>
          <option value="bench">BENCHES</option>
          <option value="almirah">ALMIRAS</option>
        </select>

        <select className="sort" onChange={(e) => setSort(e.target.value)}>
          <option value="">sort by</option>
          <option value="high">high to low</option>
          <option value="low">low to high</option>
        </select>

        <div className="pcol">
          {filterProducts.map(p => (
            <div className="pd" key={p.id}>
              <Link to={`/products/${p.id}`}>
                <img className="img" src={`/images/${p.image}`} alt={p.name} width="100%" />
                <h4 className="h4">{p.name}</h4>
              </Link>
            </div>
          ))}
        </div>
      </div>
  )
}

export default Products