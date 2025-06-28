import type { Attachment } from 'svelte/attachments';

export function submitOnCmdEnter(): Attachment<HTMLFormElement> {
	return (form) => {
		const handleCmdEnter = (e: KeyboardEvent) => {
			console.log(e);

			if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
				form.submit();
			}
		};

		form.addEventListener('keypress', handleCmdEnter);
		return () => form.removeEventListener('keypress', handleCmdEnter);
	};
}
