import { Breadcrumb } from "react-bootstrap"
import Layout from "./common/Layout"
import { Link, useNavigate } from "react-router-dom"
import ProductImg from '../assets/images/Mens/five.jpg'
import { useContext, useState } from "react"
import { CartContext } from "./context/Cart"
import { useForm } from "react-hook-form"
import { userToken, apiUrl } from "./common/http"
import { toast } from "react-toastify"
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js"

const CheckoutForm = () => {
    const [paymentMethod, setpaymentMethod] = useState('cod');
    const { cartData, shipping, subTotal, grandTotal } = useContext(CartContext);
    const navigate = useNavigate();

    // Stripe
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");


    const handlePaymentMethod = (e) => {
        setpaymentMethod(e.target.value);
    }

    const{
        register,
        handleSubmit,
        reset,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            fetch(`${apiUrl}/get-profile-details`, {
                method: 'GET',
                headers: {
                    'Contenct-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`
                }
            })
            .then(res => res.json())
            .then(result => {
                reset({
                    name: result.data.name,
                    email: result.data.email,
                    address: result.data.address,
                    city: result.data.city,
                    state: result.data.state,
                    zip: result.data.zip,
                    mobile: result.data.mobile,
                });
            })
        }
    });

    const processOrder = async (data) => {
        setLoading(true);
        setPaymentStatus("");

        if(paymentMethod == "cod"){
            saveOrder(data, 'due');
        }else{
            // Fetch the client secret from the server
            const response = await fetch(`${apiUrl}/create-payment-intent`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization' : `Bearer ${userToken()}`
                    },
                    body: JSON.stringify({ amount: grandTotal()*100 }), 
            });

            const result = await response.json();

            if (!result.clientSecret) {
                setPaymentStatus("Unable to process payment. Please try again.");
                setLoading(false);
                return;
            }

            // Ensure Stripe and Elements are loaded
            if (!stripe || !elements) {
                setPaymentStatus("Stripe is not ready. Please try again later.");
                setLoading(false);
                return;
            }

            const clientSecret = result.clientSecret;
            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: data.name,
                        email: data.email,
                        address: {
                            line1: data.address,
                            city: data.city,
                            state: data.state,
                            postal_code: data.zip,
                        },
                    },
                },
            });

            if (paymentResult.error) {
                setPaymentStatus(`Payment failed: ${paymentResult.error.message}`);
            } else if (paymentResult.paymentIntent.status === "succeeded") {
                saveOrder(data,'paid');
                setPaymentStatus("Payment successful!");
            }

        }
    }

    const saveOrder = (formData, paymentStatus) => {
        const newFormData = { ...formData, 
                            subtotal: subTotal(), 
                            shipping: shipping(), 
                            grandtotal: grandTotal(), 
                            discount: 0,
                            payment_status: paymentStatus,
                            payment_method: paymentMethod,
                            status: 'pending',
                            cart: cartData
                        }
        fetch(`${apiUrl}/save-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                'Accept': 'Application/json',
                'Authorization': `Bearer ${userToken()}`,
            },
            body: JSON.stringify(newFormData)
        })
        .then(res => res.json())
        .then(result => {
            setLoading(false);
            
            if(result.status == 200){
                localStorage.removeItem('cart');
                navigate(`/order/confirm/${result.id}`)
            }else{
                // toast.error(result.message);
            }
        })
    }

  return (
    <div className="container mb-5">
            <div className="row">
                <div className="col-md-12">
                    <Breadcrumb className='py-4'>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/cart" }}>Cart</Breadcrumb.Item>
                        <Breadcrumb.Item active>Checkout</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <form action="" onSubmit={handleSubmit(processOrder)}>
                <div className="row">
                    <div className="col-md-7">
                        <h3 className="border-bottom pb-3"><strong>Billing Details</strong></h3>
                        <div className="row pt-3">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="text" {...register("name", { required: "The name field is required" })} 
                                    className={`form-control ${errors.name && "is-invalid"}`} placeholder="Name"/>
                                    {errors.name && <p className="invalid-feedback">{errors.name?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="email" {...register("email", { required: "The email field is required" })} className={`form-control ${errors.email && "is-invalid"}`} placeholder="Email"/>
                                    {errors.email && <p className="invalid-feedback">{errors.email?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <textarea 
                                        {...register("address", { required: "The address field is required" })} 
                                        className={`form-control ${errors.address && "is-invalid"}`} 
                                        placeholder="Address" rows={3}
                                    ></textarea>
                                    {errors.address && <p className="invalid-feedback">{errors.address?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="text" {...register("city", { required: "The city field is required" })} 
                                    className={`form-control ${errors.city && "is-invalid"}`}  placeholder="City"/>
                                    {errors.city && <p className="invalid-feedback">{errors.city?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="text" {...register("state", { required: "The state field is required" })} 
                                    className={`form-control ${errors.state && "is-invalid"}`}  placeholder="State"/>
                                    {errors.state && <p className="invalid-feedback">{errors.state?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="text" {...register("zip", { required: "The zip field is required" })} 
                                    className={`form-control ${errors.zip && "is-invalid"}`}  placeholder="Zip"/>
                                    {errors.zip && <p className="invalid-feedback">{errors.zip?.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <input type="text" {...register("mobile", { required: "The mobile field is required" })} className={`form-control ${errors.mobile && "is-invalid"}`}  placeholder="Mobile No."/>
                                    {errors.mobile && <p className="invalid-feedback">{errors.mobile?.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <h3 className="border-bottom pb-3"><strong>Items</strong></h3>
                        <table className="table">
                            <tbody>
                                {
                                    cartData && cartData.map(item => {
                                        return(
                                            <tr key={`item-${item.id}`}>
                                                <td width={100}>
                                                    <img src={item.image_url} width={80} alt="" />
                                                </td>
                                                <td width={600}>
                                                    <h4>{item.title}</h4>
                                                    <div className="d-flex align-items-center pt-3">
                                                        <span>${item.price}</span>
                                                        <div className="ps-3">
                                                            {item.size && <button className="btn btn-size">{item.size}</button>}
                                                        </div>
                                                        <div className="ps-5">X {item.qty} pcs</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <div>Subtotal</div>
                                    <div>${subTotal()}</div>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <div>Shipping</div>
                                    <div>${shipping()}</div>
                                </div>
                                <div className="d-flex justify-content-between border-bottom py-2">
                                    <div><strong>Grand Total</strong></div>
                                    <div>${grandTotal()}</div>
                                </div>
                            </div>
                        </div>
                        <h3 className="border-bottom pt-4 pb-3"><strong>Payment Method</strong></h3>
                        <div className="pt-2">
                            <input 
                                type="radio" 
                                
                                onChange={handlePaymentMethod} 
                                checked={paymentMethod == 'stripe'} 
                                className="me-2" value={'stripe'}
                            />
                            <label htmlFor="" className="form-label pe-3">Stripe</label>
                            <input 
                                type="radio" 

                                onChange={handlePaymentMethod} 
                                checked={paymentMethod == 'cod'} 
                                className="me-2" value={'cod'}
                            />
                            <label htmlFor="" className="form-label pe-3">Cash on Delivery</label>
                        </div>
                        {
                            paymentMethod == "stripe" && 
                            <div className='border p-3'>
                                <CardElement />
                            </div>
                        }
                        <div className="d-flex pt-3">
                            <button className="btn btn-primary" disabled={loading}>
                                { loading ? 'Please Wait...' : 'Pay Now' }
                            </button>
                        </div>
                        {paymentStatus && <p className='alert alert-info mt-3'>{paymentStatus}</p>}
                    </div>
                </div>
            </form>
        </div>
  )
}
export default CheckoutForm