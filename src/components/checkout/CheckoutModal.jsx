import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faPhone,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function CheckoutModal({ open, onClose, addresses, selected, onSelect }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-5 sm:px-6">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 sm:mb-6 border-b pb-3">
                    <h2 className="font-bold text-xl">Chọn địa chỉ giao hàng</h2>

                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Address list */}
                <div className="mb-2 sm:mb-6">
                    <h3 className="text-xs sm:text-sm font-bold mb-3 uppercase text-gray-700">Địa chỉ đã lưu</h3>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => {
                                    onSelect(addr);
                                    onClose();
                                }}
                                className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition
                                    ${selected?.id === addr.id
                                        ? "border-orange-500 bg-orange-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-sm line-clamp-1">{addr.receiver_name}</p>

                                    {addr.is_default && (
                                        <span className="text-[10px] sm:text-xs bg-black text-white font-semibold px-2 py-0.5 rounded-full shrink-0">
                                            Mặc định
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 mt-1 flex gap-2">
                                    <FontAwesomeIcon icon={faPhone} />
                                    {addr.phone}
                                </p>

                                <p className="text-xs text-gray-500 mt-1 flex gap-2">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    {addr.detail_address}, {addr.ward}, {addr.city}
                                </p>
                            </div>
                        ))}

                        {addresses.length === 0 && (
                            <div className="text-center py-8 text-xs sm:text-sm text-gray-400">Bạn chưa có địa chỉ nào.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;