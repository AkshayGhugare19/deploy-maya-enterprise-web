import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentSummary from "../PaymentDetails/PaymentSummary";
import AttachedPrescription from "../presecription/AttachedPrescription";
import { resetCart, resetUserCartData, updateOrderSummary } from "../../redux/carts/carts";
import { apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import scrollToTop from "../../utilities/scrollToTop";

const PaymentStep = () => {
    const cartData = useSelector(state => state.cart?.cartData ? state.cart?.cartData : []);
    const fullUserCartDetails = useSelector(state => state.cart ? state.cart : []);
    const userId = useSelector((state) => state.user?.userData?.id);
    const orderMode = useSelector((state) => state.cart?.orderMode) || '';
    const enquiryId = useSelector((state) => state.cart?.enquiryId) || '';
    const [selectedOption, setSelectedOption] = useState('online');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const addOrderAndItems = async () => {
        if (orderMode === 'order') {
            try {
                const addOrderPayload = {
                    userId,
                    addressId: fullUserCartDetails?.selectedAddress?._id,
                    prescriptionId: fullUserCartDetails?.selectedPrescription[0]?._id,
                    orderType: selectedOption,
                    mode: 'order',
                    totalPayment: fullUserCartDetails?.totalCartAmount
                }
                let addOrderResponse;
                try {
                    addOrderResponse = await apiPOST(`/v1/order/add`, addOrderPayload);
                } catch (error) {
                    console.log("Error Placing order::", addOrderResponse);
                }
                if (addOrderResponse && addOrderResponse.status) {
                    toast.success('Order added successfully')
                    if (addOrderResponse?.data?.data && cartData.length) {
                        cartData?.map(async (item) => {
                            console.log(addOrderResponse?.data);
                            const addOrderItemPayload = {
                                orderId: addOrderResponse?.data?.data?.id,
                                productId: item?.productId,
                                quantity: item.quantity,
                            }
                            try {
                                const orderItemResponse = await apiPOST(`/v1/order-item/add`, addOrderItemPayload);
                            } catch (error) {
                                console.log("Error Order Adding Item::", error);
                            }
                        })
                        console.log("addOrderResponse::", addOrderResponse?.data?.data);
                        if (addOrderResponse?.data?.data?.id) {
                            const checkoutResponse = await apiPOST(`/v1/payment/create-checkout/${addOrderResponse?.data?.data?.id}`);
                            if (checkoutResponse.status) {
                                const checkoutUrl = checkoutResponse?.data?.data?.url;
                                console.log(checkoutUrl);
                                dispatch(resetUserCartData())
                                window.location.replace(checkoutUrl)
                            } else {
                                console.error("Failed to create checkout session:", checkoutResponse.data);
                            }
                        }
                    }
                } else {
                    console.log("Error adding order")
                }
            } catch (error) {
                toast.error('Error', error)
            }
        } else if (orderMode === 'enquiry') {
            console.log("enquiry");
            try {
                const payload = {
                    mode: 'order',
                    orderType: selectedOption
                }
                const checkoutResponse = await apiPOST(`/v1/payment/create-checkout/${enquiryId}`, payload);
                if (checkoutResponse.status) {
                    const checkoutUrl = checkoutResponse?.data?.data?.url;
                    console.log(checkoutUrl);
                    dispatch(resetUserCartData())
                    window.location.replace(checkoutUrl)
                } else {
                    console.error("Failed to create checkout session:", checkoutResponse.data);
                }

            } catch (error) {
                console.log("Error Placing order::", error);
            }
        } else {
            toast.error("Failed to make payment")
        }
    };

    useEffect(() => {
        scrollToTop()
    }, [])
    return <div>
        <div className="lg:flex gap-5 my-4">
            <div className="lg:w-1/2 flex flex-col">

                <h2 className="text-2xl font-bold text-[18px]">Select Your Payment Method</h2>
                <div className="space-y-4 p-4">
                    <div className={`flex items-center p-4 border rounded-lg bg-[#FFFFFF] ${selectedOption === 'online' ? 'border-green-500' : 'border-gray-300'}`}>
                        <input
                            type="radio"
                            id="payOnline"
                            name="paymentOption"
                            value="online"
                            checked={selectedOption === 'online'}
                            onChange={handleOptionChange}
                            className="form-radio h-5 w-5 text-green-500 cursor-pointer"
                        />
                        <label htmlFor="payOnline" className="ml-3 text-lg cursor-pointer font-medium">
                            Pay Online
                        </label>
                    </div>
                    <div className={`flex items-center p-4 border rounded-lg bg-[#FFFFFF] ${selectedOption === 'cod' ? 'border-green-500' : 'border-gray-300'}`}>
                        <input
                            type="radio"
                            id="cashOnDelivery"
                            name="paymentOption"
                            value="cod"
                            checked={selectedOption === 'cod'}
                            onChange={handleOptionChange}
                            className="form-radio h-5 w-5 text-green-500 cursor-pointer"
                        />
                        <label htmlFor="cashOnDelivery" className="ml-3 text-lg cursor-pointer font-medium">
                            Cash on Delivery
                        </label>
                    </div>
                </div>
                <button className="bg-[#14967F] font-[600] text-[#FFFFFF] w-[200px] rounded-[30px] p-2 self-end" onClick={addOrderAndItems}>Proceed to Payment</button>
            </div>
            <div className="flex flex-col lg:w-1/2">
                <PaymentSummary type="summary" item={cartData ? cartData : []} />
                <AttachedPrescription type="cart" />
            </div>
        </div>
    </div>
}

export default PaymentStep;