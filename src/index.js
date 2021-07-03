import './style.scss';
import './fonts/font1.woff2';
import CanvasObj from './modules/СanvasObj.js';
import Drawing from './modules/Drawing.js';
import FilesManage from './modules/FilesManage.js';
import Stack from './modules/Stack.js';

let myCanvas = new CanvasObj();
let drawing = new Drawing(myCanvas);
let filesManage = new FilesManage();
let stack = new Stack();

let flags = {
    isOverCanvas : false,
    isDragging : false,
    isRepaint : false,
    isErasing : false,
    isOnErase: false
}


myCanvas.undoBtn.onclick = () => myCanvas.undo(stack, flags, drawing, filesManage);
filesManage.loadImg.oninput = () => filesManage.loadImgFromHDD(flags, myCanvas, stack);
myCanvas.clearBtn.onclick = () => myCanvas.clearCanvas(flags, stack, filesManage);
drawing.rad.oninput = () => drawing.radius = drawing.rad.value;
drawing.col.oninput = () => drawing.color = drawing.col.value;
myCanvas.eraserBtn.onclick = () => myCanvas.eraser(flags, drawing);
myCanvas.invert.onclick = () => myCanvas.colorInvert(flags, stack, filesManage);
myCanvas.canvas.onmouseover = () => flags.isOverCanvas = true;
myCanvas.canvas.addEventListener("mousedown", (e) => drawing.engage(e, flags));
myCanvas.canvas.addEventListener("mousedown", (e) => drawing.drawPoint(e, flags, stack));
myCanvas.canvas.onmouseup = (e) => drawing.disengage(e, flags, filesManage, stack);
myCanvas.canvas.addEventListener("mousemove", (e) => drawing.drawPoint(e, flags, stack));
stack.removeStory();
myCanvas.clearCanvas(flags, stack, filesManage);