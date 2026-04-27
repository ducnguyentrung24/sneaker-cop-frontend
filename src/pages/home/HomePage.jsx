import Hero from "../../components/home/Hero";
import PromoSection from "../../components/home/PromoSection";
import ProductSection from "../../components/home/ProductSection";
import BrandSection from "../../components/home/BrandSection";

function HomePage() {
    return (
        <>
            <Hero />
            <PromoSection />
            <ProductSection title="BÁN CHẠY NHẤT" />
            <BrandSection />
        </>
    );
}

export default HomePage;