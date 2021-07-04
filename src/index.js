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

let g = {
    flags,
    myCanvas,
    drawing,
    filesManage,
    stack
}

myCanvas.undoBtn.onclick = () => myCanvas.undo(g);
filesManage.loadImg.oninput = () => filesManage.loadImgFromHDD(g);
myCanvas.clearBtn.onclick = () => myCanvas.clearCanvas(g);
drawing.rad.oninput = () => drawing.radius = drawing.rad.value;
drawing.col.oninput = () => drawing.color = drawing.col.value;
myCanvas.eraserBtn.onclick = () => myCanvas.eraser(g);
myCanvas.invert.onclick = () => myCanvas.colorInvert(g);
myCanvas.canvas.onmouseover = () => flags.isOverCanvas = true;
myCanvas.canvas.addEventListener("mousedown", (e) => drawing.engage(e, g));
myCanvas.canvas.addEventListener("mousedown", (e) => drawing.drawPoint(e, g));
myCanvas.canvas.onmouseup = (e) => drawing.disengage(e, g);
myCanvas.canvas.addEventListener("mousemove", (e) => drawing.drawPoint(e, g));
stack.removeStory();
myCanvas.clearCanvas(g);