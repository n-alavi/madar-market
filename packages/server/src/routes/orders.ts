import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

export const orderRoutes = new Elysia({ prefix: '/orders' })
  .use(authMiddleware)
  // دریافت سفارشات کاربر
  .get('/', async ({ user }) => {
    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  })
  .get('/:id', async ({ params, user }) => {
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('سفارش یافت نشد');
    }

    return order;
  })

  .post(
    '/',
    async ({ body, user }) => {
      const { items } = body;

      // محاسبه مجموع
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`محصول با شناسه ${item.productId} یافت نشد`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`موجودی محصول ${product.name} کافی نیست`);
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // ایجاد سفارش
      const order = await prisma.order.create({
        data: {
          userId: user.userId,
          total,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // کاهش موجودی محصولات
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return {
        message: 'سفارش با موفقیت ثبت شد',
        order,
      };
    },
    {
      body: t.Object({
        items: t.Array(
          t.Object({
            productId: t.String(),
            quantity: t.Number({ minimum: 1 }),
          })
        ),
      }),
    }
  )
  // به‌روزرسانی وضعیت سفارش (فقط ادمین)
  .use(adminMiddleware)
  .patch(
    '/:id/status',
    async ({ params, body }) => {
      const order = await prisma.order.update({
        where: { id: params.id },
        data: { status: body.status },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              phoneNumber: true,
              name: true,
            },
          },
        },
      });

      return {
        message: 'وضعیت سفارش به‌روزرسانی شد',
        order,
      };
    },
    {
      body: t.Object({
        status: t.Union([
          t.Literal('PENDING'),
          t.Literal('PROCESSING'),
          t.Literal('SHIPPED'),
          t.Literal('DELIVERED'),
          t.Literal('CANCELLED'),
        ]),
      }),
    }
  )

  .get('/admin/all', async () => {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            phoneNumber: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  });






