<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
</script>

<h1>Resumes</h1>

<form action="?/upload" method="post" enctype="multipart/form-data" use:enhance>
	<Input type="file" name="file" />
	<Button type="submit">
		<Icon icon="lucide:plus" />
		Add Resume
	</Button>
</form>
