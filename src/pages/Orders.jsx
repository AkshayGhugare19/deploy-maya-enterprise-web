import React, { useEffect, useState } from "react";
import OrderItemCard from "../components/Order/OrderItemCard";
import { apiGET } from "../utilities/apiHelpers";
import { API_URL } from "../config";
import { useSelector } from "react-redux";
import ReactPaginate from 'react-paginate';
import { FiEye } from "react-icons/fi";
import { MdKeyboardBackspace } from "react-icons/md";
import moment from "moment";
import scrollToTop from "../utilities/scrollToTop";

const Orders = () => {
    const userId = useSelector((state) => state.user?.userData?.id) || '';
    const [orderData, setOrderData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const getUserOrder = async () => {
        setLoading(true);
        try {
            const response = await apiGET(`${API_URL}/v1/order/get-user-orders/${userId}`);
            if (response.status) {
                const sortedData = response?.data?.data?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));
                setOrderData(sortedData);
            }
        } catch (error) {
            console.log("Error fetching user orders", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getUserOrder();
    }, [userId]);
    useEffect(() => {
        scrollToTop();
    })
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = orderData.slice(offset, offset + itemsPerPage);

    return (
        <div className="container mx-auto p-4">
            <div className="font-medium text-2xl">My Orders</div>

            {selectedOrder ? (
                <div>
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="my-4 flex items-center px-4 py-2 bg-[#14967F] text-white rounded"
                    >
                        <MdKeyboardBackspace />
                    </button>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 xl:grid-cols-2 2xl:grid-cols-3 mt-4">
                        <OrderItemCard item={selectedOrder} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto mt-4 rounded-lg">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order ID</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Mode</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Type</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Status</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Date</th>
                                    <th className="py-2 px-2 text-left bg-[#14967F] text-white border-b">Order Items</th>
                                    <th className="py-2 px-2 bg-[#14967F] text-white border-b">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="w-8 h-8 border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentItems.length ? (
                                    currentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#ccecee]">
                                            <td className="py-2 px-2 border-b">{item?._id || "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.mode || "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.orderType ? item?.orderType : "--"}</td>
                                            <td className="py-2 px-2 border-b">{item?.status ? item?.status : "--"}</td>
                                            <td className="py-2 px-2 border-b">
                                                {moment(item?.createdAt || "09/07/24").format("DD/MM/YY")}
                                            </td>
                                            <td className="py-2 px-2 border-b">
                                                {item?.orderItems?.length || "0"}
                                            </td>
                                            <td className="py-2 px-2 border-b">
                                                <div className="flex justify-center items-center">
                                                    <button onClick={() => setSelectedOrder(item)}>
                                                        <FiEye />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center">No Orders Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(orderData.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'flex justify-center items-center mt-4 space-x-1'}
                        pageClassName={'mx-1'}
                        pageLinkClassName={'px-3 py-1 border rounded'}
                        activeClassName={'text-blue-500 '}
                        previousClassName={'px-3 py-1 border rounded'}
                        nextClassName={'px-3 py-1 border rounded'}
                        breakClassName={'px-3 py-1 border rounded'}
                    />
                </>
            )}
        </div>
    );
};

export default Orders;
