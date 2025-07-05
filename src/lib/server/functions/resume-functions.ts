import { eq } from 'drizzle-orm';
import { db } from '../db';
import { CoverLetters } from '../db/schema/cover-letters';
import type { UserUI } from '../db/schema/users';
import { attemptApi, ForbiddenError, NotFoundError } from '../error';
import { micromark } from 'micromark';
import puppeteer from 'puppeteer';

export const getCoverLetterPdf = attemptApi.create(async (user: UserUI, coverLetterId: string) => {
	const [coverLetter] = await db
		.select({ userId: CoverLetters.userId, content: CoverLetters.content })
		.from(CoverLetters)
		.where(eq(CoverLetters.id, coverLetterId));

	if (!coverLetter) {
		throw new NotFoundError('Cover letter not found');
	}

	const { content, userId } = coverLetter;

	if (userId !== user.id) {
		throw new ForbiddenError('You are not authorized to download this cover letter');
	}

	const html = `
<html>
  <head>
    <meta charset="utf-8">
    <title>Markdown PDF</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      pre, code { background: #f4f4f4; }
    </style>
  </head>
  <body>
    ${micromark(content)}
  </body>
</html>
  `;

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setContent(html, { waitUntil: 'networkidle0' });
	const pdf = await page.pdf({ format: 'A4' });
	await browser.close();

	return pdf;
});
