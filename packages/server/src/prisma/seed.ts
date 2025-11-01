import { hashPassword } from '../lib/hash';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('server is running...');

  // پاک کردن دیتابیس
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ایجاد کاربر ادمین
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      phoneNumber: '09123456789',
      password: adminPassword,
      name: 'مدیر سیستم',
      role: 'ADMIN',
    },
  });
  console.log('✅ کاربر ادمین ایجاد شد');

  // ایجاد کاربر عادی
  const userPassword = await hashPassword('user123');
  const user = await prisma.user.create({
    data: {
      phoneNumber: '09123456788',
      password: userPassword,
      name: 'کاربر تست',
      role: 'USER',
    },
  });
  console.log('✅ کاربر عادی ایجاد شد');

  // ایجاد دسته‌بندی‌ها
  const electronics = await prisma.category.create({
    data: { name: 'الکترونیک' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'پوشاک' },
  });

  const books = await prisma.category.create({
    data: { name: 'کتاب' },
  });

  console.log('✅ دسته‌بندی‌ها ایجاد شدند');

  // ایجاد محصولات
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'گوشی موبایل سامسونگ',
        description: 'گوشی هوشمند با صفحه نمایش AMOLED',
        price: 15000000,
        stock: 10,
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'لپ‌تاپ لنوو',
        description: 'لپ‌تاپ 15 اینچی با پردازنده i7',
        price: 35000000,
        stock: 5,
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'هدفون بی‌سیم',
        description: 'هدفون با قابلیت نویز کنسلینگ',
        price: 2500000,
        stock: 20,
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'تی‌شرت مشکی',
        description: 'تی‌شرت پنبه‌ای با کیفیت بالا',
        price: 250000,
        stock: 50,
        categoryId: clothing.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'شلوار جین',
        description: 'شلوار جین راحت و شیک',
        price: 450000,
        stock: 30,
        categoryId: clothing.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'کتاب برنامه‌نویسی',
        description: 'آموزش جامع TypeScript',
        price: 180000,
        stock: 15,
        categoryId: books.id,
      },
    }),
  ]);

  console.log('✅ محصولات ایجاد شدند');

  // ایجاد سفارش تستی
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: 17500000,
      status: 'DELIVERED',
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: products[2].price,
          },
        ],
      },
    },
  });

  console.log('✅ سفارش تستی ایجاد شد');

  console.log('\n🎉 Seed با موفقیت انجام شد!');
  console.log('\n📝 اطلاعات ورود:');
  console.log('Admin: 09123456789 / admin123');
  console.log('User: 09123456788 / user123');
}

main()
  .catch((e) => {
    console.error('❌ خطا در Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






