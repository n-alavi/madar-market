import CategoryCard from './category-card';

const categories = [
    { name: 'لوازم تحریر', image: '/assets/stationery.png', href: '/categories/stationery' },
    { name: 'یکبار مصرف', image: '/assets/disposable-dishes.png', href: '/categories/disposable' },
    { name: 'لوازم جانبی', image: '/assets/headphones.png', href: '/categories/accessories' },
    { name: 'کنسروی و آماده', image: '/assets/canned-food.png', href: '/categories/canned' },
    { name: 'افزودنی‌ها', image: '/assets/seasoning.png', href: '/categories/additives' },
    { name: 'تنقلات', image: '/assets/clipart.png', href: '/categories/home-hygiene' },
];

export default function CategoriesSection() {
    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-5">
                <p className="text-lg font-bold text-[#BA400B]">دسته بندی‌ها</p>
                <p className="text-sm font-medium text-[#C15323]">
                    انتخاب سریع محصولات
                </p>
            </div>


            <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.href}
                        name={category.name}
                        image={category.image}
                        href={category.href}
                    />
                ))}
            </div>
        </section>
    );
}

