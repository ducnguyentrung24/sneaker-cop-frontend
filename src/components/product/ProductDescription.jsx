function ProductDescription({ product }) {
    return (
        <p className="text-gray-600 text-sm mt-10">
            {product?.description || "Không có mô tả nào cho sản phẩm này."}
        </p>
    );
};

export default ProductDescription;