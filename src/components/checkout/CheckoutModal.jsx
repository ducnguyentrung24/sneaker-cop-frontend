import { useState, useEffect } from "react";

import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faPhone,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

const PROVINCES_API_URL = import.meta.env.VITE_PROVINCES_API_URL;

function CheckoutModal({ open, onClose, addresses, selected, onSelect }) {
    const [manualAddress, setManualAddress] = useState({
        receiver_name: "",
        phone: "",
        city: "",
        ward: "",
        detail_address: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetch(`${PROVINCES_API_URL}`)
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(error => console.error("Failed to fetch provinces:", error));
    }, []);

    if (!open) return null;

    const handleCityChange = async (selectedOption) => {
        if (!selectedOption) return;

        try {
            const res = await fetch(`${PROVINCES_API_URL}/${selectedOption.value}?depth=2`);
            const data = await res.json();
            
            setManualAddress({
                ...manualAddress,
                city: data.name,
                ward: "",
            });

            setWards(data.wards || []);
        } catch(error) {
            console.error("Failed to fetch wards:", error);
            toast.error("Không thể tải danh sách phường/xã.");
        }
    };

    const handleWardChange = (selectedOption) => {
        if (!selectedOption) return;

        setManualAddress({
            ...manualAddress,
            ward: selectedOption.value,
        });
    };

    const validateManualAddress = () => {
        if (!manualAddress.receiver_name.trim()) {
            toast.error("Vui lòng nhập tên người nhận!");
            return false;
        }

        if (!manualAddress.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại!");
            return false;
        }

        if (!/^[0-9]{10,15}$/.test(manualAddress.phone.trim())) {
            toast.error("Số điện thoại phải là chuỗi số từ 10 đến 15 chữ số!");
            return false;
        }

        if (!manualAddress.city.trim()) {
            toast.error("Vui lòng nhập tỉnh/thành phố!");
            return false;
        }

        if (!manualAddress.ward.trim()) {
            toast.error("Vui lòng nhập phường/xã!");
            return false;
        }

        if (!manualAddress.detail_address.trim()) {
            toast.error("Vui lòng nhập địa chỉ chi tiết!");
            return false;
        }

        return true;
    }

    const handleManualSubmit = () => {
        if (!validateManualAddress()) return;

        onSelect({
            receiver_name: manualAddress.receiver_name.trim(),
            phone: manualAddress.phone.trim(),
            city: manualAddress.city.trim(),
            ward: manualAddress.ward.trim(),
            detail_address: manualAddress.detail_address.trim(),
            is_manual: true,
        });

        toast.success("Đã chọn địa chỉ giao hàng!");

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-5 sm:px-6">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
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

                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
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

                <div className="border-t pt-5 mt-5">
                    <h3 className="text-xs sm:text-sm font-bold mb-3 uppercase text-gray-700">Nhập địa chỉ giao hàng</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                            placeholder="Tên người nhận"
                            value={manualAddress.receiver_name}
                            onChange={(e) => setManualAddress({
                                ...manualAddress,
                                receiver_name: e.target.value,
                            })}
                        />

                        <input
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                            placeholder="Số điện thoại"
                            value={manualAddress.phone}
                            onChange={(e) => setManualAddress({
                                ...manualAddress,
                                phone: e.target.value,
                            })}
                        />

                        <Select
                            options={provinces.map(p => ({
                                value: p.code,
                                label: p.name
                            }))}
                            onChange={handleCityChange}
                            placeholder="Chọn tỉnh/thành phố"
                            value={manualAddress.city
                                ? { 
                                    value: provinces.find(p => p.name === manualAddress.city)?.code, 
                                    label: manualAddress.city 
                                }
                                : null
                            }
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />

                        <Select
                            options={wards.map(w => ({
                                value: w.name,
                                label: w.name
                            }))}
                            onChange={handleWardChange}
                            placeholder="Chọn phường/xã"
                            isDisabled={!manualAddress.city}
                            value={manualAddress.ward
                                ? { value: manualAddress.ward, 
                                    label: manualAddress.ward 
                                }
                                : null
                            }
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />

                        <input
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500 sm:col-span-2"
                            placeholder="Địa chỉ chi tiết (số nhà, tên đường, ...)"
                            value={manualAddress.detail_address}
                            onChange={(e) => setManualAddress({
                                ...manualAddress,
                                detail_address: e.target.value,
                            })}
                        />
                    </div>

                    <button
                        onClick={handleManualSubmit}
                        className="mt-4 w-full bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-orange-500 transition"
                    >
                        Sử dụng địa chỉ nhập tay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;