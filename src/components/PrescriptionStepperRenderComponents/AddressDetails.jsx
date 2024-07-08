import React, { useEffect, useState } from "react";
import AttachedPrescription from "../presecription/AttachedPrescription";
import AddressStep from "../StepperRenderComponents/AddressStep";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineLocationOn } from "react-icons/md";
import { setAddress } from "../../redux/users/users";
import { apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
import { updateSelectedAddress } from "../../redux/carts/carts";
import { toast } from "react-toastify";
import Popup from "../Address/Popup";
import { useNavigate } from "react-router-dom";

const AddressDetails = () => {
    const [duration, setDuration] = useState(5);
    const [isOpen, setIsOpen] = useState(false);
    const [unit, setUnit] = useState('Days');
    const [selectedOption, setSelectedOption] = useState('order');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const userId = useSelector((state) => state.user?.userData?.id) || "";
    const addresses = useSelector((state) => state.user?.address) || [];
    const selectedPrescription = useSelector((state) => state.cart?.selectedPrescription[0]) || {};
    const prescriptionDuration = useSelector((state) => state.cart?.prescriptionDuration) || "";
    const prescriptionType = useSelector((state) => state.cart?.prescriptionType) || "";
    const prescriptionDurationUnit = useSelector((state) => state.cart?.prescriptionDurationUnit) || "";
    const prescriptionSelectedAddress = useSelector((state) => state.cart?.selectedAddress) || {};
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSelect = async (address) => {
        console.log("Selected Address:", address);
        setSelectedAddress(address)
        dispatch(updateSelectedAddress(address))
    }
    const getUserAddresses = async () => {
        const response = await apiGET(`/v1/address/getAddress/${userId}`)
        if (response.status) {
            console.log(response.data.data);
            dispatch(setAddress(response.data.data));
        } else {
            console.error("Failed to fetch cart data", response);
        }
    }
    const setSelectedAddressFunc = async () => {
        if (selectedPrescription._id) {
            const updatePrescriptionPayload = {
                type: prescriptionType || 'order',
                durationUnit: prescriptionDurationUnit,
                durationOfDosage: prescriptionDuration,
                addressId: prescriptionSelectedAddress._id
            }

            let updateResponse;
            try {
                updateResponse = await apiPUT(`/v1/prescription/update-prescription-img/${selectedPrescription._id}`, updatePrescriptionPayload);
                console.log("updateResponse", updateResponse);
            } catch (error) {
                console.log("Error Updating prescription:", error);
            }
            if (updateResponse && updateResponse.status) {
                const addOrderPayload = {
                    userId,
                    prescriptionId: selectedPrescription._id,
                    mode: 'enquiry',
                    enquiryType: prescriptionType || 'asPerPrescription',
                    durationUnit: prescriptionDurationUnit,
                    durationOfDosage: prescriptionDuration,
                    addressId: prescriptionSelectedAddress._id
                }
                try {
                    const addOrderResponse = await apiPOST(`/v1/order/add`, addOrderPayload);
                    if (addOrderResponse.status) {
                        console.log('addOrderResponse::', addOrderResponse)
                        toast.success("Order Placed Successfully!");
                        navigate('/enquiries')
                    } else {
                        toast.error('Error Adding Order');
                    }
                } catch (error) {
                    console.log('Error Placing order::', error)
                }
            }
        } else {
            toast.error("Please select address")
        }
    }

    useEffect(() => {
        if (isOpen === false) {
            getUserAddresses()
        }
    }, [isOpen])

    return <div className="p-6 mt-4 bg-white shadow-lg rounded-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4">Address Details</h2>
        <h2 className="text-md font-semibold mb-4">Select from saved address</h2>
        <div className="flex lg:flex-row gap-4 flex-col justify-between">
            <div className="mb-4 w-full">
                {addresses?.map((address) => (
                    <div key={address._id} className={`flex items-center bg-[#F8F8F8] p-4 mb-4 rounded-lg shadow-md cursor-pointer ${selectedAddress?._id === address._id ? 'border-2 border-blue-500 transform scale-105' : ''
                        }`}
                        onClick={() => handleSelect(address)}>
                        <div className="text-2xl mr-3"><MdOutlineLocationOn /></div>
                        <div>
                            <p className="font-bold">{address.zip}</p>
                            <p>{address.addressLine1}</p>
                            <p>{address.addressLine2}</p>
                        </div>
                    </div>
                ))}
                <button onClick={setSelectedAddressFunc} className="mt-6 py-2 px-6 bg-[#14967F] text-white rounded-[30px] self-center lg:self-start">
                    Submit
                </button>
                <button onClick={() => setIsOpen(!isOpen)} className="mt-4 py-2 px-4 bg-[#F1F9FF] text-[#14967F] rounded-[30px]">
                    + Add New Address
                </button>
            </div>
            <div className="lg:w-2/5 lg:border-l-2">
                <AttachedPrescription type='uploadPrescription' />
            </div>
        </div>
        {isOpen && <Popup isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
}

export default AddressDetails;