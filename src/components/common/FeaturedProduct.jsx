import { useEffect, useState } from 'react';
import ProductImg from '../../assets/images/Mens/eleven.jpg'
import { apiUrl } from './http';
import { Link } from 'react-router-dom';


const FeaturedProduct = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const fetchFeaturedProducts = async () => {
            const res = await fetch(`${apiUrl}/get-featured-products`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            })
            .then(res => res.json())
            .then(result => {
                setFeaturedProducts(result.data);
            })
        }
    
        useEffect(() => {
            fetchFeaturedProducts();
        }, []);

  return (
    <section className='section-2 pt-5'>
                <div className='container'>
                    <h2>Featured Products</h2>
                    <div className='row mt-4'>
                        {
                            featuredProducts && featuredProducts.map( featuredProduct => {
                                return(
                                    <div className='col-md-3 col-6' key={`fp-${featuredProduct.id}`}>
                                        <div className='product card border-0'>
                                            <div className='card-img'>
                                                <Link to={`/product/${featuredProduct.id}`}>
                                                    <img src={featuredProduct.image_url} alt="" className='w-100'/>
                                                </Link>
                                            </div>
                                            <div className='card-body pt-1'>
                                                <Link to={`/product/${featuredProduct.id}`}>{featuredProduct.title}</Link>
                                                <div className='price'>
                                                    {featuredProduct.price} &nbsp;
                                                    {
                                                        featuredProduct.compare_price &&
                                                        <span className='text-decoration-line-through'>{featuredProduct.compare_price}</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }                        
                    </div>
                </div>
            </section>
  )
}
export default FeaturedProduct