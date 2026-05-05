import { useState, useEffect } from "react";

import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function AddressModal({ open, onClose, onSubmit, initialData }) {
    const defaultForm = {
        receiver_name: "",
        phone: "",
        city: "",
        ward: "",
        detail_address: "",
        is_default: false,
    };

    const [form, setForm] = useState(defaultForm);

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/v2/p/")
        .then(res => res.json())
        .then(data => setProvinces(data));
    }, []);

    useEffect(() => {
        if (!open) return;
        if (initialData) {
        setForm(initialData);

        // load wards theo city
        fetch("https://provinces.open-api.vn/api/v2/p/")
            .then(res => res.json())
            .then(async (list) => {
            const province = list.find(p => p.name === initialData.city);

            if (province) {
                const res = await fetch(
                `https://provinces.open-api.vn/api/v2/p/${province.code}?depth=2`
                );
                const data = await res.json();

                setWards(data.wards || []);
            }
            });

        } else {
        setForm(defaultForm);
        setWards([]);
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleCityChange = async (selected) => {
        if (!selected) return;

        const code = selected.value;

        const res = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${code}?depth=2`
        );
        const data = await res.json();

        setForm({
        ...form,
        city: data.name,
        ward: "",
        });

        setWards(data.wards || []);
    };

    const handleWardChange = (selected) => {
        if (!selected) return;

        setForm({
        ...form,
        ward: selected.value,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg">
                        {initialData ? "CẬP NHẬT ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}
                    </h2>

                    <button onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="text-xs text-gray-500">HỌ VÀ TÊN</label>

                        <input
                            name="receiver_name"
                            value={form.receiver_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-1 text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs text-gray-500">SỐ ĐIỆN THOẠI</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-1 text-sm"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="text-xs text-gray-500">TỈNH/THÀNH</label>

                        <Select
                            options={provinces.map(p => ({
                                value: p.code,
                                label: p.name
                            }))}
                            onChange={handleCityChange}
                            placeholder="Chọn tỉnh/thành"
                            value={provinces.find(p => p.name === form.city) 
                                ? { value: provinces.find(p => p.name === form.city).code, label: form.city }
                                : null
                            }
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>

                    {/* Ward */}
                    <div>
                        <label className="text-xs text-gray-500">PHƯỜNG/XÃ</label>

                        <Select
                            options={wards.map(w => ({
                                value: w.name,
                                label: w.name
                            }))}
                            onChange={handleWardChange}
                            placeholder="Chọn phường/xã"
                            isDisabled={!form.city}
                            value={form.ward
                                ? { value: form.ward, label: form.ward }
                                : null
                            }
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                        />
                    </div>

                    {/* Detail address */}
                    <div className="col-span-2">
                        <label className="text-xs text-gray-500">ĐỊA CHỈ CHI TIẾT</label>
                        
                        <textarea
                            name="detail_address"
                            value={form.detail_address}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 mt-1 text-sm"
                        />
                    </div>

                    {/* Default */}
                    <div className="col-span-2 flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="is_default"
                            checked={form.is_default}
                            onChange={handleChange}
                        />

                        <span className="text-sm">Đặt làm mặc định</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => {
                            setForm(defaultForm);
                            onClose();
                        }}
                        className="px-4 py-2 border rounded-lg text-sm"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={() => onSubmit(form)}
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                    >
                        Lưu địa chỉ
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddressModal;
