import React from 'react';
import dummyPrescriptionImg from "../../assest/image/prescription/dummyPrescription.png"
import { useSelector } from 'react-redux';

const AttachedPrescription = () => {
    const selectedPrescription = useSelector((state) => state.cart?.selectedPrescription) || "";
    return (
        <div className="w-full bg-[#FFFFFF] mt-3 p-4 rounded-[16px]">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Attached prescription
            </label>
            <div className='flex justify-center items-center'>
                <img className="w-full h-auto max-w-xs md:max-w-md lg:max-w-lg" src={selectedPrescription[0]?.prescriptionImgUrl ? selectedPrescription[0].prescriptionImgUrl : selectedPrescription.prescriptionImgUrl} />
            </div>
        </div>
    );
};

export default AttachedPrescription;