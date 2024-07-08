import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCardofCart from "../productComponents/ProductCardofCart";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import { deleteCartItem, updateCartItemQuantity, updateOrderSummary } from "../../redux/carts/carts";
import AttachedPrescription from "../presecription/AttachedPrescription";
import PaymentSummary from "../PaymentDetails/PaymentSummary";
import scrollToTop from "../../utilities/scrollToTop";

const OrderSummaryStep = () => {
    const cartData = useSelector(state => state.cart?.cartData ? state.cart?.cartData : []);
    const userId = useSelector((state) => state.user?.userData?.id);
    const dispatch = useDispatch()
    const handleRemoveCartItem = (id) => {
        dispatch(deleteCartItem(id));
    };

    const handleQuantityChange = (type, id, quantity) => {
        dispatch(updateCartItemQuantity({ type, id, quantity }));
    };
    const setOrderSummary = () => {
        dispatch(updateOrderSummary())
    }
    useEffect(() => {
        scrollToTop()
    }, [])
    return <div>
        <div className="text-2xl font-bold my-4">Order List {cartData?.length} items</div>
        <div className="lg:flex gap-5">
            <div className="lg:w-1/2 flex flex-col">
                {cartData.length !== 0 && cartData?.map((item) => (
                    <ProductCardofCart
                        key={item._id}
                        item={item}
                        onDelete={() => handleRemoveCartItem(item._id)}
                        onQuantityChange={(type) => handleQuantityChange(type, item._id, item.quantity)}
                    />
                ))}
                <button className="bg-[#14967F] font-[600] text-[#FFFFFF] w-[200px] rounded-[30px] p-2 self-end	" onClick={setOrderSummary}>Proceed to Payment</button>
            </div>
            <div className="flex flex-col lg:w-1/2">
                <PaymentSummary type="summary" item={cartData ? cartData : []} />
                <AttachedPrescription type="cart" />
            </div>
        </div>
    </div>
}

export default OrderSummaryStep;