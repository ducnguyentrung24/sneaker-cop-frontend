import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShieldHalved,
    faTruckFast,
    faArrowsRotate,
    faAward,
} from "@fortawesome/free-solid-svg-icons";

function FeatureSection() {
    const features = [
        {
            icon: faShieldHalved,
            title: "Chính hãng 100%",
            desc: "Sản phẩm chuẩn hãng",
        },
        {
            icon: faTruckFast,
            title: "Miễn phí vận chuyển",
            desc: "Cho đơn hàng đủ điều kiện",
        },
        {
            icon: faArrowsRotate,
            title: "Đổi trả dễ dàng",
            desc: "Hỗ trợ đổi mẫu đổi size",
        },
        {
            icon: faAward,
            title: "Bảo hành 12 tháng",
            desc: "An tâm sau mua",
        },
    ];

    return (
        <section className="py-8 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-white border border-orange-100 rounded-3xl p-4 sm:p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 min-h-20 shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-orange-300 hover:shadow-lg"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                                    <FontAwesomeIcon icon={item.icon} className="text-lg"  />
                                </div>

                                {/* Text */}
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeatureSection;