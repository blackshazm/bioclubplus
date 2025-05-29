import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';
import { isValidCPF } from '../utils/cpfValidator';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/tokenManager';
import EmailService from '../services/email.service';

// --- REGISTER ---
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, cpf, referredByCode } = req.body;

  try {
    // 1. Validar CPF (básico, a validação de formato já foi feita pelo Joi)
    if (!isValidCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido.' });
    }

    // 2. Verificar se já existe usuário com mesmo email ou CPF
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Já existe um usuário com este e-mail.' });
    }
    const existingUserByCPF = await User.findOne({ cpf });
    if (existingUserByCPF) {
      return res.status(400).json({ message: 'Já existe um usuário com este CPF.' });
    }

    // 3. Lidar com código de indicação (referredByCode)
    let referrer: IUser | null = null;
    if (referredByCode) {
      referrer = await User.findOne({ referralCode: referredByCode });
      if (!referrer) {
        return res.status(400).json({ message: 'Código de indicação inválido.' });
      }
    }

    // 4. Criar e salvar o novo usuário
    // O hash da senha e a geração do referralCode do novo usuário são feitos por pre-save hooks no model
    const newUser = new User({
      name,
      email,
      password, // Senha será hasheada pelo model
      cpf,
      referredBy: referrer ? referrer._id : undefined,
    });

    await newUser.save();

    // 5. Gerar token de verificação de e-mail
    const verificationToken = generateEmailVerificationToken({ userId: newUser._id.toString() });
    newUser.emailVerificationToken = verificationToken; // Embora não esteja no schema como 'select: false', pode ser útil para testes ou se o email não for enviado.
                                                       // O ideal é não salvar tokens de curta duração se o envio de email for robusto.
                                                       // Por simplicidade, vamos deixar assim por enquanto.
    await newUser.save({ validateBeforeSave: false }); // Salva sem re-validar para não ter problemas com campos 'select:false'

    // 6. Enviar e-mail de verificação
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    // console.log(`Email de verificação (simulado): ${verificationLink}`); // Simulação
    try {
      await EmailService.sendVerificationEmail(newUser.email, newUser.name, verificationLink);
    } catch (emailError: any) { // Tipar o erro como any ou unknown
      console.error("Erro ao enviar email de verificação:", emailError.message || emailError);
      // Não bloquear o registro se o email falhar, o usuário pode reenviar.
      // Em um sistema mais crítico, poderia adicionar a uma fila de reenvio.
    }

    // 7. Retornar resposta de sucesso
    // Não retornar tokens de acesso/refresh aqui; o usuário deve verificar o e-mail primeiro.
    res.status(201).json({
      message: 'Usuário registrado com sucesso! Por favor, verifique seu e-mail para ativar sua conta.',
      userId: newUser._id,
    });

  } catch (error) {
    next(error); // Passa o erro para o globalErrorHandler
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password'); // Precisa selecionar a senha para comparar

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas (email).' });
    }

    if (!user.password) { // Caso a senha não esteja definida por algum motivo (ex: login social futuro)
        return res.status(401).json({ message: 'Login não configurado para este usuário.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas (senha).' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Por favor, verifique seu e-mail antes de fazer login.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Sua conta está inativa. Entre em contato com o suporte.' });
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), roles: user.roles });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    // TODO: Armazenar refreshToken de forma segura (ex: HTTPOnly cookie ou no DB associado ao usuário)
    // Por agora, apenas retornando no corpo da resposta para simplicidade de desenvolvimento.

    // Remove a senha do objeto do usuário antes de enviar a resposta
    const userResponse = user.toObject(); // toObject() aplica as transformações do schema
    // delete userResponse.password; // Já é feito pelo toJSON/toObject do schema

    res.status(200).json({
      message: 'Login bem-sucedido!',
      accessToken,
      refreshToken, // Lembre-se das implicações de segurança ao enviar o refresh token assim
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// --- VERIFY EMAIL ---
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  try {
    const decoded = verifyEmailVerificationToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(400).json({ message: 'Token de verificação inválido ou expirado.' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    if (user.emailVerified) {
      return res.status(200).json({ message: 'E-mail já verificado.' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Limpa o token
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'E-mail verificado com sucesso! Você já pode fazer login.' });
  } catch (error) {
    next(error);
  }
};

// --- RESEND VERIFICATION EMAIL ---
export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body; // Ou pegar do req.user.email se a rota for protegida
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Este e-mail já foi verificado.' });
    }

    const verificationToken = generateEmailVerificationToken({ userId: user._id.toString() });
    // user.emailVerificationToken = verificationToken; // Opcional salvar
    // await user.save({ validateBeforeSave: false });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    // console.log(`Email de verificação REENVIADO (simulado): ${verificationLink}`); // Simulação
    try {
      await EmailService.sendVerificationEmail(user.email, user.name, verificationLink);
    } catch (emailError: any) {
      console.error("Erro ao reenviar email de verificação:", emailError.message || emailError);
      // Não precisa necessariamente passar para o next(error) aqui,
      // pois a falha no envio do email não impede o fluxo principal da API,
      // mas pode ser útil para o usuário saber.
      // Retornar um erro específico ou uma mensagem de que o envio falhou, mas a tentativa foi registrada.
      // Por simplicidade, vamos apenas logar e continuar, a resposta de sucesso já foi enviada.
      // Se quiser informar o usuário, a resposta de sucesso deveria vir depois daqui.
      // Para manter a estrutura atual, só logamos.
    }

    res.status(200).json({ message: 'E-mail de verificação reenviado com sucesso.' });
  } catch (error) {
    next(error);
  }
};

// --- FORGOT PASSWORD ---
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Não revelar se o email existe ou não por segurança, mas para UX pode ser útil.
      // Decisão de design: vamos informar que não foi encontrado para melhor UX.
      return res.status(404).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });
    }

    const resetToken = generatePasswordResetToken({ userId: user._id.toString() });
    user.passwordResetToken = resetToken; // Salvar o token hasheado seria mais seguro
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Token válido por 10 minutos
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // console.log(`Link de reset de senha (simulado): ${resetLink}`); // Simulação
    try {
      await EmailService.sendPasswordResetEmail(user.email, user.name, resetLink);
    } catch (emailError: any) {
      console.error("Erro ao enviar email de reset de senha:", emailError.message || emailError);
      // Limpar tokens do DB para evitar que fiquem presos se o email falhar
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false }); // Salva as alterações de limpeza
      // Informar o usuário sobre a falha no envio pode ser uma boa prática,
      // mas a resposta genérica "Se um usuário com este e-mail existir..." já foi enviada.
      // Apenas logar o erro aqui é suficiente para o backend.
    }

    res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' });
  } catch (error) {
    next(error);
  }
};

// --- RESET PASSWORD ---
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verificar o token (sem hashear por enquanto, mas idealmente seria hasheado no DB)
    const decoded = verifyPasswordResetToken(token);
    if (!decoded || !decoded.userId) {
        return res.status(400).json({ message: 'Token de redefinição inválido ou expirado.' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token, // Compara o token diretamente
      passwordResetExpires: { $gt: Date.now() }, // Verifica se não expirou
    }).select('+password'); // Precisamos do campo password para o pre-save hook funcionar corretamente

    if (!user) {
      return res.status(400).json({ message: 'Token de redefinição inválido, expirado ou usuário não encontrado.' });
    }

    user.password = password; // A senha será hasheada pelo pre-save hook do model
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.emailVerificationToken = undefined; // Limpar por segurança, caso houvesse algum
    if(!user.emailVerified) user.emailVerified = true; // Considerar o usuário como verificado após reset de senha bem sucedido

    await user.save(); // O hook pre-save irá hashear a nova senha

    // Opcional: logar o usuário automaticamente ou enviar um email de confirmação
    // Gerar novos tokens de acesso/refresh
    const accessToken = generateAccessToken({ userId: user._id.toString(), roles: user.roles });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    res.status(200).json({
      message: 'Senha redefinida com sucesso!',
      accessToken,
      refreshToken,
      user: user.toObject() // Retorna o usuário atualizado
    });

  } catch (error) {
    next(error);
  }
};

// --- REFRESH TOKEN ---
// export const refreshToken = async (req: Request, res: Response, next: NextFunction) => { /* ... placeholder ... */ };

// --- LOGOUT ---
// export const logout = async (req: Request, res: Response, next: NextFunction) => { /* ... placeholder ... */ };
