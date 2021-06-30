export default function draw({ x, y, radius, color, isDragging }) {
      if(isDragging === false) return
      ctx.fillStyle = ctx.strokeStyle = color;
      ctx.lineTo(x, y - 60);
      ctx.lineWidth = radius*2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y - 60, radius, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - 60);
}