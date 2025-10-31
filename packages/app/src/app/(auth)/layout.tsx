import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full space-y-6">
            {/* Logo */}
            <div className="flex justify-center mt-8">
                <Image
                    src="/ssets/logo.svg"
                    alt="مادر مارکت"
                    width={100}
                    height={100}
                    priority
                />
            </div>

            {/* Page Content */}
            {children}

            {/* Bottom Image */}
            <div className="flex justify-center mt-20">
                <Image
                    src="/ssets/login-image.svg"
                    alt="Illustration"
                    width={286}
                    height={204}
                    className="w-full max-w-xs h-auto"
                    priority
                />
            </div>
        </div>
    );
}

