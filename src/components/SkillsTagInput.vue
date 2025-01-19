<template>
    <div class="tag-input">
        <div class="tags">
            <span class="tag" v-for="tag in tags" :key="tag">
                {{ tag }}
                <button class="remove" @click="removeTag(tag)">×</button>
            </span>
        </div>

        <input
            type="search"
            v-model="inputValue"
            :placeholder="placeholder"
            @keydown="onKeydown"
            @blur="addTag"
            @input="onInput"
            :id="props.idProp"
            :list="`${props.idProp}-datalist`"
        />

        <datalist v-if="dataListItems?.length" :id="`${props.idProp}-datalist`">
            <option v-for="item in dataListItems" :key="item" :value="item" />
        </datalist>
    </div>
</template>

<script setup lang="ts">
import { useResumeStore } from '@/stores/resume';
import { ref, watch } from 'vue';

interface Props {
    modelValue: string[];
    placeholder?: string;
    id: string;
    idProp: string;
    value: string;
    fieldType?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const inputValue = ref('');
const tags = ref<string[]>([...(props.modelValue ?? [])]);

const fieldType = props.fieldType;
const dataListItems = ref<string[] | null>(getDataListItems());

watch(
    tags,
    () => {
        dataListItems.value = getDataListItems();
    },
    { deep: true },
);

function getDataListItems(): string[] | null {
    if (!fieldType) {
        return null;
    }

    const store = useResumeStore();
    const skills = store.skills;
    if (!skills.hasOwnProperty(fieldType)) {
        return [];
    }

    const field = skills[fieldType as keyof Skills];
    const fieldItems = field.filter((item) => !tags.value.includes(item));
    return fieldItems;
}

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

const onInput = () => {
    if (!dataListItems.value || (dataListItems.value && !dataListItems.value.includes(inputValue.value))) {
        return;
    }

    addTag();
    emit('input', tags.value);
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
