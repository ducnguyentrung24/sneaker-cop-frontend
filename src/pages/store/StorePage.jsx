import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faEnvelope,
    faLocationDot,
    faPhone,
    faStore,
    faTruckFast,
    faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const storeAddress = "175 P. Tây Sơn, Kim Liên, Hà Nội";
const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`;

function StorePage() {
    return (
        <div className="bg-gray-50">
            {/* Hero */}
            <section className="bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 py-14 sm:py-18">
                    <p className="text-orange-500 text-xs font-bold tracking-[4px] mb-3">SNEAKER COP STORE</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">CỬA HÀNG</h1>
                    <p className="text-sm sm:text-base text-white/70 mt-4 max-w-2xl leading-relaxed">
                        Ghé thăm Sneaker Cop để trải nghiệm trực tiếp các mẫu sneaker mới nhất, kiểm tra size và nhận tư vấn sản phẩm phù hợp.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-3 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                <FontAwesomeIcon icon={faStore} />
                            </div>

                            <div>
                                <h2 className="text-xl sm:text-2xl font-black">Sneaker Cop Store</h2>
                                <p className="text-sm text-gray-400 mt-1">Địa chỉ cửa hàng chính thức</p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-black text-white p-5 sm:p-6 relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/20 rounded-full" />
                            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-orange-500/10 rounded-full" />

                            <div className="relative">
                                <FontAwesomeIcon icon={faLocationDot} className="text-orange-400 text-2xl mr-2" />

                                <a
                                    href={googleMapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-2xl font-black hover:text-orange-400 transition"
                                >
                                    {storeAddress}
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
                                </a>

                                <p className="text-sm text-white/70 mt-3 leading-relaxed">
                                    Cửa hàng nằm tại khu vực trung tâm, thuận tiện cho việc trải nghiệm sản phẩm, thử size và nhận hỗ trợ trực tiếp.
                                </p>
                            </div>
                        </div>

                        {/* Map link */}
                        <a
                            href={googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 h-80 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-center px-6 hover:border-orange-400 hover:bg-orange-50 transition group"
                        >
                            <div>
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-2xl" />
                                </div>

                                <h3 className="font-black text-gray-800">Xem trên Google Maps</h3>
                                <p className="text-sm text-gray-400 mt-2">{storeAddress}</p>
                                <p className="text-xs text-orange-500 font-bold mt-3">Nhấn để mở bản đồ</p>
                            </div>
                        </a>
                    </div>

                    {/* Right */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black mb-5">Thông tin cửa hàng</h2>

                            <div className="space-y-4">
                                <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">Địa chỉ</p>

                                        <a
                                            href={googleMapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-gray-400 mt-1 hover:text-orange-500 transition inline-flex items-center gap-1"
                                        >
                                            {storeAddress}
                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faClock} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">Giờ mở cửa</p>
                                        <p className="text-xs text-gray-400 mt-1">08:00 - 22:00, tất cả các ngày trong tuần</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">Hotline</p>
                                        <p className="text-xs text-gray-400 mt-1">0857843103</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">Email</p>
                                        <p className="text-xs text-gray-400 mt-1 break-all">sneakercopvn@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black mb-5">Dịch vụ tại cửa hàng</h2>

                            <div className="space-y-3">
                                {[
                                    "Tư vấn chọn size sneaker",
                                    "Kiểm tra sản phẩm trực tiếp",
                                    "Hỗ trợ thông tin đơn hàng",
                                    "Tư vấn chính sách đổi trả",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-2xl p-5 sm:p-6 border border-orange-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white text-orange-500 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTruckFast} />
                                </div>

                                <h2 className="font-black">Mua online vẫn tiện lợi</h2>
                            </div>

                            <p className="text-sm text-orange-700 leading-relaxed">
                                Ngoài mua trực tiếp tại cửa hàng, bạn vẫn có thể đặt hàng online, chọn địa chỉ nhận hàng và theo dõi trạng thái đơn trên hệ thống.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default StorePage;