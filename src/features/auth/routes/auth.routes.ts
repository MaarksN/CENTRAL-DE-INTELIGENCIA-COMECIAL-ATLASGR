import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { authenticateToken } from '../../../shared/middlewares/authenticateToken.js';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error: unknown) {
        if (error instanceof Error && (error.message === 'User already exists' || error.message === 'Invalid credentials')) {
             res.status(400).json({ error: error.message });
        } else {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
             res.status(400).json({ error: error.message });
        } else {
             console.error('Login error:', error);
             res.status(500).json({ error: 'Login failed' });
        }
    }
});

router.get('/me', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await authService.getProfile((req as any).user.id);
        res.json(profile);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User not found') {
             res.status(404).json({ error: error.message });
        } else {
             res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }
});

router.put('/profile', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await authService.updateProfile((req as any).user.id, req.body.name);
        res.json(profile);
    } catch (error: unknown) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.post('/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully' });
});

export const authRoutes = router;
