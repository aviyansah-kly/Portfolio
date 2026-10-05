(() => {
  const stage = document.querySelector("[data-scroll-video]");
  const video = document.querySelector("[data-video]");
  const progress = document.querySelector("[data-progress]");

  if (!stage || !video) return;

  let duration = 0;
  let targetTime = 0;
  let currentTime = 0;
  let rafId = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getProgress = () => {
    const rect = stage.getBoundingClientRect();
    const scrollable = Math.max(stage.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / scrollable, 0, 1);
  };

  const updateTarget = () => {
    const p = getProgress();

    if (duration > 0) {
      // Keep a tiny margin from the exact final frame for more reliable seeking.
      targetTime = p * Math.max(duration - 0.05, 0);
    }

    if (progress) {
      progress.style.transform = `scaleX(${p})`;
    }
  };

  const render = () => {
    if (duration > 0) {
      // Small interpolation prevents harsh jumps on trackpads while
      // preserving a direct relationship between scroll and video time.
      currentTime += (targetTime - currentTime) * 0.18;

      if (Math.abs(targetTime - currentTime) < 0.001) {
        currentTime = targetTime;
      }

      if (Math.abs(video.currentTime - currentTime) > 0.008) {
        try {
          video.currentTime = currentTime;
        } catch (_) {}
      }
    }

    rafId = requestAnimationFrame(render);
  };

  const onMetadata = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    currentTime = 0;
    targetTime = 0;
    video.pause();
    updateTarget();
  };

  video.addEventListener("loadedmetadata", onMetadata, { once: true });

  window.addEventListener("scroll", updateTarget, { passive: true });
  window.addEventListener("resize", updateTarget, { passive: true });

  document.addEventListener(
    "touchstart",
    () => {
      // Helps iOS unlock media seeking after the first user gesture.
      video.play().then(() => video.pause()).catch(() => {});
    },
    { once: true, passive: true }
  );

  updateTarget();
  rafId = requestAnimationFrame(render);

  window.addEventListener("pagehide", () => cancelAnimationFrame(rafId), {
    once: true,
  });
})();
