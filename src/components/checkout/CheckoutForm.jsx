import { useEffect, useState } from "react";
import { getAddresses } from "../../services/address.service";

import CheckoutModal from "./CheckoutModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faMoneyBill,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

function CheckoutForm({ payment, setPayment, note, setNote, setAddressData }) {
    const [addresses, setAddresses] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAddresses();
            const list = Array.isArray(res) ? res : res.data || [];

            setAddresses(list);

            const defaultAddr = list.find(a => a.is_default) || list[0];

            if (defaultAddr) {
                setSelected(defaultAddr);
                setAddressData(defaultAddr);
            }
        };

        fetchData();
    }, []);

    const handleSelect = (addr) => {
        setSelected(addr);
        setAddressData(addr);
    };

    return (
        <div className="lg:col-span-7 space-y-6">
            {/* Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-lg">
                            1
                        </span>

                        <h2 className="text-sm font-bold uppercase">Thông tin giao hàng</h2>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="text-orange-500 text-xs font-bold"
                    >
                        Thay đổi
                    </button>
                </div>

                {/* Adress selected */}
                {selected && (
                    <div className="bg-[#F3F3F4] p-5 rounded-lg flex justify-between">
                        <div className="text-sm">
                            <p className="font-semibold">{selected.receiver_name}</p>

                            <p className="flex items-center gap-2 text-gray-500 mt-1">
                                <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                {selected.phone}
                            </p>

                            <p className="flex items-center gap-2 text-gray-500 mt-1">
                                <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                                {selected.detail_address}, {selected.ward}, {selected.city}
                            </p>
                        </div>

                        {selected.is_default && (
                            <span className="bg-black text-white text-xs px-3 py-1 rounded h-fit">
                                Mặc định
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* PAYMENT */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-lg">
                            2
                        </span>

                        <h2 className="text-sm font-bold uppercase">Phương thức thanh toán</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setPayment("COD")}
                        className={`p-5 border-2 rounded
                            ${payment === "COD"
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-300"
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faMoneyBill} />
                        <p className="mt-2 font-bold text-sm">COD</p>
                        <p className="text-xs text-gray-500">Thanh toán khi nhận hàng</p>
                    </button>

                    <button
                        onClick={() => setPayment("VNPAY")}
                        className={`p-5 border-2 rounded
                            ${payment === "VNPAY"
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-300"
                            }
                        `}
                    >
                        <FontAwesomeIcon icon={faWallet} />
                        <p className="mt-2 font-bold text-sm">VNPAY</p>
                        <p className="text-xs text-gray-500">Thanh toán bằng ví điện tử VNPAY</p>
                    </button>
                </div>
            </div>

            {/* NOTE */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-lg">
                            3
                        </span>

                        <h2 className="text-sm font-bold uppercase">Ghi chú đơn hàng (Tùy chọn)</h2>
                    </div>

                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                    className="w-full border border-gray-400 p-3 rounded text-sm"
                    rows={4}
                />
            </div>

            <CheckoutModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                addresses={addresses}
                selected={selected}
                onSelect={handleSelect}
            />
        </div>
    );
}

export default CheckoutForm;