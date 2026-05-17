function ProductDescription({ product }) {
    return (
        <p className="text-gray-600 text-sm sm:text-base mt-6 sm:mt-10 leading-relaxed px-1">
            {product?.description || "Không có mô tả nào cho sản phẩm này."}
        </p>
    );
};

export default ProductDescription;