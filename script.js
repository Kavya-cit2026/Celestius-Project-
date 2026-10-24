/* =========================================================
   CIT ClubSphere — script.js
   Plain JavaScript, no frameworks. Sections:
   1.  Content data (clubs + events)   <-- edit here to add clubs/events
   2.  Small helpers (DOM, storage, formatting)
   3.  Cover art generator (SVG placeholders for images)
   4.  Theme toggle
   5.  Navigation (sticky, active link, mobile menu)
   6.  Hero
   7.  Event discovery (search, filter, sort, show more)
   8.  Featured carousel
   9.  Club directory
   10. Activity timeline
   11. Modal + hash router (club / event / register views)
   12. Registration form + localStorage
   13. Newsletter, scroll-to-top, scroll reveal
   14. Start-up
   ========================================================= */
"use strict";

/* =========================================================
   1. CONTENT DATA
   ---------------------------------------------------------
   Only information supplied for each club is used here.
   - Unknown values are left as null. The UI then shows
     "Date to be announced", "Venue to be announced", etc.
   - status: "past" | "upcoming" | "tba" | "example"
   - image: put a path like "images/pitch-arena.jpg" to use a
     real photo. Leave null to use generated cover art.
   ========================================================= */

const EVENT_CATEGORIES = {
  technical: "Technical",
  "non-technical": "Non-Technical",
  workshops: "Workshops",
  competitions: "Competitions",
  cultural: "Cultural",
  interdisciplinary: "Interdisciplinary",
};

const CLUB_CATEGORIES = {
  technical: { label: "Technical", group: "Category A", title: "Technical Clubs" },
  "non-technical": { label: "Non-Technical", group: "Category B", title: "Non-Technical Clubs" },
  interdisciplinary: { label: "Technical + Non-Technical", group: "Category C", title: "Interdisciplinary Clubs" },
};

const CLUBS = [
  {
    id: "athera",
    name: "ATHERA",
    fullName: "AI and Technology Hub for Enhanced Research Analytics",
    category: "technical",
    department: "Department of Artificial Intelligence and Machine Learning",
    description:
      "A student-initiated club formed by students of the Artificial Intelligence and Machine Learning department at Chennai Institute of Technology. ATHERA provides a platform for students to explore AI, technology, research, analytics, innovation, and collaborative problem-solving.",
    focus: ["Artificial intelligence", "Technology & research", "Analytics", "Innovation", "Collaborative problem-solving"],
    teams: [],
    theme: "neural",
    colors: ["#8b5cf6", "#22d3ee"],
    monogram: "AT",
    image: null,
  },
  {
    id: "impulse",
    name: "CIT Impulse",
    fullName: "National-level technical symposium club",
    category: "technical",
    department: "Department of Electrical and Electronics Engineering",
    description:
      "A national-level technical symposium club associated with the Department of Electrical and Electronics Engineering at CIT.",
    focus: ["Technical symposium", "Software & cloud", "Quizzing", "Debugging challenges"],
    teams: [],
    theme: "circuit",
    colors: ["#06b6d4", "#34d399"],
    monogram: "IM",
    image: null,
  },
  {
    id: "magnus",
    name: "Magnus",
    fullName: "National-level technical symposium",
    category: "technical",
    department: "Department of Artificial Intelligence and Machine Learning",
    description:
      "A national-level technical symposium associated with the Department of Artificial Intelligence and Machine Learning at CIT.",
    focus: ["Technical competitions", "Innovation", "Problem-solving", "Technology-focused symposium activities"],
    teams: [],
    theme: "bold",
    colors: ["#f472b6", "#8b5cf6"],
    monogram: "MG",
    image: null,
  },
  {
    id: "build",
    name: "BUILD Club",
    fullName: "Turning ideas into action",
    category: "technical",
    department: null,
    description: "A club focused on turning ideas into action.",
    focus: ["Building practical projects", "Experimentation", "Collaboration", "Turning concepts into tangible solutions"],
    teams: [],
    theme: "builder",
    colors: ["#64748b", "#22d3ee"],
    monogram: "BC",
    image: null,
  },
  {
    id: "immerse",
    name: "Immerse CIT",
    fullName: "The official theatre club of CIT",
    category: "non-technical",
    department: null,
    description:
      "The official theatre club of Chennai Institute of Technology, bringing students together through theatre, performance, and creative expression.",
    focus: ["Theatre", "Performance", "Creative expression", "Dance & music teams"],
    teams: [
      { name: "DGROOVES", role: "Dance team associated with Immerse CIT" },
      { name: "VOXNOVA", role: "Music team associated with Immerse CIT" },
    ],
    // Guest names are shown only in the context of a past program.
    pastNote:
      "A recent past program featured guest appearances by Anishma Anilkumar and Raja Karuppuswamy. This refers to a program that has already taken place; they are not announced for any upcoming event.",
    theme: "stage",
    colors: ["#7c3aed", "#fbbf24"],
    monogram: "IC",
    image: null,
  },
  {
    id: "connects",
    name: "CIT Connects",
    fullName: "Magazine & podcast club",
    category: "non-technical",
    department: null,
    description:
      "A magazine-oriented club at CIT that organizes activities and produces magazines and podcasts.",
    focus: ["Student writing", "Editorial creativity", "Magazine publishing", "Podcast creation", "Campus storytelling"],
    teams: [],
    theme: "editorial",
    colors: ["#fb923c", "#f472b6"],
    monogram: "CC",
    image: null,
  },
  {
    id: "campustv",
    name: "Campus TV",
    fullName: "Campus media & creative community",
    category: "non-technical",
    department: null,
    description:
      "A campus media and creative community associated with student activities and performances.",
    focus: ["Creative performances", "Campus media", "Student participation", "Cultural activities"],
    teams: [{ name: "SWAYDEVILS", role: "Dance team associated with Campus TV" }],
    theme: "media",
    colors: ["#fb7185", "#22d3ee"],
    monogram: "TV",
    image: null,
  },
  {
    id: "celestius",
    name: "Celestius",
    fullName: "Where technology meets creativity",
    category: "interdisciplinary",
    department: null,
    description:
      "An interdisciplinary club at CIT that works across technical and non-technical activities.",
    focus: ["Technology and creativity", "Interdisciplinary collaboration", "Design thinking", "Workshops", "Innovation"],
    teams: [],
    theme: "blend",
    colors: ["#a78bfa", "#60a5fa"],
    monogram: "CE",
    image: null,
  },
];

/* Every supplied activity is a PAST activity. No dates, times or venues were supplied,
   so those fields stay null. Category tags are ClubSphere's own classification. */
const EVENTS = [
  {
    id: "pitch-arena", title: "Pitch Arena", clubId: "athera",
    categories: ["technical", "competitions"], status: "past",
    summary: "A pitch-style activity where student ideas meet an audience.",
    description: "Pitch Arena is listed among ATHERA's past activities. As a pitch-focused format, it connects with the club's interest in innovation and turning research ideas into presentable concepts.",
  },
  {
    id: "hack-with-magnus", title: "Hack with Magnus", clubId: "athera",
    categories: ["technical", "competitions"], status: "past",
    summary: "A hackathon-style activity listed among ATHERA's past activities.",
    description: "Hack with Magnus is listed among ATHERA's past activities, in line with the club's focus on technology and collaborative problem-solving.",
  },
  {
    id: "project-expo", title: "Project Expo", clubId: "athera",
    categories: ["technical"], status: "past",
    summary: "A showcase-style activity for student projects.",
    description: "Project Expo is listed among ATHERA's past activities. As an expo format, it reflects the club's interest in research, analytics and innovation.",
  },
  {
    id: "ideathon", title: "Ideathon", clubId: "athera",
    categories: ["technical", "competitions"], status: "past",
    summary: "An idea-focused activity listed among ATHERA's past activities.",
    description: "Ideathon is listed among ATHERA's past activities, connecting with the club's focus on innovation and collaborative problem-solving.",
  },
  {
    id: "code-to-cloud", title: "Code to Cloud", clubId: "impulse",
    categories: ["technical"], status: "past",
    summary: "A technical activity themed around code and the cloud.",
    description: "Code to Cloud is listed among the past activities associated with CIT Impulse, the national-level technical symposium club of the EEE department.",
  },
  {
    id: "micro-saas", title: "Micro SaaS", clubId: "impulse",
    categories: ["technical"], status: "past",
    summary: "A technical activity themed around small software products.",
    description: "Micro SaaS is listed among the past activities associated with CIT Impulse.",
  },
  {
    id: "tech-quiz", title: "Tech Quiz", clubId: "impulse",
    categories: ["technical", "competitions"], status: "past",
    summary: "A technology quiz from CIT Impulse.",
    description: "Tech Quiz is listed among the past activities associated with CIT Impulse.",
  },
  {
    id: "catch-the-bug", title: "Catch the Bug", clubId: "impulse",
    categories: ["technical", "competitions"], status: "past",
    summary: "A debugging-themed technical activity.",
    description: "Catch the Bug is listed among the past activities associated with CIT Impulse.",
  },
  {
    id: "cinema-vattaram", title: "Cinema Vattaram", clubId: "immerse",
    categories: ["non-technical", "cultural"], status: "past",
    summary: "A past program from Immerse CIT, the official theatre club.",
    description: "Cinema Vattaram is a past activity of Immerse CIT, the official theatre club of Chennai Institute of Technology, which brings students together through theatre, performance and creative expression.",
  },
  {
    id: "prompt-verse", title: "Prompt Verse", clubId: "celestius",
    categories: ["interdisciplinary"], status: "past",
    summary: "A Celestius activity blending technology and creativity.",
    description: "Prompt Verse is a past activity of Celestius, the interdisciplinary club that works across technical and non-technical activities.",
  },
  {
    id: "ui-ux-workshops", title: "UI/UX Workshops", clubId: "celestius",
    categories: ["interdisciplinary", "workshops"], status: "past",
    summary: "Design-focused workshops from Celestius.",
    description: "UI/UX workshops are among the past activities of Celestius, reflecting the club's focus on design thinking and interdisciplinary collaboration.",
  },
  {
    // A clearly labelled demo entry so the registration flow can be tried.
    id: "clubsphere-demo", title: "ClubSphere Demo Registration", clubId: null,
    hostLabel: "CIT ClubSphere (prototype)", theme: "demo",
    categories: [], status: "example", registrationOpen: true,
    summary: "Not a real CIT event. Use this entry to try the registration flow.",
    description: "This is an example entry created by ClubSphere to demonstrate registration. It is not organised by any CIT club, and registering does not reserve a place anywhere. Your entry is saved only in this browser.",
    highlights: ["Try form validation and the confirmation screen", "See your entry under “Your registrations”", "Remove it any time — nothing leaves your browser"],
  },
];

/* Activities shown in the Featured carousel (all past). */
const FEATURED_IDS = [
  "hack-with-magnus", "pitch-arena", "project-expo", "ideathon", "code-to-cloud", "micro-saas",
  "tech-quiz", "catch-the-bug", "cinema-vattaram", "prompt-verse", "ui-ux-workshops",
];

/* Lookup tables built from the arrays above */
const clubById = Object.fromEntries(CLUBS.map((c) => [c.id, c]));
const eventById = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

/* =========================================================
   2. HELPERS
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Escape text before putting it into HTML templates. */
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
}

/** Inline SVG icon from the sprite in index.html. */
const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/** localStorage wrapper that never throws (private mode, blocked storage, bad JSON). */
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  },
};

function hostName(event) {
  const club = clubById[event.clubId];
  return club ? club.name : event.hostLabel || "Host to be announced";
}

const STATUS_LABELS = { past: "Past Event", upcoming: "Upcoming", tba: "Details To Be Announced", example: "Example Event" };
const statusBadge = (event) => `<span class="status status--${esc(event.status)}">${esc(STATUS_LABELS[event.status] || "Details To Be Announced")}</span>`;

const categoryBadges = (event) =>
  event.categories.length
    ? event.categories.map((c) => `<span class="badge badge--${esc(c)}">${esc(EVENT_CATEGORIES[c] || c)}</span>`).join("")
    : `<span class="badge badge--interdisciplinary">Example</span>`;

/** Date/time/venue text. Missing data is reported, never invented. */
function formatDate(event) {
  if (!event.date) return null;
  const d = new Date(event.date + "T00:00:00");
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function formatTime(event) {
  if (!event.startTime) return null;
  return event.endTime ? `${event.startTime} – ${event.endTime}` : event.startTime;
}
const dateText = (e) => formatDate(e) || (e.status === "past" ? "Date not supplied" : "Date to be announced");
const timeText = (e) => formatTime(e) || (e.status === "past" ? "Time not supplied" : "Time to be announced");
const venueText = (e) => e.venue || (e.status === "past" ? "Venue not supplied" : "Venue to be announced");

/** Registration availability. A past event is never open. */
function registrationInfo(event) {
  if (event.status === "past") {
    return { open: false, label: "Registration closed", detail: "This is a past activity, so registration is not available. Follow official club announcements for future editions." };
  }
  if (event.registrationOpen) {
    return event.status === "example"
      ? { open: true, label: "Demo registration open", detail: "This example entry lets you try the registration flow. Entries are saved only in this browser." }
      : { open: true, label: "Registration open", detail: "Registrations on this prototype are saved only in this browser and are not sent to organisers." };
  }
  return { open: false, label: "Registration not open", detail: "Registration has not been announced. Check official college or club announcements." };
}

/* Toast message */
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

/* =========================================================
   3. COVER ART GENERATOR
   ---------------------------------------------------------
   Draws a unique SVG "image" per club/event, so there are
   never broken images. If an `image` path is set in the data,
   a real <img> is used instead (falling back to art on error).
   ========================================================= */
let artUid = 0;

/** Small seeded random generator so the same id always draws the same art. */
function seededRandom(seedText) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const ART_PALETTES = {
  neural:    { bg: ["#1d0f4a", "#06243f"], a: "#a78bfa", b: "#22d3ee" },
  circuit:   { bg: ["#03222c", "#0a1838"], a: "#22d3ee", b: "#34d399" },
  bold:      { bg: ["#33093f", "#0b0a2c"], a: "#f472b6", b: "#8b5cf6" },
  builder:   { bg: ["#0f172a", "#1e2a44"], a: "#22d3ee", b: "#e2e8f0" },
  stage:     { bg: ["#1c0533", "#3a0a46"], a: "#fbbf24", b: "#f472b6" },
  editorial: { bg: ["#2b1209", "#3b1430"], a: "#fb923c", b: "#fde68a" },
  media:     { bg: ["#1d0616", "#0a0b20"], a: "#fb7185", b: "#22d3ee" },
  blend:     { bg: ["#140d40", "#082448"], a: "#a78bfa", b: "#60a5fa" },
  demo:      { bg: ["#06231d", "#0a1530"], a: "#34d399", b: "#22d3ee" },
};

function coverArt(theme, seed) {
  const p = ART_PALETTES[theme] || ART_PALETTES.blend;
  const rnd = seededRandom(seed + theme);
  const id = `art${++artUid}`;
  const W = 400, H = 225;
  let shapes = "";

  switch (theme) {
    case "neural": {
      // Nodes connected by lines — a neural-network feel
      const nodes = Array.from({ length: 16 }, () => [20 + rnd() * 360, 15 + rnd() * 195]);
      nodes.forEach(([x1, y1], i) => nodes.slice(i + 1).forEach(([x2, y2]) => {
        if (Math.hypot(x1 - x2, y1 - y2) < 110) shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${p.a}" stroke-opacity=".35" stroke-width="1"/>`;
      }));
      nodes.forEach(([x, y], i) => {
        const r = 2 + rnd() * 4;
        shapes += `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="${i % 3 ? p.a : p.b}" opacity=".15"/><circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? p.a : p.b}"/>`;
      });
      break;
    }
    case "circuit": {
      // Circuit traces with pads and a chip
      for (let i = 0; i < 12; i++) {
        const y = 15 + rnd() * 195, x = rnd() * 120, len = 80 + rnd() * 150, dy = (rnd() > 0.5 ? 1 : -1) * (15 + rnd() * 30);
        const c = i % 2 ? p.a : p.b;
        shapes += `<path d="M${x} ${y} h${len} l${Math.abs(dy)} ${dy} h${60 + rnd() * 80}" fill="none" stroke="${c}" stroke-opacity=".55" stroke-width="1.5"/>`;
        shapes += `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/><circle cx="${x + len + Math.abs(dy) + 60}" cy="${y + dy}" r="3.5" fill="none" stroke="${c}" stroke-width="1.5"/>`;
      }
      shapes += `<rect x="270" y="70" width="80" height="80" rx="8" fill="${p.bg[1]}" stroke="${p.a}" stroke-width="2"/><rect x="292" y="92" width="36" height="36" rx="4" fill="${p.a}" opacity=".7"/>`;
      for (let k = 0; k < 5; k++) shapes += `<line x1="${282 + k * 14}" y1="58" x2="${282 + k * 14}" y2="70" stroke="${p.a}" stroke-width="2"/><line x1="${282 + k * 14}" y1="150" x2="${282 + k * 14}" y2="162" stroke="${p.a}" stroke-width="2"/>`;
      break;
    }
    case "bold": {
      // Big angular shapes and chevrons
      for (let i = 0; i < 5; i++) {
        const x = -60 + i * 95 + rnd() * 20;
        shapes += `<polygon points="${x},225 ${x + 70},0 ${x + 110},0 ${x + 40},225" fill="${i % 2 ? p.a : p.b}" opacity="${0.12 + rnd() * 0.25}"/>`;
      }
      shapes += `<path d="M230 60 l50 52 -50 52 M270 60 l50 52 -50 52" fill="none" stroke="${p.a}" stroke-width="10" stroke-linejoin="round" opacity=".85"/>`;
      break;
    }
    case "builder": {
      // Isometric blocks on a grid
      for (let gx = 0; gx <= W; gx += 25) shapes += `<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="${p.b}" stroke-opacity=".06"/>`;
      for (let gy = 0; gy <= H; gy += 25) shapes += `<line x1="0" y1="${gy}" x2="${W}" y2="${gy}" stroke="${p.b}" stroke-opacity=".06"/>`;
      const cube = (cx, cy, s, op) => `<g opacity="${op}"><polygon points="${cx},${cy - s} ${cx + s},${cy - s / 2} ${cx},${cy} ${cx - s},${cy - s / 2}" fill="${p.b}" fill-opacity=".9"/><polygon points="${cx - s},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx - s},${cy + s / 2}" fill="${p.a}" fill-opacity=".55"/><polygon points="${cx + s},${cy - s / 2} ${cx},${cy} ${cx},${cy + s} ${cx + s},${cy + s / 2}" fill="${p.a}" fill-opacity=".85"/></g>`;
      shapes += cube(250, 110, 40, 1) + cube(310, 140, 28, 0.85) + cube(195, 150, 24, 0.7) + cube(90 + rnd() * 40, 70, 18, 0.35);
      break;
    }
    case "stage": {
      // Spotlights over a stage with curtains
      shapes += `<defs><radialGradient id="${id}s" cx="50%" cy="0%" r="100%"><stop offset="0" stop-color="${p.a}" stop-opacity=".75"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient></defs>`;
      shapes += `<polygon points="120,0 150,0 250,225 20,225" fill="url(#${id}s)" opacity=".55"/><polygon points="255,0 285,0 390,225 160,225" fill="url(#${id}s)" opacity=".45"/>`;
      shapes += `<ellipse cx="200" cy="225" rx="230" ry="38" fill="${p.a}" opacity=".18"/>`;
      for (let i = 0; i < 4; i++) shapes += `<rect x="${i * 14}" y="0" width="12" height="225" fill="${p.b}" opacity="${0.18 - i * 0.03}"/><rect x="${W - 12 - i * 14}" y="0" width="12" height="225" fill="${p.b}" opacity="${0.18 - i * 0.03}"/>`;
      break;
    }
    case "editorial": {
      // Magazine columns and a large serif glyph
      for (let c = 0; c < 3; c++) for (let r = 0; r < 9; r++) {
        const w = 60 + rnd() * 40;
        shapes += `<rect x="${200 + c * 66}" y="${40 + r * 16}" width="${Math.min(w, 58)}" height="5" rx="2" fill="${p.b}" opacity="${r === 0 ? 0.8 : 0.25}"/>`;
      }
      shapes += `<text x="30" y="170" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-style="italic" fill="${p.a}" opacity=".9">A</text>`;
      shapes += `<line x1="30" y1="190" x2="370" y2="190" stroke="${p.b}" stroke-opacity=".4"/><line x1="30" y1="30" x2="370" y2="30" stroke="${p.b}" stroke-opacity=".4"/>`;
      break;
    }
    case "media": {
      // Film strip, play button, scanlines
      for (let y = 0; y < H; y += 6) shapes += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#fff" stroke-opacity=".03"/>`;
      shapes += `<rect x="0" y="150" width="${W}" height="46" fill="#000" opacity=".45"/>`;
      for (let x = 6; x < W; x += 22) shapes += `<rect x="${x}" y="154" width="12" height="8" rx="2" fill="${p.b}" opacity=".5"/><rect x="${x}" y="184" width="12" height="8" rx="2" fill="${p.b}" opacity=".5"/>`;
      shapes += `<circle cx="280" cy="85" r="44" fill="none" stroke="${p.a}" stroke-width="3"/><polygon points="268,64 268,106 302,85" fill="${p.a}"/>`;
      shapes += `<circle cx="80" cy="60" r="${20 + rnd() * 20}" fill="${p.a}" opacity=".2"/>`;
      break;
    }
    case "demo": {
      for (let gx = 0; gx <= W; gx += 20) shapes += `<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="${p.a}" stroke-opacity=".08" stroke-dasharray="3 5"/>`;
      shapes += `<rect x="110" y="62" width="180" height="100" rx="14" fill="none" stroke="${p.a}" stroke-width="2.5" stroke-dasharray="8 6"/><path d="M175 112 l18 18 34 -36" fill="none" stroke="${p.b}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    }
    default: {
      // "blend": orbits (creative) over a grid (technical)
      for (let gx = 200; gx <= W; gx += 20) shapes += `<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="${p.b}" stroke-opacity=".1"/>`;
      for (let gy = 0; gy <= H; gy += 20) shapes += `<line x1="200" y1="${gy}" x2="${W}" y2="${gy}" stroke="${p.b}" stroke-opacity=".1"/>`;
      for (let r = 30; r < 170; r += 28) shapes += `<circle cx="180" cy="112" r="${r}" fill="none" stroke="${r % 56 ? p.a : p.b}" stroke-opacity="${0.6 - r / 400}" stroke-width="1.4"/>`;
      shapes += `<circle cx="${180 + 86}" cy="${112 - 30}" r="7" fill="${p.b}"/><circle cx="${180 - 58}" cy="${112 + 54}" r="5" fill="${p.a}"/>`;
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bg[0]}"/><stop offset="1" stop-color="${p.bg[1]}"/></linearGradient>
      <radialGradient id="${id}v" cx="70%" cy="20%" r="80%"><stop offset="0" stop-color="${p.a}" stop-opacity=".28"/><stop offset="1" stop-color="${p.a}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#${id}g)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}v)"/>
    ${shapes}
  </svg>`;
}

/** Cover markup: a real image if supplied, otherwise generated art. */
function coverHTML({ image, theme, seed, alt, badges = "" }) {
  const media = image
    ? `<img class="cover-img" src="${esc(image)}" alt="${esc(alt)}" loading="lazy" data-theme="${esc(theme)}" data-seed="${esc(seed)}">`
    : coverArt(theme, seed);
  return `<div class="cover">${badges ? `<div class="cover__badges">${badges}</div>` : ""}${media}</div>`;
}

const eventTheme = (e) => e.theme || clubById[e.clubId]?.theme || "blend";
const eventCover = (e, badges) => coverHTML({ image: e.image, theme: eventTheme(e), seed: e.id, alt: `${e.title} cover image`, badges });
const clubCover = (c) => coverHTML({ image: c.image, theme: c.theme, seed: c.id, alt: `${c.name} cover image` });

// If a real image fails to load, swap in generated art (no broken images).
document.addEventListener("error", (evt) => {
  const img = evt.target;
  if (img instanceof HTMLImageElement && img.classList.contains("cover-img")) {
    img.insertAdjacentHTML("afterend", coverArt(img.dataset.theme, img.dataset.seed));
    img.remove();
  }
}, true);

/* =========================================================
   4. THEME TOGGLE (dark / light, saved in localStorage)
   ========================================================= */
function initTheme() {
  const btn = $("#themeToggle");
  const sync = () => {
    const isLight = document.documentElement.dataset.theme === "light";
    btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  };
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("clubsphere-theme", next); } catch (e) { /* ignore */ }
    sync();
  });
  sync();
}

/* =========================================================
   5. NAVIGATION
   ========================================================= */
function initNav() {
  const header = $("#siteHeader");
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  // Header style changes once the page scrolls
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (links.classList.contains("is-open") && !e.target.closest(".nav")) setMenu(false);
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenu(false); });

  // Highlight the nav link of the section currently in view
  const sectionToLink = { home: "home", events: "events", featured: "events", clubs: "clubs", calendar: "calendar", about: "about" };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = sectionToLink[entry.target.id];
        $$(".nav__link").forEach((a) => {
          const on = a.dataset.section === active;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach((s) => observer.observe(s));
  }

  // Links that jump to the club directory with a category pre-selected
  $$("[data-club-filter-link]").forEach((a) =>
    a.addEventListener("click", () => setClubFilter(a.dataset.clubFilterLink))
  );
}

/* =========================================================
   6. HERO
   ========================================================= */
function initHero() {
  // Category counts, calculated from the club list (not official numbers)
  Object.keys(CLUB_CATEGORIES).forEach((cat) => {
    const el = $(`[data-count="${cat}"]`);
    if (el) el.textContent = CLUBS.filter((c) => c.category === cat).length;
  });

  // Rotating featured highlight card
  const box = $("#heroFeatured");
  let index = 0;
  const render = () => {
    const e = eventById[FEATURED_IDS[index]];
    box.innerHTML = `
      ${eventCover(e, statusBadge(e))}
      <div class="hero-feat__body">
        <span class="hero-feat__label">Featured · Past activity</span>
        <h3>${esc(e.title)}</h3>
        <p>${esc(hostName(e))} · ${esc(e.summary)}</p>
        <div class="hero-feat__row">
          <div class="event-card__tags">${categoryBadges(e)}</div>
          <button class="btn btn--sm btn--ghost" type="button" data-open-event="${esc(e.id)}">View details</button>
        </div>
      </div>`;
  };
  render();

  if (!prefersReducedMotion()) {
    let paused = false;
    box.addEventListener("mouseenter", () => (paused = true));
    box.addEventListener("mouseleave", () => (paused = false));
    box.addEventListener("focusin", () => (paused = true));
    box.addEventListener("focusout", () => (paused = false));
    setInterval(() => {
      if (paused || document.hidden) return;
      index = (index + 1) % FEATURED_IDS.length;
      render();
    }, 6000);
  }
}

/* =========================================================
   7. EVENT DISCOVERY
   ========================================================= */
const PAGE_SIZE = 6;
const eventState = { category: "all", query: "", club: "all", sort: "az", visible: PAGE_SIZE };

function eventCardHTML(e) {
  const reg = registrationInfo(e);
  const date = formatDate(e), venue = e.venue;
  return `
    <article class="event-card">
      ${eventCover(e, statusBadge(e))}
      <div class="event-card__body">
        <div class="event-card__tags">${categoryBadges(e)}</div>
        <h3 class="event-card__title">${esc(e.title)}</h3>
        <span class="event-card__club">${icon("users")} ${esc(hostName(e))}</span>
        <p class="event-card__desc">${esc(e.summary)}</p>
        <ul class="meta">
          <li>${icon("calendar")}<span class="${date ? "" : "is-unknown"}">${esc(dateText(e))}${formatTime(e) ? " · " + esc(formatTime(e)) : ""}</span></li>
          <li>${icon("pin")}<span class="${venue ? "" : "is-unknown"}">${esc(venueText(e))}</span></li>
        </ul>
        <div class="event-card__foot">
          <span class="event-card__reg">${esc(reg.label)}</span>
          <button class="btn btn--sm btn--primary" type="button" data-open-event="${esc(e.id)}">View Details</button>
        </div>
      </div>
    </article>`;
}

/** Apply search + category + club filters and the sort order. */
function getFilteredEvents() {
  const q = eventState.query.trim().toLowerCase();
  const list = EVENTS.filter((e) => {
    if (eventState.category !== "all" && !e.categories.includes(eventState.category)) return false;
    if (eventState.club !== "all" && e.clubId !== eventState.club) return false;
    if (q && !(e.title.toLowerCase().includes(q) || hostName(e).toLowerCase().includes(q))) return false;
    return true;
  });
  const byTitle = (a, b) => a.title.localeCompare(b.title);
  if (eventState.sort === "za") list.sort((a, b) => byTitle(b, a));
  else if (eventState.sort === "club") list.sort((a, b) => hostName(a).localeCompare(hostName(b)) || byTitle(a, b));
  else list.sort(byTitle);
  return list;
}

function renderEvents() {
  const list = getFilteredEvents();
  const shown = list.slice(0, eventState.visible);
  $("#eventGrid").innerHTML = shown.map(eventCardHTML).join("");
  $("#eventEmpty").hidden = list.length > 0;
  $("#showMore").hidden = list.length <= eventState.visible;
  $("#eventCount").textContent = list.length
    ? `Showing ${shown.length} of ${list.length} ${list.length === 1 ? "activity" : "activities"}`
    : "";
  // Keep the category chips in sync
  $$("#eventFilters .chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.value === eventState.category)));
  $("#eventClubFilter").value = eventState.club;
}

function initEvents() {
  // Category chips (with counts)
  const chips = [["all", "All Events"], ...Object.entries(EVENT_CATEGORIES)];
  $("#eventFilters").innerHTML = chips.map(([value, label]) => {
    const count = value === "all" ? EVENTS.length : EVENTS.filter((e) => e.categories.includes(value)).length;
    return `<button class="chip" type="button" data-value="${value}" aria-pressed="false">${label}<span class="chip__count">${count}</span></button>`;
  }).join("");
  $("#eventFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    eventState.category = chip.dataset.value;
    eventState.visible = PAGE_SIZE;
    renderEvents();
  });

  // Club dropdown, built from the club list (plus the demo host)
  const select = $("#eventClubFilter");
  CLUBS.forEach((c) => select.insertAdjacentHTML("beforeend", `<option value="${c.id}">${esc(c.name)}</option>`));
  select.addEventListener("change", () => { eventState.club = select.value; eventState.visible = PAGE_SIZE; renderEvents(); });

  $("#eventSearch").addEventListener("input", (e) => { eventState.query = e.target.value; eventState.visible = PAGE_SIZE; renderEvents(); });
  $("#eventSort").addEventListener("change", (e) => { eventState.sort = e.target.value; renderEvents(); });
  $("#showMore").addEventListener("click", () => { eventState.visible += PAGE_SIZE; renderEvents(); });
  $("#eventReset").addEventListener("click", resetEventFilters);

  renderEvents();
}

function resetEventFilters() {
  Object.assign(eventState, { category: "all", query: "", club: "all", sort: "az", visible: PAGE_SIZE });
  $("#eventSearch").value = "";
  $("#eventSort").value = "az";
  renderEvents();
}

/* =========================================================
   8. FEATURED CAROUSEL
   ========================================================= */
function initFeatured() {
  const track = $("#featuredTrack");
  track.innerHTML = FEATURED_IDS.map((id) => {
    const e = eventById[id];
    return `
      <button class="feat-card" type="button" data-open-event="${esc(e.id)}" aria-label="${esc(e.title)} — past activity by ${esc(hostName(e))}. View details">
        ${eventCover(e)}
        <span class="feat-card__overlay"></span>
        <span class="feat-card__ribbon">${statusBadge(e)}</span>
        <span class="feat-card__body">
          <span class="feat-card__club">${esc(hostName(e))}</span>
          <h3>${esc(e.title)}</h3>
          <p>${esc(e.summary)}</p>
          <span class="feat-card__cta">View details ${icon("arrow-right")}</span>
        </span>
      </button>`;
  }).join("");

  const step = () => Math.max(track.clientWidth * 0.8, 300);
  const behavior = () => (prefersReducedMotion() ? "auto" : "smooth");
  $("#featPrev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: behavior() }));
  $("#featNext").addEventListener("click", () => track.scrollBy({ left: step(), behavior: behavior() }));
}

/* =========================================================
   9. CLUB DIRECTORY
   ========================================================= */
const clubState = { category: "all", query: "" };

function clubCardHTML(c) {
  const count = EVENTS.filter((e) => e.clubId === c.id).length;
  const cat = CLUB_CATEGORIES[c.category];
  return `
    <article class="club-card" data-open-club="${esc(c.id)}">
      <div class="club-card__top">
        ${clubCover(c)}
        <span class="club-card__monogram" style="background:linear-gradient(135deg, ${c.colors[0]}, ${c.colors[1]})" aria-hidden="true">${esc(c.monogram)}</span>
      </div>
      <div class="club-card__body">
        <span><span class="badge badge--${esc(c.category)}">${esc(cat.label)}</span></span>
        <h4 class="club-card__name">${esc(c.name)}</h4>
        <p class="club-card__sub">${esc(c.fullName)}</p>
        <p class="club-card__desc">${esc(c.description)}</p>
        <div class="tag-list">${c.focus.slice(0, 3).map((f) => `<span class="tag">${esc(f)}</span>`).join("")}</div>
        <div class="club-card__foot">
          <span>${count ? `${count} past ${count === 1 ? "activity" : "activities"}` : "No activities listed"}</span>
          <button class="club-card__link" type="button" data-open-club="${esc(c.id)}" aria-label="View ${esc(c.name)} details">View club ${icon("arrow-right")}</button>
        </div>
      </div>
    </article>`;
}

function renderClubs() {
  const q = clubState.query.trim().toLowerCase();
  const matches = (c) =>
    (clubState.category === "all" || c.category === clubState.category) &&
    (!q || [c.name, c.fullName, c.description, ...c.teams.map((t) => t.name)].join(" ").toLowerCase().includes(q));

  let total = 0;
  const html = Object.entries(CLUB_CATEGORIES).map(([key, cat]) => {
    const clubs = CLUBS.filter((c) => c.category === key && matches(c));
    total += clubs.length;
    if (!clubs.length) return "";
    return `
      <div class="club-group">
        <div class="club-group__head">
          <span class="club-group__label">${esc(cat.group)}</span>
          <h3>${esc(cat.title)}</h3>
        </div>
        <div class="club-grid">${clubs.map(clubCardHTML).join("")}</div>
      </div>`;
  }).join("");

  $("#clubGroups").innerHTML = html;
  $("#clubEmpty").hidden = total > 0;
  $$("#clubFilters .chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.value === clubState.category)));
}

function setClubFilter(category) {
  clubState.category = category;
  clubState.query = "";
  $("#clubSearch").value = "";
  renderClubs();
}

function initClubs() {
  const chips = [["all", "All Clubs"], ["technical", "Technical"], ["non-technical", "Non-Technical"], ["interdisciplinary", "Interdisciplinary"]];
  $("#clubFilters").innerHTML = chips.map(([value, label]) => {
    const count = value === "all" ? CLUBS.length : CLUBS.filter((c) => c.category === value).length;
    return `<button class="chip" type="button" data-value="${value}" aria-pressed="false">${label}<span class="chip__count">${count}</span></button>`;
  }).join("");
  $("#clubFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) { clubState.category = chip.dataset.value; renderClubs(); }
  });
  $("#clubSearch").addEventListener("input", (e) => { clubState.query = e.target.value; renderClubs(); });
  renderClubs();
}

/* =========================================================
   10. ACTIVITY TIMELINE
   ---------------------------------------------------------
   No real dates were supplied, so this groups activities by
   status and host instead of drawing a calendar grid.
   ========================================================= */
const timelineState = { filter: "all" };
const TIMELINE_FILTERS = [["all", "All"], ["upcoming", "Upcoming"], ["past", "Past Events"], ["example", "Example"]];

function renderTimeline() {
  const f = timelineState.filter;
  let list = EVENTS.filter((e) => f === "all" || e.status === f);
  // "Upcoming" only lists events that actually have a confirmed date
  if (f === "upcoming") list = list.filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date));

  $$("#timelineFilters .chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.value === f)));
  const box = $("#timeline");

  if (!list.length) {
    box.innerHTML = `
      <div class="empty-state">
        ${icon("calendar")}
        <h3>${f === "upcoming" ? "No upcoming events with confirmed dates" : "Nothing to show here"}</h3>
        <p>${f === "upcoming" ? "Upcoming events will appear here once official dates are announced by the clubs." : "Try another filter."}</p>
      </div>`;
    return;
  }

  // Group by host, keeping the club order from CLUBS
  const groups = new Map();
  list.forEach((e) => {
    const key = e.clubId || "_host";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  });
  const order = [...CLUBS.map((c) => c.id), "_host"];

  box.innerHTML = order.filter((k) => groups.has(k)).map((key) => {
    const club = clubById[key];
    const items = groups.get(key);
    return `
      <div class="tl-group">
        <div class="tl-group__head">
          <h3>${esc(club ? club.name : hostName(items[0]))}</h3>
          <p>${club ? esc(CLUB_CATEGORIES[club.category].title) : "Prototype example"} · ${items.length} ${items.length === 1 ? "entry" : "entries"}</p>
        </div>
        <div class="tl-items">
          ${items.map((e) => `
            <div class="tl-item">
              <div class="tl-item__main">
                <span class="tl-item__title">${esc(e.title)}</span>
                <span class="tl-item__meta">${statusBadge(e)} ${categoryBadges(e)} <span>${icon("calendar")}</span><span>${esc(dateText(e))}</span></span>
              </div>
              <button class="btn btn--sm btn--ghost" type="button" data-open-event="${esc(e.id)}">View Details</button>
            </div>`).join("")}
        </div>
      </div>`;
  }).join("");
}

function initTimeline() {
  $("#timelineFilters").innerHTML = TIMELINE_FILTERS.map(([value, label]) => {
    const count = value === "all" ? EVENTS.length
      : value === "upcoming" ? EVENTS.filter((e) => e.status === "upcoming" && e.date).length
      : EVENTS.filter((e) => e.status === value).length;
    return `<button class="chip" type="button" data-value="${value}" aria-pressed="false">${label}<span class="chip__count">${count}</span></button>`;
  }).join("");
  $("#timelineFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) { timelineState.filter = chip.dataset.value; renderTimeline(); }
  });
  renderTimeline();
}

/* =========================================================
   11. MODAL + HASH ROUTER
   ---------------------------------------------------------
   URLs:  #club/athera   #event/tech-quiz   #register/clubsphere-demo
   Each view gets its own history entry, so the browser Back
   button steps back through the modal views and then closes it.
   ========================================================= */
const modal = {
  root: $("#modal"),
  dialog: $("#modal .modal__dialog"),
  content: $("#modalContent"),
  returnFocus: null,
  stack: [],          // modal hashes this page pushed, so we know how far "back" to go
  internalNav: false, // true while our own code is changing the hash
  afterClose: null,   // optional callback once the modal has closed
};

const isModalHash = (h) => /^#(club|event|register)(\/|$)/.test(h);

/** Open a modal view by changing the hash (adds a history entry). */
function goToView(hash) {
  if (location.hash === hash) { route(); return; }
  modal.internalNav = true;
  modal.stack.push(hash);
  location.hash = hash;
}

/** Go back one modal view (used by "Back to club" / "Back to event"). */
function backOrGo(hash) {
  if (modal.stack.length > 1 && modal.stack[modal.stack.length - 2] === hash) {
    modal.internalNav = true;
    modal.stack.pop();
    history.back();
  } else {
    goToView(hash);
  }
}

/** Close the modal, unwinding the history entries it created. */
function requestClose(fallbackSection) {
  if (modal.stack.length) {
    const steps = modal.stack.length;
    modal.stack = [];
    modal.internalNav = true;
    history.go(-steps);
  } else {
    // Opened directly from a shared link: go to the relevant section
    modal.internalNav = true;
    const target = "#" + (fallbackSection || "home");
    if (location.hash === target) { modal.internalNav = false; route(); } else location.hash = target;
  }
}

window.addEventListener("hashchange", () => {
  if (modal.internalNav) {
    modal.internalNav = false;
  } else if (isModalHash(location.hash)) {
    // Browser back/forward between modal views
    const s = modal.stack;
    if (s.length > 1 && s[s.length - 2] === location.hash) s.pop();
    else if (s[s.length - 1] !== location.hash) s.push(location.hash);
  } else {
    modal.stack = [];
  }
  route();
});

/** Decide what to show based on the current hash. */
function route() {
  const [type, rawId] = location.hash.slice(1).split("/");
  const id = decodeURIComponent(rawId || "");
  if (type === "club" && clubById[id]) return showModal(clubDetailHTML(clubById[id]), "club");
  if (type === "event" && eventById[id]) return showModal(eventDetailHTML(eventById[id]), "event");
  if (type === "register") return showModal(registerFormHTML(eventById[id] ? id : ""), "register", initRegisterForm);
  hideModal();
}

function showModal(html, kind, onRender) {
  const wasHidden = modal.root.hidden;
  if (wasHidden) {
    modal.returnFocus = document.activeElement;
    modal.root.hidden = false;
    document.body.classList.add("no-scroll");
  }
  modal.root.dataset.kind = kind;
  modal.content.innerHTML = html;
  modal.dialog.scrollTop = 0;
  if (onRender) onRender();
  // Move focus into the dialog for keyboard and screen-reader users
  const focusTarget = $("[data-autofocus]", modal.content) || modal.dialog;
  focusTarget.focus({ preventScroll: true });
}

function hideModal() {
  if (modal.root.hidden) return;
  modal.root.hidden = true;
  modal.content.innerHTML = "";
  document.body.classList.remove("no-scroll");
  if (modal.returnFocus && document.body.contains(modal.returnFocus)) modal.returnFocus.focus({ preventScroll: true });
  if (modal.afterClose) {
    const fn = modal.afterClose;
    modal.afterClose = null;
    // Wait a moment so the browser's own scroll restoration finishes first
    setTimeout(fn, 60);
  }
}

/** Close modal then scroll to a section (e.g. "Explore Events" inside a club). */
function closeAndScrollTo(sectionId) {
  modal.afterClose = () => $("#" + sectionId).scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  const kind = modal.root.dataset.kind;
  requestClose(kind === "club" ? "clubs" : "events");
}

/* Keyboard: Escape closes, Tab stays inside the dialog */
document.addEventListener("keydown", (e) => {
  if (modal.root.hidden) return;
  if (e.key === "Escape") {
    e.preventDefault();
    requestClose(modal.root.dataset.kind === "club" ? "clubs" : "events");
  } else if (e.key === "Tab") {
    const focusables = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', modal.dialog)
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === modal.dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* One delegated click handler for every "open"/"close" control on the page */
document.addEventListener("click", (e) => {
  const t = e.target;
  const openEvent = t.closest("[data-open-event]");
  if (openEvent) { goToView("#event/" + openEvent.dataset.openEvent); return; }
  const openClub = t.closest("[data-open-club]");
  if (openClub) { goToView("#club/" + openClub.dataset.openClub); return; }
  if (t.closest("[data-close-modal]")) { requestClose(modal.root.dataset.kind === "club" ? "clubs" : "events"); return; }

  const action = t.closest("[data-action]");
  if (!action) return;
  const { action: name, id } = action.dataset;
  if (name === "back-to-club") backOrGo("#club/" + id);
  else if (name === "back-to-event") backOrGo("#event/" + id);
  else if (name === "register") goToView("#register/" + id);
  else if (name === "club-events") {
    const hasEvents = EVENTS.some((ev) => ev.clubId === id);
    resetEventFilters();
    if (hasEvents) { eventState.club = id; renderEvents(); }
    closeAndScrollTo("events");
  } else if (name === "goto-registrations") closeAndScrollTo("registrations");
});

/* ---------- Club detail view ---------- */
function clubDetailHTML(c) {
  const events = EVENTS.filter((e) => e.clubId === c.id);
  const cat = CLUB_CATEGORIES[c.category];
  return `
    <div class="modal__hero">${clubCover(c)}</div>
    <div class="modal__body">
      <div class="modal__eyebrow">
        <span class="badge badge--${esc(c.category)}">${esc(cat.label)} club</span>
        ${c.department ? `<span class="tag">${esc(c.department)}</span>` : ""}
      </div>
      <h2 class="modal__title" id="modalTitle" tabindex="-1" data-autofocus>${esc(c.name)}</h2>
      <p class="modal__sub">${esc(c.fullName)}</p>
      <p>${esc(c.description)}</p>

      <div class="modal__section">
        <h3>Focus areas</h3>
        <ul class="check-list">${c.focus.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>
      </div>

      ${c.teams.length ? `
      <div class="modal__section">
        <h3>Associated teams</h3>
        <div class="team-list">${c.teams.map((t) => `<div class="team"><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></div>`).join("")}</div>
      </div>` : ""}

      ${c.pastNote ? `
      <div class="modal__section">
        <h3>From a past program</h3>
        <div class="notice">${icon("info")}<p>${esc(c.pastNote)}</p></div>
      </div>` : ""}

      <div class="modal__section">
        <h3>Known past activities</h3>
        ${events.length ? `<div class="mini-list">${events.map((e) => `
          <div class="mini-event">
            <div>
              <div class="mini-event__title">${esc(e.title)}</div>
              <div class="mini-event__meta">${statusBadge(e)} ${categoryBadges(e)}</div>
            </div>
            <button class="btn btn--sm btn--ghost" type="button" data-open-event="${esc(e.id)}">View Details</button>
          </div>`).join("")}</div>`
        : `<p>No specific activities have been listed for ${esc(c.name)} yet. Follow official club announcements for updates.</p>`}
      </div>

      <p class="form-hint" style="margin-top:22px">Contact details and social media accounts are not listed here. Please use official CIT channels.</p>

      <div class="modal__actions">
        <button class="btn btn--primary" type="button" data-action="club-events" data-id="${esc(c.id)}">${icon("search")} Explore Events</button>
        <button class="btn btn--ghost" type="button" data-close-modal>${icon("arrow-left")} Back to Clubs</button>
      </div>
    </div>`;
}

/* ---------- Event detail view ---------- */
function eventDetailHTML(e) {
  const club = clubById[e.clubId];
  const reg = registrationInfo(e);
  const highlights = e.highlights || [
    club ? `Hosted by ${club.name}${club.department ? ` (${club.department.replace("Department of ", "")})` : ""}` : `Hosted by ${hostName(e)}`,
    ...(club ? club.focus.slice(0, 3).map((f) => `Club focus: ${f}`) : []),
  ];
  const tile = (iconName, label, value, known) => `
    <div class="info-tile">
      <div class="info-tile__label">${icon(iconName)} ${label}</div>
      <div class="info-tile__value ${known ? "" : "is-unknown"}">${esc(value)}</div>
    </div>`;

  return `
    <div class="modal__hero">${eventCover(e, statusBadge(e))}</div>
    <div class="modal__body">
      ${club ? `<button class="back-link" type="button" data-action="back-to-club" data-id="${esc(club.id)}">${icon("arrow-left")} ${esc(club.name)}</button>` : ""}
      <div class="modal__eyebrow">${statusBadge(e)} ${categoryBadges(e)}</div>
      <h2 class="modal__title" id="modalTitle" tabindex="-1" data-autofocus>${esc(e.title)}</h2>
      <p class="modal__sub">Hosted by ${esc(hostName(e))}</p>
      <p>${esc(e.description)}</p>

      <div class="modal__section">
        <h3>Event information</h3>
        <div class="info-grid">
          ${tile("calendar", "Date", dateText(e), !!formatDate(e))}
          ${tile("clock", "Time", timeText(e), !!formatTime(e))}
          ${tile("pin", "Venue", venueText(e), !!e.venue)}
          ${tile("layers", "Category", e.categories.map((c) => EVENT_CATEGORIES[c]).join(", ") || "Example", true)}
          ${tile("users", "Host", hostName(e), true)}
          ${tile("ticket", "Registration", reg.label, reg.open)}
        </div>
      </div>

      <div class="modal__section">
        <h3>Highlights</h3>
        <ul class="check-list">${highlights.map((h) => `<li>${icon("check")}<span>${esc(h)}</span></li>`).join("")}</ul>
      </div>

      <div class="reg-status-box ${reg.open ? "reg-status-box--open" : ""}">
        ${icon(reg.open ? "check" : "lock")}
        <p><strong>${esc(reg.label)}.</strong> ${esc(reg.detail)}</p>
      </div>

      ${e.status !== "example" ? `<p class="form-hint" style="margin-top:14px">Descriptions are based on the activity names and club information supplied to ClubSphere. Please verify details through official college or club announcements.</p>` : ""}

      <div class="modal__actions">
        ${reg.open
          ? `<button class="btn btn--primary" type="button" data-action="register" data-id="${esc(e.id)}">${icon("ticket")} Register</button>`
          : `<button class="btn" type="button" disabled aria-describedby="regReason">${icon("lock")} ${esc(reg.label)}</button><span class="sr-only" id="regReason">${esc(reg.detail)}</span>`}
        <button class="btn btn--ghost" type="button" data-close-modal>Close</button>
      </div>
    </div>`;
}

/* =========================================================
   12. REGISTRATION FORM + localStorage
   ---------------------------------------------------------
   Registrations are saved under the key below in THIS browser
   only. Nothing is sent to organisers or any server.
   ========================================================= */
const REG_KEY = "clubsphere-registrations";
const getRegistrations = () => {
  const list = store.get(REG_KEY, []);
  return Array.isArray(list) ? list : [];
};
const saveRegistrations = (list) => store.set(REG_KEY, list);
const openEvents = () => EVENTS.filter((e) => registrationInfo(e).open);

function registerFormHTML(eventId) {
  const options = openEvents();
  const preset = eventId && registrationInfo(eventById[eventId]).open ? eventId : options.length === 1 ? options[0].id : "";

  if (!options.length) {
    return `<div class="modal__body">
      <h2 class="modal__title" id="modalTitle" tabindex="-1" data-autofocus>No registrations open</h2>
      <p>None of the listed events currently accept registrations.</p>
      <div class="modal__actions"><button class="btn btn--ghost" type="button" data-close-modal>Close</button></div>
    </div>`;
  }

  return `
    <div class="modal__body">
      ${eventId ? `<button class="back-link" type="button" data-action="back-to-event" data-id="${esc(eventId)}">${icon("arrow-left")} Back to event</button>` : ""}
      <p class="eyebrow">Registration</p>
      <h2 class="modal__title" id="modalTitle" tabindex="-1" data-autofocus>Register for an event</h2>
      <p>Fields marked optional can be left blank. Your entry is stored only in this browser — it is <strong>not</strong> sent to organisers.</p>

      <form class="form" id="regForm" novalidate>
        <div class="form-banner" id="regBanner" role="alert" hidden>${icon("info")}<span id="regBannerText"></span></div>

        <div class="form-group">
          <label for="regEvent">Selected event</label>
          <div class="field"><select id="regEvent" name="event" required>
            <option value="">Choose an event…</option>
            ${options.map((e) => `<option value="${esc(e.id)}" ${e.id === preset ? "selected" : ""}>${esc(e.title)} — ${esc(hostName(e))}</option>`).join("")}
          </select></div>
          <p class="form-error" id="err-event"></p>
        </div>

        <div class="form__row">
          <div class="form-group">
            <label for="regName">Full name</label>
            <div class="field"><input id="regName" name="name" type="text" autocomplete="name" required aria-describedby="err-name" /></div>
            <p class="form-error" id="err-name"></p>
          </div>
          <div class="form-group">
            <label for="regEmail">College email address</label>
            <div class="field"><input id="regEmail" name="email" type="email" autocomplete="email" placeholder="name@college.edu" required aria-describedby="err-email" /></div>
            <p class="form-error" id="err-email"></p>
          </div>
        </div>

        <div class="form__row">
          <div class="form-group">
            <label for="regDept">Department</label>
            <div class="field"><input id="regDept" name="department" type="text" placeholder="e.g. AI & ML" required aria-describedby="err-department" /></div>
            <p class="form-error" id="err-department"></p>
          </div>
          <div class="form-group">
            <label for="regYear">Year of study</label>
            <div class="field"><select id="regYear" name="year" required aria-describedby="err-year">
              <option value="">Select year…</option>
              <option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option><option>Postgraduate</option>
            </select></div>
            <p class="form-error" id="err-year"></p>
          </div>
        </div>

        <div class="form-group">
          <label for="regPhone">Phone number <span class="optional">(optional)</span></label>
          <div class="field"><input id="regPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="10-digit mobile number" aria-describedby="err-phone" /></div>
          <p class="form-error" id="err-phone"></p>
        </div>

        <div class="form-group">
          <label class="checkbox"><input type="checkbox" id="regConsent" name="consent" aria-describedby="err-consent" />
            <span>I understand this is a prototype: my registration is saved only in this browser and is not shared with organisers.</span></label>
          <p class="form-error" id="err-consent"></p>
        </div>

        <div class="modal__actions">
          <button class="btn btn--primary" type="submit" id="regSubmit">${icon("ticket")} Confirm registration</button>
          <button class="btn btn--ghost" type="button" data-close-modal>Cancel</button>
        </div>
      </form>
    </div>`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validation rules — each returns an error message or "". */
const validators = {
  event: (v) => (!v ? "Please choose an event." : !eventById[v] || !registrationInfo(eventById[v]).open ? "Registration is not open for this event." : ""),
  name: (v) => (!v.trim() ? "Please enter your full name." : v.trim().length < 2 ? "Name looks too short." : !/^[\p{L} .'-]+$/u.test(v.trim()) ? "Use letters, spaces, dots, apostrophes or hyphens only." : ""),
  email: (v) => (!v.trim() ? "Please enter your college email address." : !EMAIL_RE.test(v.trim()) ? "Enter a valid email, like name@college.edu." : ""),
  department: (v) => (!v.trim() ? "Please enter your department." : ""),
  year: (v) => (!v ? "Please select your year of study." : ""),
  phone: (v) => {
    const digits = v.replace(/[\s-]/g, "");
    if (!digits) return ""; // optional
    return /^(\+91)?[6-9]\d{9}$/.test(digits) ? "" : "Enter a valid 10-digit mobile number, or leave it blank.";
  },
  consent: (checked) => (checked ? "" : "Please confirm you understand how this prototype stores data."),
};

function initRegisterForm() {
  const form = $("#regForm");
  if (!form) return;
  let submitted = false;

  const field = (n) => form.elements.namedItem(n);
  const read = () => ({
    event: field("event").value,
    name: field("name").value,
    email: field("email").value,
    department: field("department").value,
    year: field("year").value,
    phone: field("phone").value,
    consent: field("consent").checked,
  });

  const showError = (name, message) => {
    const el = $("#err-" + name, form);
    if (el) el.textContent = message;
    const group = el?.closest(".form-group");
    if (group) group.classList.toggle("has-error", !!message);
    const input = field(name);
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validateAll = () => {
    const data = read();
    let firstInvalid = null;
    Object.keys(validators).forEach((name) => {
      const msg = validators[name](data[name]);
      showError(name, msg);
      if (msg && !firstInvalid) firstInvalid = field(name);
    });
    return { data, firstInvalid };
  };

  // Live feedback: validate a field when leaving it, and while typing after the first submit
  Object.keys(validators).forEach((name) => {
    const input = field(name);
    const check = () => showError(name, validators[name](name === "consent" ? input.checked : input.value));
    input.addEventListener("blur", () => { if (input.value || submitted) check(); });
    input.addEventListener(name === "consent" || input.tagName === "SELECT" ? "change" : "input", () => { if (submitted) check(); });
  });

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    submitted = true;
    $("#regBanner").hidden = true;
    const { data, firstInvalid } = validateAll();
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Prevent duplicates: same email + same event
    const email = data.email.trim().toLowerCase();
    const existing = getRegistrations();
    if (existing.some((r) => r.eventId === data.event && r.email === email)) {
      $("#regBannerText").textContent = `${data.email.trim()} is already registered for ${eventById[data.event].title} in this browser.`;
      $("#regBanner").hidden = false;
      $("#regBanner").scrollIntoView({ block: "nearest" });
      return;
    }

    // Processing state (simulated — no network request is made)
    const btn = $("#regSubmit");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> Processing…`;
    $$("input, select", form).forEach((el) => (el.disabled = true));

    setTimeout(() => {
      const event = eventById[data.event];
      const record = {
        id: "CS-" + Date.now().toString(36).toUpperCase().slice(-6),
        eventId: event.id,
        eventTitle: event.title,
        name: data.name.trim(),
        email,
        department: data.department.trim(),
        year: data.year,
        createdAt: new Date().toISOString(),
      };
      const phone = data.phone.replace(/[\s-]/g, "");
      if (phone) record.phone = phone; // stored only if the user chose to give it

      if (!saveRegistrations([...existing, record])) {
        btn.disabled = false;
        btn.innerHTML = `${icon("ticket")} Confirm registration`;
        $$("input, select", form).forEach((el) => (el.disabled = false));
        $("#regBannerText").textContent = "Your browser blocked local storage, so the registration could not be saved.";
        $("#regBanner").hidden = false;
        return;
      }
      renderRegistrations();
      showSuccess(record);
    }, 900);
  });
}

function showSuccess(r) {
  modal.content.innerHTML = `
    <div class="modal__body success">
      <div class="success__icon">${icon("check")}</div>
      <h2 class="modal__title" id="modalTitle" tabindex="-1" data-autofocus>You're registered!</h2>
      <p>Your registration for <strong>${esc(r.eventTitle)}</strong> has been saved in this browser.</p>
      <div class="success__ticket">
        <div><span>Reference:</span> ${esc(r.id)}</div>
        <div><span>Name:</span> ${esc(r.name)}</div>
        <div><span>Email:</span> ${esc(r.email)}</div>
        <div><span>Year:</span> ${esc(r.year)} · ${esc(r.department)}</div>
      </div>
      <p class="form-hint">Prototype notice: this confirmation exists only on this device. It has not been sent to organisers or the college.</p>
      <div class="modal__actions">
        <button class="btn btn--primary" type="button" data-action="goto-registrations">View my registrations</button>
        <button class="btn btn--ghost" type="button" data-action="back-to-event" data-id="${esc(r.eventId)}">${icon("arrow-left")} Back to event</button>
      </div>
    </div>`;
  $("#modalTitle").focus();
}

/* "Your registrations" list on the page */
function renderRegistrations() {
  const list = getRegistrations();
  $("#regList").innerHTML = list.map((r) => `
    <li class="reg-item">
      <div>
        <div class="reg-item__title">${esc(r.eventTitle || eventById[r.eventId]?.title || "Event")}</div>
        <div class="reg-item__meta">${esc(r.name)} · ${esc(r.year)} · Ref ${esc(r.id)} · ${new Date(r.createdAt).toLocaleDateString("en-IN")}</div>
      </div>
      <button class="icon-btn" type="button" data-remove-reg="${esc(r.id)}" aria-label="Remove registration for ${esc(r.eventTitle)}">${icon("trash")}</button>
    </li>`).join("");
  $("#regEmpty").hidden = list.length > 0;
  $("#clearRegs").hidden = list.length === 0;
}

function initRegistrations() {
  $("#openRegister").addEventListener("click", () => goToView("#register"));
  $("#regList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-reg]");
    if (!btn) return;
    saveRegistrations(getRegistrations().filter((r) => r.id !== btn.dataset.removeReg));
    renderRegistrations();
    showToast("Registration removed from this browser.");
    $("#openRegister").focus();
  });
  $("#clearRegs").addEventListener("click", () => {
    if (!window.confirm("Remove all registrations saved in this browser?")) return;
    saveRegistrations([]);
    renderRegistrations();
    showToast("All local registrations cleared.");
  });
  renderRegistrations();
}

/* =========================================================
   13. NEWSLETTER, SCROLL-TO-TOP, SCROLL REVEAL
   ========================================================= */
function initNewsletter() {
  const form = $("#newsletterForm");
  const input = $("#newsletterEmail");
  const msg = $("#newsletterMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    msg.className = "form-msg";
    if (!value) { msg.textContent = "Please enter your email address."; msg.classList.add("is-error"); input.focus(); return; }
    if (!EMAIL_RE.test(value)) { msg.textContent = "That email doesn't look right — try name@college.edu."; msg.classList.add("is-error"); input.focus(); return; }
    // Deliberately NOT stored or sent anywhere.
    msg.textContent = "Looks good! This is a prototype, so no mailing list is connected — your email was not saved or sent.";
    msg.classList.add("is-success");
    form.reset();
  });
}

function initScrollTop() {
  const btn = $("#scrollTop");
  window.addEventListener("scroll", () => btn.classList.toggle("is-visible", window.scrollY > 700), { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    $(".logo").focus({ preventScroll: true });
  });
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   14. START-UP
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initTheme();
  initNav();
  initHero();
  initEvents();
  initFeatured();
  initClubs();
  initTimeline();
  initRegistrations();
  initNewsletter();
  initScrollTop();
  initReveal();
  route(); // open a modal if the page was loaded with e.g. #event/tech-quiz
});
