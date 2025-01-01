<template>
    <div class="yes-no-toggle">
        <input type="checkbox" :id="id" v-model="checked" @change="handleChange" />
        <label :for="id" class="toggle-label">
            <span class="toggle-inner" :class="{ checked: checked }"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    id: string;
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const checked = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
        checked.value = newValue;
    },
);

const handleChange = () => {
    emit('update:modelValue', checked.value);
};
</script>

<style scoped>
.yes-no-toggle {
    display: inline-block;
    position: relative;
}

input[type='checkbox'] {
    display: none;
}

.toggle-label {
    cursor: pointer;
    display: inline-block;
    width: 50px;
    height: 25px;
    background-color: #ccc;
    border-radius: 25px;
    position: relative;
    transition: background-color var(--transition-duration);
}

.toggle-inner {
    display: block;
    width: 23px;
    height: 23px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: 1px;
    transition: left var(--transition-duration);
}

.toggle-inner.checked {
    left: 26px;
    background-color: #4caf50;
}
</style>
