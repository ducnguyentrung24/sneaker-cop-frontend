import { Routes, Route } from "react-router-dom";

function HomePage() {
    return <h1 className="text-center mt-10">Sneaker Cop</h1>
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}