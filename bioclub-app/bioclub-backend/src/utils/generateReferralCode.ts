import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um código de referência único.
 * @param length Opcional: tamanho da porção aleatória do código. Padrão 6.
 * @returns Um string de código de referência.
 */
export const generateUniqueReferralCode = (length: number = 6): string => {
  // Exemplo: BIOCLUB-A2C4E6
  const prefix = 'BIOCLUB';
  const randomPart = uuidv4().replace(/-/g, '').substring(0, length).toUpperCase();
  return `${prefix}-${randomPart}`;
};
