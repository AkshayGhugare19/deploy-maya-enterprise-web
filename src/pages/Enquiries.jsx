import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {apiPOST } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { toast } from "react-toastify";
import EnquiryItemCard from "../components/Order/EnquiryItemCard";
const Enquiries = () => {
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const [orderData, setOrderData] = useState([])
    const getUserOrder = async () => {
        const response = await apiPOST(`${API_URL}/v1/order/user-enquiries/${userId}`);
        console.log("response", response.data.data.data);
        if (Array.isArray(response.data.data.data) && response.data.data.data.length > 0) {
            setOrderData(response.data.data.data)
        } else {
            toast.error(response.data.data.data)
        }
    }
    useEffect(() => {
        getUserOrder()
    }, [])

    return <div className="container mx-auto p-4">
        <div className="font-medium text-2xl">My Enquiries</div>
        <div className="w-full">
        {
            orderData.length ?
                <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 xl:grid-cols-2 2xl:grid-cols-3 mt-4">
                    {
                        orderData.length !== 0 && orderData.map((item) => (
                            <EnquiryItemCard key={item.id} item={item} />
                        ))
                    }
                </div> : 
                <div className="flex justify-center items-center my-4">
                    <div className="border py-2 px-32 border-[#14967F] text-[#14967F] rounded-lg shadow-md">No enquiries found</div>
                </div>}
        </div>
    </div>
}

export default Enquiries;