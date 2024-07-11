import React, { useState, useEffect } from 'react';
import SortByAlphabet from '../components/SortByAlphabet/SortByAlphabet';
import Pagination from '../components/Pagination/Pagination';
import { apiPOST } from '../utilities/apiHelpers';
import { toast } from 'react-toastify';
import 'tailwindcss/tailwind.css';
import KidneyMedicinesCard from '../components/kidneyMedicines/KidneyMedicinesCard';
import scrollToTop from '../utilities/scrollToTop';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
    });
    const [selectedLetter, setSelectedLetter] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (sortIndex = '', page = 1) => {
        setLoading(true);
        try {
            const payload = {
                sortIndex,
                limit: 10,
                page,
            };
            const response = await apiPOST("/v1/product/getAllProducts", payload);
            if (response?.data?.status === true) {
                // toast.success(response?.data?.data?.msg);
                setProducts(response?.data?.data?.product);
                setPagination({
                    totalProducts: response?.data?.data?.pagination?.totalProducts,
                    totalPages: response?.data?.data?.pagination?.totalPages,
                    currentPage: response?.data?.data?.pagination?.currentPage,
                    pageSize: response?.data?.data?.pagination?.pageSize,
                });
                setLoading(false);
            } else {
                toast.error(response?.data?.data?.msg);
                setLoading(false);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(selectedLetter); // Fetch products for the default selected letter 'A' on mount
    }, [selectedLetter]); // Empty dependency array ensures this runs only once

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        fetchProducts(letter, 1); // Fetch products for the selected letter and reset to page 1
    };

    const handlePageChange = (page) => {
        fetchProducts(selectedLetter, page); // Fetch products for the current selected letter and the specified page
    };

    useEffect(() => {
        fetchProducts("");
        scrollToTop();// Fetch products for the default selected letter 'A' on mount
    }, []); // Empty dependency array ensures this runs only once


    return (
        <div className="container mx-auto p-4">
            <SortByAlphabet onLetterClick={handleLetterClick} />
            <h2>Showing {pagination?.pageSize * (pagination?.currentPage - 1) + 1}-{Math.min(pagination?.pageSize * pagination?.currentPage, pagination?.totalProducts)} of {pagination.totalProducts} results</h2>


            {/* {JSON.stringify(pagination)} */}
            {loading ?
                <div className="flex justify-center items-center">
                    <div className="loader">Loading...</div>
                </div>
                :
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-1'>
                    {products?.length ? (
                        products.map((item) => (
                            <KidneyMedicinesCard key={item.id} item={item} />
                        ))
                    ) : (
                        <div className='col-span-full flex justify-center items-center'>
                            <div className='border border-[#095D7E] py-5 px-20 rounded-lg shadow-md'>
                                Not Found
                            </div>
                        </div>
                    )}
                </div>

            }
            <Pagination
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Products;
