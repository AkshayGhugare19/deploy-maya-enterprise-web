import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { apiGET } from '../utilities/apiHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { apiDELETE } from '../utilities/apiHelpers';
import { resetUserCartData } from '../redux/carts/carts';
import { toast } from 'react-toastify';


const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const userId = useSelector((state) => state.user.userData.id) || ''
  const getSessionInfo = async (sessionId) => {
    try {
      setLoading(true);
      const response = await apiGET(`/v1/payment/get-session-info/${sessionId}`);
      if (response.status === 200) {
        setData(response.data.data);
        console.log("session data", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching session info: ', error);
      toast.error('Error fetching session info');
    } finally {
      setLoading(false);
    }
  };

  const deleteUserStepperProgress = async () => {
    try {
      setLoading(true);
      const response = await apiDELETE(`/v1/stepper-progress/delete-stepper-progressByUserId/${userId}`);
      if (response.status === 200) {
        dispatch(resetUserCartData())
        console.log("Delete response", response.data.data);
      }
    } catch (error) {
      console.error('Error fetching delete response info: ', error);
      toast.error('Error fetching session info');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      getSessionInfo(sessionId);
      deleteUserStepperProgress()
    }
  }, [location]);

  const formatCurrency = (amount, currency) => {
    let symbol = '';
    switch (currency) {
      case 'usd':
        symbol = '$';
        break;
      case 'inr':
        symbol = '₹';
        break;
      default:
        symbol = currency?.toUpperCase();
    }
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="flex justify-center items-center p-4 font-poppins">
      {loading ? (
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-green-600"></div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="md:flex md:items-center md:space-x-6">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Payment confirmed successfully!</h2>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for your payment! Your transaction is confirmed. If there's anything you need to know, please don't hesitate to reach out to us!
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                <BiArrowBack className="mr-2" /> Go back to home
              </button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {data && formatCurrency(data.amount, data.currency)}
              </h2>
              <p className="text-green-600 text-lg mb-6 text-center">Payment success!</p>
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-2">Payment details</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Date: <span className="font-semibold">{data && new Date(data.created * 1000).toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Reference number: <span className="font-semibold">{data && data.id}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Amount: <span className="font-semibold">{data && formatCurrency(data.amount, data.currency)}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Payment status: <span className="font-semibold text-green-600">{data && 'Success'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
