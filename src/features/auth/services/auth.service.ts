import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma.js';
import { z } from 'zod';
import { registerSchema, loginSchema } from '@/lib/zod.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export class AuthService {
    async register(data: z.infer<typeof registerSchema>) {
        const { name, email, password, organizationId } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        let orgId = organizationId;
        if (!orgId) {
             const newOrg = await prisma.organization.create({
                 data: { name: `${name}'s Organization` }
             });
             orgId = newOrg.id;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                organizationId: orgId,
                role: 'VISUALIZADOR'
            }
        });

        return { message: 'User registered successfully' };
    }

    async login(data: z.infer<typeof loginSchema>) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }

    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }

    async updateProfile(userId: string, name: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { name }
        });
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
}
export const authService = new AuthService();
