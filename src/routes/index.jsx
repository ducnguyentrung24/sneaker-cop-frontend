import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductPage from "../pages/product/ProductPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AddressPage from "../pages/profile/AddressPage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";

import CheckoutPage from "../pages/checkout/CheckoutPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <MainLayout>
                    <HomePage />
                </MainLayout>
            } />

            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/products" element={
                <MainLayout>
                    <ProductPage />
                </MainLayout>
            } />

            <Route path="/products/:id" element={
                <MainLayout>
                    <ProductDetailPage />
                </MainLayout>
            } />

            <Route path="/cart" element={ <CartPage /> } />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <MainLayout>
                        <ProfilePage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/profile/addresses" element={ 
                <ProtectedRoute>
                    <MainLayout>
                        <AddressPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/profile/change-password" element={
                <ProtectedRoute>
                    <MainLayout>
                        <ChangePasswordPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Protected routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout>
                        <h1>Home Page</h1>
                    </MainLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default AppRoutes;