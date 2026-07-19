export class GuardrailsService {
    validateOutput(text: string): boolean {
        // Basic check for things that might look like a CPF (PII check example)
        const cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}/;
        if (cpfRegex.test(text)) {
            return false;
        }

        // Add more robust checks here (prompt injection, jailbreaks, etc)
        return true;
    }
}
