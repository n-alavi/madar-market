import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { categoryRoutes } from './routes/categories';

const PORT = process.env.PORT || 3001;

const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))
  .get('/', () => ({
    message: 'خوش آمدید به API مادر مارکت',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
    },
  }))
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(productRoutes)
      .use(categoryRoutes)
      .use(orderRoutes)
  )
  .listen(PORT);

console.log(`🚀 سرور در حال اجرا است: http://localhost:${PORT}`);
console.log(`📚 API Docs: http://localhost:${PORT}/swagger`);

export type App = typeof app;






