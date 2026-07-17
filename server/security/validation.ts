import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Strict input validation schemas to prevent Mass Assignment, XSS, and SQL Injection vectors

export const registerSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Name should only contain letters and spaces"),
    email: z.string().email().max(255),
    password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(8).max(128)
});

export const profileUpdateSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Name should only contain letters and spaces").optional(),
});

export const prospectCriteriaSchema = z.object({
    segmento: z.string().min(2).max(100),
    localizacao: z.string().min(2).max(100),
    tamanhoFrota: z.string().min(1).max(50),
    faturamento: z.string().min(1).max(50),
    dorPrincipal: z.string().min(2).max(500),
    tecnologiaAtual: z.string().min(2).max(200)
});

export const intelligenceToolSchema = z.object({
    tool: z.enum(['script_call', 'script_whatsapp', 'script_email', 'prompt', 'objections', 'followup', 'profile', 'risk'])
});

// Generic Validation Middleware wrapper
export const validateRequest = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
    };
};
