import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Shop from './components/Shop';
import Product from './components/Product';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import { AdminRequireAuth } from './components/admin/AdminRequireAuth';
import { default as ShowCategories } from './components/admin/category/Show';
import { default as CreateCategory } from './components/admin/category/Create';
import { default as EditCategory } from './components/admin/category/Edit';
import { default as ShowBrands } from './components/admin/brand/Show';
import { default as CreateBrand } from './components/admin/brand/Create';
import { default as EditBrand } from './components/admin/brand/Edit';
import { default as ShowProducts } from './components/admin/product/Show';
import { default as CreateProduct } from './components/admin/product/Create';
import { default as EditProduct } from './components/admin/product/Edit';
import { default as AccountRegister } from './components/Register';
import { default as AccountLogin } from './components/Login';
import { default as AccountProfile } from './components/front/Profile';
import { default as AccountOrders } from './components/front/Orders';
import { default as AccountOrderDetails } from './components/front/OrderDetails';
import { RequireAuth } from './components/RequireAuth';
import Confirmation from './components/Confirmation';
import { default as ShowOrders } from './components/admin/orders/Show';
import { default as OrderDetails } from './components/admin/orders/Details';
import Shipping from './components/admin/shipping/Shipping';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/shop' element={<Shop/>} />
          <Route path='/product/:id' element={<Product/>} />
          <Route path='/cart' element={<Cart/>} />

          <Route path='/register' element={<AccountRegister/>} />  
          <Route path='/login' element={<AccountLogin/>} />  

          <Route path='/profile' element={
            <RequireAuth>
              <AccountProfile/>
            </RequireAuth>
          } />  
          <Route path='/orders' element={
            <RequireAuth>
              <AccountOrders/>
            </RequireAuth>
          } />  
          <Route path='/orders/details/:id' element={
            <RequireAuth>
              <AccountOrderDetails/>
            </RequireAuth>
          } />  
          <Route path='/checkout' element={
            <RequireAuth>
              <Checkout/>
            </RequireAuth>
          } />  
          <Route path='/order/confirm/:id' element={
            <RequireAuth>
              <Confirmation/>
            </RequireAuth>
          } />  

          <Route path='/admin/login' element={<Login/>} />
          <Route path='/admin/dashboard' element={
            <AdminRequireAuth>
              <Dashboard/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategories/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategory/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategory/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands' element={
            <AdminRequireAuth>
              <ShowBrands/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands/create' element={
            <AdminRequireAuth>
              <CreateBrand/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands/edit/:id' element={
            <AdminRequireAuth>
              <EditBrand/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/products' element={
            <AdminRequireAuth>
              <ShowProducts/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/products/create' element={
            <AdminRequireAuth>
              <CreateProduct/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/products/edit/:id' element={
            <AdminRequireAuth>
              <EditProduct/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/orders' element={
            <AdminRequireAuth>
              <ShowOrders/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/orders/:id' element={
            <AdminRequireAuth>
              <OrderDetails/>
            </AdminRequireAuth>
          } />
          <Route path='/admin/shipping' element={
            <AdminRequireAuth>
              <Shipping/>
            </AdminRequireAuth>
          } />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
