<script lang="ts">
	import { linear } from 'svelte/easing';
	import { blur } from 'svelte/transition';

	let text = 'Coming Soon';

	let mounted = $state(false);
	$effect(() => {
		const timeout = setTimeout(() => {
			mounted = true;
		}, 1000);

		return () => clearTimeout(timeout);
	});
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1>
		{#each Array.from(text) as char, i}
			{#if mounted}
				<span in:blur={{ delay: i * 100, amount: 10, duration: 1000, easing: linear }}>{char}</span>
			{/if}
		{/each}
	</h1>
</div>
