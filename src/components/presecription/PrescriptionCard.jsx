import React from 'react';
import calander from "../../assest/icons/calander.svg";
import clock from "../../assest/icons/clock.svg";
import location from "../../assest/icons/location_1.svg";
import { MdRemoveRedEye } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

const PrescriptionCard = ({ item }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg  border border-gray-200">
      <div className='relative'>
        <img src={item.prescriptionImgUrl} alt="Prescription" className='w-full' />
        <div className='absolute flex justify-center items-center top-1 right-1 bg-[#CCECEE] w-[35px] h-[35px] rounded-[50%]'>
          <a href={item.prescriptionImgUrl} target='_blank'>
          <MdRemoveRedEye className='text-xl font-extrabold text-[#095D7E]' />
          </a>
        </div>
      </div>
      {/* <div className="font-bold text-xl mb-2">{item.title}</div>
      <span className="text-gray-700 text-xs mb-4 flex gap-2">
        <img src={location} alt="Location" />
        {item.address || '6 Khusboo Corner, 56 Vishwas Colony, Alkapuri Vadodara, Gujarat'}
      </span>
      <span className="text-gray-700 text-xs mb-2 flex gap-2 items-center">
        <img src={clock} alt="Clock" />
        Duration of dosage <span className="ml-auto text-green-600">5 days</span>
      </span> */}
      <div className='p-2'>
      <span className="text-gray-700 text-xs mb-4 flex gap-2 items-center mt-2">
        <img src={calander} alt="Calendar" />
        Added on <span className="ml-auto text-green-600">{new Date(item.createdAt).toLocaleDateString()}</span>
      </span>
      <div className="flex justify-center gap-6 items-center w-full py-2">
        <span  className="hover:bg-[#14967F]  bg-[#CCECEE] flex gap-1 hover:text-white  text-center items-center justify-center  w-full font-bold p-2 cursor-pointer rounded-full">
        <RiDeleteBin6Line className='text-[20px]   cursor-pointer'/>Delete
        </span>
      </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
