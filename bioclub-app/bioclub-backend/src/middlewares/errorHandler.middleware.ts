import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface AppError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
    code?: number; // Para erros de banco de dados, como duplicidade (E11000)
}

const handleDuplicateFieldsDB = (err: AppError) => {
    const valueMatch = err.message.match(/(["'])(\?.)*?/);
    const value = valueMatch ? valueMatch[0] : "Valor desconhecido";
    const message = `Valor duplicado: ${value}. Por favor, use outro valor.`;
    return { statusCode: 400, message };
};

const handleValidationErrorDB = (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const errors = Object.values(err.errors).map((el: any) => el.message); // eslint-disable-line @typescript-eslint/no-explicit-any
    const message = `Dados de entrada inválidos. ${errors.join('. ')}`;
    return { statusCode: 400, message };
};

const handleJWTError = () => ({
    statusCode: 401,
    message: 'Token inválido. Por favor, faça login novamente.',
});

const handleJWTExpiredError = () => ({
    statusCode: 401,
    message: 'Seu token expirou! Por favor, faça login novamente.',
});


export const globalErrorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let errorResponse = {
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Expor stack apenas em dev
    // errors: err.errors // Para erros de validação Joi, por exemplo
  };

  // Erros específicos do Mongoose / Banco de Dados
  if (err.name === 'MongoServerError' && err.code === 11000) { // Duplicate key
      const customError = handleDuplicateFieldsDB(err);
      errorResponse.message = customError.message;
      err.statusCode = customError.statusCode;
  } else if (err.name === 'ValidationError') { // Mongoose validation error
      const customError = handleValidationErrorDB(err);
      errorResponse.message = customError.message;
      err.statusCode = customError.statusCode;
  } else if (err.name === 'JsonWebTokenError') {
      const customError = handleJWTError();
      errorResponse.message = customError.message;
      err.statusCode = customError.statusCode;
  } else if (err.name === 'TokenExpiredError') {
      const customError = handleJWTExpiredError();
      errorResponse.message = customError.message;
      err.statusCode = customError.statusCode;
  }


  // Log do erro no console (apenas em desenvolvimento para não poluir logs de produção com todo o objeto)
  if (process.env.NODE_ENV === 'development') {
    console.error('ERRO globalErrorHandler ---------------->:', err);
  } else {
     // Em produção, logar apenas a mensagem ou um resumo
     console.error(`ERRO: ${err.statusCode} - ${err.message}`);
  }


  res.status(err.statusCode).json(errorResponse);
};
