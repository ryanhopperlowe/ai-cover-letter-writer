import * as pdfjs from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

export async function getPdfTextContent(file: File) {
	const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise;

	return (
		await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => getPageContent(pdf, i + 1)))
	).join(' ');
}

export async function getPageContent(pdf: pdfjs.PDFDocumentProxy, pageNumber: number) {
	const page = await pdf.getPage(pageNumber);
	const textContent = await page.getTextContent();
	return (
		await Promise.all(textContent.items.map((item) => (item as TextItem).str ?? ' ').join(' '))
	).join(' ');
}
