
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import left_arrow from '../../assest/image/left_arrow.svg';
import right_arrow from '../../assest/image/right_arrow.svg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cardbrand from './cardbrand';
import { apiGET } from '../../utilities/apiHelpers';
import { useNavigate } from 'react-router-dom';
import SimpleLoader from '../Loader/SimpleLoader';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const sliderRef = useRef(null);
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await apiGET('v1/brand/all'); 
        setBrands(response.data.data);
        setLoading(false);
        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1424,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  const handleNextClick = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevClick = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className='mt-10 w-full'>
      <div className=''>
        <div className='my-4 text-2xl font-bold'>Top Brands</div>
        {
          loading?
          <SimpleLoader/>
        :
        <div className='bg-[#F1F9FF] w-full'>
          <div className='px-10 py-8'>
            <div className='relative flex flex-wrap justify-between'>
              <img
                className='absolute top-16 -left-10 z-10'
                onClick={handlePrevClick}
                src={left_arrow}
                alt="Previous"
                width="60px"
                height=""
              />
              <img
                className='absolute top-16 right-0 z-10'
                onClick={handleNextClick}
                src={right_arrow}
                alt="Next"
                width="60px"
                height=""
              />
              <Slider {...settings} ref={sliderRef} className='w-full'>
                {brands.map((brand, index) => (
                  <Cardbrand onClick={()=>{navigate(`/product/brand/${brand.id}`)}}   key={brand.id} item={{ src: brand.brandImgUrl }} index={index} />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      }
      </div>
    </div>
  );
}

export default Brand;
