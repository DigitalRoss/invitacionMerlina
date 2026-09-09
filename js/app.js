const invitation = {
  name: "Agustina",
  age: 10,
  message: "¿Le temes a divertirte un montón? ¡Te espero!",

  // IMPORTANTE:
  // Formato recomendado: AAAA-MM-DDTHH:mm:ss-03:00
  // El -03:00 fija la hora de Argentina y evita diferencias entre dispositivos.
  eventDateTime: "2026-10-18T16:00:00-03:00",
  eventEndDateTime: "2026-10-18T20:00:00-03:00",

  dateLabel: "Domingo 18 de Octubre",
  timeLabel: "16:00 a 20:00 hs.",

  venue: "Paloko Bowling",
  address: "Av. San Martín 2269, CABA",
  mapUrl: "https://maps.app.goo.gl/LnZVf7kF9egGp7Lk8",

  dressCode: "Ven vestido de negro.",

  whatsappNumber: "5491156223007",
  whatsappMessage:
    "¡Hola! Confirmo mi asistencia al cumpleaños de Agustina. 🖤",

  instagramUrl: "https://www.instagram.com/digitaldesignross/"
};

const characters = [
  {
    src: "assets/img/character-2.png",
    width: "min(86vw, 410px)",
    bottom: "-5px",
    left: "50%",
    translateX: "-50%"
  },
  {
    src: "assets/img/character-1.png",
    width: "min(95vw, 455px)",
    bottom: "-8px",
    left: "50%",
    translateX: "-52%"
  },
  {
    src: "assets/img/character-3.png",
    width: "min(92vw, 440px)",
    bottom: "-4px",
    left: "50%",
    translateX: "-49%"
  },
  {
    src: "assets/img/character-4.png",
    width: "min(102vw, 485px)",
    bottom: "-12px",
    left: "50%",
    translateX: "-50%"
  }
];

const $ = (selector) => document.querySelector(selector);

const loader = $("#loader");
const enterButton = $("#enter-button");
const audio = $("#audio");
const musicToggle = $("#music-toggle");
const characterImage = $("#character-image");
const countdown = $("#countdown");
const countdownStatus = $("#countdown-status");

let characterIndex = 0;
let characterInterval = null;
let countdownInterval = null;
let hasEntered = false;

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function populateInvitation() {
  document.title = `Invitación de ${invitation.name}`;

  setText("#loader-title", invitation.name);
  setText("#guest-name", invitation.name);
  setText("#age-label", `CUMPLE ${invitation.age} AÑOS`);
  setText("#invitation-message", invitation.message);
  setText("#event-date", invitation.dateLabel);
  setText("#event-time", invitation.timeLabel);
  setText("#event-venue", invitation.venue);
  setText("#event-address", invitation.address);
  setText("#dress-code", invitation.dressCode);

  const mapButton = $("#map-button");
  mapButton.href = invitation.mapUrl;

  const whatsappButton = $("#whatsapp-button");
  const whatsappText = encodeURIComponent(invitation.whatsappMessage);
  whatsappButton.href = `https://wa.me/${invitation.whatsappNumber}?text=${whatsappText}`;
}

function applyCharacter(character) {
  characterImage.style.width = character.width;
  characterImage.style.bottom = character.bottom;
  characterImage.style.left = character.left;
  characterImage.style.transform = `translate3d(${character.translateX}, 18px, 0) scale(1.04)`;
}

function showCharacter(index) {
  const character = characters[index];

  characterImage.classList.remove("is-visible");

  window.setTimeout(() => {
    applyCharacter(character);
    characterImage.src = character.src;

    requestAnimationFrame(() => {
      characterImage.style.transform = `translate3d(${character.translateX}, 0, 0) scale(1)`;
      characterImage.classList.add("is-visible");
    });
  }, 500);
}

function startCharacters() {
  showCharacter(characterIndex);

  if (characters.length > 1) {
    characterInterval = window.setInterval(() => {
      characterIndex = (characterIndex + 1) % characters.length;
      showCharacter(characterIndex);
    }, 6200);
  }
}

async function startAudio() {
  try {
    await audio.play();
    updateMusicButton();
  } catch (error) {
    updateMusicButton();
  }
}

function updateMusicButton() {
  const playing = !audio.paused;

  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute(
    "aria-label",
    playing ? "Pausar música" : "Reproducir música"
  );
  musicToggle.innerHTML = `<span class="music-toggle__icon" aria-hidden="true">${playing ? "♪" : "♫"}</span>`;
}

function enterInvitation() {
  if (hasEntered) return;

  hasEntered = true;
  document.body.classList.remove("is-locked");
  loader.classList.add("is-leaving");
  musicToggle.hidden = false;

  startAudio();

  window.setTimeout(() => {
    loader.remove();
  }, 550);
}

function toggleAudio() {
  if (audio.paused) startAudio();
  else audio.pause();

  updateMusicButton();
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function setCountdownValues(days, hours, minutes, seconds) {
  setText("#countdown-days", pad(days));
  setText("#countdown-hours", pad(hours));
  setText("#countdown-minutes", pad(minutes));
  setText("#countdown-seconds", pad(seconds));
}

function showFinishedCountdown(message) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  countdown.classList.add("is-finished");
  countdown.innerHTML = `<p class="countdown__finished-message">${message}</p>`;
}

function updateCountdown() {
  const start = new Date(invitation.eventDateTime).getTime();
  const end = new Date(invitation.eventEndDateTime).getTime();
  const now = Date.now();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    countdownStatus.textContent = "Revisá la fecha configurada en app.js.";
    return;
  }

  if (now >= end) {
    showFinishedCountdown("¡Gracias por compartir este día!");
    countdownStatus.textContent = "";
    return;
  }

  if (now >= start && now < end) {
    showFinishedCountdown("¡Hoy es el gran día! 🖤");
    countdownStatus.textContent = "La espera terminó.";
    return;
  }

  const distance = start - now;

  const totalSeconds = Math.max(0, Math.floor(distance / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setCountdownValues(days, hours, minutes, seconds);

  if (days === 0) {
    countdownStatus.textContent = "Ya falta menos de un día.";
  } else if (days === 1) {
    countdownStatus.textContent = "Falta solo 1 día.";
  } else {
    countdownStatus.textContent = `Faltan ${days} días para festejar juntos.`;
  }
}

function startCountdown() {
  updateCountdown();

  if (!countdownInterval && !countdown.classList.contains("is-finished")) {
    countdownInterval = window.setInterval(updateCountdown, 1000);
  }
}

function setupVisibilityAudio() {
  document.addEventListener("visibilitychange", () => {
    if (!hasEntered) return;

    if (document.hidden) {
      audio.pause();
      updateMusicButton();
    }
  });
}

function init() {
  document.body.classList.add("is-locked");

  populateInvitation();
  startCharacters();
  startCountdown();
  setupRevealAnimations();
  setupVisibilityAudio();

  enterButton.addEventListener("click", enterInvitation);
  musicToggle.addEventListener("click", toggleAudio);
  audio.addEventListener("play", updateMusicButton);
  audio.addEventListener("pause", updateMusicButton);
}

document.addEventListener("DOMContentLoaded", init);
