import React from 'react';
import Rectangle from "../../assest/image/Rectangle.svg";

const Banner = () => {
  return (
    <div className="w-full flex justify-center items-center mt-8  ">
      <div className="relative w-full max-w-screen-xl h-auto">
        <img 
          src={Rectangle} 
          alt="keep healthy kidneys" 
          className="w-full h-auto rounded-lg" 
        />
        {/* Heading overlay */}
        <div className="absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-[#101010] text-xs font-bold text-left  sm:text-2xl md:text-3xl lg:text-4xl mt-2">
            Keeping Your Kidneys Healthy
          </h1>
          <div className='flex flex-wrap'>
          <button className='mt-4 text-[10px] sm:mt-6 bg-[#095D7E] text-[#FFFFFF] rounded-full px-4 sm:py-2 md:py-2 py-1 md:text-base lg:text-lg'>
            Shop medicines
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
