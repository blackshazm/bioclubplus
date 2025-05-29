import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/tokenManager';
import User, { IUser } from '../models/user.model';

// Estender a interface Request do Express para incluir a propriedade 'user'
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser; // Ou IUser, dependendo do que você quer anexar
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token) as TokenPayload | null;

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Não autorizado, token inválido.' });
      }

      // Anexa o usuário (sem a senha) ao objeto req
      // O 'select("-password")' é importante aqui se você não o fez globalmente no model
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado.' });
      }
      if (!user.isActive) {
         return res.status(401).json({ message: 'Não autorizado, usuário inativo.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Erro na autenticação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
  }
};

// Middleware para verificar papéis (roles)
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Proibido: Usuário sem papéis definidos.' });
    }
    if (!roles.some(role => req.user!.roles.includes(role))) {
      return res.status(403).json({
        message: `Proibido: Papel '${req.user.roles.join(',')}' não tem permissão para acessar este recurso. Papéis permitidos: ${roles.join(',')}.`
      });
    }
    next();
  };
};
