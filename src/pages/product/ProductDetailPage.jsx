import { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getProductById, getProducts } from '../../services/product.service';
import { getReviewsByProductId } from '../../services/review.service';

import ProductGallery from '../../components/product/ProductGallery';
import ProductInfo from '../../components/product/ProductInfo';
import ProductDescription from '../../components/product/ProductDescription';
import ProductReView from '../../components/product/ProductReview';
import ProductSlider from '../../components/product/ProductSlider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);

    const [reviewData, setReviewData] = useState({
        average_rating: 0,
        total_reviews: 0,
        reviews: [],
        rating_distribution: {},
    });

    const [actieveTab, setActiveTab] = useState("description");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductById(id);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const fetchReviews = async () => {
            try {
                const res = await getReviewsByProductId(id);
                setReviewData({
                    average_rating: res.data.average_rating,
                    total_reviews: res.data.total_reviews,
                    reviews: res.data.reviews,
                    rating_distribution: res.data.rating_distribution,
                });
            } catch(error) {
                console.error("Failed to fetch reviews: ", error);
            }
        };

        fetchReviews();
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const fetchRelated = async () => {
            try {
                const res = await getProducts({
                    category_id: product.category_id,
                    limited: 10,
                });
                setRelated(res.data.data);
            } catch(error) {
                console.error("Failed to fetch related products: ", error);
            }   
        };

        fetchRelated();
    }, [product]);

    if (!product) return <div>Đang tải...</div>;

    return (
        <div className='max-w-7xl mx-auto px-6 py-10'>
            {/* Button back */}
            <div className='mb-4'>
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-sm text-gray-600 hover:text-black'
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </button>
            </div>

            {/* Product */}
            <div className='grid grid-cols-12 gap-10'>
                <div className='col-span-7'>
                    <ProductGallery 
                        product={product} 
                        selectedColor={selectedColor}
                    />
                </div>

                <div className='col-span-5'>
                    <ProductInfo 
                        product={product} 
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        reviewStats={reviewData}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className='mt-10 flex gap-6 text-xs font-semibold'>
                <button
                    onClick={() => setActiveTab("description")}
                    className={`pb-2 
                        ${actieveTab === "description"
                            ? 'font-bold px-3 border-b-3 border-orange-500'
                            : 'text-gray-400'
                        }
                    `}
                >
                    MÔ TẢ SẢN PHẨM
                </button>

                <button
                    onClick={() =>setActiveTab("reviews")}
                    className={`pb-2
                        ${actieveTab === "reviews"
                            ? 'font-bold px-3 border-b-3 border-orange-500'
                            : 'text-gray-400'
                        }
                    `}
                >
                    ĐÁNH GIÁ SẢN PHẨM
                </button>
            </div>

            {/* Description/Reviews */}
            {actieveTab === "description" ? (
                <ProductDescription product={product} />
            ) : (
                <ProductReView
                    productId={id}
                    reviewData={reviewData}
                />
            )}  

            {/* Related */}
            <div className='mt-10'>
                <h2 className='font-bold mb-4'>SẢN PHẨM TƯƠNG TỰ</h2>
                <ProductSlider products={related} />
            </div>
        </div>
    );
};

export default ProductDetailPage;