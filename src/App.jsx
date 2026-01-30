import './css/App.css'
import { ToastContainer } from 'react-toastify'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './pages/Auth/register'
import Login from './pages/User/login'
import Products from './pages/User/products'
import Productdetails from './pages/User/productdetails'
import Cart from './pages/User/cart'
import Checkout from './pages/User/checkout'
import Orders from './pages/User/orders'
import Navbar from './Navbar/navbar'
import ProtectedRoute from './Route/protectedroute'
import AdminPage from './pages/Admin/adminpage'
import AdminProducts from './pages/Admin/admin-products'
import AdminUsers from './pages/Admin/admin-users'
import EditProduct from './pages/Admin/admin-edit-product'
import Paymentpage from './pages/User/paymentpage'
import TrackOrder from './pages/User/trackorders'
import Unauthorized from './pages/Auth/Unauthirized'

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <>
     {!hideNavbar && <Navbar />}
        <ToastContainer position="bottom-center" autoClose={1000} />   
        <Routes>
        <Route path='/register' element={< Register />} />
        <Route path='/login' element={< Login />} />
        <Route path='/' element={< Products />} />
        <Route path='/products/:id' element={<Productdetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/orders' element={<Orders/>} /> 
        <Route path='/paymentpage' element={<Paymentpage/>}/>
        <Route path='//trackorders' element={<TrackOrder/>}/>
        <Route path="/unauthorized" element={<Unauthorized />} />
     
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
