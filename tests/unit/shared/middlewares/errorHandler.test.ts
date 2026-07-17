import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '@/shared/middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

describe('errorHandler Middleware', () => {
    it('should handle ZodError and return 400', () => {
        const error = new ZodError([{
            code: 'custom',
            path: ['name'],
            message: 'Nome é obrigatório',
        }]);

        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Erro de Validação',
            details: error.issues
        });
    });

    it('should handle general Error and return 500', () => {
        const error = new Error('Test Error');

        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Test Error'
        });
    });
});
