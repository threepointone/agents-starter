/**
 * Convert various ID formats to human-readable text with only the first letter capitalized
 * Handles: kebab-case, snake_case, PascalCase, camelCase, and all caps
 * @param idToConvert
 * @returns
 */
export const idToReadableText = (
	idToConvert: string,
	options: { capitalize?: boolean } = {},
) => {
	// Split into words based on various separators and casing
	const words = idToConvert
		.replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
		.split(/(?=[A-Z][a-z])/) // Split before capital letters followed by lowercase (for camel/pascal case)
		.join(" ")
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 0);

	// Join words with spaces and capitalize only the first letter of the entire string
	return words
		.join(" ")
		.replace(/^./, (firstChar) =>
			options.capitalize ? firstChar.toUpperCase() : firstChar,
		);
};
