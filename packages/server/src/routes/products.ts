import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { adminMiddleware } from '../middleware/auth';

export const productRoutes = new Elysia({ prefix: '/products' })
  .get('/', async ({ query }) => {
    const { categoryId, search, page = '1', limit = '10' } = query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  })

  .get('/:id', async ({ params }) => {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      throw new Error('محصول یافت نشد');
    }

    return product;
  })
  .use(adminMiddleware)
  .post(
    '/',
    async ({ body }) => {
      const product = await prisma.product.create({
        data: body,
        include: { category: true },
      });

      return {
        message: 'محصول با موفقیت ایجاد شد',
        product,
      };
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        price: t.Number({ minimum: 0 }),
        stock: t.Number({ minimum: 0 }),
        image: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const product = await prisma.product.update({
        where: { id: params.id },
        data: body,
        include: { category: true },
      });

      return {
        message: 'محصول با موفقیت به‌روزرسانی شد',
        product,
      };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        price: t.Optional(t.Number({ minimum: 0 })),
        stock: t.Optional(t.Number({ minimum: 0 })),
        image: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    }
  )
  // حذف محصول (فقط ادمین)
  .delete('/:id', async ({ params }) => {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return {
      message: 'محصول با موفقیت حذف شد',
    };
  });






