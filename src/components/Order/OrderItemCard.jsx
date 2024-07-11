import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { toast } from "react-toastify";
import { apiDELETE, apiPOST } from "../../utilities/apiHelpers";
import { useSelector } from "react-redux";
import { useState } from "react";

const OrderItemCard = ({ item }) => {
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state) => state.user?.userData?.id) || false
    const [loading, setLoading] = useState(false)
    const orderAgain = async (orderItem) => {
        setLoading(true)
        const response = await apiDELETE(`/v1/cart/remove-user-cart`);
        if (response.status) {
            if (orderItem?.productDetails?.productQuantity > orderItem?.quantity) {
                try {
                    let payload = {
                        productId: orderItem?.productId,
                        userId: isLoggedIn,
                        quantity: orderItem?.quantity
                    };
                    const response = await apiPOST(`${API_URL}/v1/cart/add`, payload);
                    if (response?.data?.status) {
                        setLoading(false)
                        toast.success(response?.data?.data?.data);
                        navigate("/view-cart")
                        return true;
                    } else {
                        setLoading(false)
                        toast.error(response?.data?.data);
                        return false;
                    }
                } catch (error) {
                    setLoading(false)
                    return false;
                }
            } else {
                setLoading(false)
                toast.info("Product quantity is not available")
            }
        } else {
            toast.error("Please remove firt item from cart")
        }
    };
    return (
        item.orderItems?.map((orderItem) => (
            <div key={orderItem.productId} className="w-full flex flex-col lg:flex lg:flex-row bg-white rounded-lg shadow-lg p-2  space-x-10">
                <img
                    src={orderItem?.productDetails?.bannerImg}
                    alt={orderItem?.productDetails?.name}
                    className=" w-full lg:w-44 lg:h-44 object-cover rounded"
                />
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-xl font-medium ">{orderItem?.productDetails?.name}</div>
                        <div><span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{orderItem?.productDetails?.productQuantity} left</span></div>
                    </div>
                    <p className="text-gray-600 mb-1">
                        <span className="text-[#817F7F]">Order Id:</span> ORD-{orderItem?.orderId}
                    </p>
                    <p className="text-gray-600">
                        <span className="text-[#817F7F]">Order date:</span> {moment(orderItem.createdAt).format('DD/MM/YY')}
                    </p>
                    <div className="flex items-center mt-2">
                        <span className="text-gray-500 line-through mr-2">₹{orderItem?.productDetails?.price}</span>
                        <span className="text-teal-600 font-semibold mr-4">₹{orderItem?.productDetails?.discountedPrice}</span>
                        <div className="flex justify-between items-center space-x-2 w-full">
                            <span className="px-2 text-gray-500">Qty: {orderItem?.quantity}</span>
                            <button className="text-teal-600 items-center gap-1 flex "
                                disabled={loading}
                                onClick={() => orderAgain(orderItem)}>
                                Order again
                                {
                                    loading ?
                                        <div className={`w-4 h-4 border-2 border-teal-600 border-solid rounded-full border-t-transparent animate-spin`}></div>
                                        : ""}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        ))
    );
};

export default OrderItemCard;