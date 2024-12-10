<template>
    <div class="form-field">
        <input
            :type="type"
            :id="id"
            :placeholder="placeholder"
            :required="required"
            :value="formState.value"
            :aria-describedby="ariaDescribedBy"
            @input="handleInput"
            @blur="validate"
            ref="inputRef"
        />

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
import { debounce } from '@/utils/debounce'
import { reactive, computed, ref } from 'vue'

// Props
const props = defineProps<{
    id: string
    label: string
    placeholder?: string
    type?: string
    required?: boolean
    helperText?: string
    errorText?: string
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const formState = reactive({
    value: '',
    error: false,
})

const ariaDescribedBy = computed(() =>
    formState.error ? `${props.id}-helper ${props.id}-error` : `${props.id}-helper`,
)

function validate() {
    if (inputRef.value && !inputRef.value.checkValidity()) {
        formState.error = true
        console.log('invalid', inputRef.value.validity)
    } else {
        console.log('valid', inputRef.value, inputRef.value?.validity)
        formState.error = false
    }
}

function handleInput(e: Event) {
    const event = e as InputEvent
    const target = event.target as HTMLInputElement
    formState.value = target.value
    emit('update:modelValue', formState.value)
    debouncedValidate()
}

const debouncedValidate = debounce(() => {
    validate()
})
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
    select {
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
