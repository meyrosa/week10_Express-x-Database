import express from 'express';
import { requestLogger } from './middleware/request-logger.js';
import productRouter from './routes/product.routes.js';

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/products', productRouter);

export default app;