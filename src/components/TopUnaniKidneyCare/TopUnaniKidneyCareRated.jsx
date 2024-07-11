import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import { apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import renderStars from "../../utilities/renderProductStars";
import { setUserCartData, updateCartItemQuantity } from "../../redux/carts/carts";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SimpleLoader from "../Loader/SimpleLoader";
import TopUnaniKidneyCareCard from "./TopUnaniKidneyCareCard";


const TopUnaniKidneyCareRated = ({ stepperProgressCartData, setStepperProgressCartData }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sliderRefs = useRef({});
  const [data, setData] = useState([]);
  const loggedInUserCartData = useSelector((state) => state.cart.cartData) || []


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
                <TopUnaniKidneyCareCard item={item} stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default TopUnaniKidneyCareRated;
