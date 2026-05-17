import { useState, useEffect } from "react";

import { getAddresses, setDefaultAddress, createAddress, updateAddress, deleteAddress } from "../../services/address.service";

import ProfileSidebar from "../../components/profile/ProfileSidebar";
import AddressModal from "../../components/profile/AddressModal";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faPlus,
    faPhone,
    faLocationDot,
    faEdit,
    faTrash
 } from "@fortawesome/free-solid-svg-icons";

function AddressPage() {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const fetchAddresses = async () => {
        try {
            const res = await getAddresses();
            setAddresses(res.data);
        } catch(error) {
            toast.error("Không thể tải địa chỉ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(addressId);
            toast.success("Cập nhật địa chỉ mặc định thành công!");
            await fetchAddresses();
        } catch(error) {
            toast.error("Cập nhật địa chỉ mặc định thất bại!");
        }
    };

    const handleAdd = () => {
        if (addresses.length >= 5) {
            toast.error("Bạn chỉ có thể thêm tối đa 5 địa chỉ!");
            return;
        }

        setEditing(null);
        setOpenModal(true);
    };

    const handleEdit = (address) => {
        setEditing(address);
        setOpenModal(true);
    };

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                await updateAddress(editing.id, data);
                toast.success("Cập nhật thành công");
            } else {
                await createAddress(data);
                toast.success("Thêm thành công");
            }

            setOpenModal(false);
            fetchAddresses();
        } catch(error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại!");
        }
    };

    const handleDelete = async (addressId) => {
        try {
            await deleteAddress(addressId);
            toast.success("Xóa địa chỉ thành công!");
            setAddresses((prev) => prev.filter(a => a.id !== addressId));
        } catch(error) {
            toast.error("Xóa địa chỉ thất bại!");
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F3F3F4] px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 lg:gap-8">
                <ProfileSidebar />

                <div className="col-span-12 lg:col-span-9">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-8">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Địa chỉ nhận hàng</h1> 
                            <p className="text-xs sm:text-sm text-gray-500">
                                Quản lý địa chỉ giao hàng để thuận tiện hơn khi mua sắm.
                            </p>
                        </div>

                        <button 
                            onClick={handleAdd}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Thêm địa chỉ mới
                        </button>
                    </div>

                    {/* List */}
                    <div className="space=y=4 sm:space-y-5">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-lg px-5 sm:px-6 py-5 sm:py-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-l-4
                                    ${address.is_default
                                        ? "border-orange-500"
                                        : "border-transparent"
                                    }
                                `}
                            >
                                <div className="flex flex-col sm:flex-row justify-between sm:items-stretch gap-4">
                                    {/* Left */}
                                    <div className="space-y-2.5 min-w-0 sm:max-w-[75%]">
                                        <p className="font-semibold text-sm sm:text-md">{address.receiver_name}</p>

                                        <p className="flex items-center gap-2 text-xs text-gray-600">
                                            <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                            {address.phone}
                                        </p>

                                        <p className="flex items-center gap-2 text-xs text-gray-600">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                                            {address.detail_address}, {address.ward}, {address.city}
                                        </p>
                                    </div>

                                    {/* Right */}
                                    <div className="flex flex-row sm:flex-col sm:items-end justify-between pt-2 sm:pt-0">
                                        {/* Badge */}
                                        {address.is_default ? (
                                            <span className="text-xs text-orange-700 font-bold bg-orange-50 px-2 py-1 rounded">
                                                Mặc định
                                            </span>
                                        ): (
                                            <button
                                                onClick={() => handleSetDefault(address.id)}
                                                className="text-xs text-orange-500 font-medium hover:text-orange-700 transition"
                                            >
                                                Đặt làm mặc định
                                            </button>
                                        )}

                                        {/* Action button */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <button 
                                                onClick={() => handleEdit(address)}
                                                className="flex items-center gap-1 hover:text-blue-500 transition"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                                Sửa
                                            </button>

                                            <button
                                                onClick={() => handleDelete(address.id)}
                                                className="flex items-center gap-1 hover:text-red-500 transition"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty */}
                        {addresses.length === 0 && (
                            <div className="border-2 border-dashed rounded-xl p-14 flex flex-col items-center justify-center text-gray-400">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </div>

                                <p className="text-sm">Bạn chưa có địa chỉ nào</p>

                                <button className="mt-2 text-orange-500 text-sm font-semibold">
                                    Thêm địa chỉ mới
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddressModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                initialData={editing}
            />
        </div>
    );
};

export default AddressPage;