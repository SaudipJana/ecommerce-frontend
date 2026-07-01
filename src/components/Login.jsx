import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "./common/http";
import Layout from "./common/Layout";
import { useContext } from "react";
import { AuthContext } from "./context/Auth";
import { toast } from "react-toastify";

const Login = () => {
    const {login} = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(data)
            
            // const result = await res.json();
    
        }).then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                const userInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name
                }
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
                login(userInfo)
                navigate('/profile')
    
            } else {
                toast.error(result.message)
            }
        })
      }

  return (
    <Layout>
        <div className="container d-flex justify-content-center py-5">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="card shadow border-0 login">
                    <div className='card-body p-4'>
                        <h3 className='text-center pb-3 text-decoration-underline'>Login</h3>
                        <div className="mb-3">
                            <label htmlFor="" className='form-label'>Email</label>
                            <input { ...register('email', {required: "The email field is required", 
                            pattern: {value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid Email Address"}}) }
                            type="text" className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Your Email'/>
                            { errors.email && <p className='invalid-feedback'>{errors.email?.message}</p> }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className='form-label'>Password</label>
                            <input { ...register("password", {required: "The password field is required"}) }
                            type="password" className={`form-control ${errors.password && 'is-invalid'}`} placeholder='Your Password'/>
                            { errors.password && <p className='invalid-feedback'>{errors.password?.message}</p> }
                        </div>
                        <button className='btn btn-secondary mt-3 w-100'>Login</button>
                        <div className='d-flex justify-content-center pt-3'>
                            Don't have an Account?&nbsp;<Link to="/register" className="text-primary">Register</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </Layout>
  )
}
export default Login