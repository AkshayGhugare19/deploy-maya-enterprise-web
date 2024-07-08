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

const ViewCart = () => {
    const dispatch = useDispatch();
    const currentStep = useSelector((state) => state.cart?.currentStep);
    const orderMode = useSelector((state) => state.cart?.orderMode) || '';
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
        if (currentStep > 0) {
            dispatch(updateStep(currentStep - 1))
        }
    };

    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <MyCartStep />;
            case 1:
                return <UploadPrescriptionStep type="cart" />;
            case 2:
                return <AddressStep />;
            case 3:
                return <OrderSummaryStep />;
            case 4:
                return <PaymentStep />;
            default:
                return null;
        }
    };

    useEffect(() => {
        dispatch(fetchGlobalConfig())
        console.log(currentStep);
        // return () => {
        //     dispatch(resetStateForEnquiry());
        // };
    }, [])

    return <div className="container mx-auto p-4">
        <MyCartStepper steps={steps} currentStep={currentStep} />
        {
            currentStep > 0 && orderMode != 'enquiry' && <button
                onClick={goToPrevStep}
                className="flex items-center justify-start gap-2 mt-2">
                <FaArrowLeftLong />Back to {steps[currentStep - 1]}
            </button>
        }
        {renderStepComponent(currentStep)}
    </div>
}

export default ViewCart;