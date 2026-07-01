import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Layout from "./common/Layout"
import ProductImg from '../assets/images/Mens/five.jpg';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiUrl } from './common/http';
import Product from './Product';


const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams([]);

  const fetchCategories = () => {
    fetch(`${apiUrl}/get-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        setCategories(result.data);
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const fetchBrands = () => {
    fetch(`${apiUrl}/get-brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        setBrands(result.data);
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const fetchProducts = () => {
    let search = [];
    let params = '';

    if(categoryChecked.length > 0){
      search.push(['category', categoryChecked]);
    }

    if(brandChecked.length > 0){
      search.push(['brand', brandChecked]);
    }

    if(search.length > 0){
      params = new URLSearchParams(search);
      setSearchParams(params);
    }else{
      setSearchParams([]);
    }

    fetch(`${apiUrl}/get-products?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
      }
    })
    .then(res => res.json())
    .then(result => {
      if(result.status == 200){
        setProducts(result.data);
      }else{
        console.log('Something went wrong');
      }
    })
  }

  const [categoryChecked, setCategoryChecked] = useState( () => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const [brandChecked, setBrandChecked] = useState( () => {
    const brand = searchParams.get('brand');
    return brand ? brand.split(',') : [];
  });

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    if(checked){
      setCategoryChecked(pre => [...pre, value]);
    }else{
      setCategoryChecked(categoryChecked.filter(id => id != value));
    }
  }

  const handleBrand = (e) => {
    const { checked, value } = e.target;
    if(checked){
      setBrandChecked(pre => [...pre, value]);
    }else{
      setBrandChecked(brandChecked.filter(id => id != value));
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, [categoryChecked, brandChecked])

  return (
    <>
      <Layout>
        <div className="container">
          <Breadcrumb className='py-4'>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Shop</Breadcrumb.Item>
          </Breadcrumb>
          <div className="row">
            <div className="col-md-3">
              <div className="card shadow border-0 mb-3">
                <div className="card-body p-4">
                  <h3 className='mb-3'>Categories</h3>
                  <ul>
                    {
                      categories && categories.map(category => {
                        return(
                          <li className='mb-2' key={`category-${category.id}`}>
                            <input type="checkbox" value={category.id} onClick={handleCategory} defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false }/>
                            <label htmlFor="" className='ps-2'>{category.name}</label>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
              <div className="card shadow border-0 mb-3">
                <div className="card-body p-4">
                  <h3 className='mb-3'>Brands</h3>
                  <ul>
                    {
                      brands && brands.map(brand => {
                        return(
                          <li className='mb-2' key={`brand-${brand.id}`}>
                            <input type="checkbox" value={brand.id} onClick={handleBrand} defaultChecked={searchParams.get('brand') ? searchParams.get('brand').includes(brand.id) : false }/>
                            <label htmlFor="" className='ps-2'>{brand.name}</label>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="row pb-3">
                {
                  products && products.map(product => {
                    return(
                      <div className='col-md-4 col-6' key={`product-${product.id}`}>
                        <div className='product card border-0'>
                            <div className='card-img'>
                                <Link to={`/product/${product.id}`}>
                                  <img src={product.image_url || 'https://placehold.co/400x460?text=image'} className='w-100'/>
                                </Link>
                            </div>
                            <div className='card-body pt-1'>
                                <Link to={`/product/${product.id}`}>{product.title}</Link>
                                <div className='price'>
                                    ${product.price} &nbsp;
                                    { product.compare_price && 
                                    <span className='text-decoration-line-through'>${product.compare_price}</span> }
                                </div>
                            </div>
                        </div>
                      </div>
                    )
                  })
                }

                
                
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Shop
