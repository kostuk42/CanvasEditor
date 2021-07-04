export default class Drawing {
     constructor(myCanvas) {
          this.rad = document.getElementById("rad");
          this.col = document.getElementById("color");
          this.radius = document.getElementById("rad").value;
          this.color = document.getElementById("color").value;
          this.ctx = myCanvas.ctx;
          this.undoBtn = myCanvas.undoBtn;
          this.canvas = myCanvas.canvas;
     }
    
     draw({ x, y, radius, color }) {
          x -= radius;
          y -= radius;
          this.ctx.fillStyle = this.ctx.strokeStyle = color;
          this.ctx.lineTo(x, y - 50);
          this.ctx.lineWidth = radius * 2;
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.arc(x, y - 50, radius, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.beginPath();
          this.ctx.moveTo(x, y - 50);
     }
     drawPoint(e, { flags, stack }) {
          
          if (flags.isErasing) { this.color = '#ffff' }
          if (!flags.isDragging) { return }
          let point = { x: e.pageX, y: e.pageY, radius: this.radius, color: this.color };
          this.draw(point);
          stack.saveToLineStory(point);
     }
     engage(e, { flags }) {
          if (!flags.isOverCanvas) return
          if (e.which === 3) {
               flags.isErasing = true;
          }
          flags.isDragging = true;
          return
     }
     disengage(e, {flags, filesManage, stack}) {
        if (!flags.isOverCanvas) return 
        if (e.which === 3) {
        flags.isErasing = false;
        this.color = this.col.value;
   }
        flags.isDragging = false;
        filesManage.updateHrefOnCanvas(this.canvas);
        this.ctx.beginPath();
        stack.saveLineStory();
        stack.lineStory = [];
        this.undoBtn.disabled = false;
        return 
   }
}