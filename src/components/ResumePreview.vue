<template>
    <div class="resume-preview">
        <h2>{{ headerText }}</h2>
        <div id="pdf-container"></div>
        <div class="navigation-controls">
            <button @click="prevPage" :disabled="pageNum <= 1">Previous</button>
            <span>Page {{ pageNum }} of {{ pageCount }}</span>
            <button @click="nextPage" :disabled="pageNum >= pageCount">Next</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import * as pdfjsLib from 'pdfjs-dist/';
import { type PDFDocumentProxy } from 'pdfjs-dist';
import { useResumeStore } from '@/stores/resume';
import { generateResume } from '@/utils/resume/resume';
import { getLocalizedString } from '@/utils/resume/Page';

const resumeStore = useResumeStore();

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const headerText = ref(getLocalizedString('resumePreview'));

const pageNum = ref(1);
const pageCount = ref(0);

let pdf: PDFDocumentProxy;

async function renderPDF() {
    const pdfData = await generateResume();
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });

    pdf = await loadingTask.promise;
    pageCount.value = pdf.numPages;

    renderPage(pageNum.value);
}

async function renderPage(num: number) {
    if (!pdf) {
        console.error('No PDF document to render');
        return;
    }

    const debug = false;

    if (debug) {
        num = 3;
    }

    const page = await pdf.getPage(num);

    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
        pdfContainer.innerHTML = '';
        pdfContainer.appendChild(canvas);
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

watch(resumeStore.$state, async () => {
    await renderPDF();
});
onMounted(renderPDF);
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
}
.navigation-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>
