(function () {
  const canvas = document.getElementById("matrix-rain");
  if (!canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  const ctx = canvas.getContext("2d");

  const chars = "アカサタナハマヤラワ0123456789ABCDEF<>/{}[]$#@%&*+=;:";

  let w, h, cols, drops, fontSize = isMobile ? 16 : 14, raf, running = true;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(1).map(function () {
      return Math.floor(Math.random() * -50);
    });
  }

  function draw() {
    ctx.fillStyle = "rgba(5, 5, 16, 0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      if (Math.random() < 0.08) {
        ctx.fillStyle = "#baffd9";
      } else {
        ctx.fillStyle = "#00ff41";
      }
      ctx.fillText(char, x, y);

      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  function loop() {
    if (!running) return;
    draw();
    raf = setTimeout(loop, 40);
  }

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      running = false;
      if (raf) clearTimeout(raf);
    } else if (!reduced) {
      running = true;
      loop();
    }
  });

  if (reduced) {
    draw();
    ctx.fillStyle = "rgba(5, 5, 16, 0.08)";
  } else {
    loop();
  }
})();