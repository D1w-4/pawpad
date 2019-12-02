const jsnes = require('jsnes/dist/jsnes');

export class NesEmulator {
    static SAMPLE_COUNT = 4 * 1024;
    static SAMPLE_MASK = NesEmulator.SAMPLE_COUNT - 1;
    static SCREEN_HEIGHT = 240;
    static SCREEN_WIDTH = 256;
    static FRAMEBUFFER_SIZE = NesEmulator.SCREEN_WIDTH * NesEmulator.SCREEN_HEIGHT;
    audioReadCursor = 0;
    audioSamplesL = new Float32Array(NesEmulator.SAMPLE_COUNT);
    audioSamplesR = new Float32Array(NesEmulator.SAMPLE_COUNT);
    audioWriteCursor = 0;
    nes: Record<string, any>;
    canvasCtx: CanvasRenderingContext2D;
    framebufferU8: Uint8ClampedArray;
    framebufferU32: Uint32Array;
    canvasImage: ImageData;

    constructor(canvas: HTMLCanvasElement) {
        this.nes = new jsnes.NES({
            onFrame: this.onFrame.bind(this),
            onAudioSample: this.onAudioSample.bind(this)
        });

        this.canvasCtx =  canvas.getContext('2d') as CanvasRenderingContext2D;
        this.canvasImage = this.canvasCtx.getImageData(0, 0, NesEmulator.SCREEN_WIDTH, NesEmulator.SCREEN_HEIGHT);

        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.fillRect(0, 0, NesEmulator.SCREEN_WIDTH, NesEmulator.SCREEN_HEIGHT);

        const buffer = new ArrayBuffer(this.canvasImage.data.length);
        this.framebufferU8 = new Uint8ClampedArray(buffer);
        this.framebufferU32 = new Uint32Array(buffer);
    }

    loadRom(file: File): void {
        const fileApi = new FileReader();
        fileApi.onload = () => {
            this.nes.loadROM(fileApi.result);
            this.onAnimateFrame();
        };

        fileApi.readAsBinaryString(file);
    }

    onAudioSample(l: any, r: any) {
        this.audioSamplesL[this.audioWriteCursor] = l;
        this.audioSamplesR[this.audioWriteCursor] = r;
        this.audioWriteCursor = (this.audioWriteCursor + 1) & NesEmulator.SAMPLE_MASK;
    }

    onFrame(framebuffer24: any) {
        for (let i = 0; i < NesEmulator.FRAMEBUFFER_SIZE; i++) {
            this.framebufferU32[i] = 0xFF000000 | framebuffer24[i];
        }
    }

    onAnimateFrame = () => {
        window.requestAnimationFrame(this.onAnimateFrame);
        this.canvasImage.data.set(this.framebufferU8);
        this.canvasCtx.putImageData(this.canvasImage, 0, 0);
        this.nes.frame();
    }
}
