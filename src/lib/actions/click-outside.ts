import type { Action } from 'svelte/action';

class ClickousideEvent extends CustomEvent<never> {
	constructor() {
		super('clickoutside');
	}
}

type ClickoutsideActions = {
	onclickoutside: () => void;
};

export const clickoutside: Action<HTMLElement, undefined, ClickoutsideActions> = (node) => {
	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement | null;

		if (!target) return;

		if (!node.contains(target) && !event.defaultPrevented) {
			node.dispatchEvent(new ClickousideEvent());
		}
	};

	document.addEventListener('mousedown', handleClick);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleClick);
		}
	};
};
