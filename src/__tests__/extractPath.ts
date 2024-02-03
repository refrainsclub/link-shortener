import { extractPath } from '..';

test('extractPath should return the correct path', () => {
	const url = 'https://example.com/path/to/resource';
	expect(extractPath(url)).toBe('path/to/resource');
});
