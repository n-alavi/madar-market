import { Elysia, t } from 'elysia';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../lib/hash';
import { generateToken } from '../lib/jwt';

export const authRoutes = new Elysia({ prefix: '/auth' })
  // ثبت نام
  .post(
    '/register',
    async ({ body }) => {
      const { phoneNumber, password, name } = body;

      // بررسی وجود کاربر
      const existingUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (existingUser) {
        throw new Error('این شماره موبایل قبلاً ثبت شده است');
      }

      // هش کردن رمز عبور
      const hashedPassword = await hashPassword(password);

      // ایجاد کاربر
      const user = await prisma.user.create({
        data: {
          phoneNumber,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      // ایجاد توکن
      const token = generateToken({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });

      return {
        message: 'ثبت نام با موفقیت انجام شد',
        user,
        token,
      };
    },
    {
      body: t.Object({
        phoneNumber: t.String({ pattern: '^09[0-9]{9}$' }),
        password: t.String({ minLength: 6 }),
        name: t.Optional(t.String()),
      }),
    }
  )
  // ورود
  .post(
    '/login',
    async ({ body }) => {
      const { phoneNumber, password } = body;

      // پیدا کردن کاربر
      const user = await prisma.user.findUnique({
        where: { phoneNumber },
      });

      if (!user) {
        throw new Error('شماره موبایل یا رمز عبور اشتباه است');
      }

      // بررسی رمز عبور
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new Error('شماره موبایل یا رمز عبور اشتباه است');
      }

      // ایجاد توکن
      const token = generateToken({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });

      return {
        message: 'ورود با موفقیت انجام شد',
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          role: user.role,
        },
        token,
      };
    },
    {
      body: t.Object({
        phoneNumber: t.String(),
        password: t.String(),
      }),
    }
  );




