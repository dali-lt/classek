# Chapter format

How to write a chapter (course + exercises + quiz) and publish it with `admin-upload.html`.

> Keep chapter and exercise IDs stable once published: student progress is stored by `chapterId` and `exId`, so renaming an ID resets that progress.

## 1. Data model

```
chapters/{chapterId}                                    level, subject, title, rappel, published
chapters/{chapterId}/exercises/{exId}                   statement, hint, difficulty, lang, viz
chapters/{chapterId}/exercises/{exId}/private/solution  { text }
users/{uid}/progress/{chapterId}                        { status: { exId: "done" | "review" } }
```

- Programmation chapters: upload with the matching "Bac · Programmation" type.
- STI chapters use `"level": "bac"`, `"subject": "sti"` (upload with the "Bac · STI" type).

## 2. Code blocks in lessons, statements and solutions

Code fences are coloured by language: `html`, `css`, `js`, `php`, `sql`.

| Fence | What it shows |
|---|---|
| `html` | the code **and its result**, with an "Essayer" button to edit it live |
| `htmlsrc` | the code only (e.g. a page with errors to correct) |
| `htmlview` | the result only, titled "Résultat attendu" (the page to reproduce) |
| `svg` | a figure drawn inline in a lesson |

Notes:
- `svg` is cleaned before display: no script, link or external url. Use `style="fill:var(--color-primary)"` to follow the site colours.
- An exercise with `"lang": "html"` gets a **live result frame** under its answer box (sandboxed, so the student's scripts cannot touch the site) and the HTML helper buttons (`<` `>` `</` `"` `=` `/>`).
- A code fence can name its file after the language (` ```html index.html `, ` ```css style.css `, ` ```js script.js `). Named fences written one after the other (in a lesson or in a solution) become **one window with a tab per file**; with an `html` first file it has the Run button, which links the files like a browser.
- If the statement of an `html` exercise names an external file (`style.css`, `script.js`), including as inline code, the editor shows one tab per file, like a real editor (index.html, style.css, script.js), and the live result links them as a browser would: the page must contain `<link href="style.css">` / `<script src="script.js">`. The answers are saved as boxes 0 (page), 1, 2. Optional `files` entries are also detected alongside names in the statement.
- The code windows of web exercises check what the student types (`JS/weblint.js`): a tag never closed or unknown, a CSS property that does not exist, a missing `;` `}` `)`, a JavaScript syntax error. The line stays marked (red number and band) until it is fixed, and the first message is shown under the code. Nothing is executed: JavaScript is only compiled.
- The uploader stores each exercise's `lang` and `viz` fields.

## 3. Quiz (weekly bilan)

Questions live in the chapter JSON, in a `quiz` list (same shape as the placement test, without `topic`):

```json
"quiz": [
  { "id": "ts01", "d": 1, "q": "…", "code": "optional code", "choices": ["…", "…", "…", "…"], "answer": 0, "explain": "…" }
]
```

Upload the chapter again from `admin-upload.html` to publish its quiz. A chapter with no quiz falls back to level-test questions.

How the bilan works:
- A **study day** is a day (Tunisia time) on which the student pressed "J'ai compris" on at least one exercise. Days need not be consecutive.
- After **7 study days** the home calendar shows a "Commencer le bilan" button. The count waits at 7/7 until the bilan is taken, then restarts at 0.
- The bilan has about 10 questions: mostly from the chapters worked on during the cycle, plus 2 from older chapters the student already started. Questions not seen in the previous bilan come first.
- Firestore: `users/{uid}/progress/cycle` (days, chapters touched, recent dates) and `users/{uid}/progress/bilans` (last 12 results). Both are covered by the existing `progress/{doc}` rule.

## 4. Examples

<!-- Paste here the content of EXEMPLE-viz.md (fence examples) -->

<!-- Paste here the content of exemple-a-retenir.md (the "à retenir" example) -->

## 5. Séries (by difficulty) and Devoirs (Bac papers)

A série or a devoir is a normal chapter file with a few extra fields. It is uploaded the same way (`admin-upload.html`, same type: "Bac · Programming" …), lives in the same `chapters` collection, and uses the same exercise page (answer box, hints, solution, "J'ai compris"). It does **not** appear in the Chapitres tab, and it does not count in the chapter totals or the weekly bilan: it appears in the **Séries** or **Devoirs** tab of its subject.

| Field | Used by | Meaning |
|---|---|---|
| `kind` | both | `"serie"` or `"devoir"` (missing = normal chapter) |
| `serieLevel` | série | `1` Facile · `2` Moyen · `3` Difficile · `4` Très difficile (required) |
| `topics` | série | up to 3 short labels shown as chips (or the single `topic`) |
| `minutes` | série | estimated time, shown on the card |
| `session` | devoir | `"principale"`, `"controle"` or `"pratique"` (other = "Autres devoirs") |
| `hours`, `points` | devoir | shown on the card (3 h, 20 points) |

How the levels open: a level opens when **70 %** of the exercises of the levels before it (that have series) are finished. Level 1 is always open. A level with no series yet is shown as "Bientôt" and does not block the next one.

How a devoir's correction is revealed gradually (no new code, it is the exercise page): the student first types an answer, then opens the hints one by one (`hints[0]` = **Indice**, `hints[1]` = **Méthode**), and the **Correction** (`solution`) unlocks after the thinking time (`think`, in seconds; default 360 s for `"difficulty": "bac"`).

Examples: `docs/exemple-serie.json`, `docs/exemple-devoir.json`.


### Devoir affiché comme une feuille d'examen

Un devoir peut avoir un champ `paper` (texte markdown : tout l'énoncé, tableaux écrits `| a | b |`) : il s'affiche sur une feuille blanche, d'un seul tenant. Les `exercises` du fichier deviennent la correction (`label` + `solution`), qui s'ouvre après le temps de réflexion `think` (secondes, 900 par défaut).
