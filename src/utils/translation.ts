import * as en from '@/locales/en.json';
import * as nl from '@/locales/nl.json';

const locales: Record<Locales, Record<string, string>> = {
    en: en,
    nl: nl,
};

export function getLocalizedString(
    key: string,
    variables?: Record<string, string | number>,
    lang: Locales = 'en',
): string {
    const translationString = locales[lang][key];

    if (variables) {
        return (
            translationString?.replace(/{(.*?)}/g, (_, match) => {
                return variables[match] as string;
            }) || key
        );
    }

    return translationString || key;
}
