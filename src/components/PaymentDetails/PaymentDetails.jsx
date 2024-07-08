import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderMode, updateStep } from "../../redux/carts/carts";
const PaymentDetails = ({ item }) => {
    const dispatch = useDispatch();
    const currentStep = useSelector((state) => state.cart.currentStep ? state.cart.currentStep : 0)
    const selectedAddress = useSelector((state) => state.cart.selectedAddress ? state.cart.selectedAddress : '')
    const globalConfig = useSelector((state) => state.globalConfig?.globalConfigData ? state.globalConfig?.globalConfigData : '')
    const calculateCartAmount = (items) => {
        const totalPrice = items.reduce((sum, ele) => {
            const price = parseFloat(ele.total_price);
            return sum + (isNaN(price) ? 0 : price);
        }, 0);
        return totalPrice;
    }

    const goToNextStep = () => {
        console.log(currentStep);
        dispatch(updateStep(currentStep + 1));
        dispatch(setOrderMode('order'))
    };

    return <div className={`lg:w-1/2 h-full bg-white shadow-md rounded-lg p-6 ${item?.length === 0 ? 'hidden' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-800">Payment Details</h3>
        <p className="flex justify-between text-gray-600 mt-4">
            <span>Cart Amount</span> <span>₹{calculateCartAmount(item)}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Packaging Charges</span> <span>+ ₹{globalConfig?.packagingCharges}</span>
        </p>
        <p className="flex justify-between text-gray-600 mt-2">
            <span>Delivery Charges</span> <span>+ ₹{globalConfig?.deliveryCharges}</span>
        </p>
        <p className="flex justify-between text-[#14967F] mt-4 font-bold text-lg">
            <span>Total to pay</span> <span>₹{calculateCartAmount(item) + globalConfig?.deliveryCharges + globalConfig?.packagingCharges}</span>
        </p>
        {/* <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Delivering to</p>
            <p className="font-semibold text-gray-800">{selectedAddress?.city} {selectedAddress?.zip}</p>
            <button className="text-blue-600">Add Address</button>
        </div> */}
        <button className="w-full mt-6 bg-[#14967F] text-white py-2 rounded-lg" onClick={goToNextStep}>Place Order</button>
    </div>
}
export default PaymentDetails