import moment from "moment";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setEnquiryId, setOrderMode, updateOrderSummaryForEnquiry } from "../../redux/carts/carts";
import { apiDELETE } from "../../utilities/apiHelpers";
import { toast } from "react-toastify";

const EnquiryItemCard = ({ item }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userId = useSelector((state) => state.user.userData.id) || ''
    const getEnquiryType = (type) => {
        switch (type) {
            case "asPerPrescription":
                return "As per prescription";
            case "call":
                return "Call";
            default:
                return null;
        }
    };
    const getEnquiryStatus = (type) => {
        switch (type) {
            case "awaiting_response":
                return <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Awaiting Response</span>
            case "fulfilled":
                return <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">Fulfilled</span>
            case "in_progress":
                return <span class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">In progress</span>
            default:
                return null;
        }
    };


    const handleOrderSummary = async (orderId) => {
        console.log("orderId:", orderId);
        Swal.fire({
            title: "Proceed to order summary?",
            text: "You can view the added products there",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes Proceed!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDELETE(`/v1/cart/remove-user-cart`);
                if (response.status) {
                    dispatch(updateOrderSummaryForEnquiry({ orderId, userId }))
                    dispatch(setOrderMode('enquiry'))
                    dispatch(setEnquiryId(orderId))
                    navigate('/view-cart');
                } else {
                    toast.error("Error Deleting Cart Items")
                }
            }
        });
    };
    return (
        <div key={item._id} className={`w-full flex flex-col lg:flex lg:flex-row bg-white rounded-lg shadow-lg p-2  space-x-10`}>
            <img
                src={item?.prescriptionData?.prescriptionImgUrl}
                alt={item?.productDetails?.name}
                className="w-full lg:w-44 lg:h-44 object-cover rounded"
            />
            <div className="mt-2">
                <h2 className="text-xl font-medium mb-2">{getEnquiryStatus(item?.enquiryStatus)}</h2>
                <p className="text-gray-600 text-xs md:text-base mb-1 flex flex-wrap">
                    <span className="text-[#817F7F] ">Enquiry Id:</span>
                    <span className="truncate ml-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">{item?._id}</span>
                </p>
                <p className="text-gray-600 text-xs md:text-base mb-1">
                    <span className="text-[#817F7F] ">Type:</span>
                    <span class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 md:px-2.5 px-1 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 ml-2">{getEnquiryType(item?.enquiryType)}</span>
                </p>
                <p className="text-gray-600 text-xs md:text-base">
                    <span className="text-[#817F7F] ">Date:</span> {moment(item.createdAt).format('DD/MM/YY')}
                </p>
                {
                    item.enquiryStatus === "fulfilled" && <div className="lg:flex items-center justify-between mt-2">
                        <div className="text-gray-500 mr-2 text-xs md:text-base">Total Amount: ₹{item?.totalPayment}</div>

                        <button className="flex items-center space-x-2 p-1 bg-indigo-100 text-indigo-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-xs md:text-base" onClick={() => handleOrderSummary(item._id)}>
                            <span className="px-2 text-gray-500 flex items-center gap-2">
                                Product Qty: {item?.orderItemData?.length}
                                <button
                                    className={` ${item.enquiryStatus === "fulfilled" ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    disabled={item.enquiryStatus !== "fulfilled"}
                                >
                                    <IoEyeSharp
                                        className={`transition duration-300 transform hover:scale-125 text-blue-500 hover:text-blue-700`}
                                        size={20}
                                    />
                                </button>
                            </span>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default EnquiryItemCard;