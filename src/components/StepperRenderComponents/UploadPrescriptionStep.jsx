import React, { useState, useEffect } from "react";
import UploadPrescriptionInput from "../presecription/UploadPrescriptionInput";
import ShowSavedPrescription from "../presecription/ShowSavedPrescription";
import ValidPrescriptionFormat from "../presecription/ValidPrescriptionFormat";
import { apiGET, apiPOST } from '../../utilities/apiHelpers';
import { API_URL } from '../../config';
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedPrescription, updateStep } from "../../redux/carts/carts";
import FileUploadInput from "../Input/FileUploadInput";
import { toast } from "react-toastify";
import ShowSelectedPrescription from "../presecription/ShowSelectedPrescription";
import scrollToTop from "../../utilities/scrollToTop";

const UploadPrescriptionStep = ({ type, setCurrentStep }) => {
    const dispatch = useDispatch()
    const [savedPrescription, setSavedPrescription] = useState([]);
    const [selectedImageIndexes, setSelectedImageIndexes] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState([]);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const userId = useSelector((state) => state.user?.userData?.id) || ""
    const loggedInUserCartData = useSelector((state) => state.cart.cartData) || []

    const checkIsPriscriptionMandatory = () => {
        return loggedInUserCartData?.some((item) => item.productDetails?.isPrescription === true);
    }

    const getAllSavedPrescription = async () => {
        try {
            const response = await apiGET(`${API_URL}/v1/prescription/get-prescription-by-user/${userId}`);
            if (response?.data?.status) {
                setSavedPrescription(response?.data?.data?.data);
            } else {
                console.error("Something went wrong");
                setSavedPrescription([]);
            }
        } catch (error) {
            console.error("Something went wrong", error);
            setSavedPrescription([]);
        }
    };

    const selectedPrescription = () => {
        if (checkIsPriscriptionMandatory()) {
            if (selectedImageUrl.length) {
                console.log("selectedImageUrl", selectedImageUrl);
                dispatch(updateSelectedPrescription(selectedImageUrl))
                if (type == 'uploadPrescription') {
                    setCurrentStep();
                }
            }
            else {
                toast.error("Upload or Select Prescription to proceed")
            }
        }
        // if (type === 'cart' && selectedImageUrl.length) {
        //     console.log("selectedImageUrl", selectedImageUrl);
        //     dispatch(updateSelectedPrescription(selectedImageUrl))
        // }
        // else if (uploadedFileUrl) {
        //     setCurrentStep();
        // }
        else {
            console.log("Inside else", selectedImageUrl);
            //for stepper to update if image not selected
            dispatch(updateStep(2));
        }
    }

    const uploadPrescription = async () => {
        try {
            const prescriptionPayload = {
                userId: userId,
                prescriptionImgUrl: uploadedFileUrl,
                title: "Test 1"
            }
            const prescriptionResponse = await apiPOST(`${API_URL}/v1/prescription/add-prescription-img`, prescriptionPayload);
            if (prescriptionResponse) {
                toast.success("Prescription Added successfully!");
                setUploadStatus('File uploaded successfully!');
                console.log("prescriptionResponse", prescriptionResponse.data.data.data);
                if (type === "uploadPrescription") {
                    dispatch(updateSelectedPrescription(prescriptionResponse.data.data.data))
                }
                getAllSavedPrescription()
            } else {
                setUploadStatus('Failed to upload file.');
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        scrollToTop()
        getAllSavedPrescription();
    }, [uploadStatus]); // Trigger fetch on initial render and whenever uploadStatus changes

    useEffect(() => {
        if (uploadedFileUrl) {
            uploadPrescription();
        }
    }, [uploadedFileUrl]); // Trigger fetch on initial render and whenever uploadStatus changes
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg mt-4 w-full">
            <label className="block mb-2 text-lg font-bold text-gray-700">
                Upload Prescription
            </label>
            <div className="flex justify-between w-full">
                <div className="flex flex-col w-full">
                    <FileUploadInput setUploadedFileUrl={setUploadedFileUrl} />
                    {/* <UploadPrescriptionInput setUploadStatus={setUploadStatus} /> */}
                    {
                        // type === 'cart' ? <ShowSavedPrescription
                        //     selectedImageIndexes={selectedImageIndexes}
                        //     savedPrescription={savedPrescription}
                        //     setSelectedImageIndexes={setSelectedImageIndexes}
                        //     setSelectedImageUrl={setSelectedImageUrl} /> : <ShowSelectedPrescription selectedUrl={uploadedFileUrl} />
                        <ShowSavedPrescription
                            selectedImageIndexes={selectedImageIndexes}
                            savedPrescription={savedPrescription}
                            setSelectedImageIndexes={setSelectedImageIndexes}
                            setSelectedImageUrl={setSelectedImageUrl} />
                    }
                    <div className="flex justify-end">
                        <button
                            className="w-[100px] py-2 bg-[#14967F] text-white rounded-[30px] mt-4"
                            onClick={selectedPrescription}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="border-l border-gray-300 ml-4 mr-8"></div>
                <div>
                    <ValidPrescriptionFormat />
                </div>
            </div>
        </div>
    );
}
export default UploadPrescriptionStep;