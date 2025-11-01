import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { adminMiddleware } from '../middleware/auth';

export const categoryRoutes = new Elysia({ prefix: '/categories' })
  // دریافت همه دسته‌بندی‌ها
  .get('/', async () => {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  })
  // دریافت یک دسته‌بندی
  .get('/:id', async ({ params }) => {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error('دسته‌بندی یافت نشد');
    }

    return category;
  })
  // ایجاد دسته‌بندی (فقط ادمین)
  .use(adminMiddleware)
  .post(
    '/',
    async ({ body }) => {
      const category = await prisma.category.create({
        data: body,
      });

      return {
        message: 'دسته‌بندی با موفقیت ایجاد شد',
        category,
      };
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  // ویرایش دسته‌بندی (فقط ادمین)
  .put(
    '/:id',
    async ({ params, body }) => {
      const category = await prisma.category.update({
        where: { id: params.id },
        data: body,
      });

      return {
        message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
        category,
      };
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  // حذف دسته‌بندی (فقط ادمین)
  .delete('/:id', async ({ params }) => {
    await prisma.category.delete({
      where: { id: params.id },
    });

    return {
      message: 'دسته‌بندی با موفقیت حذف شد',
    };
  });






