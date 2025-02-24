<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { route } from '$lib/ROUTES';

	let { children, data } = $props();
</script>

<div class="flex w-full items-center justify-between px-4 py-2">
	<a href={route('/')}><h1 class="text-2xl font-bold">Resume Builder</h1></a>

	<nav>
		<ul class="flex items-center gap-2">
			{#if data.user}
				<li>
					<Button variant="ghost" href={route('/resumes')}>Resumes</Button>
				</li>

				<li>
					<Button variant="ghost" href={route('/job-listings')}>Job Listings</Button>
				</li>

				<li>
					<form action={route('logout /')} method="POST">
						<Button variant="ghost" type="submit">Logout</Button>
					</form>
				</li>
			{:else}
				<li>
					<Button variant="ghost" href={route('/login')}>Login</Button>
				</li>
			{/if}
		</ul>
	</nav>
</div>
{@render children()}
