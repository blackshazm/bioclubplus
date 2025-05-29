import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Interface para definir onde validar (body, query, params)
interface ValidationSource {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

export const validateRequest = (schemaParts: ValidationSource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Joi.ValidationErrorItem[] = [];

    if (schemaParts.body) {
      const { error } = schemaParts.body.validate(req.body, { abortEarly: false });
      if (error) errors.push(...error.details);
    }
    if (schemaParts.query) {
      const { error } = schemaParts.query.validate(req.query, { abortEarly: false });
      if (error) errors.push(...error.details);
    }
    if (schemaParts.params) {
      const { error } = schemaParts.params.validate(req.params, { abortEarly: false });
      if (error) errors.push(...error.details);
    }

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        message: err.message.replace(/['"]/g, ''), // Limpa aspas
        path: err.path.join('.'),
        type: err.type,
      }));
      return res.status(400).json({
        message: 'Erro de validação.',
        errors: formattedErrors,
      });
    }

    next();
  };
};
