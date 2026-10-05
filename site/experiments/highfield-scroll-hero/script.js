(() => {
  const stage = document.querySelector("[data-scroll-video]");
  const video = document.querySelector("[data-video]");
  const progress = document.querySelector("[data-progress]");
  const status = document.querySelector("[data-status]");

  if (!stage || !video) return;

  let duration = 0;
  let targetTime = 0;
  let displayedTime = 0;
  let rafId = 0;
  let ready = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getScrollProgress = () => {
    const rect = stage.getBoundingClientRect();
    const scrollDistance = Math.max(stage.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / scrollDistance, 0, 1);
  };

  const syncTargetToScroll = () => {
    const p = getScrollProgress();

    if (progress) {
      progress.style.transform = `scaleX(${p})`;
    }

    if (!ready || duration <= 0) return;

    targetTime = p * Math.max(duration - 0.04, 0);
  };

  const render = () => {
    if (ready && duration > 0) {
      // Smooth enough for trackpads, but still tightly follows the user's scroll.
      const delta = targetTime - displayedTime;
      displayedTime += delta * 0.28;

      if (Math.abs(delta) < 0.002) {
        displayedTime = targetTime;
      }

      if (Math.abs(video.currentTime - displayedTime) > 0.01) {
        try {
          video.currentTime = displayedTime;
        } catch (_) {}
      }
    }

    rafId = requestAnimationFrame(render);
  };

  const initializeVideo = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    ready = duration > 0;

    video.pause();
    displayedTime = 0;
    targetTime = 0;

    if (status) {
      status.textContent = ready
        ? `${duration.toFixed(1)}s film · scroll controls timeline`
        : "Unable to read video duration";
      status.classList.toggle("is-ready", ready);
    }

    syncTargetToScroll();

    // Force the first frame to render on browsers that otherwise show black.
    if (ready) {
      try {
        video.currentTime = 0.01;
      } catch (_) {}
    }
  };

  if (video.readyState >= 1) {
    initializeVideo();
  } else {
    video.addEventListener("loadedmetadata", initializeVideo, { once: true });
  }

  video.addEventListener("error", () => {
    if (status) status.textContent = "Video failed to load";
  });

  window.addEventListener("scroll", syncTargetToScroll, { passive: true });
  window.addEventListener("resize", syncTargetToScroll, { passive: true });

  document.addEventListener(
    "touchstart",
    () => {
      // Unlocks seeking on iOS Safari after the first user gesture.
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt.then(() => video.pause()).catch(() => {});
      }
    },
    { once: true, passive: true }
  );

  syncTargetToScroll();
  rafId = requestAnimationFrame(render);

  window.addEventListener(
    "pagehide",
    () => cancelAnimationFrame(rafId),
    { once: true }
  );
})();
