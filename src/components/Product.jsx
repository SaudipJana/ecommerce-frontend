import Layout from "./common/Layout"
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useContext, useEffect, useState } from "react";
import { Rating } from 'react-simple-star-rating'
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "./common/http";
import { CartContext } from "./context/Cart";

const Product = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating, setRating] = useState(3);
    const [product, setProduct] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [sizeSelected, setSizeSelected] = useState(null);
    const params = useParams();
    const { addToCart } = useContext(CartContext);

    const fetchProduct = () => {
        fetch(`${apiUrl}/get-product/${params.id}`, {
          method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                'Accept': 'Application/json',
            }
        })
        .then(res => res.json())
        .then(result => {
          if(result.status == 200){
            setProduct(result.data);
            setProductImages(result.data.product_images);
            setProductSizes(result.data.product_sizes);
          }else{
            console.log('Something went wrong');
          }
        });
    }

    const handleAddToCart = () => {
        if(productSizes.length > 0){
            if(sizeSelected == null){
                toast.error("Please Select a Size");
            }else{
                addToCart(product, sizeSelected);
                toast.success("Product Added to Cart");
            }
        }else{
            addToCart(product, null);
            toast.success("Product Added to Cart");
        }

    }

    useEffect(() => {
        fetchProduct();
    }, [])
    
  return (
    <>
        <Layout>
           <div className="container product-details">
                <div className="row">
                    <div className="col-md-12">
                        <Breadcrumb className='py-4'>
                            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/shop" }}>Shop</Breadcrumb.Item>
                            <Breadcrumb.Item active>Product</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-md-2">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    onSwiper={setThumbsSwiper}
                                    watchSlidesProgress
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    direction={`vertical`}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper mt-2"
                                >
                                    {
                                        productImages && productImages.map(productImage => {
                                            return(
                                                <SwiperSlide key={`productImage-${productImage.id}`}>
                                                    <div className='content'>
                                                        <img 
                                                            src={productImage.image_url}
                                                            className='w-100' />
                                                    </div>                                                                      
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                </Swiper>
                            </div>
                            <div className="col-md-10">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    
                                    navigation={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    thumbs={{
                                        swiper: thumbsSwiper && !thumbsSwiper.destroyed
                                        ? thumbsSwiper
                                        : null,
                                    }}
                                    className="mySwiper2"
                                >
                                    {
                                        productImages && productImages.map(productImage => {
                                            
                                            return(
                                                <SwiperSlide key={`productImage-${productImage.id}`}>
                                                    <div className='content'>
                                                    <img 
                                                        src={productImage.image_url}
                                                        className='w-100' />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    }   
                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <h2>{product.title}</h2>
                        <div className="d-flex">
                            <Rating readonly initialValue={rating} size={20}/>
                            <span className="pt-1 ps-2">10 Reviews</span>
                        </div>
                        <div className="price h4 py-3">
                            ${product.price} &nbsp;
                            { product.compare_price && 
                            <span className='text-decoration-line-through'>${product.compare_price}</span> }
                        </div>
                        <div>{product.short_description}</div>
                        <div className="pt-3">
                            <strong>Select Size:</strong>
                            <div className="sizes pt-2">
                                {
                                    productSizes && productSizes.map(productSize => {
                                        return(
                                            <button className={`btn btn-size me-2 ${sizeSelected == productSize.size.name ? 'active' : ''}`}
                                            onClick={() => setSizeSelected(productSize.size.name)}
                                            key={`productSize-${productSize.size.id}`}>
                                                {productSize.size.name}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="add-to-cart my-4">
                            <button onClick={() => handleAddToCart()} 
                            className="btn btn-primary text-uppercase">Add to Cart</button>
                        </div>
                        <hr />
                        <div>
                            <strong>SKU: </strong>
                            {product.sku}
                        </div>
                    </div>
                </div>
                <div className="row pb-5">
                    <div className="col-md-12">
                        <Tabs
                            defaultActiveKey="description"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="description" title="Description" className="ps-3">
                                <div dangerouslySetInnerHTML={{ __html: product.description }}
  />
                            </Tab>
                            <Tab eventKey="reviews" title="Reviews (10)" className="ps-3">
                                Tab content for Profile
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    </>
  )
}
export default Product