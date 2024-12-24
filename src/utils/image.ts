export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export function roundImage(base64: string, width: number, height: number): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, width, height);
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL());
            }
        };
    });
}

export async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to convert file to Base64'));
            reader.readAsDataURL(file); // This is where we can inject an error
        } catch (error) {
            reject(new Error(error as string));
        }
    });
}
