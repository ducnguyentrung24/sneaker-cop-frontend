import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import {
    faLocationDot,
    faPhone,
    faEnvelope,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <footer className="bg-black text-white mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-1">
                            <img
                                src={logo}
                                alt="Sneaker Cop"
                                className="h-9 w-auto"
                            />

                            <h2 className="text-xl font-black tracking-tight">
                                SNEAKER <span className="text-orange-500">COP</span>
                            </h2>
                        </div>

                        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                            Sneaker Cop mang đến các mẫu sneaker hiện đại, trẻ trung và phù hợp với nhiều phong cách khác nhau.
                        </p>

                        <div className="mt-5">
                            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-400 transition">
                                Khám phá sản phẩm
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Liên kết nhanh</h3>

                        <div className="space-y-3 text-sm">
                            <Link to="/" className="block text-gray-400 hover:text-orange-500 transition">
                                Trang chủ
                            </Link>

                            <Link to="/products" className="block text-gray-400 hover:text-orange-500 transition">
                                Sản phẩm
                            </Link>

                            <Link to="/cart" className="block text-gray-400 hover:text-orange-500 transition">
                                Giỏ hàng
                            </Link>

                            <Link to="/orders" className="block text-gray-400 hover:text-orange-500 transition">
                                Đơn hàng của tôi
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Hỗ trợ khách hàng</h3>

                        <div className="space-y-3 text-sm">
                            <p className="text-gray-400 hover:text-orange-500 transition cursor-pointer">Chính sách đổi trả</p>
                            <p className="text-gray-400 hover:text-orange-500 transition cursor-pointer">Chính sách vận chuyển</p>
                            <p className="text-gray-400 hover:text-orange-500 transition cursor-pointer">Hướng dẫn thanh toán</p>
                            <p className="text-gray-400 hover:text-orange-500 transition cursor-pointer">Câu hỏi thường gặp</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Liên hệ</h3>

                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faLocationDot} className="text-orange-500 mt-1" />
                                <span>175 P. Tây Sơn, Kiêm Liên, Hà Nội</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-orange-500" />
                                <span>0857843103</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-orange-500" />
                                <span>sneakercopvn@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 mt-10 pt-5 flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-500">
                      <FontAwesomeIcon icon={faCopyright} />
                      <span>2026 Sneaker Cop. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;