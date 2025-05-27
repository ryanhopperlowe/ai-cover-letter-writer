<script lang="ts">
	const { data } = $props();
	const { error, success } = data;
</script>

<div class="flex min-h-screen items-center justify-center p-8">
	{#if error}
		<div class="w-full max-w-lg rounded-lg border border-red-500 bg-red-50 p-8 text-center">
			<div class="mb-4 text-5xl">❌</div>
			<h1 class="mb-4 text-3xl font-semibold text-gray-800">Something went wrong</h1>
			<p class="mb-6 text-gray-600">{error}</p>
			<a
				href="/"
				class="inline-block rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
			>
				Return to Home
			</a>
			<p class="mt-4 text-sm text-gray-500">You can safely close this window if you'd like to.</p>
		</div>
	{:else if success}
		<div class="w-full max-w-lg rounded-lg border border-green-500 bg-green-50 p-8 text-center">
			<div class="mb-4 text-5xl">✅</div>
			<h1 class="mb-4 text-3xl font-semibold text-gray-800">Success!</h1>
			<p class="mb-6 text-gray-600">Your order has been processed successfully.</p>
			<a
				href="/"
				class="inline-block rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
			>
				Return to Home
			</a>
			<p class="mt-4 text-sm text-gray-500">You can safely close this window if you'd like to.</p>
		</div>
	{:else}
		<div class="w-full max-w-lg rounded-lg border border-gray-300 bg-gray-50 p-8 text-center">
			<div
				class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
			></div>
			<p class="text-gray-600">Processing your request...</p>
		</div>
	{/if}
</div>
