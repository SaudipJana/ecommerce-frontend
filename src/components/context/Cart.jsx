import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../common/http";
import Shipping from './../admin/shipping/Shipping';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [shippingCost, setShippingCost] = useState(0);

    const addToCart = (product, size=null) => {
        let updatedCart = [...cartData];

        if(cartData.length == 0){
            updatedCart.push({
                id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                product_id: product.id,
                size: size,
                title: product.title,
                price: product.price,
                qty: 1,
                image_url: product.image_url,
            })
        }else{
            if(size != null){
                const isProductExists = updatedCart.find(item => item.product_id == product.id && item.size == size)

                if(isProductExists){
                    updatedCart = updatedCart.map(item => (item.product_id == product.id && item.size == size) ?
                    { ...item, qty: item.qty + 1 } : item);
                }else{
                    updatedCart.push({
                        id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                        product_id: product.id,
                        size: size,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url,
                    })
                }
            }else{
                const isProductExists = updatedCart.find(item => item.product_id == product.id)

                if(isProductExists){
                    updatedCart = updatedCart.map(item => (item.product_id == product.id) ?
                    { ...item, qty: item.qty + 1 } : item);
                }else{
                    updatedCart.push({
                        id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                        product_id: product.id,
                        size: size,
                        title: product.title,
                        price: product.price,
                        qty: 1,
                        image_url: product.image_url,
                    })
                }
            }
        }
        
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    const getQty = () => {
        let qty = 0;
        cartData.map(item => {qty += parseInt(item.qty)});
        return qty;
    }

    const updateCartItem = (itemId, newQty) => {
        let updatedCart = [...cartData];
        updatedCart = updatedCart.map(item => (item.id == itemId) ? { ...item, qty: newQty } : item);
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    const deleteCartItem = (itemId) => {
        const newCartData = cartData.filter(item => item.id != itemId)
        setCartData(newCartData);
        localStorage.setItem('cart', JSON.stringify(newCartData));
    }

    const subTotal = () => {
        let subtotal = 0;
        cartData.map(item => {
            subtotal += item.qty * item.price;
        })

        return subtotal;
    }
    
    const shipping = () => {
        let shippingAmt = 0;
        cartData.map(item => {
            shippingAmt += item.qty * shippingCost;
        })

        return shippingAmt;
    }

    const grandTotal = () => {
        return subTotal() + shipping();
    }

    useEffect(() => {
        fetch(`${apiUrl}/get-shipping-charges`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
            },
        })
        .then((res) => res.json())
        .then((result) => {
            if (result.status == 200) {
                setShippingCost(result.data.shipping_charge);
            } else {
                setShippingCost(0);
                console.log("Something went wrong");
            }
        });
    });


    return(
        <CartContext.Provider value={{ addToCart, cartData, updateCartItem, deleteCartItem, getQty, subTotal, shipping, grandTotal }}>
            {children}
        </CartContext.Provider>
    )
}