import React, { useRef, useEffect, useState } from 'react';
import Slider from "react-slick";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import Topcard from './TopProductCard';
import { apiGET } from '../../utilities/apiHelpers';



const KidenyTopRated = () => {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiGET('v1/product/getTopRatedProducts');
        setProducts(response.data.data.product);
        console.log(response)
      } catch (error) {
        console.error('Error fetching top-rated products:', error);
      }
    };

    fetchProducts();
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
          slidesToShow: Math.min(Math.max(numItems, 2), 3),
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

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className='w-full'>
      <div className='relative mt-10'>
        <div className='text-2xl font-semibold my-4'>Kidney care top products</div>
        <img
          className='absolute top-[52%] -translate-y-[50%] -left-4 z-10 cursor-pointer'
          onClick={handlePrevClick}
          src={left_arrow}
          width="60px"
          height=""
          alt="Previous"
        />
        <img
          className='absolute top-[52%] -translate-y-[50%] -right-4 z-10 cursor-pointer'
          onClick={handleNextClick}
          src={right_arrow}
          width="60px"
          height=""
          alt="Next"
        />
        <Slider {...sliderSettings(products.length)} ref={sliderRef} className=''>
          {products.map((item, index) => (
            <Topcard item={item} index={index} />

          ))}
        </Slider>
      </div>
    </div>
  );
}

export default KidenyTopRated;
