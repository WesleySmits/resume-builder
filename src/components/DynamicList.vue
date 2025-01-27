<template>
    <fieldset class="dynamic-list" :id="id">
        <details ref="curtain" :name="props.curtainName ?? 'skills-curtain'" open>
            <summary>
                <header>
                    <legend>{{ title }}</legend>

                    <div class="buttons">
                        <button
                            @click="addItem"
                            class="primary icon"
                            data-action="add"
                            :disabled="maxItems ? items.length >= maxItems : false"
                        >
                            <PlusIcon />
                        </button>

                        <button v-if="sortable" @click="sortItems" class="secondary icon" data-action="sort">
                            <SortIcon />
                        </button>
                    </div>
                </header>
            </summary>

            <ul v-if="items.length" class="dynamic-list__items">
                <li v-for="(item, index) in items" :key="getKey(item, index)" :class="listItemClass">
                    <slot
                        name="item-fields"
                        :item="item"
                        :index="index"
                        :updateField="(keyPath: string, value: unknown) => updateItem(index, keyPath, value)"
                        :removeItem="() => removeItem(index)"
                    />
                </li>
            </ul>
        </details>
    </fieldset>
</template>

<script setup lang="ts" generic="T, K extends keyof T">
import { computed, ref, useTemplateRef, watch, type Ref } from 'vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import SortIcon from '@/icons/SortIcon.vue';

export interface DynamicListProps<T> {
    title: string;
    items: T[];
    maxItems?: number;
    sortable?: boolean;
    defaultItem: () => T;
    onUpdate: (newItems: T[]) => void;
    getKey?: (item: T, index: number) => string;
    direction?: 'row' | 'column';
    id?: string;
    curtainName?: string;
}

const props = defineProps<DynamicListProps<T>>();
const emit = defineEmits(['update']);
const curtainRef = useTemplateRef('curtain');

const listItemClass = computed(() => ({
    'list-item': true,
    'list-item--column': props.direction === 'column',
}));

const getKey = (item: T, index: number) => {
    return props.getKey ? props.getKey(item, index) : index.toString();
};

const items = ref<T[]>(props.items) as Ref<T[]>;

watch(
    () => props.items,
    (newItems) => {
        items.value = newItems;
    },
);

function addItem() {
    if (items.value.length >= (props.maxItems || Infinity)) {
        return;
    }

    if (curtainRef.value) {
        curtainRef.value.open = true;
    }

    const defaultItem = props.defaultItem();
    items.value.push(defaultItem);

    emit('update', items.value);
    props.onUpdate(items.value);
}

function updateItem(index: number, keyPath: string, value: unknown) {
    const updatedItem = { ...items.value[index] };

    const keys = keyPath.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let target: any = updatedItem;

    for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i] as keyof T;

        target = target[k] || (target[k] = {});
    }

    target[keys[keys.length - 1]] = value;

    items.value.splice(index, 1, updatedItem);
    emit('update', items.value);
    props.onUpdate(items.value);
}

function removeItem(index: number) {
    items.value.splice(index, 1);
    emit('update', items.value);
    props.onUpdate(items.value);
}

function sortItems() {
    items.value.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    emit('update', items.value);
    props.onUpdate(items.value);
}
</script>

<style scoped>
.dynamic-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.dynamic-list__items {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
}

header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.list-item--column {
    flex-direction: column;
    align-items: initial;
}
</style>
