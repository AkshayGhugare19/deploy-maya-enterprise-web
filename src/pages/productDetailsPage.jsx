import React, { useEffect, useState } from 'react';
import ProductDeyailsCard from '../components/productComponents/productDetailsCard';
import { apiGET } from '../utilities/apiHelpers';
import { useParams,Link } from 'react-router-dom';
import { API_URL } from '../config';


const ProductDeyailsPage = () => {
    const { id } = useParams();
    const [productInformations, setProductInformations] = useState('');
    const [productData,setProductData] = useState(null);
    const [error, setError] = useState(null);
    const params = useParams()


    const getProductInformation = async () => {
        try {
            const response = await apiGET(`${API_URL}/v1/product/get-product-details-information-by-product/${id}`);
            if (response?.data?.status) {
                setProductInformations(response?.data?.data);
            } else {
                console.error("Something went wrong");
                setProductInformations(null);
            }
        } catch (error) {
            console.error("Something went wrong", error);
            setProductData(null);
        }
    };

    
        const getProductData = async () => {
            try {
                const response = await apiGET(`v1/product/get-product/${params.id}`);
                setProductData(response.data.data.data.product); 
                console.log(productData)
                console.log()
            } catch (error) {
                setError(error.message || 'Error fetching data');
            }
        };

 

    useEffect(() => {
        getProductInformation();
        getProductData();
    }, [id]);

  return (
    <div className="container mx-auto p-4">
       <nav class="text-gray-500 mb-4">
        <ol class="list-reset flex">
            <li><Link to='/' class="text-[#817F7F] hover:underline">Home</Link></li>
            <li><span class="mx-2">{">"}</span></li>
            <li><Link to='/products' class="text-[#817F7F] hover:underline">All Products</Link></li>
            <li><span class="mx-2">{">"}</span></li>
            <li class="text-[#101010]">Ace Q10 Capsule</li>
        </ol>
    </nav>
      <ProductDeyailsCard productInformations={productInformations} productData={productData}/>
    </div>

  );
};

export default ProductDeyailsPage;
