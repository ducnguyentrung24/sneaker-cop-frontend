import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function ProductReview({ reviewData }) {
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

        return {
            star,
            percent,
        };
    });

    return (
        <div className='mt-8 grid grid-cols-12 gap-10'>
            {/* Left */}
            <div className='col-span-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='font-bold text-sm font'>ĐÁNH GIÁ TỪ KHÁCH HÀNG</h3>

                    <button className='text-xs text-black font-bold pb-1 mr-2 border-b-3 border-black hover:border-orange-500 hover:text-orange-500'>
                        XEM TẤT CẢ
                    </button>
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