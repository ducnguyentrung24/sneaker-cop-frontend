import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                } 
            />

            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route 
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <h1>Profile Page</h1>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;