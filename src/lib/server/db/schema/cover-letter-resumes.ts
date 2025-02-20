import { Orm } from '../helpers';
import { CoverLetters } from './cover-letters';
import { Resumes } from './resumes';

export const CoverLetterResumes = Orm.table('cover_letter_resumes', {
	coverLetterId: Orm.uuid().references(() => CoverLetters.id),
	resumeId: Orm.uuid().references(() => Resumes.id)
});
