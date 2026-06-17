import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faCreditCard,
    faHeadset,
    faRuler,
    faShieldHalved,
    faTruckFast,
    faRotateLeft,
    faBoxOpen,
    faClock,
    faPhone,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const supportCards = [
    {
        icon: faRuler,
        title: "Hướng dẫn chọn size",
        desc: "Gợi ý chọn size sneaker phù hợp theo chiều dài bàn chân và form giày.",
    },
    {
        icon: faTruckFast,
        title: "Giao hàng",
        desc: "Theo dõi thời gian xử lý đơn hàng và chính sách vận chuyển.",
    },
    {
        icon: faRotateLeft,
        title: "Đổi trả",
        desc: "Hỗ trợ đổi trả sản phẩm khi sai size, lỗi sản phẩm hoặc sai thông tin đơn.",
    },
    {
        icon: faCreditCard,
        title: "Thanh toán",
        desc: "Hỗ trợ thanh toán COD và VNPay Sandbox trong quá trình đặt hàng.",
    },
];

const sizeRows = [
    {
        foot: "23.5 - 24.1 cm",
        vn: "39 - 40",
    },
    {
        foot: "24.4 - 25.4 cm",
        vn: "40 - 41",
    },
    {
        foot: "25.7 - 26.7 cm",
        vn: "41 - 43",
    },
    {
        foot: "27 - 27.9 cm",
        vn: "43 - 44",
    },
    {
        foot: "28.3 - 28.6 cm",
        vn: "44 - 45",
    },
    {
        foot: "29.4 - 31.8 cm",
        vn: "46 - 49",
    },
];

const sizeTips = [
    "Đo chiều dài bàn chân vào cuối ngày để có kết quả chính xác hơn.",
    "Nếu số đo nằm giữa 2 size, nên chọn size lớn hơn để mang thoải mái hơn.",
    "Một số mẫu sneaker có form rộng hoặc ôm chân, nên xem kỹ thông tin sản phẩm trước khi đặt hàng.",
];

const faqItems = [
    {
        question: "Làm thế nào để chọn đúng size giày?",
        answer: "Bạn nên đo chiều dài bàn chân theo cm, sau đó đối chiếu với bảng size VN trong phần hướng dẫn. Nếu số đo nằm giữa hai size, nên chọn size lớn hơn để mang thoải mái hơn.",
    },
    {
        question: "Làm thế nào để thêm sản phẩm vào giỏ hàng?",
        answer: "Bạn cần chọn đầy đủ màu sắc, size và số lượng trước khi thêm sản phẩm vào giỏ hàng. Nếu biến thể đã hết hàng hoặc số lượng vượt quá tồn kho, hệ thống sẽ không cho phép thêm vào giỏ.",
    },
    {
        question: "Thanh toán VNPay thất bại thì đơn hàng có được ghi nhận không?",
        answer: "Nếu thanh toán VNPay thất bại, trạng thái thanh toán sẽ không được ghi nhận là đã thanh toán. Bạn có thể đặt lại đơn hàng hoặc chọn phương thức thanh toán COD.",
    },
    {
        question: "Tôi xem trạng thái đơn hàng ở đâu?",
        answer: "Sau khi đăng nhập, bạn có thể vào trang đơn hàng để xem danh sách đơn đã đặt, chi tiết từng đơn, trạng thái xử lý đơn hàng và trạng thái thanh toán.",
    },
    {
        question: "Tôi có thể hủy đơn hàng sau khi đặt không?",
        answer: "Bạn có thể hủy đơn khi đơn hàng đang ở trạng thái chờ xử lý hoặc đang xử lý. Khi đơn hàng đã chuyển sang giao hàng hoặc hoàn thành, hệ thống sẽ không hỗ trợ hủy từ phía khách hàng.",
    },
    {
        question: "Khi nào tôi có thể đánh giá sản phẩm?",
        answer: "Bạn có thể đánh giá sản phẩm sau khi đơn hàng đã hoàn thành. Đánh giá giúp những người dùng khác có thêm thông tin tham khảo trước khi mua hàng.",
    },
];

const policy = [
    {
        icon: faBoxOpen,
        title: "Xử lý đơn hàng",
        desc: "Đơn hàng được ghi nhận sau khi đặt thành công và chờ quản trị viên xác nhận.",
    },
    {
        icon: faTruckFast,
        title: "Vận chuyển",
        desc: "Thời gian giao hàng phụ thuộc vào địa chỉ nhận hàng và trạng thái xử lý đơn.",
    },
    {
        icon: faRotateLeft,
        title: "Đổi trả",
        desc: "Hỗ trợ đổi trả trong trường hợp sản phẩm lỗi hoặc sai thông tin đơn hàng.",
    },
    {
        icon: faShieldHalved,
        title: "Cam kết sản phẩm",
        desc: "Sản phẩm được hiển thị đầy đủ thông tin về giá, size, màu sắc và tồn kho.",
    },
]

function SupportPage() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="bg-gray-50">
            {/* Hero */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 py-14 sm:py-18">
                    <div className="max-w-3xl">
                        <p className="text-orange-500 text-xs font-bold tracking-[4px] mb-3">SUPPORT CENTER</p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">TRUNG TÂM HỖ TRỢ</h1>
                        <p className="text-sm sm:text-base text-white/70 mt-4 leading-relaxed">
                            Tổng hợp các thông tin cần thiết giúp bạn chọn sản phẩm, đặt hàng, thanh toán và theo dõi đơn hàng dễ dàng hơn.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-10 sm:py-14 space-y-10">
                {/* Support cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {supportCards.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
                        >
                            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={item.icon} />
                            </div>

                            <h3 className="font-bold text-gray-900">{item.title}</h3>

                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Size guide */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faRuler} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black">Hướng dẫn chọn size</h2>
                                    <p className="text-xs text-gray-400 mt-1">Một số lưu ý khi chọn size sneaker</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-100 text-sm">
                                    <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                                        <tr>
                                            <th className="text-left px-4 py-3">Chiều dài chân</th>
                                            <th className="text-left px-4 py-3">Size</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sizeRows.map((row) => (
                                            <tr
                                                key={`${row.foot}-${row.vn}`}
                                                className="border-t border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 font-semibold">{row.foot}</td>

                                                <td className="px-4 py-3 text-orange-500 font-bold">{row.vn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5 space-y-2">
                                {sizeTips.map((tip, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 text-sm text-gray-500"
                                    >
                                        <span className="text-orange-500 font-black">{index + 1}.</span>
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faHeadset} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-black">Câu hỏi thường gặp</h2>
                                    <p className="text-xs text-gray-400 mt-1">Các vấn đề khách hàng thường quan tâm</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {faqItems.map((item, index) => {
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={item.question}
                                            className="border border-gray-100 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                                className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-gray-50 transition"
                                            >
                                                <span className="text-sm font-bold">{item.question}</span>

                                                <FontAwesomeIcon icon={faAngleDown} className={`text-gray-400 transition ${isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                                                    {item.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Policy */}
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black mb-4">Chính sách hỗ trợ</h2>

                            <div className="space-y-4">
                                {policy.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                            <FontAwesomeIcon icon={item.icon} />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold">{item.title}</h3>

                                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-black rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/20 rounded-full" />
                            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-orange-500/10 rounded-full" />

                            <div className="relative">
                                <p className="text-xs text-orange-400 font-bold tracking-[3px] mb-2">SNEAKER COP</p>
                                <h2 className="text-xl font-black">Cần hỗ trợ nhanh?</h2>

                                <p className="text-sm text-white/70 mt-3 leading-relaxed">
                                    Bạn có thể liên hệ trực tiếp qua thông tin bên dưới khi cần hỗ trợ về sản phẩm hoặc đơn hàng.
                                </p>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/10 text-orange-400 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/50">Hotline</p>
                                            <p className="text-sm font-bold">085743103</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/10 text-orange-400 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/50">Email</p>
                                            <p className="text-sm font-bold">sneakercopvn@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/10 text-orange-400 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faClock} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-white/50">Thời gian hỗ trợ</p>
                                            <p className="text-sm font-bold">08:00 - 22:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SupportPage;