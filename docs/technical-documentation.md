# Technical Documentation – Assignment 3
 
**Student:** Raghad Alyami (202371310)
**Course:** SWE363 – Web Development
**Assignment:** Assignment 3 – Advanced Functionality
 
## 1. Project Overview
 
This project is an improved version of my personal portfolio website from Assignment 2. The main objective is to add advanced features: integrating an external API, implementing more complex logic, managing application state, and optimizing performance.
 
In Assignment 2, I added expandable project cards and a Quote of the Moment section that loads data from a public API.
 
For Assignment 3, I added:
 
1. **GitHub profile card** – live data from the GitHub REST API, with loading, error, and missing-data handling.
2. **Step-by-step contact form validation** – several rules checked in order, each with its own message.
3. **Light / dark theme** – state saved in `localStorage` and restored when the page reloads.
4. **Performance and accessibility optimization** – tested with Google Lighthouse, from 87 / 96 / 96 / 91 to 100 / 100 / 100 / 100.
The website is still a static single page built with HTML, CSS, and vanilla JavaScript. It needs no server, database, build step, or frontend framework.
 
## 2. Technologies Used
 
| Technology | Purpose |
|---|---|
| HTML5 | Structures the portfolio sections, GitHub card, project cards, buttons, and form |
| CSS3 | Layout (Grid, Flexbox), custom properties for theming, transitions, animations, responsive design |
| JavaScript | Handles user interactions, API requests, validation, and theme state |
| DOM API | Accesses, creates, and updates HTML elements |
| Fetch API | Requests data from the GitHub and DummyJSON APIs |
| Web Storage API | `localStorage` remembers the visitor's theme |
| GitHub REST API | Provides my public profile data (free, no API key) |
| DummyJSON | Provides the quotes for Quote of the Moment (free, no API key) |
| Google Lighthouse | Measures performance, accessibility, best practices, and SEO |
| Squoosh | Resizes and converts images to WebP |
 
## 3. Project Structure
 
| File | Purpose |
|---|---|
| `index.html` | Page structure: header with navigation and theme button, About Me, GitHub, Projects, Quote of the Moment, Contact, footer. A small script in `<head>` applies the saved theme early. |
| `css/styles.css` | Theme variables (light and dark), layout, card / quote / GitHub styles, animations, reduced-motion rules |
| `js/script.js` | Six parts, in order: greeting, contact form validation, project cards, quote API, GitHub API, theme toggle |
| `assets/images/` | `Wasm.webp` (≈55 KB) and `pedestrian-light.webp` (≈51 KB) |
| `README.md` | Explains the project and how to run it |
| `docs/ai-usage-report.md` | Documents AI assistance |
| `docs/technical-documentation.md` | Explains the implementation and testing |
 
## 4. Website Implementation
 
### 4.1 GitHub Profile Card (API Integration)
 
This section shows my GitHub profile using data from the GitHub REST API.
 
- Endpoint: `GET https://api.github.com/users/Raghad25B`
- Documentation: https://docs.github.com/en/rest/users/users
- Fields used: `login`, `name`, `bio`, `avatar_url`, `html_url`, `public_repos`, `created_at`
- No API key is needed, so no secret is exposed in the front-end code. Without login, GitHub allows **60 requests per hour** per visitor.
I first planned to list my repositories, but most of my repositories are in the course organization, so only two appeared in my account. A profile card was a better fit: it shows meaningful live data without depending on how many public repositories I have.
 
#### HTML – three states
 
The card uses the same structure as my quote section from Assignment 2:
 
```html
<div aria-live="polite">
    <div class="github-loading" id="github-loading" hidden> spinner + "Loading GitHub profile…" </div>
    <div class="github-profile" id="github-profile" hidden> avatar + name + bio + info pills + profile link </div>
    <div class="github-error" id="github-error" role="alert" hidden> message </div>
</div>
<button type="button" class="btn btn-secondary" id="github-retry-btn" hidden>Try again</button>
```
 
`showGitHubState(state)` shows exactly one of the three boxes, and shows the **Try again** button only in the error state.
 
#### API Data Handling
 
```
loadGitHubProfile()
  ├─ showGitHubState("loading")
  ├─ start timeout                  AbortController + REQUEST_TIMEOUT_MS (8 s, shared with the quote)
  ├─ try
  │   ├─ fetch(GITHUB_API_URL)
  │   ├─ if !response.ok → throw    "HTTP 404", "HTTP 403", …
  │   ├─ response.json()
  │   ├─ check login is a string, else throw
  │   ├─ fill name, bio, avatar, link with textContent / src / href
  │   ├─ build the info pills with createElement
  │   └─ showGitHubState("success")
  ├─ catch
  │   ├─ console.error(...)
  │   ├─ getGitHubErrorMessage(error)
  │   └─ showGitHubState("error")
  └─ finally: clearTimeout(...)
```
 
- **Missing data:** my profile has no name or bio (`null`), so the code uses fallbacks instead of showing "null":
```js
document.getElementById("github-name").textContent = user.name || user.login;
document.getElementById("github-bio").textContent = user.bio || "No bio yet.";
```
  If `public_repos` is 0, the pill says "No public repositories yet". If `created_at` is missing, the "Joined" pill is skipped.
- **Info pills:** each pill is created with `document.createElement("li")` and `appendChild`, and reuses the `.tech-list` style from the project cards. `replaceChildren()` clears the old pills first, so pressing **Try again** does not duplicate them.
- **Security:** API text is inserted with `textContent`, not `innerHTML`.
- **Smaller avatar:** GitHub resizes avatars with a URL parameter. `avatar_url + "&s=176"` requests 176 px (2× the 88 px display size, so it stays sharp), which reduced the image from about 46 KB to about 10 KB.
#### Error State
 
| Situation | How it is detected | Message |
|---|---|---|
| No internet | `navigator.onLine` is `false` | "You seem to be offline. Check your internet connection, then press "Try again"." |
| Too slow (> 8 s) | `error.name === "AbortError"` | "GitHub took too long to respond. Press "Try again" in a moment." |
| Profile not found | `HTTP 404` | "This GitHub profile could not be found." |
| Request limit | `HTTP 403` | "GitHub's request limit was reached (60 per hour). Please try again later." |
| Anything else | default | "GitHub is not available right now. Press "Try again", or check back later." |
 
#### Reusing Assignment 2 code
 
Instead of writing new loading and error styles, I added the GitHub classes to the existing quote rules (for example `.quote-loading, .github-loading { … }`), and the GitHub code reuses the `spinner` class and the `REQUEST_TIMEOUT_MS` constant. Both API sections look and behave the same, without repeated CSS.
 
### 4.2 Contact Form Validation (Complex Logic)
 
In Assignment 2, the form only checked that the name and message were not empty. In Assignment 3, `checkMessage()` checks several rules **in order**. Each failed rule shows its own message and stops with `return`, so the visitor only sees one clear problem at a time:
 
| Step | Rule | Message |
|---|---|---|
| 1 | Name, email, and message are not empty after `trim()` | "Please fill in your name, email and message, not just spaces." |
| 2 | Name has at least 2 characters | "Name must contain at least 2 characters." |
| 3 | Email matches the pattern below | "Please enter a valid email address, like name@example.com." |
| 4 | Message has at least 10 characters | "Your message is a bit short. Please write at least 10 characters." |
| ✓ | All rules pass | "Thank you, [name]! Your entries are valid." – then `contactForm.reset()` clears the form |
 
```js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```
 
- `[^\s@]+` means "one or more characters that are not a space or @", so the pattern requires *text @ text . text*.
- The pattern is intentionally simple: it catches common mistakes (`raghad@`, `raghad.com`, spaces) without rejecting unusual but valid addresses.
- The form has the `novalidate` attribute. Without it, the browser's own popups for `required` and `type="email"` would block the submit before my JavaScript runs, and my messages would never appear.
- The name-length rule (step 2) was my own addition. It is placed after the empty check, so an empty form still gets the clearer "please fill in" message.
### 4.3 Light / Dark Theme (State Management)
 
The theme is one piece of state, `"light"` or `"dark"`, kept in two places:
 
| Where | Purpose |
|---|---|
| `data-theme` attribute on `<html>` | What the page shows now – the CSS reacts to it |
| `localStorage` key `"theme"` | What is remembered for the next visit |
 
#### Choosing the theme on page load
 
A small script in `<head>` runs **before the page is drawn**:
 
```js
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");
```
 
1. If a theme was saved, use it.
2. Otherwise, follow the device setting.
It is in `<head>` because `script.js` loads at the end of the page. If the theme were applied only there, dark-mode visitors would see a quick white flash first.
 
#### Switching the theme
 
In `script.js`, `applyTheme(theme)` sets `data-theme` and updates the button label (🌙 Dark mode / ☀️ Light mode). On page load it syncs the button with the theme already chosen in `<head>`. Each click flips the value, calls `applyTheme()`, and saves the new value with `localStorage.setItem("theme", newTheme)`.
 
All `localStorage` calls are inside `try/catch`, because some browsers block storage (for example in strict private modes). In that case the theme still switches, it just isn't remembered.
 
#### CSS variables
 
Every color that changes between themes is a CSS variable in `:root`, and the dark theme only overrides the variables:
 
```css
:root {
    --accent: #c2185b;
    --header-bg: #b5475f;
    ...
}
 
[data-theme="dark"] {
    --accent: #f96983;
    --header-bg: #7a3d4a;
    --card: #2a2326;
    --text: #f3eeec;
    ...
    color-scheme: dark; /* dark scrollbars and form controls */
}
```
 
Because the cards, quote box, GitHub card, and form all use these variables, they switch automatically without separate dark-mode rules. Colors that were hardcoded in Assignment 2 (`header`, `footer`, `button`, `h2`, `#greeting`) were converted to variables. For example, the header, footer, and Send Message button share `--header-bg`.
 
### 4.4 Features Kept from Assignments 1 and 2
 
- **Dynamic greeting:** `showGreeting()` uses `getHours()` to choose good morning / afternoon / evening.
- **Expandable project cards:** event delegation, `aria-expanded`, `inert` on closed panels, and the `grid-template-rows: 0fr → 1fr` animation. These are unchanged from Assignment 2.
- **Quote of the Moment:** DummyJSON API with three states, an 8-second timeout, response validation, and no repeated quotes. Unchanged, apart from now sharing its styles with the GitHub card.
 
## 5. User Experience and Accessibility
 
### Navigation
 
The navigation bar now links to About Me, GitHub, Projects, Quote, and Contact. The theme button sits under the navigation in the header, so it is easy to find on every screen size.
 
### Accessibility
 
- All interactive controls are real `<button>` elements with `:focus-visible` outlines; the theme button has its own white outline on the header.
- The GitHub card uses `aria-live="polite"` to announce the result and `role="alert"` for errors; the spinner uses `aria-hidden`.
- The avatar's `alt` text is set from the API data ("GitHub profile picture of Raghad25B").
- **Color contrast:** Lighthouse showed that white text on the light pink header and the pale pink text failed the WCAG 4.5:1 contrast ratio. I darkened `--accent` (`#f96983` → `#c2185b`) and `--header-bg` (`#eaaeb9` → `#b5475f`) in the light theme and added `--accent-strong` for primary buttons. All text now passes in both themes.
- `prefers-reduced-motion` still turns off animations, and `color-scheme: dark` makes built-in controls match the dark theme.
## 6. Testing
 
### 6.1 Method
 
- **Manual testing in the browser** with DevTools: the **Console** for errors, the **Network** tab set to *Offline* or *Slow 3G* to test API failures, **Application → Local Storage** to check and delete the saved theme, **Rendering → prefers-color-scheme** to emulate a dark device, and **device mode** for phone, tablet, and desktop sizes.
- **Google Lighthouse** (Mobile, Incognito window, served with VS Code Live Server), before and after the optimizations, in both themes.
### 6.2 Test Cases
 
| # | Test Case | Expected Result | Actual Result |
|---|---|---|---|
| 1 | Open the website | All sections appear; GitHub card and a quote load | Pass |
| 2 | GitHub card – normal load | Avatar, "Raghad25B", "No bio yet.", repository and join-date pills | Pass |
| 3 | GitHub card – slow network (Slow 3G) | Spinner and "Loading GitHub profile…" appear first | Pass |
| 4 | GitHub card – wrong username | "This GitHub profile could not be found." + Try again | Pass |
| 5 | GitHub card – offline | "You seem to be offline…" + Try again | Pass |
| 6 | Back online + Try again | Profile loads, Try again button disappears | Pass |
| 7 | Contact – empty form / spaces only | "Please fill in your name, email and message…" | Pass |
| 8 | Contact – name "R" | "Name must contain at least 2 characters." | Pass |
| 9 | Contact – email "raghad@" / "raghad.com" | "Please enter a valid email address…" | Pass |
| 10 | Contact – message "hi" | "Your message is a bit short…" | Pass |
| 11 | Contact – all valid | Thank-you message, form clears | Pass |
| 12 | Theme toggle | Whole site switches; label changes | Pass |
| 13 | Refresh / reopen the tab | Chosen theme is remembered | Pass |
| 14 | No saved theme + dark device setting | Site starts in dark mode | Pass |
| 15 | Dark mode – all sections | All text readable (no dark-on-dark) | Pass |
| 16 | Project cards and quote (regression) | Work as in Assignment 2 | Pass |
| 17 | Phone, tablet, desktop sizes | No horizontal scrolling; cards and GitHub card stack on phone | Pass |
| 18 | Links | Navigation, GitHub profile, and DummyJSON links work | Pass |
| 19 | Console | No JavaScript errors (only the logged API errors in tests 4–5) | Pass |
 
Tested in: Google Chrome on Windows
 
## 7. Performance and Compatibility
 
### 7.1 Lighthouse Results (Mobile)
 
| | Performance | Accessibility | Best Practices | SEO | Largest Contentful Paint |
|---|---|---|---|---|---|
| Before | 87 | 96 | 96 | 91 | 4.1 s |
| After – dark theme | **100** | **100** | **100** | **100** | 1.9 s |
| After – light theme | **100** | **100** | **100** | **100** | 1.1 s |
 
### 7.2 Changes Made
 
| Lighthouse finding | What I changed |
|---|---|
| Images much larger than displayed (1200×1600 shown at 315×420), ≈555 KB in total | Resized to 840 px tall (2× display size) and converted to **WebP** with Squoosh: `Wasm` 321 KB → 55 KB; both images ≈555 KB → ≈106 KB |
| Images below the first screen loaded immediately | Added `loading="lazy"` |
| Possible layout shift while images load | Added `width` and `height` attributes |
| GitHub avatar 460×460 for an 88 px circle | Requested a 176 px version with `&s=176` |
| Low contrast in buttons, header, and pink text | New theme colors (section 5) |
| Console error: `favicon.ico` 404 | Added an inline SVG favicon |
| No meta description | Added `<meta name="description">` |
 
### 7.3 Reviewed but Not Changed
 
| Finding | Reason |
|---|---|
| Minify CSS / JS (4–5 KB) | Very small saving; readable code is more important for this course |
| Cache lifetimes, HSTS, CSP, COOP, X-Frame-Options | These are **server (HTTP header) settings** controlled by the host, not by my HTML, CSS, or JavaScript |
| Network dependency chain | Expected for client-side API calls: the page content shows first, then the API sections fill in |
 
### 7.4 Compatibility
 
- Only standard HTML, CSS, and JavaScript supported by current versions of Chrome, Edge, Firefox, and Safari. WebP, `loading="lazy"`, `localStorage`, and `prefers-color-scheme` are supported in all of them.
- The layout uses `auto-fit` + `minmax()` grids and `flex-wrap`, so it adapts to phones, tablets, and desktops.
## 8. Limitations
 
- The contact form is a demonstration and does not send messages.
- The GitHub card and quote section need an internet connection and depend on GitHub and DummyJSON being available. GitHub allows 60 unauthenticated requests per hour per visitor.
- The GitHub card shows profile information only, not a list of repositories, because most of my repositories are in the course organization.
## 9. Conclusion
 
Assignment 3 turns my portfolio into a more complete web application. It now combines two external APIs with careful error and missing-data handling, a step-by-step validation process, and a theme that is stored and restored with `localStorage`.
 
Optimizing with Lighthouse showed me how much image size and color contrast affect a site: converting two images to WebP improved the Performance score from 87 to 100, and reorganizing the colors into theme variables fixed contrast and dark mode at the same time. Reusing my Assignment 2 code and styles kept the new features consistent and avoided repetition.
 
## 10. References
 
- Course slides: Ch.2 HTML, Ch.3 CSS, Ch.4 JS
- MDN Web Docs – Fetch API, AbortController, Window.localStorage, prefers-color-scheme, Lazy loading
- GitHub REST API – Users: https://docs.github.com/en/rest/users/users
- GitHub REST API – Rate limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- DummyJSON Quotes API – https://dummyjson.com/docs/quotes
- Google Lighthouse (Chrome DevTools), Squoosh (https://squoosh.app)
- Claude (Claude Opus 5.5) and ChatGPT (GPT-6): suggestions for the GitHub card, form validation, theme toggle, and Lighthouse fixes, reviewed and modified (see `ai-usage-report.md`)
 