import express from 'express';
import Joi from 'joi';

// Controladores (serão implementados no próximo passo, por enquanto apenas placeholders)
import * as authController from '../controllers/auth.controller'; // Ajuste o caminho se necessário

// Middlewares
import { validateRequest } from '../middlewares/validation.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';
import { protect } from '../middlewares/auth.middleware'; // Para rotas como resend-verification

const router = express.Router();

// --- Schemas de Validação Joi ---

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Nome deve ser um texto.',
    'string.empty': 'Nome não pode ser vazio.',
    'string.min': 'Nome deve ter no mínimo {#limit} caracteres.',
    'string.max': 'Nome deve ter no máximo {#limit} caracteres.',
    'any.required': 'Nome é obrigatório.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser um endereço válido.',
    'string.empty': 'Email não pode ser vazio.',
    'any.required': 'Email é obrigatório.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Senha não pode ser vazia.',
    'string.min': 'Senha deve ter no mínimo {#limit} caracteres.',
    'any.required': 'Senha é obrigatória.',
  }),
  cpf: Joi.string().length(11).pattern(/^\d+$/).required().messages({ // Validar se são apenas números e tamanho 11
    'string.length': 'CPF deve ter {#limit} dígitos.',
    'string.pattern.base': 'CPF deve conter apenas números.',
    'string.empty': 'CPF não pode ser vazio.',
    'any.required': 'CPF é obrigatório.',
  }),
  referredByCode: Joi.string().optional().allow('').trim(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser um endereço válido.',
    'any.required': 'Email é obrigatório.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória.',
  }),
});

const emailVerificationSchema = Joi.object({
  token: Joi.string().required().messages({'any.required': 'Token de verificação é obrigatório.'}),
});

const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser um endereço válido.',
    'any.required': 'Email é obrigatório.',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser um endereço válido.',
    'any.required': 'Email é obrigatório.',
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({'any.required': 'Token é obrigatório.'}),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Nova senha deve ter no mínimo {#limit} caracteres.',
    'any.required': 'Nova senha é obrigatória.',
  }),
});

// --- Rotas de Autenticação ---

// POST /api/auth/register
router.post(
  '/register',
  authLimiter, // Aplicar rate limiting específico para rotas de autenticação
  validateRequest({ body: registerSchema }),
  authController.register // Controlador será implementado depois
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validateRequest({ body: loginSchema }),
  authController.login // Controlador será implementado depois
);

// GET /api/auth/verify-email/:token
router.get(
  '/verify-email/:token',
  validateRequest({ params: emailVerificationSchema }),
  authController.verifyEmail // Controlador será implementado depois
);

// POST /api/auth/resend-verification-email
router.post(
  '/resend-verification-email',
  authLimiter,
  protect, // Usuário precisa estar logado para reenviar (ou pode ser aberto, dependendo da lógica)
  validateRequest({ body: resendVerificationEmailSchema }),
  authController.resendVerificationEmail // Controlador será implementado depois
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  authLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  authController.forgotPassword // Controlador será implementado depois
);

// POST /api/auth/reset-password/:token
router.post(
  '/reset-password/:token',
  authLimiter,
  validateRequest({ params: Joi.object({ token: Joi.string().required() }), body: resetPasswordSchema.extract('password') }), // Valida token no params e password no body
  authController.resetPassword // Controlador será implementado depois
);

// POST /api/auth/refresh-token
// Esta rota precisará de um refresh token válido no body ou cookie
// router.post('/refresh-token', authController.refreshToken); // Implementar depois

// POST /api/auth/logout
// router.post('/logout', protect, authController.logout); // Implementar depois

export default router;
