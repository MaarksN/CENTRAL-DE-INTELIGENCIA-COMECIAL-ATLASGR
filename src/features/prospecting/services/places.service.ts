export interface PlaceSearchResult {
    id: string;
    displayName: string;
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
    nationalPhoneNumber?: string;
    websiteUri?: string;
    businessHours?: any;
    error?: string;
}

export async function searchGooglePlace(
    companyName: string,
    locationStr: string
): Promise<PlaceSearchResult | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    const query = `${companyName} ${locationStr}`.trim();
    if (!query) return null;

    try {
        const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours',
            },
            body: JSON.stringify({
                textQuery: query,
                languageCode: 'pt-BR'
            }),
        });

        if (!res.ok) {
            console.error('Google Places API error:', await res.text());
            return null;
        }

        const data = await res.json();
        const places = data.places || [];
        
        if (places.length === 0) {
            return null;
        }

        // Retorna o primeiro resultado (maior relevância)
        const p = places[0];
        
        return {
            id: p.id,
            displayName: p.displayName?.text || companyName,
            formattedAddress: p.formattedAddress,
            rating: p.rating,
            userRatingCount: p.userRatingCount,
            nationalPhoneNumber: p.nationalPhoneNumber,
            websiteUri: p.websiteUri,
            businessHours: p.regularOpeningHours
        };
    } catch (error) {
        console.error('Error fetching Google Place:', error);
        return null;
    }
}
