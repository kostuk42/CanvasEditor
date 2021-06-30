export default function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWhite();
}