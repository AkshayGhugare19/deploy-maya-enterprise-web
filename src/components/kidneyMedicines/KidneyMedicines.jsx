import React, { useEffect, useState } from 'react';
import KidneyMedicinesCard from "./KidneyMedicinesCard"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { apiPOST } from '../../utilities/apiHelpers';



const KidneyMedicines = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const getAllProduct = async () => {
    try {
      const payload = {
        "sortIndex": "",
        "limit": 8,
        "page": 1
      };
      const response = await apiPOST(`${API_URL}/v1/product/getAllProducts`, payload);
      console.log("response>>>", response)
      if (response?.data?.status) {
        setProducts(response?.data?.data?.product);
      } else {
        console.error("Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <div className='my-8 w-full'>
      <div className=' font-bold text-2xl'>Kidney Medicines</div>
      <KidneyMedicinesCard products={products} />
      <div className='flex w-full items-center justify-center'>
        <button onClick={() => navigate("/products")} className="mt-4 bg-[#14967F] hover:text-white px-7 py-2 rounded-full transition duration-300 transform hover:scale-105">
          <span className=" font-semibold text-xs">Load nore</span>
        </button>
      </div>

    </div>
  )
};

export default KidneyMedicines;
