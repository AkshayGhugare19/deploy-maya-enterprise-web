import React, { useState, useEffect, useRef } from "react";
import { apiPOST } from "../../utilities/apiHelpers";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Popup({ isOpen, setIsOpen, onUpdate }) {
  const [addressFormData, setAddressFormData] = useState({
    Name: '',
    addressLine1: '',
    addressLine2: '',
    zip: '',
    country: '',
    city: '',
    state: ''
  });

  const [errors, setErrors] = useState({});

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const alphaRegex = /^[A-Za-z\s]+$/;
    const zipRegex = /^\d{6}$/;

    if (!addressFormData.Name.trim()) {
      newErrors.Name = "Name is required";
    } else if (!alphaRegex.test(addressFormData.Name)) {
      newErrors.Name = "Enter alphabets only";
    }

    if (!addressFormData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address 1 is required";
    } else if (addressFormData.addressLine1.length > 40) {
      newErrors.addressLine1 = "Address 1 should not be more than 40 characters";
    }

    if (!addressFormData.addressLine2.trim()) {
      newErrors.addressLine2 = "Address 2 is required";
    } else if (addressFormData.addressLine2.length > 40) {
      newErrors.addressLine2 = "Address 2 should not be more than 40 characters";
    }

    if (!addressFormData.zip.trim()) {
      newErrors.zip = "Pincode is required";
    } else if (!zipRegex.test(addressFormData.zip)) {
      newErrors.zip = "Pincode should be exactly 6 digits";
    }

    if (!addressFormData.country.trim()) {
      newErrors.country = "Country is required";
    } else if (!alphaRegex.test(addressFormData.country)) {
      newErrors.country = "Country should contain only alphabets";
    }

    if (!addressFormData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!alphaRegex.test(addressFormData.city)) {
      newErrors.city = "City should contain only alphabets";
    }

    if (!addressFormData.state.trim()) {
      newErrors.state = "State is required";
    } else if (!alphaRegex.test(addressFormData.state)) {
      newErrors.state = "State should contain only alphabets";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await apiPOST('/v1/address/add-address', addressFormData);
      if (response.status) {
        // Clear the form data
        setAddressFormData({
          Name: '',
          addressLine1: '',
          addressLine2: '',
          zip: '',
          country: '',
          city: '',
          state: ''
        });
        setErrors({});
        togglePopup();
        // onUpdate();
        toast.success('Address added successfully');
      } else {
        // Handle error
        console.error('Error adding address:', response.data.message);
        toast.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={popupRef} className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[732px] max-h-[90vh] overflow-y-auto scrollbar-custom scroll-smooth relative">
            <button
              onClick={togglePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-xl font-bold mb-4">Add New Address</h1>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="Name"
                    value={addressFormData.Name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.Name && <span className="text-xs text-red-500">{errors.Name}</span>}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Address 1</label>
                <textarea
                  name="addressLine1"
                  value={addressFormData.addressLine1}
                  onChange={handleChange}
                  placeholder="Address 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {errors.addressLine1 && <span className="text-xs text-red-500">{errors.addressLine1}</span>}
              </div>
              <div>
                <label className="block text-gray-700">Address 2</label>
                <textarea
                  name="addressLine2"
                  value={addressFormData.addressLine2}
                  onChange={handleChange}
                  placeholder="Address 2 (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {errors.addressLine2 && <span className="text-xs text-red-500">{errors.addressLine2}</span>}
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="zip"
                    value={addressFormData.zip}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.zip && <span className="text-xs text-red-500">{errors.zip}</span>}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addressFormData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.country && <span className="text-xs text-red-500">{errors.country}</span>}
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={addressFormData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={addressFormData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
                </div>
              </div>
              <button type="submit" className='rounded-full bg-[#14967F] text-sm text-[#FFFFFF] p-3'>Save & Update</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
