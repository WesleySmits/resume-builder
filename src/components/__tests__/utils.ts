import { getLocalizedString } from '@/utils/translation';
import type { DOMWrapper } from '@vue/test-utils';
import { expect } from 'vitest';

export function testFormField(
    input: HTMLInputElement,
    label: DOMWrapper<HTMLLabelElement>,
    helperText: DOMWrapper<HTMLElement>,
    fieldName: string,
    placeholder: string | null,
    expectedValue = '',
    required = false,
    labelText = '',
    helperTextText = '',
) {
    const labelTextToUse = labelText || getLocalizedString(fieldName);
    const helperTextToUse = helperTextText || getLocalizedString(`${fieldName}HelperText`);
    const placeHolderToUse = placeholder === null ? null : placeholder || getLocalizedString(`${fieldName}Placeholder`);

    expect(input.id).toBe(fieldName);
    expect(input.value).toBe(expectedValue);
    expect(label.text()).toBe(labelTextToUse);
    if (placeHolderToUse) expect(input.placeholder).toBe(placeHolderToUse);
    expect(helperText.text()).toBe(helperTextToUse);
    expect(input.required).toBe(required);
}
