export interface LimeData {
	last_updated: number;
	ttl: number;
	version: string;
	data: {
		bikes: {
			bike_id: string;
			is_disabled: number;
			is_reserved: number;
			lat: number;
			lon: number;
			vehicle_type: string;
		}[];
	};
}

export async function GET() {
	const data = await (
		await fetch('https://data.lime.bike/api/partners/v1/gbfs/washington_dc/free_bike_status.json', {
			mode: 'no-cors'
		})
	).json();

	return new Response(JSON.stringify(data));
}
