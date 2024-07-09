import React, { useEffect, useState } from "react";
import ProductCardofCart from "../productComponents/ProductCardofCart";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import { apiDELETE, apiGET, apiPUT } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, setCart, setOrderMode, updateCartItemQuantity } from "../../redux/carts/carts";
import scrollToTop from "../../utilities/scrollToTop";

const MyCartStep = ({ stepperProgressCartData, setStepperProgressCartData }) => {
    // const [cartData, setCartData] = useState([]);
    const userId = useSelector((state) => state.user?.userData?.id);
    const dispatch = useDispatch()
    const cartData = useSelector(state => state.cart?.cartData ? state.cart?.cartData : []);

    const handleRemoveCartItem = async (id) => {
        // dispatch(deleteCartItem(id));
        try {
            const response = await apiDELETE(`/v1/cart/delete/${id}`);
            if (response.status) {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
            } else {
                // return rejectWithValue(response.data);
            }
        } catch (error) {
            // return rejectWithValue(error.response.data);
        }
    };

    const handleQuantityChange = async (type, id, quantity) => {
        // dispatch(updateCartItemQuantity({ type, id, quantity }));
        const updatedQuantity = type === 'increment' ? quantity + 1 : quantity - 1;
        const payload = { quantity: updatedQuantity };

        try {
            const response = await apiPUT(`/v1/cart/update/${id}`, payload);
            if (response.status) {
                const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
            } else {
                // return rejectWithValue(response.data);
            }
        } catch (error) {
            // return rejectWithValue(error.response.data);
        }
    };

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (userId) {
                    const response = await apiGET(`/v1/cart/all-by-user/${userId}`);
                    if (response.status) {
                        console.log(response?.data?.data);
                        dispatch(setCart(response?.data?.data));
                    } else {
                        console.error("Failed to fetch cart data", response);
                    }
                }
            } catch (error) {
                console.error("Error fetching cart data", error);
            }
        };
        scrollToTop();
        fetchCartData();
    }, []);

    return (
        <>
            {/* {JSON.stringify(stepperProgressCartData.cartData)} */}
            <div className="text-2xl font-bold my-4">{stepperProgressCartData?.cartData?.length} items added in Cart</div>
            <div className="lg:flex gap-5">
                <div className="lg:w-1/2 min-w-[300px] max-h-[500px] overflow-y-auto scrollbar-custom scroll-smooth">
                    {stepperProgressCartData.cartData && stepperProgressCartData?.cartData?.length !== 0 && stepperProgressCartData?.cartData.map((item) => (
                        <ProductCardofCart
                            key={item._id}
                            item={item}
                            onDelete={() => handleRemoveCartItem(item._id)}
                            onQuantityChange={(type) => handleQuantityChange(type, item._id, item.quantity)}
                        />
                    ))}
                </div>
                <PaymentDetails item={stepperProgressCartData ? stepperProgressCartData : []} setStepperProgressCartData={setStepperProgressCartData} />
            </div>
        </>
    );
}

export default MyCartStep;