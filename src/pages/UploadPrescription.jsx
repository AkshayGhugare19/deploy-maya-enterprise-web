// App.js
import React, { useState } from 'react';
import PrescriptionStepper from '../components/Steppers/PrescriptionStepper';
import UploadPrescriptionStep from '../components/StepperRenderComponents/UploadPrescriptionStep';
import ChooseMedicines from '../components/PrescriptionStepperRenderComponents/ChooseMedicines';
import AddressDetails from '../components/PrescriptionStepperRenderComponents/AddressDetails';

const UploadPrescription = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, name: 'Upload Prescription' },
        { id: 2, name: 'Choose Your Medicines' },
        { id: 3, name: 'Address Details' },
    ];

    const handleCurrentStepUpdate = (id) => {
        setCurrentStep(id)
    }

    const renderStepComponent = (stepIndex) => {
        switch (stepIndex) {
            case 1:
                return <UploadPrescriptionStep type="uploadPrescription" setCurrentStep={() => handleCurrentStepUpdate(2)} />;
            case 2:
                return <ChooseMedicines setCurrentStep={() => handleCurrentStepUpdate(3)} />;
            case 3:
                return <AddressDetails />;
            default:
                return null;
        }
    };
    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className='text-[#101010] font-bold text-lg'>Upload Prescription</h1>
            <div className='lg:flex  gap-4'>
                <div className='lg:w-1/4 mt-4'>
                    <PrescriptionStepper currentStep={currentStep} steps={steps} />
                </div>
                <div className='w-full'>
                    {renderStepComponent(currentStep)}
                </div>
            </div>
        </div>
    );
};

export default UploadPrescription;
