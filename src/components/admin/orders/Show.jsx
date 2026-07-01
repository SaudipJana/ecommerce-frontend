import { Link } from "react-router-dom";
import Layout from "../../common/Layout";
import Sidebar from "../../common/Sidebar";
import { adminToken, apiUrl } from "../../common/http";
import { useEffect, useState } from "react";
import Loader from './../../common/Loader';
import Nostate from "../../common/Nostate";

const Show = () => {
  const [loader, setLoader] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    setLoader(true);
    const res = await fetch(`${apiUrl}/orders`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`
      }
    }).then(res => res.json())
    .then(result => {
      setLoader(false);
      if(result.status == 200){
        setOrders(result.data);
      } else{
        console.log("Something went wrong")
      }
    })
  }

  useEffect(() => {
    fetchOrders();
  }, [])

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className="h4 pb-0 mb-0">Orders</h4>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow">
                          <div className="card-body p-4">
                            { loader && <Loader/> }
                            {
                              orders.length > 0 &&
                            
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    orders.map(order => {
                                      return(
                                        <tr key={`order-${order.id}`}>
                                          <td>#{order.id}</td>
                                          <td><Link to={`/admin/orders/${order.id}`}>{order.name}</Link></td>
                                          <td>{order.email}</td>
                                          <td>${order.grandtotal}</td>
                                          <td>{order.created_at}</td>
                                          <td>
                                            { order.payment_status == 'due' && <span className="badge text-bg-danger">Due</span> }
                                            { order.payment_status == 'paid' && <span className="badge text-bg-success">Paid</span> }
                                          </td>
                                          <td>
                                            { order.status == 'pending' && <span className="badge text-bg-warning">Pending</span> }
                                            { order.status == 'shipped' && <span className="badge text-bg-warning">Shipped</span> }
                                            { order.status == 'delivered' && <span className="badge text-bg-success">Delivered</span> }
                                            { order.status == 'cancelled' && <span className="badge text-bg-danger">Cancelled</span> }
                                          </td>
                                        </tr>
                                      )
                                    })
                                  }
                                  
                                </tbody>
                              </table>
                            }
                            { loader == false && orders.length == 0 && <Nostate text="Orders Not Found"/> }
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Show;
