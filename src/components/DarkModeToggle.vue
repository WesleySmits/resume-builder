<template>
    <div class="dark-mode-container">
        <input
            class="dark-mode-toggle"
            type="checkbox"
            name="Dark mode"
            role="switch"
            value="on"
            @change="toggleTheme"
        />
        <svg class="sun-moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" ref="toggleIcon">
            <path
                d="M17.5 28C17.5 43.1878 28.5681 55.5 27.5 55.5C12.3122 55.5 0 43.1878 0 28C0 12.8122 12.3122 0.5 27.5 0.5C27.5 0.5 17.5 12.8122 17.5 28Z"
            >
                <animate
                    ref="moonToSun"
                    begin="indefinite"
                    fill="freeze"
                    attributeName="d"
                    dur="500ms"
                    to="M55 27.5C55 42.6878 42.6878 55 27.5 55C12.3122 55 0 42.6878 0 27.5C0 12.3122 12.3122 0 27.5 0C42.6878 0 55 12.3122 55 27.5Z"
                />
                <animate
                    ref="sunToMoon"
                    begin="indefinite"
                    fill="freeze"
                    attributeName="d"
                    dur="500ms"
                    to="M17.5 28C17.5 43.1878 28.5681 55.5 27.5 55.5C12.3122 55.5 0 43.1878 0 28C0 12.8122 12.3122 0.5 27.5 0.5C27.5 0.5 17.5 12.8122 17.5 28Z"
                />
            </path>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Theme = 'light' | 'dark';

const toggleIcon = ref<SVGSVGElement>();
const moonToSun = ref<SVGAnimateElement>();
const sunToMoon = ref<SVGAnimateElement>();

function setTheme(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        sunToMoon.value?.beginElement();
    } else {
        moonToSun.value?.beginElement();
    }
}

function toggleTheme(): void {
    const currentTheme: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
}

onMounted(() => {
    if (sunToMoon.value && !sunToMoon.value.beginElement) {
        sunToMoon.value.beginElement = () => {};
    }

    if (moonToSun.value && !moonToSun.value.beginElement) {
        moonToSun.value.beginElement = () => {};
    }

    const currentTheme = localStorage.getItem('theme') as Theme | null;
    if (currentTheme !== null) {
        setTheme(currentTheme);
        return;
    }

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        setTheme('dark');
        return;
    }
});
</script>

<style scoped>
.dark-mode-container {
    --scale: 1.1;

    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transform: scale(var(--scale));
}

.dark-mode-toggle {
    appearance: none;
    background: #fff;
    width: calc(2.5rem * var(--scale));
    height: calc(1.5rem * var(--scale));
    border-radius: 18.75rem;
    cursor: pointer;
    outline: none;
    box-shadow:
        0 0.25rem 0.25rem rgba(0, 0, 0, 0.05),
        0 0.5rem 0.75rem rgba(0, 0, 0, 0.05),
        0 1rem 1.25rem rgba(0, 0, 0, 0.1);
}

.sun-moon-icon {
    pointer-events: none;
    position: absolute;
    left: 20%;
    fill: #000;
    transition: var(--transition-duration) ease-out;
    width: calc(0.859375rem * var(--scale));
    height: calc(0.859375rem * var(--scale));
}

html.dark .sun-moon-icon {
    transform: translateX(120%) rotate(-180deg);
}
</style>
