<template>
    <div :class="{ 'form-field': true, 'form-field--error': formState.error }">
        <component
            :is="inputType === 'skills' ? SkillsTagInput : inputType === 'yesno' ? YesNoToggle : inputType"
            :fieldType="props.fieldType ?? ''"
            :id="inputType === 'skills' ? '' : id"
            :id-prop="inputType === 'skills' || inputType === 'yesno' ? id : ''"
            class="form-field__input"
            :placeholder="placeholder"
            :required="required"
            :value="inputType === 'skills' ? (formState.value as string[]).join(',') : formState.value"
            :aria-labelledby="props.id"
            :aria-describedby="ariaDescribedBy"
            :modelValue="formState.value"
            :cols="cols"
            :rows="rows"
            :min="min"
            :max="max"
            @input="handleInput"
            @blur="validate"
            @update:modelValue="handleInput"
            v-bind="inputAttrs"
            ref="inputRef"
        >
            <template v-if="inputType === 'select'">
                <option v-if="props.placeholder" value="" :selected="!formState.value" :data-test="formState.value">
                    {{ props.placeholder }}
                </option>

                <option
                    v-for="option in options"
                    :key="option.value"
                    :value="option.value"
                    :selected="option.value === formState.value"
                >
                    {{ option.text }}
                </option>
            </template>
        </component>

        <label :for="id">{{ label }}</label>

        <slot name="helper" :id="`${id}-helper`" :error="false" v-if="!formState.error">
            <small id="`${id}-helper`" class="help-text">{{ helperText }}</small>
        </slot>

        <slot name="error" :id="`${id}-error`" :error="true" v-if="formState.error">
            <small id="`${id}-error`" class="error-text" role="alert">
                {{ errorText }}
            </small>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { debounce } from '@/utils/debounce';
import { reactive, computed, ref } from 'vue';
import SkillsTagInput from './SkillsTagInput.vue';
import YesNoToggle from './YesNoToggle.vue';

const props = defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    fieldType?: string;
    required?: boolean;
    helperText?: string;
    errorText?: string;
    modelValue?: string | string[] | number | boolean | File;
    options?: { value: string; text: string }[];
    cols?: number;
    rows?: number;
    min?: number;
    max?: number;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | string[] | boolean | number): void;
    (e: 'valid', value: string | string[] | number | boolean | File): void;
}>();

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);
const formState = reactive({
    value: props.modelValue,
    error: false,
});

const inputType = computed(() => {
    if (props.type === 'textarea') return 'textarea';
    if (props.type === 'select') return 'select';
    if (props.type === 'skills') return 'skills';
    if (props.type === 'yesno') return 'yesno';
    return 'input';
});

const inputAttrs = computed(() => {
    if (inputType.value === 'select') {
        return {};
    }
    return {
        type: props.type,
    };
});

const ariaDescribedBy = computed(() =>
    formState.error ? `${props.id}-helper ${props.id}-error` : `${props.id}-helper`,
);

function validate() {
    if (inputRef.value && inputRef.value instanceof HTMLInputElement && !inputRef.value.checkValidity()) {
        formState.error = true;
    } else {
        formState.error = false;
        if (formState.value || formState.value === '' || formState.value === false) {
            emit('valid', formState.value);
        }
    }
}

function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    if (props.type === 'file' && target instanceof HTMLInputElement && target.files) {
        formState.value = target.files[0];
        emit('valid', target.files[0]);
    } else if (props.type === 'skills') {
        const value = event as unknown as string[];
        formState.value = value;
        emit('update:modelValue', value);
        debouncedValidate();
    } else if (props.type === 'yesno') {
        let value: boolean;
        if (event instanceof Event) {
            const target = event.target as HTMLInputElement;
            value = target.checked;
        } else {
            value = event as boolean;
        }

        formState.value = value;
        emit('update:modelValue', value);
        debouncedValidate();
    } else if (props.type === 'number') {
        const value = target.value ? parseInt(target.value, 10) : '';
        if (typeof value !== 'number') {
            formState.error = true;
            return;
        }

        formState.value = value;
        emit('update:modelValue', value);
        debouncedValidate();
    } else {
        formState.value = target.value;
        emit('update:modelValue', target.value);
        debouncedValidate();
    }
}

const debouncedValidate = debounce(() => {
    validate();
});
</script>

<style scoped>
.form-field {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.125rem;

    label {
        order: 1;
    }

    input,
    textarea,
    select,
    .form-field__input {
        order: 2;
    }

    .help-text {
        order: 3;
    }

    .error-text {
        order: 4;
    }
}

.form-field--error {
    input,
    select,
    textarea,
    .form-field__input {
        --border-color: var(--color-state-error);
    }
}
</style>
