// ─── Sequence data ────────────────────────────────────────────────────────────
// Replace each `frames` array with your actual image paths, e.g.:
//   frames: ['photos/seq1/a.jpg', 'photos/seq1/b.jpg', ...]
// Frames are shown in order; the first frame is the still default.

const FRAME_MS = 250; // milliseconds per frame (200–300 recommended)

const sequences = [
  {
    title: "Elevation",
    sub: "Rise Dance Group · Spring 2025",
    
    frames: ['sequencephotos/updates/leap1.jpg', 'sequencephotos/updates/leap2.jpg', 'sequencephotos/updates/leap3.jpg', 'sequencephotos/updates/leap4.jpg'],
    colors: ["#1a0a2e", "#2d1060", "#1a0a2e", "#3b1580"],
  },
  {
    title: "Raise",
    sub: "BreakFree · Spring 2024",
    frames: ['sequencephotos/breakfree1.JPG', 'sequencephotos/breakfree2.JPG', 'sequencephotos/breakfree3.JPG', 'sequencephotos/breakfree4.JPG'],
    colors: ["#0e1a2e", "#172d52", "#0e1a2e", "#1d3a6b"],
  },
  {
    title: "Rain Dance",
    sub: "Cornell Belly Dance · Spring 2024",
    frames: ['sequencephotos/updates/dance1.JPG', 'sequencephotos/updates/dance2.JPG', 'sequencephotos/updates/dance3.JPG', 'sequencephotos/updates/dance4.JPG'],
    colors: ["#0e1a2e", "#172d52", "#0e1a2e", "#1d3a6b"],
    colors: ["#1a0e2e", "#2e1a4e", "#1a0e2e", "#3d2060"],
  },
  {
    title: "Flow",
    sub: "Cornell Belly Dance · Spring 2024",
    frames:['sequencephotos/move1.jpg','sequencephotos/move2.jpg', 'sequencephotos/move3.jpg', 'sequencephotos/move4.jpg'],
    colors: ["#0a1a1a", "#102e2e", "#0a1a1a", "#153d3d"],
  },
  {
    title: "Adagio",
    sub: "Tompkins Orchestra · Spring 2023",
    frames: ['sequencephotos/calm1.jpg', 'sequencephotos/calm2.jpg', 'sequencephotos/calm3.jpg', 'sequencephotos/calm4.jpg'],
    colors: ["#1a0a1a", "#2e1030", "#1a0a1a", "#3d1542"],
  },
  {
    title: "Crescendo",
    sub: "Tompkins Orchestra · Winter 2022",
    frames: ['sequencephotos/porterstrong1.jpg', 'sequencephotos/porterstrong2.jpg', 'sequencephotos/porterstrong3.jpg', 'sequencephotos/porterstrong4.jpg'],
    colors: ["#1a1400", "#2e2200", "#1a1400", "#3d2e00"],
  },
];

// ─── Card rendering ────────────────────────────────────────────────────────────

function buildCard(seq, index) {
  const card = document.createElement("article");
  card.className = "seq-card";
  card.setAttribute("data-index", index);
  card.setAttribute("aria-label", `Photo sequence: ${seq.title}`);

  // Frames wrapper
  const framesDiv = document.createElement("div");
  framesDiv.className = "seq-frames";

  for (let i = 0; i < 4; i++) {
    if (seq.frames) {
      // Real images
      const img = document.createElement("img");
      img.className = "seq-frame" + (i === 0 ? " is-active" : "");
      img.src = seq.frames[i];
      img.alt = `${seq.title} — frame ${i + 1}`;
      img.loading = "lazy";
      framesDiv.appendChild(img);
    } else {
      // Placeholder colored div
      const placeholder = document.createElement("div");
      placeholder.className = "seq-frame" + (i === 0 ? " is-active" : "");
      placeholder.style.cssText = `
        position: absolute; inset: 0;
        background: ${seq.colors[i]};
        display: flex; align-items: center; justify-content: center;
      `;
      // Subtle label so placeholders are obviously placeholders
      const label = document.createElement("span");
      label.textContent = `Frame ${i + 1}`;
      label.style.cssText = `
        font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase;
        color: rgba(147,51,234,0.35); font-family: var(--font-body);
      `;
      placeholder.appendChild(label);
      framesDiv.appendChild(placeholder);
    }
  }

  // Overlay: dots + hint text
  const overlay = document.createElement("div");
  overlay.className = "seq-overlay";

  const hint = document.createElement("p");
  hint.className = "seq-hint";
  hint.textContent = "hover to play";

  const dotsDiv = document.createElement("div");
  dotsDiv.className = "seq-dots";
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("span");
    dot.className = "seq-dot" + (i === 0 ? " is-active" : "");
    dotsDiv.appendChild(dot);
  }

  overlay.appendChild(hint);
  overlay.appendChild(dotsDiv);
  framesDiv.appendChild(overlay);

  // Info strip
  const infoDiv = document.createElement("div");
  infoDiv.className = "seq-info";

  const title = document.createElement("h3");
  title.className = "seq-title";
  title.textContent = seq.title;

  const sub = document.createElement("p");
  sub.className = "seq-sub";
  sub.textContent = seq.sub;

  infoDiv.appendChild(title);
  infoDiv.appendChild(sub);

  card.appendChild(framesDiv);
  card.appendChild(infoDiv);

  return card;
}

// ─── Animation logic ───────────────────────────────────────────────────────────

function getFrameEls(card) {
  return card.querySelectorAll(".seq-frame");
}

function getDotEls(card) {
  return card.querySelectorAll(".seq-dot");
}

function showFrame(card, frameIndex) {
  const frames = getFrameEls(card);
  const dots = getDotEls(card);

  frames.forEach((f, i) => f.classList.toggle("is-active", i === frameIndex));
  dots.forEach((d, i) => d.classList.toggle("is-active", i === frameIndex));
}

function startAnimation(card) {
  if (card._animInterval) return; // already running

  let current = 0;
  card.classList.add("is-playing");

  card._animInterval = setInterval(() => {
    current = (current + 1) % 4;
    showFrame(card, current);
  }, FRAME_MS);
}

function stopAnimation(card) {
  if (card._animInterval) {
    clearInterval(card._animInterval);
    card._animInterval = null;
  }
  card.classList.remove("is-playing");
  showFrame(card, 0); // reset to first frame
}

// ─── Event wiring ──────────────────────────────────────────────────────────────

function attachEvents(card) {
  // Hover animates the card preview
  card.addEventListener("mouseenter", () => startAnimation(card));
  card.addEventListener("mouseleave", () => stopAnimation(card));

  // Click (any device) opens the full lightbox
  card.addEventListener("click", () => {
    stopAnimation(card);
    const idx = parseInt(card.getAttribute("data-index"));
    lbOpenSeq(sequences[idx]);
  });
}

// ─── Lightbox ──────────────────────────────────────────────────────────────────
// Handles both still photos (.still img) and animated sequences (seq-cards).

let _lb, _lbImg, _lbSeq, _lbInterval;

function lbClose() {
  if (_lbInterval) { clearInterval(_lbInterval); _lbInterval = null; }
  _lb.classList.remove("is-open");
  document.body.style.overflow = "";
  // Reset both modes
  _lbImg.src = "";
  _lbImg.style.display = "";
  _lbSeq.classList.remove("is-visible");
  _lbSeq.innerHTML = "";
}

function lbOpenStill(src, alt) {
  _lbImg.src = src;
  _lbImg.alt = alt || "";
  _lbImg.style.display = "block";
  _lbSeq.classList.remove("is-visible");
  _lb.classList.add("is-open");
  document.body.style.overflow = "hidden";
  document.getElementById("lightboxClose").focus();
}

function lbOpenSeq(seq) {
  // Stop any previous lb animation
  if (_lbInterval) { clearInterval(_lbInterval); _lbInterval = null; }

  // Build the frame display
  _lbSeq.innerHTML = "";

  const framesEl = document.createElement("div");
  framesEl.className = "lb-seq-frames";
  seq.frames.forEach((src, i) => {
    const img = document.createElement("img");
    img.className = "lb-seq-frame" + (i === 0 ? " is-active" : "");
    img.src = src;
    img.alt = `${seq.title} — frame ${i + 1}`;
    framesEl.appendChild(img);
  });

  const dotsEl = document.createElement("div");
  dotsEl.className = "lb-seq-dots";
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("span");
    dot.className = "lb-seq-dot" + (i === 0 ? " is-active" : "");
    dotsEl.appendChild(dot);
  }

  const metaEl = document.createElement("div");
  metaEl.className = "lb-seq-meta";
  metaEl.innerHTML = `<h3 class="lb-seq-title">${seq.title}</h3><p class="lb-seq-sub">${seq.sub}</p>`;

  const infoEl = document.createElement("div");
  infoEl.className = "lb-seq-info";
  infoEl.appendChild(metaEl);
  infoEl.appendChild(dotsEl);

  _lbSeq.appendChild(framesEl);
  _lbSeq.appendChild(infoEl);

  // Hide still img, show seq player
  _lbImg.style.display = "none";
  _lbSeq.classList.add("is-visible");
  _lb.classList.add("is-open");
  document.body.style.overflow = "hidden";
  document.getElementById("lightboxClose").focus();

  // Loop the animation
  let current = 0;
  _lbInterval = setInterval(() => {
    current = (current + 1) % 4;
    framesEl.querySelectorAll(".lb-seq-frame").forEach((f, i) => f.classList.toggle("is-active", i === current));
    dotsEl.querySelectorAll(".lb-seq-dot").forEach((d, i) => d.classList.toggle("is-active", i === current));
  }, FRAME_MS);
}

function initLightbox() {
  _lb    = document.getElementById("lightbox");
  _lbImg = document.getElementById("lightboxImg");
  _lbSeq = document.getElementById("lightboxSeq");
  const closeBtn = document.getElementById("lightboxClose");

  // Stills: click to open
  document.querySelectorAll(".still img").forEach((img) => {
    img.addEventListener("click", () => lbOpenStill(img.src, img.alt));
  });

  // Close via button, backdrop, or Escape
  closeBtn.addEventListener("click", lbClose);
  _lb.addEventListener("click", (e) => { if (e.target === _lb) lbClose(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && _lb.classList.contains("is-open")) lbClose();
  });
}

// ─── Init ──────────────────────────────────────────────────────────────────────

function init() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  sequences.forEach((seq, i) => {
    const card = buildCard(seq, i);
    attachEvents(card);
    grid.appendChild(card);
  });

  initLightbox();
}

document.addEventListener("DOMContentLoaded", init);
