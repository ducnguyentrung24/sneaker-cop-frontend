import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBolt,
    faFire,
    faRankingStar,
    faMedal
} from "@fortawesome/free-solid-svg-icons";

function FeatureSection() {
    const features = [
        {
            icon: faBolt,
            title: "Xu Hướng Mới",
            desc: "Cập nhật sneaker hot nhất mỗi ngày"
        },
        {
            icon: faFire,
            title: "Giảm Giá",
            desc: "Sản phẩm đang có ưu đãi hấp dẫn"
        },
        {
            icon: faRankingStar,
            title: "Bán Chạy",
            desc: "Những mẫu được yêu thích nhất"
        },
        {
            icon: faMedal,
            title: "Thương Hiệu",
            desc: "Nike, Adidas, Puma, Vans..."
        }
    ];

    return (
        <section className="py-10">
            <div className="max-w-300 mx-auto px-4">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 min-h-23"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className="text-red-500 text-xl"
                                />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col justify-center">
                                <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
                                    {item.title}
                                </h3>

                                <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}

export default FeatureSection;