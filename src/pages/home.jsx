import React, { useEffect, useState } from 'react'
import Brand from '../components/topBrand/brand'
import MainSlider from '../components/banner/MainSlider'
import KidenyTopRated from '../components/TopRatedComponent/KidenyTopRated'
import TopUnaniKidneyCareRated from '../components/TopUnaniKidneyCare/TopUnaniKidneyCareRated'
import Banner from '../components/banner/Banner'
import KidneyMedicines from '../components/kidneyMedicines/KidneyMedicines'
import { useDispatch, useSelector } from 'react-redux'
import { resetCurrentStep, resetStateForEnquiry, setUserCartData } from '../redux/carts/carts'
import { apiGET } from '../utilities/apiHelpers'
import { setCartCount } from '../redux/users/users'

const Home = () => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user?.userData?.id) || '';
  const [stepperProgressCartData, setStepperProgressCartData] = useState([]);
  const getUserStepperProgress = async () => {
    if (userId) {
      try {
        const stepperResponse = await apiGET(`/v1/stepper-progress/user-stepper-progress/${userId}`)
        setStepperProgressCartData(stepperResponse.data?.data);
        dispatch(setCartCount(stepperResponse.data?.data?.cartData.length));
      } catch (error) {
        console.log("Error fetching cart details", error);
      }
    }
  }
  useEffect(() => {
    getUserStepperProgress();
    dispatch(resetStateForEnquiry())
  }, [])
  return (
    <div className=' '>
      <div className='container mx-auto px-4'>
        <MainSlider />
        <KidenyTopRated stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
        <Brand />
        <TopUnaniKidneyCareRated stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
        <Banner />
        <KidneyMedicines stepperProgressCartData={stepperProgressCartData} setStepperProgressCartData={setStepperProgressCartData} />
      </div>
    </div>
  )
}

export default Home
