import './style.css';


let story = [];
let lineStory = [];
let isOverCanvas = false;
let isDragging = false;
let isRepaint = false;
let erasing;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rad = document.getElementById("rad");
const col = document.getElementById("color");
const clear = document.querySelector('.clear');
const loadImg = document.getElementById('profile_pic');
const saveImg = document.getElementById('save');
const undoBtn = document.querySelector('.undo');
const eraser = document.querySelector('.eraser');
const invert = document.querySelector(".invert");
const flipBtn = document.querySelector(".flip");

let radius = rad.value;
let color = col.value;
// let imgSrc = '';
let newImg = '';
let isOnErase = false;

// import draw from './draw';
// import updateHrefOnCanvas from './updateHrefOnCanvas';
// import loadImgFromHDD from './loadImgFromHDD';
// import canvasToWindowSize from './canvasToWindowSize';
// import canvasWhite from './canvasWhite';
// import clearCanvas from './clearCanvas';
// import colorInvert from './invert';

function canvasToWindowSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function canvasWhite () {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
   canvasWhite();
   canvasToWindowSize();
   if (isRepaint) { return }
   story = getStory();
   story.push('clear');
   setStory(story);
}
function flip() {
   ctx.scale(-1, 1)
}

function draw({ x, y, radius, color}  ) {
   
      x -= radius;
      y -= radius;
  
      ctx.fillStyle = ctx.strokeStyle = color;
      ctx.lineTo(x, y - 50 );
      ctx.lineWidth = radius*2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y - 50 , radius, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - 50 );
}

function colorInvert() {
const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i+1] = 255 - imgData.data[i+1];
        imgData.data[i+2] = 255 - imgData.data[i+2];
        imgData.data[i+3] = 255;
    }
   ctx.putImageData(imgData, 0, 0);
   if(isRepaint){return}
   story = getStory();
   story.push('invert');
   setStory(story);
}

function loadImgFromHDD () {
    let file = this.files[0];
   newImg = document.createElement('img');
   newImg.src = window.URL.createObjectURL(file);
   newImg.onload = function () {
      canvasToWindowSize();
      ctx.drawImage(newImg, 0, 0);
      if(isRepaint){return}
      story = getStory();
      story.push('newImg');
      setStory(story);
      
      // newImg = null;
   };
}

function updateHrefOnCanvas () {
    canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    URL.revokeObjectURL(saveImg.href);
   saveImg.href = url;
}, 'image/jpeg', 0.95);
}

function saveToLineStory(point) {
   lineStory.push(point);
}

function undo() {
   
   story = getStory();
   console.log(story);
   story.pop();
   setStory(story);
   if (story.length === 0) {
      undoBtn.disabled = true;
      return
   }
   isRepaint = true;
   clearCanvas();
   for (let i = 0; i < story.length; i++) {
      const command = story[i];
      
      switch (command) {
         case 'clear':
            clearCanvas();
            break;
         case 'newImg':
            ctx.drawImage(newImg, 0, 0);
            break;
         case 'invert':
            colorInvert();
         case 'undefined':
            console.log('alarm');
            break;
         default:
            command.forEach(point => draw(point));
            ctx.beginPath();
            break;
      }
   }
   isRepaint = false;
}
function getStory() {
   return JSON.parse(localStorage.getItem('story'))||[]
}
function setStory (story) {
   localStorage.setItem('story', JSON.stringify(story));
}
function removeStory() {
   localStorage.remove('story');
}
flipBtn.onclick = flip;
undoBtn.onclick = undo;
loadImg.oninput = loadImgFromHDD;
clear.onclick = clearCanvas;
rad.oninput = function() {
   radius = this.value;
}
col.oninput = function() {
   color = this.value;
}
eraser.onclick = function () {
   isOnErase = !isOnErase;
   if (isOnErase) {
      color = "#ffffff";
      eraser.style.color = "#ffffff";
      return
   };
   color = col.value;
   eraser.style.color = "#000000";
      
}
invert.onclick = colorInvert;


   

canvas.onmouseover = (e) => {
   isOverCanvas = true;
}

var drawPoint = function (e) {
   if (erasing) { color = '#ffff' }
   if (!isDragging) { return }
   let point = { x: e.pageX, y: e.pageY, radius: radius, color: color };
   draw(point);
   saveToLineStory(point);
}

const engage = function (e) {
   if (!isOverCanvas) { return }
   if (e.which === 3) {
      erasing = true;     
   }
   isDragging = true;
}

const disengage = function (e) {
   if (!isOverCanvas) { return }
   if (e.which === 3) {
      erasing = false;
      color = col.value;
      
   }
   isDragging = false;
   ctx.beginPath();
   updateHrefOnCanvas();
   story = getStory();
   story.push(lineStory);
   setStory(story);
   lineStory = story = [];
   undoBtn.disabled = false;
   

}

//lets go!

localStorage.removeItem('story');
clearCanvas();
canvas.addEventListener("mousedown", engage);
canvas.addEventListener("mousedown", drawPoint);
canvas.addEventListener("mousemove", drawPoint);
canvas.addEventListener("mouseup", disengage);
