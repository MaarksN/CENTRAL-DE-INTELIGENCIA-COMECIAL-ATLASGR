import type { PlaceCandidate } from './places.service';

/** Busca candidatos reais de empresas por categoria+região via OpenStreetMap Nominatim. */
export async function searchNominatimCandidates(query: string, count: number): Promise<PlaceCandidate[]> {
    if (!query.trim()) return [];

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${Math.min(Math.max(count, 1), 20)}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'ProspectorAtlas/1.0',
            }
        });

        if (!res.ok) {
            console.error('Nominatim error:', await res.text());
            return [];
        }

        const data = await res.json();
        
        return data.map((p: any) => {
            const addr = p.address || {};
            const city = addr.city || addr.town || addr.village;
            const state = addr.state;
            
            const tradeName = p.name || p.display_name?.split(',')[0] || 'Empresa sem nome';

            return {
                tradeName,
                address: p.display_name,
                city,
                state,
                rating: undefined,
                userRatingCount: undefined,
                phone: undefined, // Nominatim usually doesn't have phone in standard search endpoint
                website: undefined,
            } satisfies PlaceCandidate;
        });
    } catch (error) {
        console.error('Error searching Nominatim candidates:', error);
        return [];
    }
}
