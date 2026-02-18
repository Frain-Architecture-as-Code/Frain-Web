import HomeFooter from "./home/home-footer";
import HomeNavbar from "./home/home-navbar";

export default function FallbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <HomeNavbar />
            {children}
            <HomeFooter />
        </div>
    );
}
