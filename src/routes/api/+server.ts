export interface Data {
	lime: Vehicle[];
	lyft: Vehicle[];
}

export interface Vehicle {
	id: string;
	lat: number;
	lon: number;
}

interface LimeData {
	last_updated: number;
	ttl: number;
	version: string;
	data: {
		bikes: {
			bike_id: string;
			lat: number;
			lon: number;
			vehicle_type: string;
		}[];
	};
}

interface LyftData {
	data: {
		bikes: {
			bike_id: string;
			lat: 38.918041813833334;
			lon: -77.02698008283333;
			type: string;
		}[];
	};
}

export async function GET() {
	const [limeData, lyftData]: [LimeData, LyftData] = await Promise.all([
		(
			await fetch(
				'https://data.lime.bike/api/partners/v1/gbfs/washington_dc/free_bike_status.json',
				{
					mode: 'no-cors'
				}
			)
		).json(),
		(
			await fetch(
				'https://s3.amazonaws.com/lyft-lastmile-production-iad/lbs/dca/free_bike_status.json',
				{
					mode: 'no-cors'
				}
			)
		).json()
	]);

	const data: Data = {
		lime: limeData.data.bikes.map((item) => ({ lat: item.lat, lon: item.lon, id: item.bike_id })),
		lyft: lyftData.data.bikes
			.filter((item) => item.type == 'electric_scooter')
			.map((item) => ({ lat: item.lat, lon: item.lon, id: item.bike_id }))
	};

	return new Response(JSON.stringify(data));
}
