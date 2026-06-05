import Hero from "../../components/home/Hero";
import PromoSection from "../../components/home/PromoSection";
import ProductSection from "../../components/home/ProductSection";
import BrandSection from "../../components/home/BrandSection";
import FeatureSection from "../../components/home/FeatureSection";
import StorySection from "../../components/home/StorySection";

function HomePage() {
    return (
        <>
            <Hero />
            <FeatureSection />
            <PromoSection />
            <ProductSection title="BÁN CHẠY NHẤT" />
            <StorySection />
            <BrandSection />
        </>
    );
}

export default HomePage;