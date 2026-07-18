export interface HunterEmailResult {
    email: string | null;
    score?: number;
}

/**
 * Encontra/verifica um e-mail real de uma pessoa num domínio via Hunter.io Email Finder (tier gratuito).
 * Usado como fallback quando a Apollo não retorna e-mail para um decisor encontrado.
 */
export async function findEmailViaHunter(domain: string, fullName: string): Promise<HunterEmailResult> {
    const apiKey = process.env.HUNTER_API_KEY;
    if (!apiKey || !domain || !fullName.trim()) return { email: null };

    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(' ');
    if (!firstName || !lastName) return { email: null };

    try {
        const params = new URLSearchParams({
            domain,
            first_name: firstName,
            last_name: lastName,
            api_key: apiKey,
        });
        const res = await fetch(`https://api.hunter.io/v2/email-finder?${params.toString()}`);
        if (!res.ok) return { email: null };
        const data = await res.json();
        return { email: data?.data?.email || null, score: data?.data?.score };
    } catch (error) {
        console.error('Error querying Hunter.io:', error);
        return { email: null };
    }
}
