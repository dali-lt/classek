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
- If the statement of an `html` exercise names an external file (`style.css`, `script.js`), the editor shows one tab per file, like a real editor (index.html, style.css, script.js), and the live result links them as a browser would: the page must contain `<link href="style.css">` / `<script src="script.js">`. The answers are saved as boxes 0 (page), 1, 2.
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
