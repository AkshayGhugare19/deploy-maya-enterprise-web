// src/ProductCard.js
import React from 'react';
import { apiDELETE, apiGET, apiPUT } from '../../utilities/apiHelpers';
import { useSelector } from 'react-redux';

const ProductCardofCart = ({ item, onQuantityChange, onDelete }) => {
    const userId = useSelector((state) => state.user?.userData?.id);


    const handleDelete = () => {
        onDelete(item._id);
    }

    const handleIncrement = () => {
        onQuantityChange('increment', item._id);
    }

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onQuantityChange('decrement', item._id);
        }
    }

    return (
        <div className="flex p-4 bg-white shadow-md rounded-lg mb-4">
            {/* {JSON.stringify(item)} */}
            <img
                className="w-24 h-24 object-cover object-center"
                src={`${item?.productDetails?.bannerImg}`}
                alt="Ace Q10 Capsule"
            />
            <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item?.productDetails?.name}</h3>
                <p className="text-sm text-gray-600">
                    <span className="font-bold">Marketer: </span>{item?.productDetails?.marketer}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-bold">Salt Composition: </span>
                    {item?.productDetails?.saltComposition}
                </p>
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        {[...Array(4)].map((_, i) => (
                            <svg
                                key={i}
                                className="w-4 h-4 text-yellow-500 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.122-6.545L0 7.27l6.561-.953L10 0l3.439 6.317L20 7.27l-5.244 4.275 1.122 6.545z" />
                            </svg>
                        ))}
                        <svg
                            className="w-4 h-4 text-gray-300 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 15l-5.878 3.09 1.122-6.545L0 7.27l6.561-.953L10 0l3.439 6.317L20 7.27l-5.244 4.275 1.122 6.545z" />
                        </svg>
                    </div>
                </div>
                <div className='flex items-center'>

                    <div className="flex justify-between w-full items-center mt-4">
                        <div className='flex items-center'>
                            <div className="flex items-center">
                                <span className="text-gray-500 line-through mr-2">₹{item?.productDetails?.price}</span>
                                <span className="text-lg font-bold text-blue-600">₹{item?.productDetails?.discountedPrice}</span>
                            </div>
                            <div className='ml-4'>
                                <button className="px-3 py-1 bg-gray-200 rounded-md" onClick={handleDecrement}>-</button>
                                <span className="px-3">{item?.quantity}</span>
                                <button className="px-3 py-1 bg-gray-200 rounded-md" onClick={handleIncrement}>+</button>
                            </div>
                        </div>
                        <button className="p-2 text-red-500" onClick={handleDelete}>
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M3 6l3 18h12l3-18H3zm18-4h-5.58L15 0h-6l-.42 2H3v2h18V2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardofCart;
