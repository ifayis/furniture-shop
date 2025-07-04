import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Products from './products'
import Productdetails from './pages/productdetails'
import Cart from './pages/cart'
import Checkout from './pages/checkout'
import Orders from './pages/orders'
import Navbar from './navbar'
import ProtectedRoute from './protectedroute'
import AdminPage from './pages/adminpage'
import AdminProducts from './pages/admin-products'
import AdminUsers from './pages/admin-users'
import EditProduct from './pages/admin-edit-product'


function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
     {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/register' element={< Register />} />
        <Route path='/login' element={< Login />} />
        <Route path='/' element={< Products />} />
        <Route path='/products/:id' element={<Productdetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/orders' element={<Orders/>} /> 
     
        <Route element={<ProtectedRoute role='admin' />}>
        <Route path='/adminpage' element={<AdminPage />} />
        <Route path='/admin-products' element={<AdminProducts />} />
        <Route path='/admin-users' element={<AdminUsers/>} />
        <Route path="/admin-edit-product/:id" element={<EditProduct />} />
        </Route>

     </Routes>
    </>
  )
}

export default App
