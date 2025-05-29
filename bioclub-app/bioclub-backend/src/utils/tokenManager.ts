import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

const JWT_EMAIL_VERIFICATION_SECRET = process.env.JWT_EMAIL_VERIFICATION_SECRET as string;
const JWT_EMAIL_VERIFICATION_EXPIRES_IN = process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN;

const JWT_PASSWORD_RESET_SECRET = process.env.JWT_PASSWORD_RESET_SECRET as string;
const JWT_PASSWORD_RESET_EXPIRES_IN = process.env.JWT_PASSWORD_RESET_EXPIRES_IN;

if (!JWT_SECRET || !JWT_REFRESH_SECRET || !JWT_EMAIL_VERIFICATION_SECRET || !JWT_PASSWORD_RESET_SECRET) {
  console.error('Erro: Segredos JWT não definidos completamente no .env');
  // Em um ambiente de produção, você poderia querer que o processo saísse:
  // process.exit(1);
}

export interface TokenPayload {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Permite outras propriedades
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_EMAIL_VERIFICATION_SECRET, { expiresIn: JWT_EMAIL_VERIFICATION_EXPIRES_IN });
};

export const verifyEmailVerificationToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_EMAIL_VERIFICATION_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_PASSWORD_RESET_SECRET, { expiresIn: JWT_PASSWORD_RESET_EXPIRES_IN });
};

export const verifyPasswordResetToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_PASSWORD_RESET_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
