import React, { useState } from "react";
import AttachedPrescription from "../presecription/AttachedPrescription";
import { updateSelectedPrescriptionDuration, updateSelectedPrescriptionDurationUnit, updateSelectedPrescriptionType } from "../../redux/carts/carts";
import { useDispatch, useSelector } from "react-redux";
import { apiGET, apiPUT } from "../../utilities/apiHelpers";
import { API_URL } from "../../config";

const ChooseMedicines = ({ setCurrentStep }) => {
    const [duration, setDuration] = useState(5);
    const [unit, setUnit] = useState('Days');
    const [selectedOption, setSelectedOption] = useState('asPerPrescription');
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user?.userData?.id) || ""
    const handleDurationChange = async (e) => {
        setDuration(e.target.value);
        // dispatch(updateSelectedPrescriptionDuration(e.target.value))
        const updateStepperProgressPayload = {
            prescriptionDuration: e.target.value
        }
        try {
            const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
            console.log("userStepperAddResponse", userStepperAddResponse);
            if (userStepperAddResponse.status) {
                const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                // setStepperProgressCartData(stepperResponse.data?.data);
            }
        } catch (error) {
            console.log("Error updating seleted prescription", error);
        }
    };

    const handleUnitChange = async (e) => {
        setUnit(e.target.value);
        // dispatch(updateSelectedPrescriptionDurationUnit(unit))
        const updateStepperProgressPayload = {
            prescriptionDurationUnit: unit
        }
        try {
            const userStepperAddResponse = await apiPUT(`${API_URL}/v1/stepper-progress/update-stepper-progress/${userId}`, updateStepperProgressPayload);
            console.log("userStepperAddResponse", userStepperAddResponse);
            if (userStepperAddResponse.status) {
                const stepperResponse = await apiGET(`${API_URL}/v1/stepper-progress/user-stepper-progress/${userId}`)
                // setStepperProgressCartData(stepperResponse.data?.data);
            }
        } catch (error) {
            console.log("Error updating seleted prescription", error);
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
        dispatch(updateSelectedPrescriptionType(option))
    };
    const handleNextStep = () => {
        dispatch(updateSelectedPrescriptionType(selectedOption))
        dispatch(updateSelectedPrescriptionDurationUnit(unit))
        dispatch(updateSelectedPrescriptionDuration(duration))
        setCurrentStep()
    };
    return <>
        <div className="p-6 mt-4 bg-white shadow-lg rounded-lg mx-auto">
            <h2 className="text-lg font-semibold mb-4">Choose Your Medicines {selectedOption}{unit}{duration}</h2>
            <div className="flex lg:flex-row flex-col justify-between">
                <div>
                    <div className="mb-4">
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="orderOption"
                                value="asPerPrescription"
                                checked={selectedOption === 'asPerPrescription'}
                                onChange={() => handleOptionChange('asPerPrescription')}
                                className="mr-2"
                            />
                            Order everything as per prescription
                        </label>
                        {selectedOption === 'asPerPrescription' && (
                            <div className="lg:flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="w-26 p-2 border rounded-[40px]"
                                />
                                <select
                                    value={unit}
                                    onChange={handleUnitChange}
                                    className="p-2 border rounded-[40px] bg-[#095D7E] text-white"
                                >
                                    <option value="Days">Days</option>
                                    <option value="Weeks">Weeks</option>
                                    <option value="Months">Months</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="orderOption"
                                value="call"
                                checked={selectedOption === 'call'}
                                onChange={() => handleOptionChange('call')}
                                className="mr-2"
                            />
                            Ask Maya to call
                        </label>
                    </div>
                </div>
                <div className="lg:w-2/5 lg:border-l-2">
                    <AttachedPrescription type="uploadPrescription" />
                </div>
            </div>
            <button className="w-[130px] p-2 bg-[#14967F] mt-5 text-white font-semibold rounded-[30px]" onClick={handleNextStep}>
                Next
            </button>
        </div>
    </>
}

export default ChooseMedicines;