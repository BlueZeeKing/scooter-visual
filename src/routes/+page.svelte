<script lang="ts">
	//import Chart from 'chart.js/auto';
	import Highcharts from 'highcharts/highmaps';
	import { onMount } from 'svelte';
	import data from '../map.json';
	import type { LimeData } from './api/+server';

	let container: HTMLDivElement;

	onMount(async () => {
		const res = await fetch('/api');
		const data: LimeData = await res.json();

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
					mapData: data,
					name: 'Washington DC',
					type: 'map',
					borderColor: '#707070',
					nullColor: 'rgba(200, 200, 200, 0.3)',
					showInLegend: false
				}
			]
		});
	});
</script>

<div bind:this={container} />
