import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCardofCart from "../productComponents/ProductCardofCart";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import { deleteCartItem, updateCartItemQuantity, updateOrderSummary } from "../../redux/carts/carts";
import AttachedPrescription from "../presecription/AttachedPrescription";
import PaymentSummary from "../PaymentDetails/PaymentSummary";
import scrollToTop from "../../utilities/scrollToTop";
import { apiDELETE, apiGET, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";
import ButtonWithLoader from "../Button/ButtonWithLoader";
import { toast } from "react-toastify";
import { setCartCount } from "../../redux/users/users";

const OrderSummaryStep = ({ stepperProgressCartData, setStepperProgressCartData }) => {
    const cartData = useSelector(state => state.cart?.cartData ? state.cart?.cartData : []);
    const userId = useSelector((state) => state.user?.userData?.id);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const handleRemoveCartItem = async (id) => {
        // dispatch(deleteCartItem(id));
        try {
            const response = await apiDELETE(`/v1/cart/delete/${id}`);
            if (response.status) {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
                dispatch(setCartCount(stepperResponse.data?.data?.cartData?.length))
            } else {
                // return rejectWithValue(response.data);
            }
        } catch (error) {
            // return rejectWithValue(error.response.data);
        }
    };

    // const handleQuantityChange = async (type, id, quantity) => {
    //     // dispatch(updateCartItemQuantity({ type, id, quantity }));
    //     const updatedQuantity = type === 'increment' ? quantity + 1 : quantity - 1;
    //     const payload = { quantity: updatedQuantity };

    //     try {
    //         const response = await apiPUT(`/v1/cart/update/${id}`, payload);
    //         if (response.status) {
    //             const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
    //             setStepperProgressCartData(stepperResponse.data?.data);
    //         } else {
    //             // return rejectWithValue(response.data);
    //         }
    //     } catch (error) {
    //         // return rejectWithValue(error.response.data);
    //     }
    // };

    const isDataValid = () => {
        if (stepperProgressCartData && stepperProgressCartData?.cartData?.length !== 0) {
            return stepperProgressCartData?.cartData?.some((ele) => ele?.quantity > ele?.productDetails?.productQuantity);
        }
        return false;
    };

    const setOrderSummary = async () => {
        // dispatch(updateOrderSummary())
        if (!isDataValid()) {
            setLoading(true)
            const updateStepperProgressPayload = {
                currentStep: 4
            }
            try {
                const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
                console.log("userStepperAddResponse", userStepperAddResponse);
                if (userStepperAddResponse.status) {
                    const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                    setStepperProgressCartData(stepperResponse.data?.data);
                    setLoading(false)
                }
            } catch (error) {
                console.log("Error updating seleted prescription", error);
                setLoading(false)
            }
        } else {
            toast.error('Order Quantity Is Invalid')
        }
    }

    const getUserStepperProgress = async () => {
        try {
            const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
            setStepperProgressCartData(stepperResponse.data?.data);
        } catch (error) {
            toast.error(error)
        }
    }
    useEffect(() => {
        getUserStepperProgress()
        scrollToTop()
    }, [])
    return <div>
        <div className="text-2xl font-bold my-4">Order List {stepperProgressCartData?.cartData?.length} items</div>
        <div className="lg:flex gap-5">
            <div className="lg:w-1/2 min-w-[300px] flex flex-col gap-y-3">
                <div className="max-h-[380px] overflow-y-auto scrollbar-custom scroll-smooth">
                    {stepperProgressCartData.cartData && stepperProgressCartData?.cartData?.length !== 0 && stepperProgressCartData?.cartData.map((item) => (
                        <ProductCardofCart
                            key={item._id}
                            item={item}
                            onDelete={() => handleRemoveCartItem(item._id)}
                            // onQuantityChange={(type) => handleQuantityChange(type, item?._id, item?.quantity, item?.productDetails?.productQuantity)}
                            stepperProgressCartData={setStepperProgressCartData}
                            setStepperProgressCartData={setStepperProgressCartData}
                        />
                    ))}
                </div>

                <div className={`${stepperProgressCartData?.cartData?.length === 0 ? 'hidden' : 'lg:ml-auto'}`}>
                    <ButtonWithLoader loading={loading} buttonText={"Proceed to payment"} onClick={setOrderSummary} width={"w-[200px]"} />
                </div>
            </div>
            <div className={`flex flex-col lg:w-1/2 ${stepperProgressCartData?.cartData?.length === 0 ? 'hidden' : ''}`}>
                <PaymentSummary type="summary" item={stepperProgressCartData ? stepperProgressCartData : []} />
                <AttachedPrescription type="cart" stepperProgressCartData={stepperProgressCartData} />
            </div>
        </div>
    </div >
}

export default OrderSummaryStep;