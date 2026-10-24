# CIT ClubSphere

A discovery platform for the clubs and campus activities of Chennai Institute of Technology (CIT), built with plain **HTML, CSS and JavaScript**.

> **Independent student prototype.** This is not an official CIT platform and is not endorsed by the college or any club. Registrations are saved **only in your own browser** (localStorage). They are never sent to organisers, the college, or any server.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Page structure: navigation, hero, events, featured, clubs, timeline, registration desk, about, newsletter, footer, plus the inline SVG icon set |
| `style.css` | All styling: dark/light themes, layout, animations, responsive rules |
| `script.js` | All content data (clubs and events) and every interaction |

No other files are needed. Icons are inline SVG and event images are generated SVG art, so nothing breaks offline. Google Fonts (Inter and Space Grotesk) load when you're online. Offline, the page uses your system font instead.

---

## 1. Run it on your Mac

**Option A: double-click**

1. Open Finder and go to `Desktop › My project › cit-clubsphere`.
2. Double-click `index.html`. It opens in your default browser.

**Option B: a local web server**

Some browsers restrict `file://` pages, so a local server is a good fallback. Open **Terminal** and run:

```bash
cd ~/Desktop/"My project"/cit-clubsphere && python3 -m http.server 8000
```

Then visit <http://localhost:8000>. Press `Ctrl + C` in Terminal to stop the server. macOS includes `python3`. If it asks you to install the developer tools, accept.

---

## 2. Add a new club

Open `script.js`, find the `CLUBS` array (section 1), and add an object:

```js
{
  id: "robotics",                         // unique, lowercase, no spaces
  name: "Robotics Club",
  fullName: "Short tagline or full name",
  category: "technical",                  // "technical" | "non-technical" | "interdisciplinary"
  department: null,                       // or "Department of ..."
  description: "One or two accurate sentences.",
  focus: ["Robotics", "Embedded systems"],
  teams: [],                              // e.g. [{ name: "TEAM", role: "Dance team associated with ..." }]
  theme: "circuit",                       // neural | circuit | bold | builder | stage | editorial | media | blend
  colors: ["#06b6d4", "#34d399"],         // monogram gradient
  monogram: "RC",
  image: null,
},
```

The club card, the category counts, the club filter dropdown and the club detail view all update automatically.

## 3. Add a new event

Add an object to the `EVENTS` array:

```js
{
  id: "robo-race-2027",
  title: "Robo Race",
  clubId: "robotics",                     // must match a club id
  categories: ["technical", "competitions"], // technical, non-technical, workshops, competitions, cultural, interdisciplinary
  status: "upcoming",                     // "past" | "upcoming" | "tba" | "example"
  date: "2027-02-14",                     // YYYY-MM-DD, or null if not confirmed
  startTime: "10:00 AM",                  // or null
  endTime: "1:00 PM",                     // or null
  venue: "Main Auditorium",               // or null  ->  shows "Venue to be announced"
  registrationOpen: true,                 // only when registration is officially open
  summary: "One-line card text.",
  description: "Longer description for the details view.",
  highlights: ["Optional bullet", "Another"], // optional
  image: null,
},
```

How the site handles this data:
- **Missing values are never invented.** A `null` date, time or venue shows as "to be announced" (or "not supplied" for past events).
- **Past events can't take registrations.** If `status` is `"past"`, the Register button is always disabled, whatever `registrationOpen` says.
- **Upcoming needs a date.** The timeline lists an event under "Upcoming" only when it has a `date`.
- **Featured carousel.** To show an event there, add its `id` to `FEATURED_IDS`.
- **Demo entry.** Once real events with open registration exist, you can delete the `clubsphere-demo` entry.

## 4. Use real photos

1. Create an `images` folder next to `index.html`.
2. Copy your photos in, for example `images/cinema-vattaram.jpg`. A 1600×900 JPG or WebP under about 300 KB works well.
3. Set the `image` field on that event or club:

   ```js
   image: "images/cinema-vattaram.jpg",
   ```

If a photo is missing or its path is wrong, the generated cover art shows instead, so you never get a broken image. Only use photos you have permission to publish.

## 5. What would need a backend

This prototype works entirely in the browser. Real registrations shared with organisers would need:

- **A database and API.** Store registrations centrally (for example Firebase/Firestore, Supabase, or your own Node/Express + PostgreSQL server).
- **Authentication.** Verify students, ideally by signing in with their college email.
- **An organiser dashboard.** Clubs can view, export and manage registrations, with role-based access.
- **Server-side validation.** Re-check every field, enforce duplicate and capacity limits, and add rate-limiting and spam protection.
- **Notifications.** Send confirmation emails through a transactional email service, plus a real newsletter or mailing list with opt-in and unsubscribe.
- **Content management.** Let club admins publish confirmed dates, venues and images without editing code.
- **Privacy and compliance.** Write a privacy notice, set data-retention rules, and get official approval from the college before you collect student data.

## Testing checklist (verified)

- Homepage loads with no console errors; no broken images.
- All 8 clubs appear in the correct categories (Technical 4, Non-Technical 3, Interdisciplinary 1).
- All 11 supplied activity names appear in the events grid, featured carousel and timeline, labelled **Past Event**.
- Search (by event or club name), category filters, club filter, A→Z / Z→A / by-club sort, "Show more" and the empty state all work.
- Club and event details open and close with the close button, the Escape key, the backdrop and the browser Back button. Focus stays inside the dialog and returns to the button that opened it.
- Registration: required-field, email and phone validation; processing state; confirmation screen; duplicate prevention (same email + event); entries persist after a reload and can be removed.
- Dark/light toggle is remembered between visits; the mobile hamburger menu works; no horizontal scrolling down to 280px wide; reduced-motion is respected.
