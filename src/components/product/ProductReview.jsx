import { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { use } from 'react';

function ProductReview({ productId, reviewData, reviewFilters, setReviewFilters }) {
    const {
        average_rating = 0,
        total_reviews = 0,
        reviews = [],
        rating_distribution = {},
    } = reviewData;

    const breakdown = [5, 4, 3, 2, 1].map(star => {
        const count = rating_distribution[star] || 0;
        const percent = total_reviews
            ? (count / total_reviews) * 100
            : 0;

        return { star, percent };
    });

    return (
        <div className='mt-8 grid grid-cols-12 gap-10'>
            {/* Left */}
            <div className='col-span-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-bold text-sm font'>ĐÁNH GIÁ TỪ KHÁCH HÀNG</h3>

                    {/* Dropdown Filter */}
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-bold text-black'>
                            Lọc theo:
                        </span>

                        <select
                            value={reviewFilters?.rating ?? ""}
                            onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);

                                console.log("Rating: ", value, typeof value);
                                setReviewFilters(prev => ({
                                    ...prev,
                                    rating: value,
                                    page: 1
                                }));

                            }}
                            className='px-3 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black'
                        >
                            <option value="">Tất cả</option>
                            <option value="5">5 sao</option>
                            <option value="4">4 sao</option>
                            <option value="3">3 sao</option>
                            <option value="2">2 sao</option>
                            <option value="1">1 sao</option>
                        </select>
                    </div>
                </div>

                {/* Reviews */}
                {reviews.map(r => (
                    <div key={r.id} className='mb-6 border-b border-gray-300 pb-4'>
                        {/* Name */}
                        <p className='font-semibold text-sm'>
                            {r.user?.full_name}
                        </p>

                        {/* Star + date */}
                        <div className='flex items-center gap-2 mt-1'>
                            <div className='flex text-orange-500 text-[10px]'>
                                {[...Array(5)].map((_, i) => (
                                    <FontAwesomeIcon
                                        key={i}
                                        icon={faStar}
                                        className={i < r.rating ? '' : 'text-gray-300'}
                                    />
                                ))}
                            </div>

                            <span className='text-gray-400 text-xs'>
                                {new Date(r.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Comment */}
                        <p className='mt-2 text-sm text-gray-600'>
                            {r.comment}
                        </p>
                    </div>
                ))}

                {/* Load more */}
                {reviews.length < (
                    reviewFilters.rating
                        ? rating_distribution[reviewFilters.rating] || 0
                        : total_reviews
                ) && (
                    <div className='text-center mt-6'>
                        <button
                            onClick={() => setReviewFilters(prev => ({
                                ...prev,
                                page: prev.page + 1,
                            }))}
                            className='px-6 py-2 border rounded text-sm hover:bg-gray-100'
                        >
                            XEM THÊM
                            <FontAwesomeIcon icon={faChevronDown} className='text-xs' />
                        </button>
                    </div>
                )}
            </div>

            {/* Right */}
            <div className='col-span-4 bg-gray-50 p-6 rounded'>
                {/* Avg */}
                <div className='text-5xl font-bold text-center'>
                    {average_rating.toFixed(1)}
                </div>

                {/* Stars */}
                <div className='flex justify-center text-orange-500 mt-2'>
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.round(average_rating) ? '' : 'text-gray-300'}
                        />
                    ))}
                </div>

                {/* Total */}
                <p className='text-center text-xs text-gray-500 mt-1 mb-4'>
                    {total_reviews} ĐÁNH GIÁ
                </p>

                {/* Rating distribution */}
                {breakdown.map(item => (
                    <div key={item.star} className='flex items-center gap-2 mb-2 text-xs'>
                        <span className='w-4 text-gray-500'>{item.star}</span>

                        <div className='flex-1 bg-gray-200 h-1 rounded'>
                            <div
                                className='bg-orange-500 h-1 rounded'
                                style={{ width: `${item.percent}%` }}
                            />
                        </div>

                        <span className='w-10 text-right text-gray-400'>
                            {item.percent.toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReview;