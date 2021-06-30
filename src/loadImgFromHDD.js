export default function loadImgFromHDD () {
    let file = this.files[0];
   let newImg = document.createElement('img');
   newImg.src = window.URL.createObjectURL(file);
   newImg.onload = function () {
      console.log(this.naturalWidth, this.naturalHeight);
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(newImg, 0, 0);
      newImg = null;
   };
}