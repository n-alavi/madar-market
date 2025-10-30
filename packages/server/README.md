# Madar Market - Backend API

Backend API برای پروژه مادر مارکت با استفاده از Elysia، Prisma و PostgreSQL

## تکنولوژی‌ها

- **Elysia** - فریمورک سریع برای Bun
- **Prisma** - ORM برای دیتابیس
- **PostgreSQL** - دیتابیس
- **JWT** - احراز هویت
- **Bcrypt** - هش کردن رمز عبور

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
bun install
```

### 2. راه‌اندازی PostgreSQL

مطمئن شوید که PostgreSQL نصب و در حال اجرا است. سپس یک دیتابیس جدید بسازید:

```sql
CREATE DATABASE madar_market;
```

### 3. تنظیم متغیرهای محیطی

فایل `.env` را ویرایش کنید و اطلاعات دیتابیس خود را وارد کنید:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/madar_market?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
```

### 4. اجرای Prisma Migrations

```bash
bun run db:generate
bun run db:push
```

### 5. Seed کردن دیتابیس (اختیاری)

```bash
bun run db:seed
```

این دستور داده‌های تستی شامل محصولات، دسته‌بندی‌ها و کاربران نمونه ایجاد می‌کند.

### 6. اجرای سرور

```bash
bun run dev
```

سرور روی `http://localhost:3001` اجرا خواهد شد.

## API Endpoints

### Authentication

- `POST /api/auth/register` - ثبت نام کاربر جدید
- `POST /api/auth/login` - ورود کاربر

### Products

- `GET /api/products` - دریافت لیست محصولات
- `GET /api/products/:id` - دریافت جزئیات محصول
- `POST /api/products` - ایجاد محصول جدید (فقط ادمین)
- `PUT /api/products/:id` - ویرایش محصول (فقط ادمین)
- `DELETE /api/products/:id` - حذف محصول (فقط ادمین)

### Categories

- `GET /api/categories` - دریافت لیست دسته‌بندی‌ها
- `GET /api/categories/:id` - دریافت جزئیات دسته‌بندی
- `POST /api/categories` - ایجاد دسته‌بندی (فقط ادمین)
- `PUT /api/categories/:id` - ویرایش دسته‌بندی (فقط ادمین)
- `DELETE /api/categories/:id` - حذف دسته‌بندی (فقط ادمین)

### Orders

- `GET /api/orders` - دریافت سفارشات کاربر
- `GET /api/orders/:id` - دریافت جزئیات سفارش
- `POST /api/orders` - ثبت سفارش جدید
- `PATCH /api/orders/:id/status` - تغییر وضعیت سفارش (فقط ادمین)
- `GET /api/orders/admin/all` - دریافت همه سفارشات (فقط ادمین)

## دستورات مفید Prisma

```bash
# تولید Prisma Client
bun run db:generate

# Push schema به دیتابیس
bun run db:push

# ایجاد migration
bun run db:migrate

# باز کردن Prisma Studio
bun run db:studio
```

## اطلاعات ورود پیش‌فرض (بعد از seed)

- **Admin**: admin@madarmarket.com / admin123
- **User**: user@madarmarket.com / user123

## ساختار پروژه

```
src/
├── index.ts              # ورودی اصلی
├── lib/
│   ├── prisma.ts        # کلاینت Prisma
│   ├── jwt.ts           # توابع JWT
│   └── hash.ts          # توابع Hash
├── middleware/
│   └── auth.ts          # Middleware احراز هویت
├── routes/
│   ├── auth.ts          # مسیرهای احراز هویت
│   ├── products.ts      # مسیرهای محصولات
│   ├── categories.ts    # مسیرهای دسته‌بندی
│   └── orders.ts        # مسیرهای سفارشات
└── prisma/
    ├── schema.prisma    # Schema دیتابیس
    └── seed.ts          # Seed داده‌های تستی
```


