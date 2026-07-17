// Validação de CNPJ com o algoritmo oficial de dígitos verificadores (Receita Federal).

export function sanitizeCnpj(cnpj: string): string {
    return (cnpj || '').replace(/\D/g, '');
}

export function formatCnpj(cnpj: string): string {
    const digits = sanitizeCnpj(cnpj);
    if (digits.length !== 14) return cnpj;
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function calcCheckDigit(base: string): number {
    const weights = base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sum = base
        .split('')
        .reduce((acc, digit, idx) => acc + Number(digit) * weights[idx], 0);

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(cnpj: string): boolean {
    const digits = sanitizeCnpj(cnpj);
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false; // todos os dígitos iguais

    const base = digits.slice(0, 12);
    const firstCheck = calcCheckDigit(base);
    const secondCheck = calcCheckDigit(base + firstCheck);

    return digits === base + String(firstCheck) + String(secondCheck);
}
