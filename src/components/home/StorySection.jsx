import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const stories = [
    {
        id: 1,
        title: "TẤT CẢ SẢN PHẨM",
        desc: "Khám phá toàn bộ sneaker tại Sneaker Cop",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=900&auto=format&fit=crop",
        className: "md:row-span-2 md:h-full",
        state: {
            filter: null,
            sort: "newest",
        },
    },
    {
        id: 2,
        title: "SẢN PHẨM MỚI",
        desc: "Những mẫu sneaker mới nhất vừa được cập nhật",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
        className: "",
        state: {
            filter: null,
            sort: "newest",
        },
    },
    {
        id: 3,
        title: "BÁN CHẠY",
        desc: "Các mẫu sneaker được nhiều khách hàng lựa chọn",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop",
        className: "",
        state: {
            filter: "best_seller",
            sort: "newest",
        },
    },
    {
        id: 4,
        title: "ĐANG GIẢM GIÁ",
        desc: "Săn sneaker ưu đãi với mức giá hấp dẫn",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=900&auto=format&fit=crop",
        className: "md:col-span-2",
        state: {
            filter: "discount",
            sort: "newest",
        },
    },
];

function StorySection() {
    const navigate = useNavigate();

    const handleNavigate = (state) => {
        navigate("/products", {
            state: {
                ...state,
                scrollTo: "product-list",
            }
        });
    };

    return (
        <section className="bg-white py-10 sm:py-12 md:py-14">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-8">
                    <p className="text-xs font-bold text-orange-500 tracking-widest mb-2">
                        QUICK DISCOVER
                    </p>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                        KHÁM PHÁ SNEAKER THEO NHU CẦU
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-115">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => handleNavigate(story.state)}
                            className={`group relative overflow-hidden rounded-2xl cursor-pointer min-h-55 bg-gray-200 shadow-sm
                                ${story.className}
                            `}
                        >
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute left-5 right-5 bottom-5 text-white">
                                <p className="text-[11px] font-bold tracking-[3px] text-orange-400 mb-2">SNEAKER COP</p>

                                <h3 className="text-xl sm:text-2xl font-black tracking-wide">
                                    {story.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-sm leading-relaxed">
                                    {story.desc}
                                </p>

                                <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition">
                                    Xem ngay
                                    <FontAwesomeIcon icon={faArrowRight} className="transition group-hover:translate-x-1" />
                                </div>
                            </div>

                            {/* Hover border */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-2xl transition"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StorySection;