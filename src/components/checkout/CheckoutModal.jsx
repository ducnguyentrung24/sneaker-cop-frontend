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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="font-bold text-xl">Chọn địa chỉ giao hàng</h2>

                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Address list */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold mb-3 uppercase text-gray-700">Địa chỉ đã lưu</h3>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => {
                                    onSelect(addr);
                                    onClose();
                                }}
                                className={`p-4 rounded-xl border cursor-pointer transition
                                    ${selected?.id === addr.id
                                        ? "border-orange-500 bg-orange-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                    }
                                `}
                            >
                                <p className="font-semibold text-sm">{addr.receiver_name}</p>

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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;