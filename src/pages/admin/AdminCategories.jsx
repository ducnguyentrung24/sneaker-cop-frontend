import CategoryBrand from "../../components/admin/common/CategoryBrand";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/category.service";

function AdminCategories() {
    return (
        <CategoryBrand
            title="Quản lý danh mục"
            desription="Quản lý và cấu hình danh mục sản phẩm của bạn"
            entityName="danh mục"
            searchPlaceholder="Tên danh mục..."
            getData={getCategories}
            createData={createCategory}
            updateData={updateCategory}
            deleteData={deleteCategory}
        />
    );
};

export default AdminCategories;