import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    details?: any;
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: any;

    constructor(message: string, statusCode: number = 400, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

export const errorHandler = (err: Error & { statusCode?: number, details?: any }, req: Request, res: Response, next: NextFunction) => {
    console.error('Global Error Handler:', err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: 'Erro de Validação',
            details: err.issues
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            details: err.details
        });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Erro Interno do Servidor'
    });
};
