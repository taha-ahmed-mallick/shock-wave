let cvs = document.getElementsByTagName("canvas")[0];
let ctx = cvs.getContext('2d');

cvs.height = window.innerHeight;
cvs.width = window.innerWidth;

function animate() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "#2196F3";
      ctx.translate(150, 150);
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(0, 0, 150, 150);/* / 2, 0, Math.PI * 2*/
      ctx.fill();
      ctx.rotate(0 - Math.PI / 4);
      ctx.translate(-150, -150);
      ctx.closePath();
      requestAnimationFrame(animate);
}

animate();