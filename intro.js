// PHOTOS comes from assets/photos/manifest.js

const startScreen = document.getElementById('start-screen');
const typeScreen = document.getElementById('typewriter-screen');
const typeText = document.getElementById('typewriter-text');
const carouselScreen = document.getElementById('carousel-screen');
const carouselImg = document.getElementById('carousel-img');
const music = document.getElementById('bg-music');
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');
const site = document.getElementById('site');
const intro = document.getElementById('intro');
const skipBtn = document.getElementById('skip-btn');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(el, text, speed = 70) {
  el.textContent = '';
  for (const char of text) {
    el.textContent += char;
    await wait(speed);
  }
}

async function showScreen(el) {
  el.classList.add('visible');
}

async function hideScreen(el) {
  el.classList.remove('visible');
  await wait(1000);
}

async function openCurtain() {
  curtainLeft.classList.add('open');
  curtainRight.classList.add('open');
  await wait(1900);
}

async function closeCurtain() {
  curtainLeft.classList.remove('open');
  curtainRight.classList.remove('open');
  await wait(1900);
}

const MUSIC_VOLUME = 0.22;

async function fadeOutMusic(durationMs = 2000) {
  if (music.paused) return;
  const steps = 20;
  const stepTime = durationMs / steps;
  const startVolume = music.volume;
  for (let i = 1; i <= steps; i++) {
    music.volume = Math.max(0, startVolume * (1 - i / steps));
    await wait(stepTime);
  }
  music.pause();
  music.currentTime = 0;
}

async function runCarousel() {
  const hasPhotos = Array.isArray(window.PHOTOS) && window.PHOTOS.length > 0;
  const perImage = 6000;

  if (hasPhotos) {
    carouselImg.src = `assets/photos/${window.PHOTOS[0]}`;
    await new Promise(resolve => {
      carouselImg.onload = resolve;
      carouselImg.onerror = resolve;
    });
    carouselImg.classList.add('visible');
  }

  showScreen(carouselScreen);
  await wait(300);

  await openCurtain();

  if (!hasPhotos) {
    await wait(2500);
  } else {
    await wait(perImage);
    for (let i = 1; i < window.PHOTOS.length; i++) {
      const src = `assets/photos/${window.PHOTOS[i]}`;
      carouselImg.classList.remove('visible');
      await wait(400);
      carouselImg.src = src;
      carouselImg.classList.add('visible');
      await wait(perImage);
    }
  }

  await closeCurtain();

  carouselImg.classList.remove('visible');
  carouselScreen.classList.remove('visible');
}

async function revealSite() {
  await fadeOutMusic();
  await openCurtain();
  intro.remove();
  site.hidden = false;
}

async function runIntro() {
  if (music.src) {
    music.volume = MUSIC_VOLUME;
    music.play().catch(() => {});
  }

  await hideScreen(startScreen);

  showScreen(typeScreen);
  await typeLine(typeText, "Alex, I know it's not your birthday yet.");
  await wait(2200);
  await typeLine(typeText, "But I couldn't help myself.");
  await wait(3500);
  await hideScreen(typeScreen);
  typeText.textContent = '';

  showScreen(typeScreen);
  await typeLine(typeText, "Through the last several years with you, we've taken some pretty good pictures and videos.");
  await wait(2500);
  await typeLine(typeText, "Let's have a look at some of the highlights.");
  await wait(3000);
  await hideScreen(typeScreen);
  typeText.textContent = '';

  await runCarousel();

  showScreen(typeScreen);
  await typeLine(typeText, "While the moments we've captured are unforgettable, and beautiful...");
  await wait(2500);
  await typeLine(typeText, "I think it's about time we up our game.");
  await wait(3500);
  await hideScreen(typeScreen);

  await revealSite();
}

startScreen.addEventListener('click', () => {
  runIntro();
}, { once: true });

skipBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  music.pause();
  if (intro.parentNode) intro.remove();
  site.hidden = false;
});

showScreen(startScreen);
