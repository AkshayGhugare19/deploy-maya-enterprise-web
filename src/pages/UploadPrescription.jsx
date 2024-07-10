// App.js
import React, { useEffect, useState } from 'react';
import PrescriptionStepper from '../components/Steppers/PrescriptionStepper';
import UploadPrescriptionStep from '../components/StepperRenderComponents/UploadPrescriptionStep';
import ChooseMedicines from '../components/PrescriptionStepperRenderComponents/ChooseMedicines';
import AddressDetails from '../components/PrescriptionStepperRenderComponents/AddressDetails';
import { apiGET, apiPOST, apiPUT } from '../utilities/apiHelpers';
import { API_URL } from '../config';
import { useSelector } from 'react-redux';
import EnquiryUploadPrescription from '../components/PrescriptionStepperRenderComponents/EnquiryUploadPrescription';

const UploadPrescription = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
    const steps = [
        { id: 0, name: 'Upload Prescription' },
        { id: 1, name: 'Choose Your Medicines' },
        { id: 2, name: 'Address Details' },
    ];
    const userId = useSelector((state) => state.user?.userData?.id) || ""

    const handleCurrentStepUpdate = async (id) => {
        const updateStepperProgressPayload = {
            currentStepForUploadPres: id
        }
        try {
            const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
            console.log("userStepperAddResponse", userStepperAddResponse);
            if (userStepperAddResponse.status) {
                const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                setStepperProgressCartData(stepperResponse.data?.data);
            }
        } catch (error) {
            console.log("Error updating seleted prescription", error);
        }
        setCurrentStep(id)
    }

    const getUserStepperProgress = async () => {
        try {
            const userStepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`);
            if (userStepperResponse?.data?.code == 400 && !userStepperResponse?.data?.status) {
                const stepperProgressAddPayload = {
                    orderMode: 'enquiry',
                    currentStepForUploadPres: 0
                }
                const userStepperAddResponse = await apiPOST(`${API_URL}/v1/stepper-progress/add-stepper-progress/${userId}`, stepperProgressAddPayload);
                console.log("userStepperAddResponse", userStepperAddResponse);
                setStepperProgressCartData(userStepperAddResponse.data?.data);
            } else {
                const stepperProgressUpdatePayload = {
                    orderMode: 'enquiry'
                }
                const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, stepperProgressUpdatePayload);
                console.log('userStepperAddResponse', userStepperAddResponse);
                setStepperProgressCartData(userStepperResponse.data?.data);
            }
            console.log("response", userStepperResponse);
        } catch (error) {
            console.error("Error fetching or creating stepper progress:", error);
        }
    }

    useEffect(() => {
        getUserStepperProgress()
    }, [])

    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <EnquiryUploadPrescription type="uploadPrescription" setCurrentStep={() => handleCurrentStepUpdate(1)} stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />;
            case 1:
                return <ChooseMedicines setCurrentStep={() => handleCurrentStepUpdate(2)} stepperProgressCartData={stepperProgressCartData} />;
            case 2:
                return <AddressDetails stepperProgressCartData={stepperProgressCartData} />;
            default:
                return null;
        }
    };
    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className='text-[#101010] font-bold text-lg'>Upload Prescription</h1>
            <div className='lg:flex  gap-4'>
                <div className='lg:w-1/4 mt-4'>
                    <PrescriptionStepper currentStep={stepperProgressCartData?.currentStepForUploadPres} steps={steps} />
                </div>
                <div className='w-full'>
                    {renderStepComponent(stepperProgressCartData?.currentStepForUploadPres)}
                </div>
            </div>
        </div>
    );
};

export default UploadPrescription;
