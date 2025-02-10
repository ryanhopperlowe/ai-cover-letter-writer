import { StorageClient } from '$lib/server/storage/storage-client.server';
import { fail } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { Resumes, ResumesSchema } from '$lib/server/db/schema/resumes';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return fail(401, { message: 'Unauthorized' });
	}

	const resumes = await db.select().from(Resumes).where(eq(Resumes.userId, locals.user.id));

	return { resumes: resumes.map((r) => ResumesSchema.select.parse(r)) };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();

		const { file, name } = zfd
			.formData({
				file: zfd.file(),
				name: zfd.text().optional()
			})
			.parse(formData);

		const { id } = await StorageClient.uploadObject(user.id, file);

		await db.insert(Resumes).values({
			name: name || file.name,
			bucketPath: id,
			userId: user.id
		});

		return { success: true };
	},
	delete: async ({ request, locals }) => {
		const { user } = locals;
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();

		const { id } = zfd.formData({ id: zfd.text() }).parse(formData);

		const [resume] = await db.select().from(Resumes).where(eq(Resumes.id, id));

		if (!resume) {
			return fail(404, { message: 'Resume not found' });
		}

		await StorageClient.deleteObject(user.id, resume.bucketPath);

		await db.delete(Resumes).where(eq(Resumes.id, id));

		return { success: true };
	}
};
