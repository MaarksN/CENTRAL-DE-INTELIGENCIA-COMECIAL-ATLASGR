import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export class AuthService {
    async register(data: any) {
        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const atlasOrg = await prisma.organization.findUnique({ where: { name: 'Atlas GR' } });
        if (!atlasOrg) {
             throw new Error('Default organization not found');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                organizationId: atlasOrg.id,
                role: 'VISUALIZADOR'
            }
        });

        return { message: 'User registered successfully' };
    }

    async login(data: any) {
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
