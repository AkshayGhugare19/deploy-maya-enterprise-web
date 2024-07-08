import React from 'react';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center my-4 bg-[#FFFFFF]">
             <button onClick={() => onPageChange(currentPage - 1)} className='flex items-center  text-[16px] text-[#817F7F] px-4 py-2 m-1 bg-white rounded hover:bg-gray-200 disabled:bg-gray-200'>
            <MdOutlineKeyboardArrowLeft className='mr-2' />
            <span>Previous</span>
        </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-4 py-2 m-1 rounded ${currentPage === number ? 'bg-[#14967F] text-white  ' : 'bg-white border text-gray-700 hover:bg-gray-400'}`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center  text-[16px] text-[#817F7F] px-4 py-2 m-1 bg-white rounded hover:bg-gray-400 disabled:bg-gray-200"
            >
                <span>Next</span>
                <MdKeyboardArrowRight className='mr-2' />

                </button>
        </div>
    );
};

export default Pagination;