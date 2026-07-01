import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../common/Layout";
import Sidebar from "../../common/Sidebar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { adminToken, apiUrl } from "../../common/http";
import { useEffect, useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const Edit = ({ placeholder }) => {
    const [disable, setDisable] = useState(false);
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [productImages, setProductImages] = useState([]);
    const [sizesChecked, setSizesChecked] = useState([]);
    const navigate = useNavigate();
    const params = useParams();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${apiUrl}/products/${params.id}`, {
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
                        setProductImages(result.data.product_images);
                        setSizesChecked(result.productSizes)
                        reset({
                            title: result.data.title,
                            category: result.data.category_id,
                            brand: result.data.brand_id,
                            short_description: result.data.short_description,
                            description: result.data.description,
                            price: result.data.price,
                            compare_price: result.data.compare_price,
                            sku: result.data.sku,
                            barcode: result.data.barcode,
                            quantity: result.data.quantity,
                            status: result.data.status,
                            is_featured: result.data.is_featured
                            
                        });
                    } else {
                        console.log("Something went wrong");
                    }
                });
        },
    });

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || "",
        }),
        [placeholder],
    );

    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];

        formData.append("image", file);
        formData.append("product_id",params.id);
        setDisable(true);

        const res = await fetch(`${apiUrl}/add-product-image`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${adminToken()}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                if(result.status == 200){
                    productImages.push(result.data);
                    setProductImages(productImages);
                }else{
                    toast.error(result.errors.image[0]);
                }
                
                setDisable(false);
                e.target.value = "";
            });
    };

    const changeImage = async (e, image) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await fetch(`${apiUrl}/update-product-default-image?product_id=${params.id}&image=${image}`, {
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
                    toast.success(result.message);
                } else {
                    console.log("Something went wrong");
                }
            });
    };

    const deleteImage = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${adminToken()}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status == 200) {
                    const newProductImages = productImages.filter(productImage => productImage.id != id);
                    setProductImages(newProductImages);
                    toast.success(result.message);
                } else {
                    console.log("Something went wrong");
                }
            });
    };

    const saveProduct = async (data) => {
        const formData = { ...data, description: content };

        setDisable(true);

        const res = await fetch(`${apiUrl}/products/${params.id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${adminToken()}`,
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((result) => {
                setDisable(false);
                if (result.status == 200) {
                    toast.success(result.message);
                    navigate("/admin/products");
                } else {
                    const formErrors = result.errors;
                    Object.keys(formErrors).forEach((field) => {
                        setError(field, { message: formErrors[field][0] });
                    });
                    console.log("Something went wrong");
                }
            });
    };

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);

    const fetchSizes = async () => {
        const res = await fetch(`${apiUrl}/sizes`, {
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
                    setSizes(result.data);
                } else {
                    console.log("Something went wrong");
                }
            });
    };

    const fetchCategories = async () => {
        const res = await fetch(`${apiUrl}/categories`, {
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
                    setCategories(result.data);
                } else {
                    console.log("Something went wrong");
                }
            });
    };

    const fetchBrands = async () => {
        const res = await fetch(`${apiUrl}/brands`, {
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
                    setBrands(result.data);
                } else {
                    console.log("Something went wrong");
                }
            });
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchSizes();
    }, []);

    return (
        <Layout>
            <div className="container">
                <div className="row mb-5">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className="h4 pb-0 mb-0">Products / Edit</h4>
                        <Link to="/admin/products" className="btn btn-primary">
                            Back
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form action="" onSubmit={handleSubmit(saveProduct)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">
                                            Title
                                        </label>
                                        <input
                                            {...register("title", { required: "The title field is required" })}
                                            type="text"
                                            className={`form-control ${errors.title && "is-invalid"}`}
                                            placeholder="Title"
                                        />
                                        {errors.title && <p className="invalid-feedback">{errors.title?.message}</p>}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Category</label>
                                                <select
                                                    {...register("category", { required: "Select a category" })}
                                                    className={`form-control ${errors.category && "is-invalid"}`}>
                                                    <option value="">Select a Category</option>
                                                    {categories &&
                                                        categories.map((category) => {
                                                            return (
                                                                <option
                                                                    key={`category-${category.id}`}
                                                                    value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                                {errors.category && (
                                                    <p className="invalid-feedback">{errors.category?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Brand</label>
                                                <select {...register("brand")} className="form-control">
                                                    <option value="">Select a Brand</option>
                                                    {brands &&
                                                        brands.map((brand) => {
                                                            return (
                                                                <option key={`brand-${brand.id}`} value={brand.id}>
                                                                    {brand.name}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">
                                            Short Description
                                        </label>
                                        <textarea
                                            {...register("short_description")}
                                            className="form-control"
                                            placeholder="Short Description"
                                            rows={3}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">
                                            Description
                                        </label>
                                        <JoditEditor
                                            ref={editor}
                                            value={content}
                                            config={config}
                                            tabIndex={1}
                                            onBlur={(newContent) => setContent(newContent)}
                                        />
                                    </div>
                                    <div className="row">
                                        <h3 className="py-3 border-bottom mb-3">Pricing</h3>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Price</label>
                                                <input
                                                    {...register("price", { required: "The price field is required" })}
                                                    className={`form-control ${errors.price && "is-invalid"}`}
                                                    type="text"
                                                    placeholder="Price"
                                                />
                                                {errors.price && (
                                                    <p className="invalid-feedback">{errors.price?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Compared Price</label>
                                                <input
                                                    {...register("compare_price")}
                                                    type="text"
                                                    placeholder="Compared Price"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h3 className="py-3 border-bottom mb-3">Inventory</h3>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">SKU</label>
                                                <input
                                                    {...register("sku", { required: "The sku field is required" })}
                                                    className={`form-control ${errors.sku && "is-invalid"}`}
                                                    type="text"
                                                    placeholder="SKU"
                                                />
                                                {errors.sku && (
                                                    <p className="invalid-feedback">{errors.sku?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Barcode</label>
                                                <input
                                                    {...register("barcode")}
                                                    type="text"
                                                    placeholder="Barcode"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Quantity</label>
                                                <input
                                                    {...register("qty")}
                                                    type="text"
                                                    placeholder="Quantity"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Status</label>
                                                <select
                                                    {...register("status", { required: "Select a status" })}
                                                    className={`form-control ${errors.status && "is-invalid"}`}>
                                                    <option value="">Select a Status</option>
                                                    <option value="0">Inactive</option>
                                                    <option value="1">Active</option>
                                                </select>
                                                {errors.status && (
                                                    <p className="invalid-feedback">{errors.status?.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Featured</label>
                                        <select
                                            {...register("is_featured", { required: "Select a option" })}
                                            className={`form-control ${errors.is_featured && "is-invalid"}`}>
                                            <option value="">Select a Option</option>
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                        </select>
                                        {errors.is_featured && (
                                            <p className="invalid-feedback">{errors.is_featured?.message}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <h3 className="py-3 border-bottom mb-3">Sizes</h3>
                                            {
                                                sizes && sizes.map((size) => {
                                                    return(
                                                        <div className="form-check-inline me-5" key={`psize-${size.id}`}>
                                                            <input { ...register("sizes")} className="form-check-input" checked={sizesChecked.includes(size.id)} type="checkbox" value={size.id} id={`size-${size.id}`} onChange={(e) => {
                                                                if(e.target.checked){
                                                                    setSizesChecked([...sizesChecked, size.id]);
                                                                }else{
                                                                    setSizesChecked(sizesChecked.filter(sid => size.id != sid));
                                                                }
                                                            }}/>
                                                            <label className="form-check-label ps-2" htmlFor={`size-${size.id}`}>
                                                            {size.name}
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                    </div>
                                    <div className="mb-3">
                                        <h3 className="py-3 border-bottom mb-3">Gallery</h3>
                                        <label className="form-label">Image</label>
                                        <input type="file" className="form-control" onChange={handleFile} />
                                    </div>
                                    <div className="mb-3">
                                        <div className="row">
                                            {productImages &&
                                                productImages.map((productImage, index) => {
                                                    return (
                                                        <div className="col-md-2 mb-3" key={`productImage-${index}`}>
                                                            <div className="card shadow position-relative image-card">
                                                                <img src={productImage.image_url} className="w-100 rounded" />
                                                                <button
                                                                    className="btn btn-danger position-absolute end-0 m-1 rounded-circle d-flex p-1 delete-btn" title="Delete"
                                                                    onClick={(e) => deleteImage(e, productImage.id)}>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="1em"
                                                                        height="1em"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="#fff"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="lucide lucide-trash-icon lucide-trash">
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                                        <path d="M3 6h18" />
                                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary position-absolute m-1 rounded-circle d-flex p-1 set-default" title="Set Default"
                                                                    onClick={(e) => changeImage(e, productImage.image)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                              }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3" disabled={disable}>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Edit;
