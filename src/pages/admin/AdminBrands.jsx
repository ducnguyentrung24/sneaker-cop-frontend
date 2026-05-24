import CategoryBrand from "../../components/admin/common/CategoryBrand";

import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
} from "../../services/brand.service";

function AdminBrands() {
    return (
        <CategoryBrand
            title="Quản lý thương hiệu"
            desription="Quản lý và cấu hình thương hiệu sản phẩm của bạn"
            entityName="thương hiệu"
            searchPlaceholder="Tên thương hiệu..."
            getData={getBrands}
            createData={createBrand}
            updateData={updateBrand}
            deleteData={deleteBrand}
        />
    );
};

export default AdminBrands;