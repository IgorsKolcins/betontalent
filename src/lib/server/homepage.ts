import homepageJson from '../../../mocks/homepage.json';
import { homepageSchema, type HomepageContent } from '$lib/api/homepage/schema';

const homepage = homepageSchema.parse(homepageJson);

export function getHomepageContent(): HomepageContent {
	return homepage;
}
