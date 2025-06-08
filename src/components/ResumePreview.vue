<template>
    <div class="resume-preview">
        <h2>{{ headerText }}</h2>
        <div id="pdf-container" ref="pdfContainer"></div>
        <div class="resume-preview__navigation">
            <button @click="prevPage" :disabled="pageNum <= 1">Previous</button>
            <span>Page {{ pageNum }} of {{ pageCount }}</span>
            <button @click="nextPage" :disabled="pageNum >= pageCount">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import { useResumeStore } from '@/stores/resume';
import { generateResume } from '@/utils/resume/resume';
import { getLocalizedString } from '@/utils/translation';

const pdfContainer = ref<HTMLElement | null>(null);
const resumeStore = useResumeStore();

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs';

const headerText = ref(getLocalizedString('resumePreview'));

const pageNum = ref(1);
const pageCount = ref(0);

let pdf: PDFDocumentProxy;

async function renderPDF() {
    const pdfData = await generateResume();
    try {
        const loadingTask = getDocument({ data: pdfData });
        const result = await Promise.race([
            loadingTask.promise,
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('PDF loading timeout')), 10000)),
        ]);

        if (!result) {
            throw new Error('No PDF document to render');
        }

        pdf = result;

        pageCount.value = pdf.numPages;

        renderPage(pageNum.value);
    } catch (error) {
        console.error('Failed to load or render PDF:', error);
        return Promise.reject(error);
    }
}

async function renderPage(num: number) {
    const page = await pdf.getPage(num);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (pdfContainer.value) {
        pdfContainer.value.innerHTML = '';
        pdfContainer.value.appendChild(canvas);
    }

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;
}

const prevPage = () => {
    if (pageNum.value <= 1) return;
    pageNum.value--;
    renderPage(pageNum.value);
};

const nextPage = () => {
    if (pageNum.value >= pageCount.value) return;

    pageNum.value++;
    renderPage(pageNum.value);
};

watch(resumeStore.$state, handleRenderPDF);
onMounted(handleRenderPDF);

async function handleRenderPDF(): Promise<void> {
    try {
        await renderPDF();
    } catch (error) {
        console.error(error);
    }
}
</script>

<style scoped>
.resume-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
#pdf-container {
    width: 100%;
    height: 100%;
    overflow: auto;

    canvas {
        width: 100%;
        max-width: 100%;
        height: auto;
    }
}
.resume-preview__navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>
