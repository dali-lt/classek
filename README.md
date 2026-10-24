# Classek

Classek ("ta classe", in Tunisian Arabic) is a learning space for Tunisian Bac informatique students: courses, exercises with solutions, algorithm animations, and an ideas box so students help shape the site. It also includes a teacher tool (students, calendar, payments).

- **For teachers**: manage students, groups, a calendar and monthly payments in one place.
- **For students**: a learning space with a placement test, chapters and exercises (informatique, Bac level), growing step by step.

Built with plain **HTML, CSS and JavaScript** (no framework, no build step) and **Firebase** for accounts and cloud storage.

Live site: https://dali-lt.github.io/classek

## Features

### Teacher side
- **Student list**: add, edit and delete students, with search and filters by level and group
- **Fields per student**: first name, last name, level (7th-9th grade / Lycée 1st-4th form), start date, end date, optional notes, avatar
- **Dashboard**: total students, number of groups, Collège vs Lycée split, students per level, days left per student
- **Calendar**: monthly view of start dates, end dates and group study days, with a day-by-day event list
- **Groups**: assign students to groups with recurring study days (Mon-Sat), filter calendar events by group
- **Payments**: monthly income, paid / unpaid amounts, per-student payment history, "Mark paid", and a half-month / custom amount calculator
- **Backups**: export and import your data as a file

### Student side
- Sign in with Google, choose "teacher" or "student" at account creation
- **Placement test** (Programmation + STI/Web domains) with a result per domain, a level badge and an answer review; offered on the first visit and skippable
- Profile (name, gender, phone, level, avatar) and settings, delete account
- Chapters list (exercises and solutions are being added)

### General
- **Bilingual UI**: French and Arabic (Tunisian dialect) with one click (dates and level names adapt; the teacher app also offers English)
- **Accounts**: Google sign-in, account page, sign out, delete account
- **Cloud sync**: data is saved to the cloud and follows you across devices
- **Responsive design**: works on desktop and mobile

## Weekly bilan

- A **study day** is a day (Tunisia time) on which the student pressed "J’ai compris" on at least one exercise. Days need not be consecutive.
- After **7 study days** the home calendar shows a "Commencer le bilan" button. The count waits at 7/7 until the bilan is taken, then restarts at 0.
- The bilan has about 10 questions: mostly from the chapters worked on during the cycle, plus 2 from older chapters the student already started. Questions not seen in the previous bilan come first.
- Questions live in the chapter JSON, in a `quiz` list (same shape as the placement test, without `topic`):

```json
"quiz": [
  { "id": "ts01", "d": 1, "q": "…", "code": "optional code", "choices": ["…", "…", "…", "…"], "answer": 0, "explain": "…" }
]
```

  Upload the chapter again from `admin-upload.html` to publish its quiz. A chapter with no quiz falls back to level-test questions.
- Firestore: `users/{uid}/progress/cycle` (days, chapters touched, recent dates) and `users/{uid}/progress/bilans` (last 12 results). Both are covered by the existing `progress/{doc}` rule.

## Project structure

```
index.html        Welcome page: Google sign-in / create account + role choice
teacher.html      Teacher app (students, calendar, payments)
student.html      Student app (placement test, profile, chapters)
admin-upload.html Admin-only page to upload a chapter JSON to Firestore
CSS/              style.css, welcome.css, test.css, chapters.css
JS/               welcome.js, script.js (teacher app), student.js,
                  chapters.js, cycle.js (study days + bilan questions), firebase-config.js, firebase-sync.js, sync-core.js
data/             placement-test.json
Images/           logos and illustrations
```

## Getting started

1. Clone or download the repo.
2. Create a Firebase project and enable **Authentication** (Google provider) and **Firestore**.
3. Paste your web app config in `JS/firebase-config.js`.
4. Publish `firestore.rules` (Firebase console → Firestore → Rules).
5. Add your site domain in Authentication → Settings → Authorized domains.
6. Serve the folder (GitHub Pages, or any static server) and open `index.html`.

## Firestore data model

```
users/{uid}/meta/account      { role: "teacher" | "student", createdAt }
users/{uid}/meta/profile      teacher or student details
users/{uid}/meta/groups       { items: [...] }
users/{uid}/students/{id}     one document per student (teacher side)
users/{uid}/progress/placement  placement test result (student side)
users/{uid}/progress/{chapterId}  { status: { exId: "done" | "review" } }
chapters/{chapterId}          course content: level, subject, title, rappel, published
chapters/{chapterId}/exercises/{exId}                  statement, hint, difficulty
chapters/{chapterId}/exercises/{exId}/private/solution { text }
```

The role decides which app a user lands on (`teacher.html` or `student.html`). Teacher and student data live in separate sub-collections of the user's own space, and there is no link between a teacher and a student yet.

### Using GitHub Pages

Settings → Pages → deploy from the `main` branch. Remember to add your GitHub Pages domain in Firebase Authentication → Settings → Authorized domains.

## Data & privacy

- Data is stored in Firebase (Firestore) under the signed-in account.
- Access is controlled by **Firestore Security Rules** (`firestore.rules`), not only by the interface: each user can only read and write documents under their own `users/{uid}`.
- The Firebase web config is not secret; the rules are what protect the data.
- Placement test questions and answers are served as a static file, so they are public. Do not put paid or private content in this repo.
- "Delete account" removes the account; "Clear all data" erases the teacher's data and cannot be undone.

## Tech stack

- HTML5, CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript
- Firebase Authentication + Firestore
- Google Fonts

## Roadmap

- [x] Payment / fees tracking per student
- [x] Export / import data
- [x] Accounts and cloud sync
- [x] Student side with placement test
- [ ] Student chapters: summary, graded exercises, detailed solutions
- [ ] Progress tracking for students
- [ ] Short quizzes
- [ ] Optional link between a teacher and their students
- [ ] Dark mode toggle

## License

Free to use and modify for personal or educational purposes.
