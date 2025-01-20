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
            :id="id"
            :list="datalistId"
        />

        <datalist v-if="dataList?.length" :id="datalistId">
            <option v-for="item in dataList" :key="item" :value="item" />
        </datalist>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
    modelValue: string[];
    placeholder?: string;
    id: string;
    dataList?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const inputValue = ref('');
const tags = ref<string[]>([...(props.modelValue ?? [])]);

const datalistId = computed(() => `${props.id}-datalist`);

watch(
    tags,
    (newTags) => {
        emit('update:modelValue', newTags);
    },
    { deep: true },
);

const addTag = () => {
    const trimmedValue = inputValue.value.trim();
    if (trimmedValue && !tags.value.includes(trimmedValue)) {
        tags.value.push(trimmedValue);
    }
    inputValue.value = '';
};

const removeTag = (tag: string) => {
    tags.value = tags.value.filter((t) => t !== tag);
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== ',' && event.key !== 'Enter') {
        return;
    }

    event.preventDefault();
    addTag();
    emit('input', tags.value);
};

const onInput = () => {
    if (!props.dataList || (props.dataList && !props.dataList.includes(inputValue.value))) {
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
