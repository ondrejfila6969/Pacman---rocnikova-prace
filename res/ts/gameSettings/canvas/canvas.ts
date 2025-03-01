const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
const canvasWidth: number = 504;
const canvasHeight: number = 552;

const resizeCanvas = (): void => {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

const clearCanvas = (): void => {
  if (ctx) return ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

export {resizeCanvas, clearCanvas, canvas, ctx, canvasHeight, canvasWidth};