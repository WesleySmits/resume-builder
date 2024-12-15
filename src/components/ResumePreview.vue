<template>
    <div class="resume-preview">
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
import { resumeData } from '@/stores/resume';
import { generateResume } from '@/utils/resume/resume';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const pageNum = ref(1);
const pageCount = ref(0);

async function renderPDF() {
    const pdfData = await generateResume(resumeData);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });

    const pdf = await loadingTask.promise;
    pageCount.value = pdf.numPages;

    renderPage(pageNum.value, pdf);
}

async function renderPage(num: number, doc?: PDFDocumentProxy) {
    const pdfDocument = doc ?? null;
    if (!pdfDocument) return;

    const page = await pdfDocument.getPage(num);

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

watch(resumeData, async () => {
    await renderPDF();
});
onMounted(renderPDF);
</script>

<style scoped>
.resume-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
}
#pdf-container {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.navigation-controls {
    margin-top: 10px;
}
</style>
