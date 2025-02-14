import axios from 'axios';

export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId) {
    return new Response(JSON.stringify({ error: 'Place ID is required' }), { status: 400 });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        placeid: placeId,
        key: apiKey,
        reviews_sort: 'newest',
      },
    });
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
  }
}
