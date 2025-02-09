import { zfd } from 'zod-form-data';
import type { Actions, PageServerLoad } from './$types';
import { StorageClient } from '$lib/server/storage/storage-client.server';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const res = await StorageClient.listObjects();

	function parseKey(key?: string) {
		if (!key) return;
		return key.split('/').slice(2).join('/');
	}

	return { resumes: res.Contents?.map((c) => parseKey(c.Key)) };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();

		const { file } = zfd
			.formData({
				file: zfd.file()
			})
			.parse(formData);

		const res = await StorageClient.uploadObject(user.id, file);

		console.log(res);
		return res;
	}
};
