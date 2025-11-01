import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
    name: string;
    image: string;
    href: string;
}

export default function CategoryCard({ name, image, href }: CategoryCardProps) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-2 group"
        >
            <div className="relative w-[73px] h-[76px] rounded-xl overflow-hidden bg-gradient-to-b from-[#FFF7F5] to-[#FFEBE6] flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-contain"
                />
            </div>
            <span className="text-sm text-[#787471] font-medium text-center">
                {name}
            </span>
        </Link>
    );
}

