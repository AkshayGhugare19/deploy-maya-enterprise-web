
import React, { useState, useEffect } from 'react';
import presecriptionIcon from "../../assest/icons/prescriptionIcon.png";
import CartIcon from "../../assest/icons/whiteCartIcon.png";
import grayCircleIcon from "../../assest/icons/grayCircle.png";
import renderStars from "../../utilities/renderProductStars";
import { apiGET, apiPOST } from "../../utilities/apiHelpers";
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, setUserCartData, updateCartItemQuantity } from '../../redux/carts/carts';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import { RiDeleteBinLine } from 'react-icons/ri';

const menuItems = [
    'Overview',
    'Uses and benefits',
    'Side effects',
    'How to use',
    'How drug works',
    'Safety advice',
    'Missed dose',
    'All substitutes',
    'Quick tips',
    'Fact box',
    'Patient concerns',
    'FAQs'
];

const ProductDetailsCard = ({ productInformations, productData }) => {
    const [count, setCount] = useState(1);
    const [activeItem, setActiveItem] = useState('');
    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state) => state.user?.userData?.id) || false
    const loggedInUserCartData = useSelector((state) => state.cart.cartData) || []

    const stars = Array(5).fill('').map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill={i < productInformations?.productDetails?.avgRating ? "#F1C320" : "#CCECEE"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.39 2.454a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.539 1.118l-3.39-2.454a1 1 0 00-1.175 0l-3.39 2.454c-.783.57-1.838-.197-1.539-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.535 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
    ));

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setActiveItem(id);
        }
    };

    const handleIncrement = (productId) => {
        const currentQuantity = fetchCartQuantity(productId);
        const id = fetchCartId(productId);
        console.log("handleIncrement cartId", id);
        dispatch(updateCartItemQuantity({ type: 'increment', id, quantity: currentQuantity }));
    };

    const handleDecrement = (productId) => {
        const currentQuantity = fetchCartQuantity(productId);
        const id = fetchCartId(productId);
        console.log("handleDecrement cartId", id);
        if (currentQuantity > 1) {
            dispatch(updateCartItemQuantity({ type: 'decrement', id, quantity: currentQuantity }));
        }
    };

    const checkCartDataExists = (id) => {
        return loggedInUserCartData?.some((item) => item.productDetails?._id === id);
    }

    const fetchCartQuantity = (id) => {
        const product = loggedInUserCartData.find((item) => item.productDetails._id === id);
        return product ? product.quantity : 0;
    };

    const fetchCartId = (id) => {
        const product = loggedInUserCartData.find((item) => item.productDetails._id === id);
        return product ? product._id : 0;
    };

    const addToCart = async (id) => {
        if (isLoggedIn) {
            console.log(id);
            try {
                const payload = {
                    productId: id,
                    userId: isLoggedIn,
                    quantity: 1
                }
                const response = await apiPOST(`/v1/cart/add`, payload);
                if (response.status) {
                    dispatch(setUserCartData(isLoggedIn))
                    toast.success("Product added to cart")
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error("Please Login First");
        }
    }

    const handleRemoveCartItem = (id) => {
        const cartId = fetchCartId(id) || '';
        dispatch(deleteCartItem(cartId));
        toast.success('Cart Item Removed Successfully!')
    };

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = '';
            menuItems.forEach(item => {
                const section = document.getElementById(item.replace(/\s+/g, '-').toLowerCase());
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 80 && rect.bottom >= 80) {
                        currentSection = item.replace(/\s+/g, '-').toLowerCase();
                    }
                }
            });
            setActiveItem(currentSection);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <div className="w-full h-[450px] lg:w-64 bg-white shadow-md rounded-lg p-4 mb-4 lg:mb-0">
                <ul>
                    {menuItems.map((item, index) => {
                        const id = item.replace(/\s+/g, '-').toLowerCase();
                        return (
                            <li key={index} className="my-2">
                                <a
                                    href={`#${id}`}
                                    className={`text-gray-800 hover:text-black flex justify-between ${activeItem === id ? 'text-gray-500' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(id);
                                    }}
                                >
                                    <span>{item}</span>
                                    <span>›</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='w-full'>
                <div className="w-full bg-white shadow-lg rounded-lg ">
                    <div className='p-4'>
                        <div className='w-full gap-4 lg:flex'>
                            <div className='w-[100%]'>
                                <div className='border flex justify-center  rounded-md'>
                                    <img className="w-full object-cover mx-auto rounded-md" src={productData?.bannerImg} alt="Ace Q10 Capsule" />
                                </div>
                                <div className="flex space-x-4 mb-10">
                                    {productData?.images?.map((image, id) =>
                                        <div className=" w-16 h-16 lg:w-24 lg:h-28 md:w-24 md:h-28 sm:w-24 sm:h-28 mt-4 bg-gray-200 rounded-lg">
                                            <img src={image} alt="" />
                                        </div>
                                    )}

                                </div>
                            </div>
                            <div className="w-full p-1">
                                <div className="flex justify-between items-center mb-2">
                                    {productInformations?.productDetails?.isPrescription &&
                                        <div className="flex items-center">
                                            <img src={presecriptionIcon} alt="Prescription Icon" />
                                            <div className="ml-2 text-gray-700 text-xs">Prescription</div>
                                        </div>
                                    }
                                    <div className="text-gray-700 flex ">{renderStars(productData?.avgRating)}</div>
                                </div>
                                <div className="text-xl font-semibold text-2xl mb-4">{productData?.name}</div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Marketer</div>
                                    <div className='text-xs'>: {productData?.marketer}</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Salt Composition</div>
                                    <div className='text-xs'>:{productData?.saltComposition}</div>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex">
                                    <div className="font-semibold text-xs w-36">Origin of Medicine</div>
                                    <div className='text-xs'>: {productData?.origin}</div>
                                </div>
                                <hr />
                                <div className='w-full flex justify-between mt-4'>
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold text-gray-800 mr-2">₹{productData?.price}</div>
                                        <div className="text-lg line-through text-gray-500">₹{productData?.discountedPrice}</div>
                                    </div>
                                    {checkCartDataExists(id) && <div className="flex items-center">
                                        <div className="w-full flex items-center justify-between rounded-full">
                                            <button
                                                className="bg-[#F3F3F3] text-[#373435] rounded-[12px] w-[42px] h-full py-2 flex items-center justify-center focus:outline-none"
                                                onClick={() => handleDecrement(id)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-4 text-lg">{fetchCartQuantity(id)}</span>
                                            <button
                                                className="bg-[#F3F3F3] text-[#373435] rounded-[12px] w-[42px] h-full py-2 flex items-center justify-center focus:outline-none"
                                                onClick={() => handleIncrement(id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>}
                                </div>
                                <div>{productData?.stripCapsuleQty} Capsule(S) In A Strip</div>
                                {
                                    !isLoggedIn ? (
                                        <button button className="flex items-center justify-center w-full py-2 text-white bg-[#14967F] rounded-full hover:bg-teal-700 mt-4 transition duration-300 transform hover:scale-105" onClick={(e) => addToCart(id ? id : '')}>
                                            <img src={CartIcon} className="mr-2" alt="Cart Icon" />
                                            <span className="font-semibold">Add to Cart</span>
                                        </button>
                                    ) : (
                                        checkCartDataExists(id) ? (
                                            <div className="w-full flex gap-3 items-center justify-between mt-4 rounded-full">
                                                <button
                                                    className="bg-[#f0fdfa] text-[#14967F] rounded-full w-[70%] h-full py-2 px-10 flex items-center gap-3 justify-center focus:outline-none hover:bg-[#14967F] hover:shadow-lg hover:text-[#f0fdfa]"
                                                    onClick={() => navigate('/view-cart')}
                                                >
                                                    Go to Cart <GoArrowRight />
                                                </button>
                                                <button
                                                    className="bg-[#fecaca] text-[#dc2626] rounded-full w-[30%] h-full py-2 flex items-center gap-2 justify-center focus:outline-none  hover:shadow-lg"
                                                    onClick={() => handleRemoveCartItem(id)}
                                                >
                                                    <RiDeleteBinLine /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <button button className="flex items-center justify-center w-full py-2 text-white bg-[#14967F] rounded-full hover:bg-teal-700 mt-4 transition duration-300 transform hover:scale-105" onClick={(e) => addToCart(id ? id : '')}>
                                                <img src={CartIcon} className="mr-2" alt="Cart Icon" />
                                                <span className="font-semibold">Add to Cart</span>
                                            </button>
                                        )
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </div>
                <div className='flex flex-col gap-4 mt-4'>
                    <div id="overview" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Introduction to Ace Q10 Capsule</div>
                        <div className='text-[20px] font-medium'>{productInformations?.introduction}</div>
                    </div>
                    <div id="uses-and-benefits" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Uses of Ace Q10 Capsule</div>
                        <div className='text-[20px] font-medium'>{productInformations?.uses}</div>
                    </div>
                    <div id="side-effects" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Side Effects of Ace Q10 Capsule</div>
                        <div className='text-[20px] font-medium'>{productInformations?.therapeuticEffects}</div>
                    </div>
                    <div id="how-to-use" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>How to Use Ace Q10 Capsule</div>
                        <div className='text-[20px] font-medium'>{productInformations?.interaction}</div>
                    </div>
                    <div id="how-drug-works" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>How Drug Works</div>
                        <div className='text-[20px] font-medium'>{productInformations?.moreInformationabout}</div>
                    </div>
                    {/* <div id="how-drug-works" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>How Drug Works</div>
                        <div className='text-[20px] font-medium'>{productInformations?.howtoconsume}</div>
                    </div> */}
                    <div id="safety-advice" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='text-[20px] font-medium mb-2'>Safety Advice for Ace Q10 Capsule</div>
                        {productInformations?.safetyAdvices && Object.keys(productInformations.safetyAdvices).map((key, index) => (
                            <div key={index} className='flex mt-4 items-center'>
                                <img src={grayCircleIcon} className='h-9 w-9' alt="Icon" />
                                <div className='ml-4'>
                                    <div className='font-semibold text-xs'>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div className="text-xs">{productInformations.safetyAdvices[key]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id="missed-dose" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Missed Dose</div>
                        <div className='text-[20px] font-medium'>{productInformations?.sideEffects}</div>
                    </div>
                    <div id="all-substitutes" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>All Substitutes</div>
                        <div className='text-[20px] font-medium'>{productInformations?.wordofAdvice}</div>
                    </div>
                    {/* <div id="quick-tips" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Quick Tips</div>
                        <div className='text-xs'>{productInformations?.quickTips}</div>
                    </div>
                    <div id="fact-box" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Fact Box</div>
                        <div className='text-xs'>{productInformations?.factBox}</div>
                    </div>
                    <div id="patient-concerns" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>Patient Concerns</div>
                        <div className='text-xs'>{productInformations?.patientConcerns}</div>
                    </div>
                    <div id="faqs" className='bg-white shadow-md rounded-lg p-4'>
                        <div className='font-bold mb-2'>FAQs</div>
                        <div className='text-xs'>{productInformations?.faqs}</div>
                    </div> */}
                </div>
            </div>
        </div >
    );
};

export default ProductDetailsCard;
