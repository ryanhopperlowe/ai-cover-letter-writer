import type { SubmitFunction } from '@sveltejs/kit';

export class FormState {
	loading = $state(false);

	onSuccessFns: (() => void)[] = [];

	onSuccess(fn: () => void) {
		this.onSuccessFns.push(fn);

		return this;
	}

	submit: SubmitFunction = () => {
		this.loading = true;

		return ({ update }) => {
			this.loading = false;

			this.onSuccessFns.forEach((fn) => fn());

			update();
		};
	};
}
