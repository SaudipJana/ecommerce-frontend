import { useEffect, useState } from "react"
import Layout from "./common/Layout"
import { apiUrl, userToken } from "./common/http";
import { Link, useParams } from "react-router-dom";
import Loader from "./common/Loader";

const Confirmation = () => {
    const [order, setOrder] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    const fetchOrder = () => {
        fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
            }
        })
        .then(res => res.json())
        .then(result => {
            setLoading(false);
            if(result.status == 200){
                setOrder(result.data); 
                setItems(result.data.items)
            }
        });
    }

    useEffect(() => {
        fetchOrder();
    }, [])

  return (
    <Layout>
        <div className="container py-5">
            { loading  && <Loader/> }
            {
                loading == false && order.id &&
                <div>
                    <div className="row">
                        <h1 className="text-center fw-bold text-success">Thank You!</h1>
                        <p className="text-muted text-center">Your order has been placed successfully.</p>
                    </div>
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="fw-bold">Order Summery</h3>
                            <hr />
                            <div className="row">
                                <div className="col-6">
                                    <p><strong>Order ID:</strong> #{order.id}</p>
                                    <p><strong>Date:</strong> {order.created_at}</p>
                                    <p>
                                        <strong>Status:</strong>&nbsp;
                                        { order.status == 'pending' && <span className="badge bg-warning">Pending</span> }
                                        { order.status == 'shipped' && <span className="badge bg-warning">Shipped</span> }
                                        { order.status == 'delivered' && <span className="badge bg-success">Delivered</span> }
                                        { order.status == 'cancelled' && <span className="badge bg-danger">Cancelled</span> }
                                    </p>
                                    <p>
                                        <strong>Payment Method:</strong>&nbsp;
                                        {
                                            order.payment_method == 'stripe' && <span>Stripe</span>
                                        }
                                        {
                                            order.payment_method == 'cod' && <span>Cash on Delivery</span>
                                        }
                                    </p>
                                </div>
                                <div className="col-6">
                                    <p><strong>Customer:</strong> {order.name}</p>
                                    <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zip}</p>
                                    <p><strong>Contact:</strong> {order.mobile}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <table className="table table-striped table-bordered">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th width="150">Price</th>
                                                <th width="150">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                items && items.map(item => {
                                                    return(
                                                        <tr key={`item-${item.id}`}>
                                                            <td>{item.name}</td>
                                                            <td>{item.qty}</td>
                                                            <td>{item.unit_price}</td>
                                                            <td>${item.price}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="text-end fw-bold" colSpan={3}>Subtotal</td>
                                                <td>{order.subtotal}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-end fw-bold" colSpan={3}>Shipping</td>
                                                <td>{order.shipping}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-end fw-bold" colSpan={3}>Grandtotal</td>
                                                <td>{order.grandtotal}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="text-center">
                                    <Link to='' className="btn btn-primary me-2">View Order Details</Link>
                                    <Link to='/' className="btn btn-outline-secondary ms-2">Continue Shopping</Link>
                                </div>
                            </div>
                        </div>
                    </div>   
                </div>
            }
            {
                loading == false && order.id == null &&
                <div className="row">
                    <h1 className="text-center fw-bold text-muted">Order Not Found!</h1>
                </div>
            }
        </div>
    </Layout>
  )
}
export default Confirmation