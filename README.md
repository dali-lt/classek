# Classek

Classek ("ta classe", in Tunisian Arabic) is a learning space for Tunisian **Bac informatique** students: courses, graded exercises with solutions, a live HTML playground, a placement test and a weekly quiz, plus an ideas box so students help shape the site.

Built with plain **HTML, CSS and JavaScript** (no framework, no build step) and **Firebase** for accounts and cloud storage.

Live site: [https://dali-lt.github.io/classek](https://dali-lt.github.io/classek)

## Features

- **Sign in with Google**; the student profile (name, gender, phone, level, avatar) can be edited at any time
- **Placement test** (Programmation + STI/Web domains) with a result per domain, a level badge and an answer review; offered on the first visit and skippable
- **Subjects and chapters**: Programmation (algorithms, Python, Bac-type exercises) and STI (Web, HTML, CSS)
- **Exercises**: lesson summary, graded exercises (easy / medium / Bac level), hints, solutions, "J'ai compris" / "À revoir" marking and a free-thinking timer
- **HTML playground** for STI exercises: a live, sandboxed result frame with helper buttons
- **Personal notes** per chapter
- **Progress tracking**: overall percentage, exercises done / to review / remaining, and "resume where you stopped"
- **Weekly bilan**: a short quiz after 7 study days
- **Ideas box**: students can send feedback and suggestions
- **Bilingual UI**: French and Arabic with one click
- **Cloud sync**: progress follows you across devices
- **Responsive design**: works on desktop and mobile

## Writing chapters

Chapter JSON format, code-block types (`html`, `htmlsrc`, `htmlview`, `svg`), quiz format and the weekly bilan rules are documented in [docs/chapter-format.md](docs/chapter-format.md). Chapters are uploaded from `admin-upload.html` (admin only).

## Project structure

```
index.html        Welcome page: Google sign-in / create account
student.html      Student app (placement test, profile, chapters, exercises)
admin-upload.html Admin-only page to upload a chapter JSON to Firestore
CSS/              style.css, welcome.css, test.css, chapters.css
JS/               welcome.js, student.js, chapters.js, cycle.js
                  (study days + bilan questions), firebase-config.js,
                  firebase-sync.js, sync-core.js
Images/           logos and illustrations
docs/             chapter-format.md
```

## Getting started

1. Clone or download the repo.
2. Create a Firebase project and enable **Authentication** (Google provider) and **Firestore**.
3. Paste your web app config in `JS/firebase-config.js`.
4. Write your Firestore security rules (Firebase console → Firestore → Rules).
5. Add your site domain in Authentication → Settings → Authorized domains.
6. Serve the folder (GitHub Pages, or any static server) and open `index.html`.

### Using GitHub Pages

Settings → Pages → deploy from the `main` branch, then add the GitHub Pages domain in Firebase Authentication → Settings → Authorized domains.

## Firestore data model

```
users/{uid}/meta/account          { role, createdAt }
users/{uid}/meta/profile          student details
users/{uid}/progress/placement    placement test result
users/{uid}/progress/{chapterId}  { status: { exId: "done" | "review" } }
users/{uid}/progress/cycle        study days and chapters touched (weekly bilan)
users/{uid}/progress/bilans       last bilan results
chapters/{chapterId}              course content: level, subject, title, rappel, published
chapters/{chapterId}/exercises/{exId}                   statement, hint, difficulty
chapters/{chapterId}/exercises/{exId}/private/solution  { text }
```

## Data & privacy

- Data is stored in Firebase (Firestore) under the signed-in account.
- Access is controlled by **Firestore Security Rules**, not only by the interface: each user can only read and write documents under their own `users/{uid}`.
- The Firebase web config is not secret; the rules are what protect the data.
- Placement test questions and answers are served as a static file, so they are public. Do not put paid or private content in this repo.
- "Delete account" removes the account and its data.

## Tech stack

- HTML5, CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript
- Firebase Authentication + Firestore
- Google Fonts

## Roadmap

- More chapters (Programmation and STI)
- Dark mode toggle

## License

Free to use and modify for personal or educational purposes.
