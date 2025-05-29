import rateLimit from 'express-rate-limit';

export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por janela (windowMs)
  standardHeaders: true, // Retorna informações do rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  message: 'Muitas requisições deste IP, por favor, tente novamente após 15 minutos.',
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // Limita cada IP a 10 requisições de autenticação (login, registro, etc.) por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas tentativas de autenticação deste IP, por favor, tente novamente após 5 minutos.',
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas para o limite
});
