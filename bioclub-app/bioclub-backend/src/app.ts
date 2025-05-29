import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';
import { defaultLimiter } from './middlewares/rateLimiter.middleware';
import authRoutes from './routes/auth.routes';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Conectar ao MongoDB
connectDB();

const app: Application = express();

// Middlewares básicos
app.use(cors()); // Habilita CORS para todas as origens por padrão
app.use(helmet()); // Adiciona vários headers de segurança HTTP
app.use(express.json()); // Faz o parse de requisições com payload JSON
app.use(express.urlencoded({ extended: true })); // Faz o parse de requisições com payload URL encoded

// HTTP request logger middleware em modo 'dev' apenas se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Aplicar rate limiting padrão a todas as requisições /api
// Pode ser mais específico, ex: app.use('/api', defaultLimiter);
app.use(defaultLimiter);

// Endpoint de Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'BioClub Backend is healthy!',
  });
});

// Rotas da API
app.use('/api/auth', authRoutes); // Adicionar esta linha

// Placeholder para outras rotas da API (serão adicionadas depois)
// Ex: app.use('/api/users', userRoutes);

// Placeholder para middleware de tratamento de erros global (será adicionado depois)
// app.use(globalErrorHandler);

// Middleware de tratamento de erros global (DEVE SER O ÚLTIMO MIDDLEWARE)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
  if (process.env.NODE_ENV) {
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
  }
});

export default app; // Exportar app para uso em testes, por exemplo
