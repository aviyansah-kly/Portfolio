(() => {
  const stage = document.querySelector("[data-scroll-video]");
  const video = document.querySelector("[data-video]");
  const progress = document.querySelector("[data-progress]");
  const status = document.querySelector("[data-status]");

  if (!stage || !video) return;

  let duration = 0;
  let targetTime = 0;
  let lastAppliedTime = -1;
  let ticking = false;
  let ready = false;

  const SEEK_EPSILON = 1 / 30; // avoid seeking for sub-frame changes

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getScrollProgress = () => {
    const rect = stage.getBoundingClientRect();
    const scrollDistance = Math.max(stage.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / scrollDistance, 0, 1);
  };

  const computeTarget = () => {
    const p = getScrollProgress();

    if (progress) {
      progress.style.transform = `scaleX(${p})`;
    }

    if (!ready || duration <= 0) return;

    targetTime = p * Math.max(duration - 0.04, 0);
  };

  const applySeek = () => {
    ticking = false;
    if (!ready || duration <= 0) return;

    // Do not spam the decoder while it is still resolving the previous seek.
    if (video.seeking) return;

    if (Math.abs(targetTime - lastAppliedTime) < SEEK_EPSILON) return;

    lastAppliedTime = targetTime;

    try {
      if (typeof video.fastSeek === "function") {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    } catch (_) {}
  };

  const scheduleSeek = () => {
    computeTarget();

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applySeek);
    }
  };

  const continueToLatestTarget = () => {
    // If the user kept scrolling during a seek, immediately resolve to the latest target.
    if (Math.abs(targetTime - lastAppliedTime) >= SEEK_EPSILON) {
      scheduleSeek();
    }
  };

  const initializeVideo = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    ready = duration > 0;
    video.pause();

    if (status) {
      status.textContent = ready
        ? `${duration.toFixed(1)}s film · scroll controls timeline`
        : "Unable to read video duration";
      status.classList.toggle("is-ready", ready);
    }

    if (ready) {
      targetTime = 0.01;
      lastAppliedTime = -1;
      scheduleSeek();
    }
  };

  if (video.readyState >= 1) {
    initializeVideo();
  } else {
    video.addEventListener("loadedmetadata", initializeVideo, { once: true });
  }

  video.addEventListener("seeked", continueToLatestTarget);

  video.addEventListener("error", () => {
    if (status) status.textContent = "Video failed to load";
  });

  window.addEventListener("scroll", scheduleSeek, { passive: true });
  window.addEventListener("resize", scheduleSeek, { passive: true });

  document.addEventListener(
    "touchstart",
    () => {
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt.then(() => video.pause()).catch(() => {});
      }
    },
    { once: true, passive: true }
  );

  scheduleSeek();
})();
