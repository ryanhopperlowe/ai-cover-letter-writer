import { OPENAI_API_KEY, OPENAI_PROJECT } from '$env/static/private';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, project: OPENAI_PROJECT });

const CoverLetterSchema = z.object({
	content: z.string()
});

class AiServiceClass {
	constructor(private readonly openai: OpenAI) {}

	async generateCoverLetter(jobDescription: string, resumes: string[], extraInfo?: string) {
		const res = await this.openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `
You are a cover letter writing assistant, given a list of resumes, and a job description, write a compelling cover letter to ensure the user lands their dream job!
          `
				},
				{
					role: 'user',
					content: `
					Here is the job description:
					${jobDescription}
					`
				},
				...resumes.map(
					(resume, index) =>
						({
							role: 'system',
							content: `Here is resume ${index + 1}: ${resume}`
						}) as const
				),
				...(extraInfo
					? [
							{
								role: 'user',
								content: `Here is extra info to take into consideration while writing the cover letter: ${extraInfo}`
							} as const
						]
					: []),
				{ role: 'user', content: 'Write my cover letter!' }
			],
			response_format: zodResponseFormat(CoverLetterSchema, 'event')
		});

		return res.choices.map((c) => c.message)[0];
	}

	async test() {
		const res = await this.openai.chat.completions.create({
			model: 'gpt-4o-2024-11-20',
			messages: [
				{
					role: 'system',
					content: `
You are a cover letter writing assistant, given a list of resumes, and a job description, write a compelling cover letter to ensure the user lands their dream job!
          `
				},
				{ role: 'system', content: `` },
				{ role: 'user', content: 'Write my cover letter!' }
			],
			response_format: zodResponseFormat(CoverLetterSchema, 'event')
		});

		return res.choices.map((c) => c.message)[0];
	}
}

export const AiService = new AiServiceClass(openai);
