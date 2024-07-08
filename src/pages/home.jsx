import React, { useEffect } from 'react'
import Brand from '../components/topBrand/brand'
import MainSlider from '../components/banner/MainSlider'
import KidenyTopRated from '../components/TopRatedComponent/KidenyTopRated'
import TopUnaniKidneyCareRated from '../components/TopUnaniKidneyCare/TopUnaniKidneyCareRated'
import Banner from '../components/banner/Banner'
import KidneyMedicines from '../components/kidneyMedicines/KidneyMedicines'
import { useDispatch, useSelector } from 'react-redux'
import { resetCurrentStep, resetStateForEnquiry, setUserCartData } from '../redux/carts/carts'

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetStateForEnquiry())
  }, [])
  return (
    <div className=' '>
      <div className='container mx-auto px-4'>
        <MainSlider />
        <KidenyTopRated />
        <Brand />
        <TopUnaniKidneyCareRated />
        <Banner />
        <KidneyMedicines />
      </div>
    </div>
  )
}

export default Home
