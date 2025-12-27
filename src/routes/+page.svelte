<script>
	import { onMount, onDestroy } from 'svelte';
	import DoseCard from '$lib/components/DoseCard.svelte';
	import PuffCounter from '$lib/components/PuffCounter.svelte';
	import ExtraPuffs from '$lib/components/ExtraPuffs.svelte';
	import {
		getTrackerState,
		getExtraPuffs,
		toggleDose,
		addExtraPuff,
		deleteExtraPuff,
		resetDay,
		refillInhaler,
		checkDailyReset,
		subscribeToTrackerState,
		subscribeToExtraPuffs
	} from '$lib/supabase.js';

	let state = $state({
		morning_completed: false,
		morning_timestamp: null,
		evening_completed: false,
		evening_timestamp: null,
		puff_count: 120,
		last_reset_date: null
	});

	let extraPuffs = $state([]);
	let loading = $state(true);
	let stateSubscription;
	let puffSubscription;

	// Computed values
	let allDosesCompleted = $derived(state.morning_completed && state.evening_completed);
	let isLowPuffs = $derived(state.puff_count <= 20);

	onMount(async () => {
		// Check for daily reset
		await checkDailyReset();

		// Load initial data
		await loadData();

		// Set up real-time subscriptions
		stateSubscription = subscribeToTrackerState(async () => {
			const newState = await getTrackerState();
			if (newState) {
				state = newState;
			}
		});

		puffSubscription = subscribeToExtraPuffs(async () => {
			extraPuffs = await getExtraPuffs();
		});

		loading = false;
	});

	onDestroy(() => {
		if (stateSubscription) {
			stateSubscription.unsubscribe();
		}
		if (puffSubscription) {
			puffSubscription.unsubscribe();
		}
	});

	async function loadData() {
		const trackerState = await getTrackerState();
		if (trackerState) {
			state = trackerState;
		}

		extraPuffs = await getExtraPuffs();
	}

	async function handleToggleDose(doseType) {
		const result = await toggleDose(doseType);
		if (result) {
			state = result;
		}
	}

	async function handleAddExtraPuff() {
		await addExtraPuff();
		// Data will update via subscription
	}

	async function handleDeleteExtraPuff(puffId) {
		await deleteExtraPuff(puffId);
		// Data will update via subscription
	}

	async function handleResetDay() {
		if (confirm('Are you sure you want to reset today\'s doses?')) {
			const result = await resetDay();
			if (result) {
				state = result;
			}
		}
	}

	async function handleRefill(newCount) {
		const result = await refillInhaler(newCount);
		if (result) {
			state = result;
		}
	}

	function formatDate() {
		const today = new Date();
		return today.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Brad's Asthma Tracker</title>
</svelte:head>

<div class="container">
	<!-- Header -->
	<header class="header">
		<div class="cat-photo">
			<div class="cat-placeholder">🐱</div>
		</div>
		<h1>Brad's Asthma Tracker</h1>
		<div class="date">{formatDate()}</div>
	</header>

	{#if loading}
		<div class="loading-message">Loading...</div>
	{:else}
		<!-- Low Puff Warning Banner -->
		{#if isLowPuffs}
			<div class="warning-banner">
				⚠️ LOW INHALER - Time to order replacement
			</div>
		{/if}

		<!-- Status Banner -->
		<div class="status-banner" class:completed={allDosesCompleted}>
			{allDosesCompleted ? '✓ All doses completed' : 'Doses pending'}
		</div>

		<!-- Daily Doses Card -->
		<div class="card">
			<div class="card-title">Daily Doses</div>

			<DoseCard
				doseType="morning"
				completed={state.morning_completed}
				timestamp={state.morning_timestamp}
				onToggle={handleToggleDose}
			/>

			<DoseCard
				doseType="evening"
				completed={state.evening_completed}
				timestamp={state.evening_timestamp}
				onToggle={handleToggleDose}
			/>

			<button class="btn" style="margin-top: 16px;" on:click={handleResetDay}>
				Reset Day
			</button>
		</div>

		<!-- Puff Counter Card -->
		<div class="card">
			<PuffCounter puffCount={state.puff_count} onRefill={handleRefill} />
		</div>

		<!-- Extra Puffs Card -->
		<div class="card">
			<div class="card-title">Extra Puffs</div>
			<ExtraPuffs
				{extraPuffs}
				onAdd={handleAddExtraPuff}
				onDelete={handleDeleteExtraPuff}
			/>
		</div>
	{/if}
</div>

<style>
	.header {
		text-align: center;
		padding: 24px 16px;
		background: var(--bg-main);
		margin-bottom: 16px;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.cat-photo {
		display: flex;
		justify-content: center;
		margin-bottom: 12px;
	}

	.cat-placeholder {
		width: 80px;
		height: 80px;
		background: var(--bg-subtle);
		border: 3px solid var(--brand-cinnamon);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48px;
		transition: transform 0.2s ease;
	}

	.cat-placeholder:hover {
		transform: scale(1.05);
	}

	h1 {
		font-size: 28px;
		font-weight: bold;
		color: var(--brand-cinnamon);
		margin-bottom: 8px;
	}

	.date {
		color: var(--text-muted);
		font-size: 14px;
	}

	.warning-banner {
		background: var(--warning-bg);
		border: 3px solid var(--warning-border);
		border-radius: 8px;
		padding: 16px;
		text-align: center;
		font-weight: bold;
		margin-bottom: 16px;
		color: var(--warning-text);
		font-size: 16px;
		box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
	}

	.status-banner {
		background: var(--pending-bg);
		border: 2px solid var(--border-light);
		border-radius: 8px;
		padding: 16px;
		text-align: center;
		font-weight: bold;
		margin-bottom: 16px;
		color: var(--text-main);
		transition: all 0.3s ease;
	}

	.status-banner.completed {
		background: var(--success-bg);
		border-color: var(--success-border);
		color: var(--success-text);
	}

	.loading-message {
		text-align: center;
		padding: 48px 16px;
		color: var(--text-muted);
		font-size: 18px;
	}

	/* Tablet and up */
	@media (min-width: 768px) {
		h1 {
			font-size: 32px;
		}

		.cat-placeholder {
			width: 96px;
			height: 96px;
			font-size: 56px;
		}

		.header {
			padding: 32px 24px;
		}

		.warning-banner {
			font-size: 18px;
			padding: 20px;
		}
	}
</style>
