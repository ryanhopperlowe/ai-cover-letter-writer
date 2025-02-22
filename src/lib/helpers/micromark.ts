import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export function markdown(text: string) {
	return micromark(text, {
		extensions: [gfm()],
		htmlExtensions: [gfmHtml()],
		allowDangerousHtml: true
	});
}
