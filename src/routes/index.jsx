import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProductPage from "../pages/product/ProductPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";

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