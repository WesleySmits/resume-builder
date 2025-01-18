export function capitalize(text: string): string {
    if (!text) {
        return '';
    }

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function toCamelCase(text: string): string {
    return text
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(' ')
        .map((word, index) => (index === 0 ? word : capitalize(word)))
        .join('');
}
