import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import titlepre from '../../assest/image/Vector.svg';
import shopping from '../../assest/image/shopping.svg';
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import renderStars from "../../utilities/renderProductStars";
import { setUserCartData, updateCartItemQuantity } from "../../redux/carts/carts";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const TopUnaniKidneyCareRated = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sliderRefs = useRef({});
  const [data, setData] = useState([]);
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


  const fetchData = async () => {
    try {
      const response = await apiGET(`${API_URL}/v1/product/getProductsBasedOnCategories`);
      if (response.data.status) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sliderSettings = (numItems) => ({
    dots: false,
    infinite: numItems > 1,
    speed: 500,
    slidesToShow: Math.min(Math.max(numItems, 2), 5),
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 5),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 5),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 4),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 0), 3),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 2), 2),
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: Math.min(Math.max(numItems, 1), 1),
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  });

  const handleNextClick = (index) => {
    sliderRefs.current[index].slickNext();
  };

  const handlePrevClick = (index) => {
    sliderRefs.current[index].slickPrev();
  };

  const CustomArrow = ({ className, style, onClick, src, alt }) => (
    <img
      className={className}
      style={{ ...style, display: "block", zIndex: 2, width: '60px', height: '90px', right: '-14px', padding: '0px' }}
      onClick={onClick}
      src={src}
      alt={alt}
    />
  );

  return (
    <div className="w-full">
      {data.map((category, index) => (
        <div key={category.category} className="mt-8 relative">
          <h2 className="text-2xl font-bold my-4">{category.category}</h2>
          <img
            className='absolute top-[52%] -translate-y-[50%] -left-4 z-10 cursor-pointer'
            onClick={() => handlePrevClick(index)}
            src={left_arrow}
            width="60px"
            height=""
            alt="Previous"
          />
          <img
            className='absolute top-[52%] -translate-y-[50%] -right-4 z-10 cursor-pointer'
            onClick={() => handleNextClick(index)}
            src={right_arrow}
            width="60px"
            height=""
            alt="Next"
          />
          <Slider {...sliderSettings(category.products.length)} ref={(slider) => (sliderRefs.current[index] = slider)}>
            {category.products.length !== 0 && category.products.map((item) => (
              <div key={item._id} className="p-4">
                <div className="border p-4 rounded-[16px] h-[350px] flex flex-col justify-between bg-[#FFFFFF] hover:shadow-xl group">
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
                    !isLoggedIn ? <button className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]" onClick={addToCart}>
                      <img src={shopping} alt="Add to Cart" className="h-5 mr-2" />
                      <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
                    </button> : <>
                      {
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
                        ) : <button
                          className="w-full flex items-center justify-center bg-gray-200 px-7 py-2 rounded-full group-hover:bg-[#14967F] group-hover:text-[#FFFFFF]"
                          onClick={(e) => addToCart(item._id)}
                        >
                          <img src={shopping} alt="Add to Cart" className="h-5 mr-2 group-hover:text-white group-hover:hidden" />
                          <span className="text-[#14967F] font-semibold text-xs group-hover:text-[#FFFFFF]">Add to cart</span>
                        </button>
                      }
                    </>
                  }
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default TopUnaniKidneyCareRated;
