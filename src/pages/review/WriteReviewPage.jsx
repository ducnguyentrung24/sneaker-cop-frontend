import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

import { getOrderDetail } from "../../services/order.service";
import { createReview, getReviewsByOrder } from "../../services/review.service";

function WriteReviewPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);

    const [reviews, setReviews] = useState({});

    useEffect(() => {
        fetchData();
    }, [orderId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Get order detail
            const orderRes = await getOrderDetail(orderId);
            const orderData = orderRes.data;

            // Get reviews by order
            const reviewsRes = await getReviewsByOrder(orderId);
            const reviewedList = reviewsRes.data || [];

            const reviewMap = {};
            reviewedList.forEach((review) => {
                reviewMap[review.order_item_id] = review;
            });

            const initialReview = {};
            orderData.items.forEach((item) => {
                const reviewed = reviewMap[item.id];

                initialReview[item.id] = {
                    rating: reviewed ? reviewed.rating : 5,
                    comment: reviewed ? reviewed.comment : "",
                    submitted: !!reviewed,
                };
            });

            setOrder(orderData);
            setReviews(initialReview);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin đánh giá!");
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (itemId, rating) => {
        setReviews((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                rating,
            },
        }));
    };

    const handleCommentChange = (itemId, value) => {
        setReviews((prev) => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                comment: value,
            },
        }));
    };

    const handleSubmitReview = async (item) => {
        const review = reviews[item.id];

        if (!review?.rating) {
            toast.error("Vui lòng chọn số sao đánh giá");
            return;
        }

        try {
            setSubmittingId(item.id);

            await createReview({
                product_id: item.product_id,
                order_id: order.id,
                order_item_id: item.id,
                rating: review.rating,
                comment: review.comment.trim(),
            });

            setReviews((prev) => ({
                ...prev,
                [item.id]: {
                    ...prev[item.id],
                    submitted: true,
                },
            }));

            toast.success("Gửi đánh giá thành công!");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gửi đánh giá thất bại!"
            );
        } finally {
            setSubmittingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F3F4] pt-24 flex items-center justify-center">
                <div className="bg-white px-8 py-5 rounded-lg shadow-sm text-sm text-gray-500">
                    Đang tải thông tin đánh giá...
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#F3F3F4] pt-24 flex items-center justify-center">
                <div className="bg-white px-8 py-5 rounded-lg shadow-sm text-sm text-gray-500">
                    Không tìm thấy đơn hàng
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F3F4] pt-8 sm:pt-10 pb-10 sm:pb-14 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between sm:contents">
                        {/* Back */}
                        <div className="flex justify-start">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-black transition"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                Quay lại
                            </button>
                        </div>

                        {/* ORDER CODE */}
                        <div className="flex justify-end sm:order-3">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Mã đơn hàng</p>
                                <p className="text-xs sm:text-sm font-bold">#{order.order_code}</p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center sm:order-2">
                        <h1 className="text-xl font-bold uppercase tracking-tight">Đánh giá sản phẩm</h1>
                    </div>
                </div>

                {/* Review cards */}
                <div className="space-y-4 sm:space-y-5">
                    {order.items.map((item) => {
                        const review = reviews[item.id] || {};
                        const isSubmitted = review.submitted;
                        const isSubmitting = submittingId === item.id;

                        return (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                            >

                                {/* Product */}
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-5">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-full h-45 sm:w-28 sm:h-24 object-cover rounded-lg bg-gray-100 border border-gray-200"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-2">{item.product_name}</h2>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        Màu: {item.color}
                                                    </span>

                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        Size: {item.size}
                                                    </span>
                                                </div>
                                            </div>

                                            {isSubmitted && (
                                                <span className="shrink-0 h-fit bg-green-50 text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                    Đã đánh giá
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs font-bold uppercase mt-4 mb-2">
                                            Đánh giá của bạn:
                                        </p>

                                        {/* STARS */}
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    disabled={isSubmitted}
                                                    onClick={() =>
                                                        handleRatingChange(item.id, star)
                                                    }
                                                    className="text-xl disabled:cursor-not-allowed"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className={
                                                            star <= review.rating
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />
                                                </button>
                                            ))}

                                            <span className="text-xs text-gray-500 ml-2">
                                                {review.rating}/5 sao
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                {/* Comment */}
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase mb-2">
                                        Nhận xét:
                                    </label>

                                    <textarea
                                        value={review.comment || ""}
                                        disabled={isSubmitted}
                                        maxLength={500}
                                        onChange={(e) =>
                                            handleCommentChange(
                                                item.id,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nhập cảm nhận của bạn về sản phẩm"
                                        rows={4}
                                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm outline-none resize-none focus:border-orange-500 focus:bg-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    disabled={isSubmitted || isSubmitting}
                                    onClick={() => handleSubmitReview(item)}
                                    className="w-full h-11 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-50 transition"
                                >
                                    {isSubmitted
                                        ? "Đã gửi đánh giá"
                                        : isSubmitting
                                            ? "Đang gửi..."
                                            : "Gửi đánh giá"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default WriteReviewPage;