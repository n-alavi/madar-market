'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CartIcon, OrdersIcon, ProfileIcon } from './icons';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const navItems: NavItem[] = [
    { href: '/', label: 'خانه', icon: HomeIcon },
    { href: '/shopping-card', label: 'سبد خرید', icon: CartIcon },
    { href: '/orders', label: 'سفارش‌ها', icon: OrdersIcon },
    { href: '/dashboard', label: 'پروفایل', icon: ProfileIcon },
];

export default function Footer() {

    const pathname = usePathname();

    return (
        <footer className="max-w-sm mx-auto fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <nav className="max-w-lg mx-auto px-4">
                <ul className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href} className="flex-1">
                                <Link
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors ${isActive
                                        ? 'text-[#FF6A29]'
                                        : 'text-[#B3B2B2] '
                                        }`}
                                >
                                    <Icon
                                        className="w-6 h-6"
                                        style={{ color: isActive ? "#FF6A29" : "#B3B2B2" }}
                                    />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </footer>
    );
}

