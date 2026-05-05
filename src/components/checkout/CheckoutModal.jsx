import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faPhone,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

function CheckoutModal({ open, onClose, addresses, selected, onSelect }) {
    const [manual, setManual] = useState({
        receiver_name: "",
        phone: "",
        city: "",
        ward: "",
        detail_address: "",
    });

    const [errors, setErrors] = useState({});

    if (!open) return null;

    const validate = () => {
        const newErrors = {};

        if (!manual.receiver_name.trim()) newErrors.receiver_name = "Vui lòng nhập họ tên";

        if (!manual.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^0\d{9}$/.test(manual.phone)) newErrors.phone = "Số điện thoại không hợp lệ";

        if (!manual.city.trim()) newErrors.city = "Vui lòng nhập tỉnh/thành";

        if (!manual.ward.trim()) newErrors.ward = "Vui lòng nhập phường/xã";

        if (!manual.detail_address.trim()) newErrors.detail_address = "Vui lòng nhập địa chỉ";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleManualChange = (e) => {
        const { name, value } = e.target;

        setManual({ ...manual, [name]: value, });

        setErrors({ ...errors, [name]: "", });
    };

    const handleManualSubmit = () => {
        if (!validate()) return;

        onSelect(manual);
        onClose();
        setManual({
            receiver_name: "",
            phone: "",
            city: "",
            ward: "",
            detail_address: "",
        });
        setErrors({});
    };

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

                {/* Address orther */}
                <div className="bg-gray-50 border rounded-xl p-5">
                    <h3 className="text-sm font-bold mb-4 uppercase text-gray-700">Địa chỉ khác</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <input
                                name="receiver_name"
                                placeholder="Họ và tên"
                                value={manual.receiver_name}
                                onChange={handleManualChange}
                                className={`w-full border rounded-lg p-3 text-sm
                                    ${errors.receiver_name ? "border-red-500" : "border-gray-200"}
                                `}
                            />

                            {errors.receiver_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.receiver_name}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <input
                                name="phone"
                                placeholder="Số điện thoại"
                                value={manual.phone}
                                onChange={handleManualChange}
                                className={`w-full border rounded-lg p-3 text-sm
                                    ${errors.phone ? "border-red-500" : "border-gray-200"}
                                `}
                            />

                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* City */}
                        <div>
                            <input
                                name="city"
                                placeholder="Tỉnh / Thành phố"
                                value={manual.city}
                                onChange={handleManualChange}
                                className={`w-full border rounded-lg p-3 text-sm
                                    ${errors.city ? "border-red-500" : "border-gray-200"}
                                `}
                            />

                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        {/* WARD */}
                        <div>
                            <input
                                name="ward"
                                placeholder="Phường / Xã"
                                value={manual.ward}
                                onChange={handleManualChange}
                                className={`w-full border rounded-lg p-3 text-sm
                                    ${errors.ward ? "border-red-500" : "border-gray-200"}
                                `}
                            />

                            {errors.ward && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.ward}
                                </p>
                            )}
                        </div>

                        {/* Detail address */}
                        <div className="col-span-2">
                            <input
                                name="detail_address"
                                placeholder="Địa chỉ chi tiết"
                                value={manual.detail_address}
                                onChange={handleManualChange}
                                className={`w-full border rounded-lg p-3 text-sm
                                    ${errors.detail_address ? "border-red-500" : "border-gray-200"}
                                `}
                            />

                            {errors.detail_address && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.detail_address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleManualSubmit}
                        className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90"
                    >
                        Sử dụng địa chỉ này
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;