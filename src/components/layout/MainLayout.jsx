import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
    return (
        <div
            className="h-screen flex flex-col overflow-x-hidden overflow-y-auto
                max-lg:[-ms-overflow-style:none]
                max-lg:[scrollbar-width:none]
                max-lg:[&::-webkit-scrollbar]:hidden
            "
        >
            <Header />

            <main className="flex-1 w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;