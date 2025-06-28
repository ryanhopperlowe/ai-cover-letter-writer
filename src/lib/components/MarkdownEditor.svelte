<script lang="ts">
	import { Crepe } from '@milkdown/crepe';
	import '@milkdown/crepe/theme/common/style.css';
	import '@milkdown/crepe/theme/nord.css';
	import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {}

	let { value = $bindable(''), defaultValue, ...inputProps }: Props = $props();

	function milkdownEditor(): Attachment {
		return (element) => {
			const crepe = new Crepe({
				root: element,
				defaultValue,
				features: { [Crepe.Feature.Toolbar]: true }
			});

			crepe.editor
				.config((ctx) => {
					const listener = ctx.get(listenerCtx);
					listener.markdownUpdated((_, markdown, prevMarkdown) => {
						if (markdown === prevMarkdown) return;

						value = markdown;
					});
				})
				.use(listener);

			crepe.create();

			return () => crepe.destroy();
		};
	}
</script>

<div {@attach milkdownEditor()}></div>
<input {value} {defaultValue} {...inputProps} type="hidden" />
