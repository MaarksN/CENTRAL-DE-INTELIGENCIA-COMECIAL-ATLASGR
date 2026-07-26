import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/lib/api';

describe('API Client', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = vi.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.clearAllMocks();
    });

    it('should successfully get data using api.get', async () => {
        const mockData = { id: 1, name: 'Test' };
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockData
        } as Response);

        const result = await api.get('/api/test');
        expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({ method: 'GET' }));
        expect(result).toEqual(mockData);
    });

    it('should successfully post data with success wrapper', async () => {
        const mockResponse = { success: true, data: { id: 1 } };
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse
        } as Response);

        const result = await api.post('/api/test', { name: 'Test' });
        expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ name: 'Test' })
        }));
        expect(result).toEqual({ id: 1 });
    });

    it('should throw error when response is not ok', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({ error: 'Bad Request' })
        } as Response);

        await expect(api.get('/api/test')).rejects.toThrow('Bad Request');
    });

    it('should throw error when success wrapper returns false', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ success: false, error: 'Logic Error' })
        } as Response);

        await expect(api.get('/api/test')).rejects.toThrow('Logic Error');
    });
});
