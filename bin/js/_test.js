(() => {
  const canvas = document.getElementById('clockCanvas');
  const context = canvas.getContext('2d');

  let util = null;

  window.addEventListener(
    'load',
    () => {
      util = new Canvas2dUtil(document.getElementById('clockCanvas'));
      drawClock();
    },
    false
  );

  function drawClock() {
    context.font = 'normal 5rem "Roboto Condensed", sans-serif';
    context.fillStyle = 'white';
    context.textAlign = 'left';
    util.drawText('message', 200, 100);
    requestAnimationFrame(drawClock);
  }
})();
