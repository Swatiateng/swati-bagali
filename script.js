(() => {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, stars = [], sparks = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(190, Math.floor((width * height) / 6500));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.25 + .25,
      a: Math.random() * .62 + .12,
      twinkle: Math.random() * .018 + .003,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() > .9 ? "143, 206, 91" : "255, 209, 91"
    }));
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const pulse = reduceMotion ? 0 : Math.sin(time * s.twinkle + s.phase) * .18;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.hue}, ${Math.max(.08, s.a + pulse)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx; p.y += p.vy; p.life -= 1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, ${Math.floor(170 + 65 * p.life / p.maxLife)}, 75, ${Math.max(0, p.life / p.maxLife)})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.life <= 0) sparks.splice(i, 1);
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    if (reduceMotion || Math.random() > .78) return;
    sparks.push({
      x: event.clientX, y: event.clientY,
      vx: (Math.random() - .5) * .5,
      vy: (Math.random() - .5) * .5,
      life: 18 + Math.random() * 18,
      maxLife: 36, size: Math.random() * 1.6 + .4
    });
    if (sparks.length > 45) sparks.shift();
  }, { passive: true });

  resize();
  draw();
})();
