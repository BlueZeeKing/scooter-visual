<script lang="ts">
	import { onMount } from 'svelte';
	import mapData from '../map.json';
	import type { DisplayData, LimeData } from './api/+server';
	import { BubbleMapChart, topojson } from 'chartjs-chart-geo';

	function distance(x1: number, y1: number, x2: number, y2: number) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}

	let container: HTMLCanvasElement;

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

		new BubbleMapChart(container, {
			data: {
				labels: ['Map', 'Scooters'],
				datasets: [
					{
						label: 'Scooters',
						outline: mapData.features,
						showOutline: true,
						data: []
					}
				]
			}
		});
	});
</script>

<canvas bind:this={container} class="full" />

<style>
	.full {
		height: 100vh;
		width: 100vw;
	}
</style>
