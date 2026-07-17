import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// For enterprise architecture, these should come from a secure Vault or KMS.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// Keys should be rotated. We represent active and historical keys here.
const activeKeyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

if (activeKeyBuffer.length !== 32) {
    // Failsafe for dev environments
    console.warn("WARNING: ENCRYPTION_KEY must be 32 bytes (64 hex characters). Using fallback key.");
}

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(16);
    const key = activeKeyBuffer.length === 32 ? activeKeyBuffer : crypto.scryptSync('fallback-secret', 'salt', 32);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedData: string): string => {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) throw new Error("Invalid encrypted data format");

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = activeKeyBuffer.length === 32 ? activeKeyBuffer : crypto.scryptSync('fallback-secret', 'salt', 32);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const maskEmail = (email: string): string => {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `*@${domain}`;
    return `${local.substring(0, 1)}***${local.substring(local.length - 1)}@${domain}`;
};

export const maskDocument = (doc: string): string => {
    if (!doc || doc.length < 5) return doc;
    return `***.***.${doc.substring(doc.length - 2)}`;
};
