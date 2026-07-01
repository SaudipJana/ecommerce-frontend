
import { useForm } from "react-hook-form";
import { adminToken, apiUrl } from "../../common/http";
import Layout from "../../common/Layout";
import Sidebar from "../../common/Sidebar";
import { toast } from "react-toastify";

const Shipping = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            fetch(`${apiUrl}/get-shipping`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${adminToken()}`,
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.status == 200) {
                        reset({
                            shipping_charge: result.data?.shipping_charge,
                        })
                    } else {
                        console.log("Something went wrong");
                    }
                });
        },
    });

    const saveShipping = (data) => {
        const res = fetch(`${apiUrl}/save-shipping`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${adminToken()}`,
                },
                body: JSON.stringify(data)
            })
            .then((res) => res.json())
            .then((result) => {
                if (result.status == 200) {
                    toast.success(result.message);
                    reset({
                        shipping: result.data.shipping_charge,
                    })
                } else {
                    console.log("Something went wrong");
                }
            });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className="h4 pb-0 mb-0">Shipping</h4>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form action="" onSubmit={handleSubmit(saveShipping)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">
                                            Shipping Charge ($)
                                        </label>
                                        <input
                                            {...register("shipping_charge", { required: "The shipping field is required" })}
                                            type="number"
                                            className={`form-control ${errors.shipping && "is-invalid"}`}
                                            placeholder="Shipping Charge"
                                        />
                                        {errors.shipping && (
                                            <p className="invalid-feedback">{errors.shipping?.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Shipping;
