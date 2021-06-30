import './style.css';
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let story = [];
let lineStory = [];
let isOverCanvas = false;
let isDragging = false;
let erasing;
const rad = document.getElementById("rad");
const col = document.getElementById("color");
const clear = document.querySelector('.clear');
const loadImg = document.getElementById('profile_pic');
const saveImg = document.getElementById('save');
const undoBtn = document.querySelector('.undo');
const eraser = document.querySelector('.eraser');
const invert = document.querySelector(".invert");
const flip = document.querySelector(".flip");

let radius = rad.value;
let color = col.value;
let imgSrc = '';
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
}

function loadImgFromHDD () {
    let file = this.files[0];
   newImg = document.createElement('img');
   newImg.src = window.URL.createObjectURL(file);
   newImg.onload = function () {
      console.log(this.naturalWidth, this.naturalHeight);
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(newImg, 0, 0);
      
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
   canvasWhite();
   if (newImg) {
      ctx.drawImage(newImg, 0, 0); 
   };
   console.log('newImg' + newImg)
   story = getStory();
   story.pop();
   setStory(story);
   if (story.length === 0) {
      undoBtn.disabled = true;
      return
   }
   
   for (let i = 0; i < story.length; i++) {
      const lineArr = story[i];
      lineArr.forEach(
         point => {
            draw(point);
         }
      )
      ctx.beginPath();
   }
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
      console.log('disengage')
   }
   isDragging = false;
   ctx.beginPath();
   updateHrefOnCanvas();
   story = getStory();
   story.push(lineStory);
   setStory(story);
   lineStory = story = [];
   undoBtn.disabled = false;
   console.log(story);

}

//lets go!
clearCanvas();
localStorage.removeItem('story');
canvas.addEventListener("mousedown", engage);
canvas.addEventListener("mousedown", drawPoint);
canvas.addEventListener("mousemove", drawPoint);
canvas.addEventListener("mouseup", disengage);
