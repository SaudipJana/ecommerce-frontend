import { useEffect, useState } from 'react';
import ProductImg from '../../assets/images/Mens/eight.jpg';
import { apiUrl } from './http';
import { Link } from 'react-router-dom';

const LatestProduct = () => {
    const [latestProducts, setLatestProducts] = useState([]);

    const fetchLatestProducts = async () => {
        const res = await fetch(`${apiUrl}/get-latest-products`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
            setLatestProducts(result.data);
        })
    }

    useEffect(() => {
        fetchLatestProducts();
    }, []);

  return (
    <section className='section-2 pt-5'>
            <div className='container'>
                <h2>New Arrivals</h2>
                <div className='row mt-4'>
                    {
                        latestProducts && latestProducts.map( latestProduct => {
                            return(
                                <div className='col-md-3 col-6' key={`lp-${latestProduct.id}`}>
                                    <div className='product card border-0'>
                                        <div className='card-img'>
                                            <Link to={`/product/${latestProduct.id}`}>
                                                <img src={latestProduct.image_url} alt="" className='w-100'/>
                                            </Link>
                                        </div>
                                        <div className='card-body pt-1'>
                                            <Link to={`/product/${latestProduct.id}`}>{latestProduct.title}</Link>
                                            <div className='price'>
                                                {latestProduct.price} &nbsp;
                                                {
                                                    latestProduct.compare_price &&
                                                    <span className='text-decoration-line-through'>{latestProduct.compare_price}</span>
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
export default LatestProduct