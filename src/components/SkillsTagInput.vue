<template>
    <div class="tag-input">
        <div class="tags">
            <span class="tag" v-for="tag in tags" :key="tag">
                {{ tag }}
                <button class="remove" @click="removeTag(tag)">×</button>
            </span>
        </div>

        <input v-model="inputValue" :placeholder="placeholder" @keydown="onKeydown" @blur="addTag" :id="props.idProp" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    modelValue: string[];
    placeholder?: string;
    id: string;
    idProp: string;
    value: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const inputValue = ref(props.value ?? '');
const tags = ref<string[]>([...(props.modelValue ?? [])]);

const addTag = () => {
    const trimmedValue = inputValue.value.trim();
    if (trimmedValue && !tags.value.includes(trimmedValue)) {
        tags.value.push(trimmedValue);
        emit('update:modelValue', tags.value);
    }

    inputValue.value = '';
};

const removeTag = (tag: string) => {
    tags.value = tags.value.filter((t) => t !== tag);
    emit('update:modelValue', tags.value);
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === ',' || event.key === 'Enter') {
        event.preventDefault();
        addTag();
    }
};
</script>

<style scoped>
.tag-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    background-color: #4a90e2;
    color: white;
    border-radius: 12px;
    padding: 0.2rem 0.5rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
}

.tag .remove {
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    margin-left: 0.5rem;
    cursor: pointer;
}
</style>
