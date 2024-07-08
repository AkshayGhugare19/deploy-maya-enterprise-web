import React, { useRef, useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import shopping from '../../assest/image/shopping.svg';
import titlepre from '../../assest/icons/prescriptionIcon.png';
import renderStars from '../../utilities/renderProductStars';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCartData, updateCartItemQuantity } from '../../redux/carts/carts';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function TopProductCard({ item }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user?.userData?.id) || false
  const loggedInUserCartData = useSelector((state) => state.cart.cartData) || []

  const handleIncrement = (productId) => {
    const currentQuantity = fetchCartQuantity(productId);
    const id = fetchCartId(productId);
    console.log("handleIncrement cartId", id);
    dispatch(updateCartItemQuantity({ type: 'increment', id, quantity: currentQuantity }));
  };

  const handleDecrement = (productId) => {
    const currentQuantity = fetchCartQuantity(productId);
    const id = fetchCartId(productId);
    console.log("handleDecrement cartId", id);
    if (currentQuantity > 1) {
      dispatch(updateCartItemQuantity({ type: 'decrement', id, quantity: currentQuantity }));
    }
  };

  const checkCartDataExists = (id) => {
    return loggedInUserCartData?.some((item) => item.productDetails._id === id);
  }

  const fetchCartQuantity = (id) => {
    const product = loggedInUserCartData.find((item) => item.productDetails._id === id);
    return product ? product.quantity : 0;
  };

  const fetchCartId = (id) => {
    const product = loggedInUserCartData.find((item) => item.productDetails._id === id);
    return product ? product._id : 0;
  };

  const addToCart = async (id) => {
    if (isLoggedIn) {
      console.log(id);
      try {
        const payload = {
          productId: id,
          userId: isLoggedIn,
          quantity: 1
        }
        const response = await apiPOST(`/v1/cart/add`, payload);
        if (response.status) {
          dispatch(setUserCartData(isLoggedIn))
          toast.success("Product added to cart")
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please Login First");
    }
  }

  return (
    <div className="border p-4 rounded-[16px] h-[350px] flex flex-col justify-between mx-4 bg-[#FFFFFF] hover:shadow-xl group">
      {/* Prescription badge */}
      <div className="flex items-center mb-2">
        {item.isPrescription && <img src={titlepre} alt="Prescription Required" className=" mr-2" />}
        <span className="text-sm">{item.isPrescription ? "Prescription Required" : ''}</span>
      </div>

      {/* Product image */}
      <div className={`flex justify-center ${!item.isPrescription ? "mt-3" : ''}`}>
        <img src={item.bannerImg} alt={item.name} className="w-full h-32 object-cover rounded-md" />
      </div>

      {/* Product name */}
      <div className="">
        <label className="font-extrabold text-sm hover:cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>{item.name || "Product Name"}</label>
      </div>

      {/* Rating stars */}
      <div className="flex gap-2">
        {renderStars(item.avgRating)}
      </div>

      {/* Price */}
      <div className="flex gap-2 items-center">
        <span className="line-through text-gray-500">₹{item.price}</span>
        <span className="text-[#095D7E] font-semibold">₹{item.discountedPrice}</span>
      </div>

      {/* Add to cart button */}
      {
        !isLoggedIn ? (
          <button
            className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]"
            onClick={addToCart}
          >
            <img src={shopping} alt="Add to Cart" className="h-5 mr-2" />
            <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
          </button>
        ) : (
          checkCartDataExists(item._id) ? (
            <div className="w-full flex items-center justify-between bg-gray-200 rounded-full">
              <button
                className="bg-[#14967F] text-white rounded-full w-[58px] h-full py-2 flex items-center justify-center focus:outline-none"
                onClick={() => handleDecrement(item._id)}
              >
                -
              </button>
              <span className="mx-4 text-lg">{fetchCartQuantity(item._id)}</span>
              <button
                className="bg-[#14967F] text-white rounded-full w-[58px] h-full py-2 flex items-center justify-center focus:outline-none"
                onClick={() => handleIncrement(item._id)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center bg-gray-200 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]"
              onClick={(e) => addToCart(item._id)}
            >
              <img src={shopping} alt="Add to Cart" className="h-5 mr-2 group-hover:text-white group-hover:hidden" />
              <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
            </button>
          )
        )
      }
    </div>

  );
}

export default TopProductCard;
