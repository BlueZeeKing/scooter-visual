<script lang="ts">
	import Highcharts, { map } from 'highcharts/highmaps';
	import { onMount } from 'svelte';
	import mapData from '../map.json';
	import type { DisplayData, LimeData } from './api/+server';

	function distance(x1: number, y1: number, x2: number, y2: number) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}

	let container: HTMLDivElement;

	function getDisplayData(data: LimeData, size: number) {
		const displayData: DisplayData[] = [];

		data.data.bikes.forEach((element) => {
			const bubble = displayData.find(
				(item) => distance(item.lat, item.lon, element.lat, element.lon) < size
			);
			if (bubble == undefined) {
				displayData.push({
					lat: element.lat,
					lon: element.lon,
					count: 1
				});
			} else {
				bubble.count++;
			}
		});

		return displayData;
	}

	onMount(async () => {
		const data: LimeData = await (await fetch('/api')).json();

		const chart = Highcharts.mapChart(container, {
			title: {
				text: 'Live DC Scooter Data',
				align: 'left'
			},
			mapNavigation: {
				enabled: true
			},
			series: [
				{
					mapData: mapData,
					name: 'Washington DC',
					type: 'map',
					borderColor: '#707070',
					nullColor: 'rgba(200, 200, 200, 0.3)',
					showInLegend: false
				},
				{
					type: 'mapbubble',
					turboThreshold: 10000,
					name: 'Scooters',
					maxSize: 35,
					data: getDisplayData(data, 0.005).map((item) => ({
						lat: item.lat,
						lon: item.lon,
						z: item.count
					}))
				}
			]
		});

		// setInterval(async () => {
		// 	const data: LimeData = await (await fetch('/api')).json();

		// 	chart.series
		// 		.find((item) => (item.name = 'Scooters'))
		// 		?.setData(
		// 			getDisplayData(data, 0.005).map((item) => ({
		// 				lat: item.lat,
		// 				lon: item.lon,
		// 				z: item.count
		// 			}))
		// 		);
		// }, 10000);
	});
</script>

<div bind:this={container} class="full" />

<style>
	.full {
		height: 100vh;
		width: 100vw;
	}
</style>
