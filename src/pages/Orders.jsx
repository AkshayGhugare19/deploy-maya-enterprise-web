import React, { useEffect, useState } from "react";
import OrderCard from "../components/Order/OrderCard";
import OrderItemCard from "../components/Order/OrderItemCard";
import { apiGET } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { useSelector } from "react-redux";

const Orders = () => {
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const [orderData, setOrderData] = useState([])
    const getUserOrder = async () => {
        const response = await apiGET(`${API_URL}/v1/order/get-user-orders/${userId}`);
        console.log("response", response.data.data);
        setOrderData(response.data.data)
    }
    useEffect(() => {
        getUserOrder()
    }, [])

    return <div className="container mx-auto p-4">
        <div className="font-medium text-2xl">My Orders</div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 xl:grid-cols-2 2xl:grid-cols-3 mt-4">
        {
            orderData.length !== 0 && orderData.map((item) => (
                <OrderItemCard key={item.id} item={item} />
            ))
        }
        </div>
    </div>
}

export default Orders;