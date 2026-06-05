import Hero from "../../components/home/Hero";
import PromoSection from "../../components/home/PromoSection";
import ProductSection from "../../components/home/ProductSection";
import BrandSection from "../../components/home/BrandSection";
import FeatureSection from "../../components/home/FeatureSection";

function HomePage() {
    return (
        <>
            <Hero />
            <FeatureSection />
            <PromoSection />
            <ProductSection title="BÁN CHẠY NHẤT" />
            <BrandSection />
        </>
    );
}

export default HomePage;