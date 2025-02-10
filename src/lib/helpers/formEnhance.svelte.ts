import type { SubmitFunction } from '@sveltejs/kit';

export class FormState {
	loading = $state(false);
	onSubmitFns: (() => void)[] = [];

	onSubmit(fn: () => void) {
		this.onSubmitFns.push(fn);

		return this;
	}

	submit: SubmitFunction = () => {
		this.loading = true;
		return ({ update }) => {
			this.loading = false;

			this.onSubmitFns.forEach((fn) => fn());

			update();
		};
	};
}
