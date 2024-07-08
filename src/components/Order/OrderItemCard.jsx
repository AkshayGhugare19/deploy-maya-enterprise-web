import moment from "moment";

const OrderItemCard = ({ item }) => {
    return (
        item.orderItems?.map((orderItem) => (
            <div key={orderItem.productId} className="w-full flex flex-col lg:flex lg:flex-row bg-white rounded-lg shadow-lg p-2  space-x-10">
                <img
                    src={orderItem?.productDetails?.bannerImg}
                    alt={orderItem?.productDetails?.name}
                    className=" w-full lg:w-44 lg:h-44 object-cover rounded"
                />
                <div className="mt-4">
                    <h2 className="text-xl font-medium mb-2">{orderItem?.productDetails?.name}</h2>
                    <p className="text-gray-600 mb-1">
                        <span className="text-[#817F7F]">Order Id:</span> ORD-{orderItem?.orderId}
                    </p>
                    <p className="text-gray-600">
                        <span className="text-[#817F7F]">Order date:</span> {moment(orderItem.createdAt).format('DD/MM/YY')}
                    </p>
                    <div className="flex items-center mt-2">
                        <span className="text-gray-500 line-through mr-2">₹{orderItem?.productDetails?.price}</span>
                        <span className="text-teal-600 font-semibold mr-4">₹{orderItem?.productDetails?.discountedPrice}</span>
                        <div className="flex items-center space-x-2">
                            <span className="px-2 text-gray-500">Qty: {orderItem?.quantity}</span>
                        </div>
                    </div>
                </div>
                {/* <button className="text-teal-600 font-semibold">Order again</button> */}
            </div>
        ))
    );
};

export default OrderItemCard;