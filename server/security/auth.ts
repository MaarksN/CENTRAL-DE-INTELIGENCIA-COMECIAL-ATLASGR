import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_SECRET || 'fallback-access-secret-for-dev';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-for-dev';

export interface UserPayload {
    id: string;
    email: string;
    role: string;
    organizationId: string;
}

// In-memory cache for simple replay attack protection via nonces
const nonceCache = new Set<string>();

export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: UserPayload): string => {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string, isRefresh = false): UserPayload => {
    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET;
    return jwt.verify(token, secret) as UserPayload;
};

export const rotateToken = (refreshToken: string): { accessToken: string, newRefreshToken: string } | null => {
    try {
        const payload = verifyToken(refreshToken, true);
        // Note: In a real enterprise system, you should look up the user again to ensure they haven't been deleted or roles changed.
        // For simplicity here, we assume the payload is valid enough to issue new tokens.
        // We will just generate new tokens based on ID, but ideally we'd fetch full UserPayload.

        // Let's create a placeholder payload, the caller should ideally fetch user data and call generateAccessToken directly.
        // We'll throw an error here to encourage the route handler to fetch the user.
        throw new Error('rotateToken requires full user fetch, use generateAccessToken in route handler.');
    } catch (e) {
        return null;
    }
}

export const checkReplayAttack = (nonce: string): boolean => {
    if (!nonce) return false; // Nonce is required
    if (nonceCache.has(nonce)) {
        return false; // Replay attack detected
    }
    nonceCache.add(nonce);

    // Simple cleanup to prevent memory leak (in production, use Redis with TTL)
    if (nonceCache.size > 10000) {
        nonceCache.clear();
    }

    return true;
};
