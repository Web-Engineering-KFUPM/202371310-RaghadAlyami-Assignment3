# AI Usage Report

I Raghad Alyami 202371310 declare on Saturday 21st of NOV 2026 that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

## Tools Used and Use Cases

In Assignment 1 my AI report was too short, and in Assignment 2 the AI wrote most of the feature code for me. For this assignment I changed how I worked: I asked ChatGPT to give me code **with blanks** so I had to complete the important logic myself, and I recorded what it suggested, what I decided, what I changed, and how I tested it.

I used AI to:

- turn the Assignment 3 instructions into a to-do list and track my progress
- decide which API to add (I chose my GitHub profile instead of a repository list, because I only have a few public repos)
- get fill-in-the-blank templates for the GitHub card, the contact form validation, and the light/dark theme
- review my code before each commit and explain why a test failed
- read my Lighthouse reports and rank the problems by importance
- write first drafts of my README and technical documentation
- organize my AI evidence and write this report.

## AI Tools Used

- ChatGPT (GPT-6): Planning, fill-in-the-blank code templates, code review, debugging, Lighthouse analysis, commit messages, and first drafts of my README and technical documentation (conversation C01, artifacts A01–A18).

- Claude (Claude app) Claude Opus 5.5: Organizing and renaming my AI evidence files and drafting this AI usage report from the evidence and my commit history (conversation C02, artifact A19).

## Benefits and Challenges

- The blanks made me write the logic myself: `response.ok`, `response.json()`, the four validation conditions, and the `localStorage` calls. This is why the GitHub and theme code in my final version is my own structure, not a copy of the template.

- ChatGPT read my 25-page Lighthouse report and pointed out the real problems: images up to 561 KiB larger than needed, low contrast on the `.btn-primary` buttons, a missing favicon (404 error), and a missing meta description. It also told me which warnings were caused by Live Server, so I didn't waste time on them.

- It only checked my code by reading it. It said it could not run it in a browser, so I had to test every feature myself.

- Some explanations did not match my code. When my site opened in dark mode, ChatGPT said its template always starts in light mode, but my version follows the device setting with `prefers-color-scheme`. I had to understand my own code to see that this was the expected behavior.

- The "Name error" test case failed at first. ChatGPT first guessed it was the HTML `required` attribute, but `required` only checks for an empty field. It then asked me to check that the `name.length < 2` condition was in my function and the file was saved, and to look at the Console, and I re-tested before committing.

- When I sent my Lighthouse reports, it noticed that the report I called "before the fixes" already had the image improvements, so I had to be careful about which report was which.

## Learning Outcomes

- Fetching data: `fetch()` does not fail on a 404 or 403, so I check `response.ok` and throw an error myself. `response.json()` turns the response into a JavaScript object.

- Fallback values: `user.name || user.login` and `user.bio || "No bio yet."` show something useful when a field is missing.

- Error states: `showGitHubState()` uses `state !== "loading"` style comparisons so only one of the loading, success, or error boxes is visible. The Try again button only appears in the error state.

- Image size from an API: GitHub avatars can be resized with `&s=176`, which is 2× the 88 px display size, so the image is sharp but much smaller.

- Validation logic: `trim()` removes spaces, `||` checks if any field is empty, `emailPattern.test(email)` checks the email format, and `return` stops the function at the first failed rule so the user sees one clear message.

- State management: `localStorage.setItem("theme", ...)` saves the choice and `getItem` reads it on the next visit. The `data-theme` attribute on `<html>` switches all the CSS variables at once.

- Avoiding a flash of the wrong theme: the small script in `<head>` sets the theme before the page is drawn. `matchMedia("(prefers-color-scheme: dark)")` follows the device setting on a first visit. `try/catch` keeps the toggle working if the browser blocks storage.

- CSS variables: a hardcoded `background-color: #eaaeb9` on my Send Message button was why it did not change with the theme. Replacing hardcoded colors with variables fixed it.

- Performance: Largest Contentful Paint was 4.1 s because of large JPEG images. Converting them to WebP (≈560 KB → ≈106 KB), adding `loading="lazy"`, and adding `width`/`height` brought it to 1.1 s with no layout shift.

- Accessibility: white text on my pink `#f96983` did not reach the WCAG 4.5:1 contrast ratio, so I added a darker `--accent-strong` for buttons.

- Lighthouse scores went from 87 / 96 / 96 / 91 to 100 / 100 / 100 / 100 in both light and dark mode.

- Git: adding a second `-m` to `git commit` puts the `Assisted-by:` line in the commit body.

## Responsible Use and Modifications

I asked for code with blanks instead of finished code, filled in the blanks myself, and then changed the code to fit my portfolio. My GitHub card follows the same loading/success/error, timeout and retry pattern as my Assignment 2 quote widget, and my theme code uses an early `<head>` script and an `applyTheme()` function instead of the template's `updateThemeButton()`. For the Lighthouse fixes I chose my own solutions: a darker `--accent-strong` variable instead of the suggested `--primary-btn-bg`, an inline SVG emoji favicon instead of a PNG file, and my own meta description. I did not apply every suggestion, for example rewording the 403 error message. I tested each feature in the browser (wrong username, offline, theme refresh, every validation case), checked phone, tablet and desktop sizes in DevTools, re-ran Lighthouse after every round of fixes, and credited AI with `Assisted-by: ChatGPT (GPT-6)` in each AI-assisted commit. I rewrote and expanded the AI drafts of my README and technical documentation so they describe my final code.

## AI Usage Log

| ID  | Tool (model)       | Date       | Purpose | Files affected | What you changed and how you verified it |
| --- | ------------------ | ---------- | ------- | -------------- | ---------------------------------------- |
| C01 | ChatGPT (GPT-6)    | 21/11/2026 | Main working conversation for Assignment 3: to-do list, choosing features, code templates with blanks, code review, debugging, Lighthouse analysis, commit messages, and documentation drafts. | `index.html`, `css/styles.css`, `js/script.js`, `assets/images/`, `README.md`, `docs/technical-documentation.md` | Used the to-do list to plan my work but did not build its suggested repository list or filter/sort, because I only have a few public repos. Chose a GitHub profile card instead. Each feature was tested in the browser before committing (commits `7f6e231`, `c338a94`, `868ca6e`, `1210cc5`, `86fb26c`, `5b27b27`). |
| A01 | ChatGPT (GPT-6)    | 21/11/2026 | HTML template with blanks for the GitHub profile card. | `index.html` | Expanded it into separate loading, success and error boxes inside `aria-live`, added a stats list and a Try again button, and wrote "View profile on GitHub" as the link text. Checked that all IDs match the JavaScript. |
| A02 | ChatGPT (GPT-6)    | 21/11/2026 | `loadGitHubProfile()` with blanks (username, `ok`, `json`, `name`, `avatar_url`, `html_url`). | `js/script.js` | Filled in the blanks, then restructured it with `showGitHubState()`, `getGitHubErrorMessage()`, an 8-second `AbortController` timeout and a retry button, following my Assignment 2 quote widget. Added `user.name \|\| user.login`. Tested with my real username, a wrong username (error message appears), and offline mode. |
| A03 | ChatGPT (GPT-6)    | 21/11/2026 | `checkMessage()` validation with blanks: empty fields, name length, email format, message length. | `js/script.js`, `index.html` | Completed the four conditions, rewrote the error messages in my own words, and added `contactForm.reset()` after success. Tested all five cases from the test table. The "Name error" case failed at first; I followed ChatGPT's checklist and re-tested until a one-letter name showed the name-length message. |
| A04 | ChatGPT (GPT-6)    | 21/11/2026 | Theme toggle button HTML with blank label. | `index.html` | Used "🌙 Dark mode" / "☀️ Light mode" as labels and gave the button a `theme-toggle` class for styling. |
| A05 | ChatGPT (GPT-6)    | 21/11/2026 | New `--page-bg` and `--header-bg` CSS variables for the light theme. | `css/styles.css` | Kept only `--header-bg` and used it for the header, footer and buttons. I did not add `--page-bg`; the dark page background is set in a `[data-theme="dark"] body` rule instead. Later darkened `--header-bg` for contrast (see A15). |
| A06 | ChatGPT (GPT-6)    | 21/11/2026 | Dark theme variables with blanks. | `css/styles.css` | Chose my own dark colors on a `[data-theme="dark"]` selector, with `color-scheme: dark` and comments on the contrast choices. Also replaced the hardcoded Send Message button color with a variable after noticing it did not change with the theme. Checked every section in both themes. |
| A07 | ChatGPT (GPT-6)    | 21/11/2026 | Theme toggle JavaScript with `localStorage` blanks. | `js/script.js`, `index.html` | Filled in `getItem`/`setItem`, then rewrote it: a small script in `<head>` applies the saved theme (or the device setting) before the page is drawn, `applyTheme()` updates the page and button, and `try/catch` handles blocked storage. Tested toggling, refreshing, and clearing `localStorage`. |
| A08 | ChatGPT (GPT-6)    | 21/11/2026 | Lazy loading blank for the Wasm image. | `index.html` | Added `loading="lazy"`. Replaced by A10 when the image was converted to WebP. |
| A09 | ChatGPT (GPT-6)    | 21/11/2026 | Lazy loading blank for the pedestrian light image. | `index.html` | Added `loading="lazy"`. Replaced by A10 when the image was converted to WebP. |
| A10 | ChatGPT (GPT-6)    | 21/11/2026 | WebP image paths and lazy loading after the first Lighthouse report. | `index.html`, `assets/images/` | Resized and converted both images to WebP (≈560 KB → ≈106 KB) and deleted the old JPEGs. Added `width`/`height` instead of `decoding="async"` to prevent layout shift. Lighthouse Performance went from 87 to 100 and LCP from 4.1 s to 1.1 s. |
| A11 | ChatGPT (GPT-6)    | 21/11/2026 | Smaller GitHub avatar using the `s` size parameter. | `js/script.js` | Used `user.avatar_url + "&s=176"` instead of the `URL` object, with a comment explaining 176 = 2 × 88 px. Checked that the avatar still loads and looks sharp. |
| A12 | ChatGPT (GPT-6)    | 21/11/2026 | Darker primary button color for contrast. | `css/styles.css` | Added `--accent-strong: #c2185b` instead of the suggested `--primary-btn-bg` and a darker hover color. Lighthouse no longer flagged `#github-link` or `#new-quote-btn`. |
| A13 | ChatGPT (GPT-6)    | 21/11/2026 | Favicon link to fix the 404 error. | `index.html` | Used an inline SVG emoji favicon (💻) instead of a separate PNG file, so no extra file is needed. The favicon 404 disappeared from the Console. |
| A14 | ChatGPT (GPT-6)    | 21/11/2026 | Meta description with blanks. | `index.html` | Wrote my own description that only mentions what the site really shows (projects, live GitHub data, contact details). SEO went from 91 to 100. |
| A15 | ChatGPT (GPT-6)    | 21/11/2026 | Header and heading text color variables for light-mode contrast. | `css/styles.css` | Instead of new `--header-text`/`--heading-text` variables, I darkened `--header-bg` and `--accent` and kept the original pink accent in dark mode. Light-mode Accessibility went from 96 to 100. |
| A16 | ChatGPT (GPT-6)    | 21/11/2026 | Rules to apply the header/heading variables. | `css/styles.css` | Replaced my hardcoded heading colors (`#ff728c`, `#fd5070`) with `var(--accent)`. Rechecked contrast with Lighthouse in both themes. |
| A17 | ChatGPT (GPT-6)    | 21/11/2026 | First draft of the README. | `README.md` | Rewrote and expanded it: added a "What's New Since Assignment 2" table, step-by-step setup and usage instructions, a testing summary, browser compatibility, limitations and future work. Checked that every feature listed exists on the site. |
| A18 | ChatGPT (GPT-6)    | 21/11/2026 | First draft of the technical documentation. | `docs/technical-documentation.md` | Restructured it around my final code (GitHub card, validation steps, theme state, performance) and added a technologies table and before/after Lighthouse results. Compared each description with `js/script.js`. |
| C02 | Claude (Opus 5.5)  | 21/11/2026 | Write this AI usage report from my evidence ZIP and commit history, and fix the evidence file names. | `docs/ai-usage-report.md`, evidence ZIP | Gave it my Assignment 2 report as the format to follow. Renamed evidence files to the C01/A01 format. Checked each log row against my commits and the evidence files before committing. |
| A19 | Claude (Opus 5.5)  | 21/11/2026 | First draft of this AI usage report. | `docs/ai-usage-report.md` | Reviewed it against my repository and the C01 conversation and corrected anything that did not match what I did. |