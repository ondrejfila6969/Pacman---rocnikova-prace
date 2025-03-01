const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 504;
const canvasHeight = 552;
const resizeCanvas = () => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};
const clearCanvas = () => {
    if (ctx)
        return ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};
export { resizeCanvas, clearCanvas, canvas, ctx, canvasHeight, canvasWidth };
