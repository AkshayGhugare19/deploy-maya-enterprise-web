import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiPOST } from "../../utilities/apiHelpers";
import { useSelector } from "react-redux";

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const formData = location.state;

  console.log("FormData::::::::::::::::: ", formData);

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setloading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus on the next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const validateOTP = () => {
    if (otp.includes("")) {
      return "Please enter the complete OTP.";
    }
    return "";
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateOTP();
    if (validationError) {
      setErrors(validationError);
    } else {
      // Handle OTP verification logic here
      console.log("OTP entered:", otp.join(""));
      setErrors("");
      try {
        let payload = {
          otp:  otp.join(""),
          email: formData.email,
        };
        setloading(true);
        const response = await apiPOST("v1/auth/verify-otp", payload);
        console.log("response", response);
        if (response.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "OTP verified Successfully",
            icon: "success",
          }).then(() => {
              navigate('/login');
          });
        } else {
          Toast.fire({
            title: "Error!",
            text: response.data?.message || "Something went wrong!",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("error", error);
        Toast.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
          icon: "error",
        });
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <div className="flex max-w-4xl md:mx-auto mt-10 border rounded-lg overflow-hidden shadow-lg mx-5">
      <div
        style={{ backgroundColor: "#F1F9FF" }}
        className=" hidden md:block lg:block   flex-1 p-10 flex flex-col rounded-xl items-end"
      >
        <h2 className="text-2xl font-bold mb-4">Medicines, Home Delivered</h2>
        <p className="text-xs text-gray-400">
          Order any medicine or health product and we'll deliver it for free.
          Enjoy discounts on everything.
        </p>
      </div>
      <div className="flex-1 p-10 bg-white ">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
          <button className="text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="mb-8">
          <p className="text-gray-600 text-xs">
            Provide OTP sent to {phoneNumber}{" "}
            <Link to="#" className="text-[#095D7E] no-underline">
              Edit
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="">
            <div className="mb-2">
              <p className="text-gray-600 text-sm">Enter OTP </p>
            </div>
            <div className="flex justify-between mb-4">
              {otp.map((data, index) => {
                return (
                  <input
                    className=" w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 md:w-16 md:h-16  text-center rounded-lg border bg-[#F8F8F8]"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>
            {errors && (
              <div className="text-red-500 text-sm mb-4">{errors}</div>
            )}
            <div className="text-center mb-24">
              <Link
                to="#"
                className="text-[#14967F] text-sm font-semibold no-underline"
              >
                Resend OTP?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-[#095D7E] rounded-full"
          >
            Verify OTP
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-600">
          New on MAYA ENTERPRISE?{" "}
          <Link to="/signup" className="text-[#095D7E] no-underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;