export default class CanvasObj {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = document.getElementById("canvas").getContext("2d");
        this.clearBtn = document.querySelector('.clear');
        this.undoBtn = document.querySelector('.undo');
        this.eraserBtn = document.querySelector('.eraser');
        this.invert = document.querySelector(".invert");
    }

    canvasToWindowSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    canvasWhite(filesManage) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
    }

    clearCanvas(flags, stack, filesManage) {
        this.canvasToWindowSize();
        this.canvasWhite(filesManage);
        
        if (flags.isRepaint) { return }
        stack.setStory('clear');
        filesManage.updateHrefOnCanvas(this.canvas);
        
    }

    colorInvert({ isRepaint }, stack, filesManage) {
        // this.canvasWhite(filesManage);
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            
            imgData.data[i] = 255 - imgData.data[i];
            imgData.data[i + 1] = 255 - imgData.data[i + 1];
            imgData.data[i + 2] = 255 - imgData.data[i + 2];
            imgData.data[i + 3] = 255;
            
        }
        this.ctx.putImageData(imgData, 0, 0);
        
        if (isRepaint) { return }
        stack.setStory('invert');
        filesManage.updateHrefOnCanvas(this.canvas)
    }
     
    eraser(flags, drawing) {
        flags.isOnErase = !flags.isOnErase;
        if (flags.isOnErase) {
            drawing.color = "#ffffff";
            this.eraserBtn.style.color = "#ffffff";
            return
        };
        drawing.color = drawing.col.value;
        this.eraserBtn.style.color = "#000000";
    }

    undo(stack, flags, drawing, filesManage) {
        
        stack.removeLastCommand();
        if (stack.story.length === 0) {
            this.undoBtn.disabled = true;
            this.clearCanvas(flags, stack, filesManage);
            return
        }
        flags.isRepaint = true;
        this.clearCanvas(flags, stack, filesManage);
        for (let n = 0; n < stack.story.length; n++) {
            const command = stack.story[n];
            
            switch (command) {
                case 'clear':
                    this.clearCanvas(flags, stack, filesManage);
                    break;
                case 'newImg':
                    this.ctx.drawImage(filesManage.newImg, 0, 0);
                    break;
                case 'invert':
                    this.colorInvert(flags, stack);
                    break;
                default:
                    command.forEach(point => drawing.draw(point));
                    this.ctx.beginPath();
                    break;
            }
        }
        flags.isRepaint = false;
    }
}