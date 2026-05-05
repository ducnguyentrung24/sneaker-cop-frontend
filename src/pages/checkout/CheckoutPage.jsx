import { useCart } from "../../context/CartContext";

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import CheckoutForm from "../../components/checkout/CheckoutForm";
import OrderSummary from "../../components/checkout/OrderSummary";

import { checkoutFromCart, checkoutFromBuyNow } from "../../services/order.service";
import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function CheckoutPage() {
    const { fetchCart } = useCart();

    const { state } = useLocation();
    const navigate = useNavigate();

    const items = state?.items || [];

    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState("COD");
    const [note, setNote] = useState("");
    const [addressData, setAddressData] = useState(null);

    if (!items.length) {
        return <div className="p-10 text-center">Không có sản phẩm</div>;
    }

    const total = items.reduce((sum, i) => sum + i.total, 0);

    const isCart = items[0]?.id && !items[0]?.variant_id;

    const handleSubmit = async () => {
        if (!addressData) {
            toast.error("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        try {
            setLoading(true);
            let res;

            if (isCart) {
                res = await checkoutFromCart({
                    address_id: addressData.id,
                    payment_method: payment,
                    note,
                    selected_item_ids: items.map(i => i.id),
                });
            } else {
                const item = items[0];

                res = await checkoutFromBuyNow({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    address_id: addressData.id,
                    payment_method: payment,
                    note,
                });
            }

            await fetchCart();

            navigate("/checkout/success", {
                state: {
                orderCode: res.data.order_code,
                }
            });
        } catch (error) {
            navigate("/checkout/fail", {
                state: {
                message: error.response?.data?.message || "Đặt hàng thất bại!",
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F3F4] px-6 pt-20 pb-16">
            <div className="max-w-7xl mx-auto">         
                {/* HEADER */}
                <div className="flex-col items-center gap-6 mb-5">
                    <div
                        className="flex items-center gap-2 text-md font-semibold cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Quay lại
                    </div>

                    <h1 className="text-3xl font-bold mt-3 uppercase tracking-tight">
                        Thanh toán
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <CheckoutForm
                        payment={payment}
                        setPayment={setPayment}
                        note={note}
                        setNote={setNote}
                        setAddressData={setAddressData}
                    />
        
                    <OrderSummary
                        items={items}
                        total={total}
                        loading={loading}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;    