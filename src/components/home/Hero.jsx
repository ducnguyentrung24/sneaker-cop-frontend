import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ArrowButton from "../common/ArrowButton";

const slides = [
    {
        id:1,
        image: "https://giaycaosmartmen.com/wp-content/uploads/2020/09/giay-nam-sneaker-la-gi.jpg",
        title: "SALE",
        highlight: "OFF",
        desc: "GIẢM GIÁ LÊN ĐẾN 50% CHO SNEAKER CAO CẤP",
    },
    {
        id:2,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_dKw_q6CZJSfXNrsFq7eURWS9quzo71bt0A&s",
        title: "NEW",
        highlight: "ARRIVAL",
        desc: "KHÁM PHÁ BỘ SƯU TẬP MỚI NHẤT",
    }
];

function Hero() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[index];

    return (
        <div className="relative h-130 sm:h-150 md:h-165 overflow-hidden">
            <img src={slide.image} className="w-full h-full object-cover" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="absolute left-6 right-6 sm:left-10 sm:right-auto md:left-auto md:right-20 top-1/2 -translate-y-1/2 text-white max-w-full md:max-w-md">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-none">
                    {slide.title} <span className="text-red-500">{slide.highlight}</span>
                </h1>

                <p className="mt-2 text-sm sm:text-base md:text-lg">
                    {slide.desc}
                </p>

                <button 
                    onClick={() => navigate("/products")}
                    className="mt-6 bg-white text-black px-5 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 hover:opacity-90 transition">
                        MUA NGAY
                </button>
            </div>

            {/* Button arrow left */}
            <ArrowButton direction="left" onClick={prev} className="text-white hidden sm:block" />

            {/* Button arrow right */}
            <ArrowButton direction="right" onClick={next} className="text-white hidden sm:block" />

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1 rounded-full transition-all ${
                            i === index 
                                ? 'w-8 bg-white' 
                                : 'w-4 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;