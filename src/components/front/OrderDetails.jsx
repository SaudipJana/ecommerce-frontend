import { apiUrl, userToken } from "../common/http";
import Layout from "../common/Layout";
import UserSidebar from "../common/UserSidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import Nostate from "../common/Nostate";


const OrderDetails = () => {
    const [order, setOrder] = useState([]);
    const [loader, setLoader] = useState(null);
    const params = useParams();

    const fetchOrder = async () => {
        setLoader(true);
        const res = await fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken()}`
            }
        }).then(res => res.json())
        .then(result => {
            setLoader(false);
            if(result.status == 200){
            setOrder(result.data);
            } else{
                console.log("Something went wrong")
              }
        })
    }

    useEffect(() => {
        fetchOrder();
    }, [])

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className="h4 pb-0 mb-0">My Order Details</h4>
                    </div>
                    <div className="col-md-3">
                        <UserSidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            
                                <div className="card shadow mb-5">
                                    <div className="card-body p-4">
                                        { loader && <Loader/> } 
                                        {
                                            loader == false && order.id && 
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <h3>Order ID: #{order.id}</h3>
                                                        { order.status == 'pending' && <span className="badge text-bg-warning">Pending</span> }
                                                        { order.status == 'shipped' && <span className="badge text-bg-warning">Shipped</span> }
                                                        { order.status == 'delivered' && <span className="badge text-bg-success">Delivered</span> }
                                                        { order.status == 'cancelled' && <span className="badge text-bg-danger">Cancelled</span> }
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Date</div>
                                                        <h4 className="pt-2">{order.created_at}</h4>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Payment Status</div>
                                                        { order.payment_status == 'due' && <span className="badge text-bg-danger">Due</span> }
                                                        { order.payment_status == 'paid' && <span className="badge text-bg-success">Paid</span> }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="py-5">
                                                            <strong>{order.name}</strong>
                                                            <div>{order.email}</div>
                                                            <div>{order.mobile}</div>
                                                            <div>{order.address}, <br/>{order.city}, {order.state}, {order.zip}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary pt-5">Payment Method</div>
                                                        <h4 className="pt-2">Cash on Delivery</h4>
                                                    </div>
                                                    
                                                </div>
                                                <div className="row">
                                                    <h3 className="pb-2 "><strong>Items</strong></h3>
                                                    {
                                                        order.items && order.items.map(item => {
                                                            return(
                                                                <div className="row justify-content-end" key={`item-${item.id}`}>
                                                                    <div className="col-lg-12">
                                                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                            <div className="d-flex">
                                                                                <div>
                                                                                    <img width="70" className="me-3" 
                                                                                    src={item.product.image_url || 'https://placehold.co/70?text=img'} />
                                                                                </div>
                                                                                <div className="d-flex flex-column">
                                                                                    <div className="mb-2"><span>{item.name}</span></div>
                                                                                    <div>
                                                                                        {
                                                                                            item.size &&
                                                                                            <button className="btn btn-size">{item.size}</button>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex">
                                                                                <div>X {item.qty}</div>
                                                                                <div className="ps-3">${item.unit_price}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    
                                                    <div className="row justify-content-end">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div>Subtotal</div>
                                                                <div>${order.subtotal}</div>
                                                            </div>
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div>Shipping</div>
                                                                <div>${order.shipping}</div>
                                                            </div>
                                                            <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                <div><strong>Grand Total</strong></div>
                                                                <div>${order.grandtotal}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        { loader == false && order.id == null && <Nostate text="Order Details Not Found"/> }
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default OrderDetails;
