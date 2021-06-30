export default function updateHrefOnCanvas () {
    canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    URL.revokeObjectURL(saveImg.href);
   saveImg.href = url;
}, 'image/jpeg', 0.95);
}

   