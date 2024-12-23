<template>
    <div class="form-field">
        <component
            :is="inputType === 'skills' ? SkillsTagInput : inputType"
            :id="inputType === 'skills' ? '' : id"
            :id-prop="inputType === 'skills' ? id : ''"
            class="form-field__input"
            :placeholder="placeholder"
            :required="required"
            :value="inputType === 'skills' ? (formState.value as string[]).join(',') : formState.value"
            :aria-describedby="ariaDescribedBy"
            :modelValue="formState.value"
            :cols="cols"
            :rows="rows"
            @input="handleInput"
            @blur="validate"
            @update:modelValue="handleInput"
            v-bind="inputAttrs"
            ref="inputRef"
        >
            <template v-if="inputType === 'select'">
                <option v-for="option in options" :key="option.value" :value="option.value">
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

// Props
const props = defineProps<{
    id: string;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    helperText?: string;
    errorText?: string;
    modelValue?: string | string[] | File;
    options?: { value: string; text: string }[];
    cols?: number;
    rows?: number;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | string[]): void;
    (e: 'valid', value: string | string[] | File): void;
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
    if (inputRef.value && !inputRef.value.checkValidity()) {
        formState.error = true;
    } else {
        formState.error = false;
        if (formState.value || formState.value === '') {
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
</style>
