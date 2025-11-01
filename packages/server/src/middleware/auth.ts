import { Elysia } from 'elysia';
import { verifyToken, type JWTPayload } from '../lib/jwt';

export const authMiddleware = (app: Elysia) =>
    app.derive(({ headers }): { user: JWTPayload } => {
        const authorization = headers.authorization;

        if (!authorization) {
            throw new Error('توکن احراز هویت یافت نشد');
        }

        const token = authorization.replace('Bearer ', '');

        try {
            const user = verifyToken(token);
            return { user };
        } catch (error) {
            throw new Error('توکن نامعتبر است');
        }
    });

export const adminMiddleware = (app: Elysia) =>
    app.use(authMiddleware)
        .onBeforeHandle(({ user }) => {
            if (user.role !== 'ADMIN') {
                throw new Error('شما دسترسی ادمین ندارید');
            }
        });

