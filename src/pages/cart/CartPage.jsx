import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import  { useCart } from "../../context/CartContext";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faArrowLeft,
    faArrowRight,
    faTrash,
    faMinus,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

function CartPage() {
    const navigate = useNavigate();

    const { cart, updateQuantity, removeItem, removeManyItems } = useCart();
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (cart.items.length) {
            setSelected(cart.items.map(i => i.id));
        } else {
            setSelected([]);
        }
    }, [cart.items]);

    const toggle = (id) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selected.length === cart.items.length) setSelected([]);
        else setSelected(cart.items.map(i => i.id));
    };

    const total = cart.items
        .filter(i => selected.includes(i.id))
        .reduce((sum, i) => sum + i.total, 0);

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-4 text-sm shadow-md">
                <span
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 cursor-pointer font-semibold"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </span>

                <span className="font-semibold flex items-center gap-2 tracking-wide">
                    <FontAwesomeIcon icon={faCartShopping} />
                    GIỎ HÀNG
                </span>

                <span className="font-semibold">
                    Bạn đang có: {cart.items.length} sản phẩm
                </span>
            </div>

            {cart.items.length ? (
                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <div className="max-w-5xl mx-auto px-6">
                        {/* Select + delete all */}
                        <div className="flex justify-between items-center mb-4 px-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selected.length === cart.items.length}
                                    onChange={selectAll}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">CHỌN TẤT CẢ</span>
                            </div>

                            <button
                                onClick={() => {
                                    removeManyItems(selected);
                                    setSelected([]);
                                    toast.success("Đã xóa các sản phẩm đã chọn");
                                }}
                                disabled={!selected.length}
                                className={`text-xs px-5 py-2 rounded flex items-center gap-1 font-medium
                                    ${selected.length
                                        ? 'bg-red-500 text-white cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                XÓA
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-6">
                            {cart.items.map(item => (
                                <div 
                                    key={item.id} 
                                    className="flex justify-between items-center px-5 pb-6 pt-4 shadow"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-5">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(item.id)}
                                            onChange={() => toggle(item.id)}
                                            className="w-4 h-4"
                                        />

                                        <img 
                                            src={item.product.thumbnail} 
                                            className="w-20 h-20 object-cover rounded-md"
                                        />

                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm">{item.product.name}</p>

                                            <p className="text-xs font-semibold text-gray-500">
                                                Màu: {item.variant.color} | Size: {item.variant.size}
                                            </p>

                                            {/* Quantity */}
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-fit mt-2">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            toast.error("Số lượng phải lớn hơn 0");
                                                            return;
                                                        };
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }}
                                                    className={`px-2 py-1 text-xs
                                                        ${item.quantity <= 1
                                                            ? 'opacity-30'
                                                            : ''
                                                        }
                                                    `}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>

                                                <input 
                                                    type="text"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (!value || value < 1) {
                                                            toast.error("Số lượng không hợp lệ");
                                                            return;
                                                        }

                                                        if (value > item.variant.stock) {
                                                            toast.error("Số lượng vượt quá tồn kho");
                                                            return;
                                                        }
                                                        updateQuantity(item.id, value);
                                                    }}
                                                    className="w-12 text-center text-sm outline-none"
                                                />

                                                <button
                                                    onClick={() => {
                                                        if (item.quantity >= item.variant.stock) {
                                                            toast.error("Số lượng vượt quá tồn kho");
                                                            return;
                                                        };
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }}
                                                    className={`px-2 py-1 text-xs
                                                        ${item.quantity >= item.variant.stock
                                                            ? 'opacity-30'
                                                            : ''
                                                        }
                                                    `}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex flex-col justify-between items-end min-w-30 h-20">
                                        <button
                                            onClick={() => {
                                                removeItem(item.id);
                                                toast.success("Đã xóa sản phẩm");
                                            }}
                                            className="text-red-500 text-xs font-semibold flex items-center justify-end gap-1 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Xóa
                                        </button>

                                        <p className="font-semibold text-lg">
                                            {Math.round(item.total).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>        
                            ))}  
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg mb-6 text-3xl text-gray-300">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>

                    <h2 className="font-semibold text-xl mb-4">
                        GIỎ HÀNG ĐANG TRỐNG
                    </h2>

                    <p className="text-gray-500 text-sm max-w-md mb-8">
                        Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.<br />Hãy tiếp tục mua sắm để thêm sản phẩm vào giỏ hàng của bạn!
                    </p>

                    <button
                        onClick={() => navigate('/products')}
                        className="bg-black text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2"
                    >
                        TIẾP TỤC MUA SẮM
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}
        
            {/* Footer */}
            <div className="flex justify-between items-center px-8 py-5 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.12)]">
                <div>
                    <p className="text-md font-bold">TỔNG CỘNG THANH TOÁN</p>

                    <p className="text-orange-500 text-2xl font-bold mt-1">
                        {Math.round(total).toLocaleString('vi-VN')}đ
                    </p>
                    
                    <p className="text-xs text-gray-700 mt-1">
                        MIỄN PHÍ VẬN CHUYỂN CHO TẤT CẢ ĐƠN HÀNG
                    </p>
                </div>

                <button
                    disabled={!selected.length}
                    className={`px-15 py-3 rounded-lg flex items-center gap-2 text-sm font-medium
                        ${selected.length
                            ? 'bg-black text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    MUA NGAY
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    );
};

export default CartPage;