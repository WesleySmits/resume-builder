/**
 * Formats a date into "MMM yyyy" (e.g., "Aug 2024").
 * @param date - The date to format.
 * @param locale - Optional locale string. Defaults to the user's browser locale.
 * @returns A string in the format "MMM yyyy".
 */
export function formatDateToLocale(passedDate: Date | string, locale?: string): string {
    const date = typeof passedDate === 'string' ? parseDateFromString(passedDate) : passedDate;
    const userLocale = locale || navigator.language || 'en-US';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
    };

    return new Intl.DateTimeFormat(userLocale, options).format(date);
}

/**
 * Converts a string in "YYYY-MM-DD" format to a Date object.
 * @param dateString - The date string in "YYYY-MM-DD" format.
 * @returns A Date object or null if the input is invalid.
 */
export function parseDateFromString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);

    // Validate the parsed numbers
    if (!year || !month || !day || year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error(`Invalid date string: ${dateString}`);
    }

    // Create a Date object (note: month is zero-based in JavaScript Date)
    return new Date(year, month - 1, day);
}
