/**
 * Valida um número de CPF.
 * Esta é uma validação básica e pode não cobrir todos os casos ou formatos.
 * Para produção, considere uma biblioteca mais robusta.
 * @param cpf O CPF a ser validado (pode conter pontos e traço).
 * @returns True se o CPF for aparentemente válido, False caso contrário.
 */
export const isValidCPF = (cpf: string): boolean => {
  if (!cpf) return false;

  const cpfClean = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cpfClean.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos (todos os números iguais)
  if (/^(\d)+$/.test(cpfClean)) return false;

  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfClean.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpfClean.substring(10, 11))) return false;

  return true;
};
