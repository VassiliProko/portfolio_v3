(() => {
  "use strict";

  const DURATION = 9;
  const EASE = "power3.inOut";
  const ARRIVE = "power4.out";
  const DEPART = "power3.in";
  const searchParams = new URLSearchParams(window.location.search);
  const isExportMode = searchParams.get("export") === "1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.gsap) {
    throw new Error("GSAP did not load. Run `npm install` in playground/prettify-animation first.");
  }

  const stageFrame = document.querySelector(".stage-frame");
  const stage = document.querySelector(".stage");
  const browser = document.querySelector(".browser");
  const brand = document.querySelector(".brand-lockup");
  const brandMark = document.querySelector(".brand-mark");
  const brandTitle = document.querySelector(".brand-title");
  const neutralWash = document.querySelector(".neutral-wash");
  const prettified = document.querySelector(".interface-layer--prettified");
  const sweep = document.querySelector(".transform-sweep");
  const playPause = document.querySelector("#playPause");
  const restart = document.querySelector("#restart");
  const scrubber = document.querySelector("#timelineScrubber");
  const timeReadout = document.querySelector("#timeReadout");

  if (isExportMode) {
    document.body.classList.add("export-mode");
    const exportWidth = Number(searchParams.get("width")) || 1920;
    const exportHeight = Number(searchParams.get("height")) || 1080;
    const exportScale = Math.min(exportWidth / 1920, exportHeight / 1080);
    document.body.style.width = `${exportWidth}px`;
    document.body.style.height = `${exportHeight}px`;
    stageFrame.style.width = `${exportWidth}px`;
    stageFrame.style.height = `${exportHeight}px`;
    stage.style.transform = `scale(${exportScale})`;
  }

  function resizeStage() {
    if (isExportMode) return;
    const scale = Math.min(stageFrame.clientWidth / 1920, stageFrame.clientHeight / 1080);
    stage.style.setProperty("--stage-scale", String(scale));
  }

  const resizeObserver = new ResizeObserver(resizeStage);
  resizeObserver.observe(stageFrame);
  resizeStage();

  gsap.set(browser, {
    autoAlpha: 0,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 180,
    scale: 1.15,
    clipPath: "inset(12% 0 0 0 round 22px)",
  });
  gsap.set(brand, { xPercent: -50, yPercent: -50, x: 0, y: 0, autoAlpha: 1 });
  gsap.set(brandMark, { scale: 1 });
  gsap.set(brandTitle, { autoAlpha: 1, x: 0, filter: "blur(0px)" });
  gsap.set(neutralWash, { autoAlpha: 0 });
  gsap.set(prettified, { clipPath: "inset(0 100% 0 0)" });
  gsap.set(sweep, { autoAlpha: 0, x: -240 });

  const timeline = gsap.timeline({
    repeat: -1,
    paused: isExportMode || reducedMotion,
    defaults: { ease: EASE },
    onUpdate: updateControls,
  });

  timeline
    .addLabel("identity", 0)
    .to({}, { duration: 0.62 })
    .to(brandTitle, { autoAlpha: 0, x: 54, filter: "blur(7px)", duration: 0.38, ease: DEPART }, 0.62)
    .to(brandMark, { scale: 0.84, duration: 0.48, ease: EASE }, 0.66)
    .to(brand, { autoAlpha: 0, duration: 0.34, ease: DEPART }, 0.92)
    .to(neutralWash, { autoAlpha: 1, duration: 0.56, ease: EASE }, 0.62)
    .addLabel("original", 1.04)
    .to(
      browser,
      {
        autoAlpha: 1,
        x: 300,
        y: 26,
        scale: 1.4,
        clipPath: "inset(0% 0 0 0 round 22px)",
        duration: 0.82,
        ease: ARRIVE,
      },
      0.88,
    )
    .to({}, { duration: 0.2 })
    .addLabel("overview", 2.02)
    .to(browser, { x: 0, y: 0, scale: 0.88, duration: 0.88, ease: EASE }, 2.02)
    .to({}, { duration: 0.22 })
    .to(browser, { y: 266, duration: 0.68, ease: EASE }, 3.02)
    .to(brand, { autoAlpha: 1, x: 374, y: -362, duration: 0.5, ease: ARRIVE }, 3.06)
    .to(brandMark, { scale: 0.82, duration: 0.5, ease: ARRIVE }, 3.06)
    .addLabel("transform", 3.62)
    .to(neutralWash, { autoAlpha: 0, duration: 0.56, ease: EASE }, 3.62)
    .to(sweep, { autoAlpha: 1, x: 1650, duration: 0.74, ease: "power2.inOut" }, 3.68)
    .to(prettified, { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power2.inOut" }, 3.68)
    .to(sweep, { autoAlpha: 0, duration: 0.18, ease: DEPART }, 4.28)
    .to({}, { duration: 0.28 })
    .addLabel("quickLinks", 5.05)
    .to(brand, { autoAlpha: 0, duration: 0.3, ease: DEPART }, 5.05)
    .to(browser, { x: -704, y: 124, scale: 1.56, duration: 0.86, ease: EASE }, 5.05)
    .to({}, { duration: 0.16 })
    .addLabel("polished", 6.12)
    .to(browser, { x: 258, y: 52, scale: 1.22, duration: 0.9, ease: EASE }, 6.12)
    .to({}, { duration: 0.24 })
    .addLabel("resolve", 7.3)
    .to(browser, { x: 0, y: 246, scale: 0.9, duration: 0.62, ease: EASE }, 7.3)
    .to(brand, { autoAlpha: 1, x: 374, y: -362, duration: 0.42, ease: ARRIVE }, 7.34)
    .to(brandMark, { scale: 0.82, duration: 0.42, ease: ARRIVE }, 7.34)
    .to(browser, { autoAlpha: 0, y: 180, scale: 1.08, duration: 0.5, ease: DEPART }, 7.88)
    .to(brand, { x: 0, y: 0, duration: 0.7, ease: EASE }, 7.92)
    .to(brandMark, { scale: 1, duration: 0.7, ease: EASE }, 7.92)
    .to(brandTitle, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.56, ease: ARRIVE }, 8.22)
    .set(prettified, { clipPath: "inset(0 100% 0 0)" }, 8.98)
    .set(browser, { x: 0, y: 180, scale: 1.15, clipPath: "inset(12% 0 0 0 round 22px)" }, 8.98)
    .to({}, { duration: 0.02 });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const wholeSeconds = Math.floor(seconds % 60);
    const hundredths = Math.floor((seconds % 1) * 100);
    return `${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
  }

  function updateControls() {
    const time = Math.min(timeline.time(), DURATION);
    scrubber.value = String(time);
    timeReadout.value = `${formatTime(time)} / ${formatTime(DURATION)}`;
    playPause.textContent = timeline.paused() ? "Play" : "Pause";
  }

  playPause.addEventListener("click", () => {
    timeline.paused(!timeline.paused());
    updateControls();
  });

  restart.addEventListener("click", () => {
    timeline.restart();
    updateControls();
  });

  scrubber.addEventListener("input", (event) => {
    timeline.pause(Number(event.currentTarget.value), false);
    updateControls();
  });

  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      timeline.pause(button.dataset.scene, false);
      updateControls();
    });
  });

  if (reducedMotion && !isExportMode) {
    timeline.pause("polished", false);
  } else if (!isExportMode) {
    timeline.play(0);
  }

  updateControls();

  // Development and export API. Timing can be edited above, or manipulated live
  // from DevTools with `window.prettifyTimeline`.
  window.prettifyTimeline = timeline;
  window.__PRETTIFY__ = {
    ready: true,
    duration: DURATION,
    labels: { ...timeline.labels },
    setTime(time) {
      timeline.pause(Math.max(0, Math.min(Number(time), DURATION)), false);
      gsap.updateRoot();
    },
  };
})();
