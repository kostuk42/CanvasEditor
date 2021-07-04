export default class FilesManage {
    constructor() {
        this.newImg = '';
        this.saveImg = document.getElementById('save');
        this.loadImg = document.getElementById('profile_pic');
    }

    updateHrefOnCanvas (canvas) {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
    URL.revokeObjectURL(this.saveImg.href);
    this.saveImg.href = url;
    }, 'image/jpeg', 0.95);
    }

  loadImgFromHDD(g) {
    const { flags, myCanvas, stack, filesManage } = g;
    let file = this.loadImg.files[0];
    this.newImg = document.createElement('img');
    this.newImg.src = window.URL.createObjectURL(file);
    // let filesManage = this;
    myCanvas.clearCanvas(g);
    this.updateHrefOnCanvas(myCanvas.canvas);
    this.newImg.onload = function () {
      
    myCanvas.canvas.width = this.naturalWidth;
    myCanvas.canvas.height = this.naturalHeight;
    myCanvas.ctx.drawImage(this, 0, 0);
    if (flags.isRepaint) { return }
    stack.setStory('newImg');
   };   
}    
}