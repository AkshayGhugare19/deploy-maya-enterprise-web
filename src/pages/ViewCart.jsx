import React, { useEffect, useState } from "react";
import MyCartStepper from "../components/Steppers/MyCartStepper";
import MyCartStep from "../components/StepperRenderComponents/MyCartStep";
import UploadPrescriptionStep from "../components/StepperRenderComponents/UploadPrescriptionStep";
import AddressStep from "../components/StepperRenderComponents/AddressStep";
import OrderSummaryStep from "../components/StepperRenderComponents/OrderSummaryStep";
import PaymentStep from "../components/StepperRenderComponents/PaymentStep";
import { fetchGlobalConfig } from "../redux/globalconfig/globalconfig";
import { useDispatch, useSelector } from "react-redux";
import { resetStateForEnquiry, updateStep } from "../redux/carts/carts";
import { FaArrowLeftLong } from "react-icons/fa6";
import { apiGET, apiPOST } from "../utilities/apiHelpers";
import { API_URL } from "../config";

const ViewCart = () => {
    const dispatch = useDispatch();
    const currentStep = useSelector((state) => state.cart?.currentStep);
    const orderMode = useSelector((state) => state.cart?.orderMode) || '';
    const userId = useSelector((state) => state.user?.userData.id) || '';
    const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
    // const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        'My Cart',
        'Upload Prescription',
        'Add Address',
        'Order Summary',
        'Payment'
    ];

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            updateStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (stepperProgressCartData?.currentStep > 0) {
            dispatch(updateStep(currentStep - 1))
        }
    };

    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <MyCartStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            case 1:
                return <UploadPrescriptionStep type="cart" stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            case 2:
                return <AddressStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            case 3:
                return <OrderSummaryStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            case 4:
                return <PaymentStep stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            default:
                return null;
        }
    };

    const getUserStepperProgress = async () => {
        try {
            const userStepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`);
            if (userStepperResponse?.data?.code == 400 && !userStepperResponse?.data?.status) {
                const stepperProgressAddPayload = {
                    orderMode: 'order'
                }
                const userStepperAddResponse = await apiPOST(`${API_URL}/v1/stepper-progress/add-stepper-progress/${userId}`, stepperProgressAddPayload);
                console.log("userStepperAddResponse", userStepperAddResponse);
                setStepperProgressCartData(userStepperAddResponse.data?.data);
            }
            else {
                setStepperProgressCartData(userStepperResponse.data?.data);
            }
            console.log("response", userStepperResponse);
        } catch (error) {
            console.error("Error fetching or creating stepper progress:", error);
        }
    }

    useEffect(() => {
        dispatch(fetchGlobalConfig())
        getUserStepperProgress();
        console.log(stepperProgressCartData?.currentStep);
        // return () => {
        //     dispatch(resetStateForEnquiry());
        // };
    }, [])

    return <div className="container mx-auto p-4">
        <MyCartStepper steps={steps} currentStep={stepperProgressCartData?.currentStep} />
        {
            stepperProgressCartData?.currentStep > 0 && orderMode != 'enquiry' && <button
                onClick={goToPrevStep}
                className="flex items-center justify-start gap-2 mt-2">
                <FaArrowLeftLong />Back to {steps[stepperProgressCartData?.currentStep - 1]}
            </button>
        }
        {renderStepComponent(stepperProgressCartData?.currentStep)}
    </div>
}

export default ViewCart;