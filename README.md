# 202371310-RaghadAlyami-Assignment3
 
Personal portfolio website for **SWE363 – Web Engineering, Assignment 3 (Advanced Functionality)**.
This assignment builds on my [Assignment 2 portfolio](https://github.com/Web-Engineering-KFUPM/202371310-RaghadAlyami-Assignment2) and adds API integration, stronger application logic, state management, and performance optimization.
 
## Project Description
 
A responsive single-page portfolio that introduces me, shows my live GitHub profile, presents my projects, shows a quote from a public API, and includes a validated demonstration contact form. Visitors can switch between a light and a dark theme, and the site remembers their choice.
It is a static website built with HTML, CSS, and vanilla JavaScript – no frameworks, libraries, or build tools.
 
## What's New Since Assignment 2
 
| Area | Assignment 2 | Assignment 3 |
|---|---|---|
| API | Quote of the Moment (DummyJSON) | Plus a **GitHub profile card** loaded live from the GitHub REST API |
| Contact form | Checks name and message are not empty | **Step-by-step validation:** empty fields → name length → email format → message length, each with its own message |
| State | None | **Light / dark theme** saved in `localStorage`, restored on reload, and following the device setting on a first visit |
| Styling | Some hardcoded colors | All theme colors are CSS variables, so one set of rules serves both themes |
| Performance | JPEG images (≈560 KB) | WebP images (≈106 KB), lazy loading, image sizes, smaller GitHub avatar |
| Accessibility | ARIA, focus outlines, reduced motion | Plus colors that pass WCAG contrast in both themes – **Lighthouse 100 / 100 / 100 / 100** |
 
## Features
 
- **Time-based greeting** – greets the visitor with good morning / afternoon / evening (from Assignment 1).
- **GitHub profile card** *(new)* – loads my avatar, username, bio, number of public repositories, and join date from the GitHub API.
  - Loading spinner, friendly error messages (offline, slow, not found, rate limit) and a **Try again** button
  - Handles missing data, e.g. shows "No bio yet." when my profile has no bio
- **Light / dark theme** *(new)* – the 🌙 / ☀️ button in the header switches the theme. The choice is saved and restored on the next visit. On a first visit, the site follows the device's light/dark setting.
- **Contact form validation** *(improved)* – checks, in order, that no field is empty, the name has at least 2 characters, the email looks valid, and the message has at least 10 characters. It is a demonstration form: messages are **not** sent or stored.
- **Expandable project cards** – **Show details** reveals the tools used and a full description; **Expand all** opens or closes every card at once (from Assignment 2).
- **Quote of the Moment** – a random quote from a public API, with loading, error, and **Try again** states (from Assignment 2).
- **Responsive layout** – cards and the GitHub card stack into one column on small screens.
- **Keyboard and screen-reader friendly** – real buttons, focus outlines, and announced loading/error states.
## Technologies
 
- HTML5
- CSS3 (Grid, Flexbox, custom properties for theming, transitions, keyframe animations, media queries)
- Vanilla JavaScript (DOM manipulation, event listeners, `fetch`, `async`/`await`, `AbortController`, `localStorage`, regular expressions)
- [GitHub REST API](https://docs.github.com/en/rest/users/users) – free, no API key
- [DummyJSON Quotes API](https://dummyjson.com/docs/quotes) – free, no API key
## Folder Structure
 
```
202371310-RaghadAlyami-assignment3/
├── README.md
├── index.html                  # page structure, content, and early theme script
├── css/
│   └── styles.css              # theme variables, layout, animations, responsive rules
├── js/
│   └── script.js               # greeting, form validation, cards, quote API, GitHub API, theme
├── assets/
│   └── images/                 # optimized WebP project images
├── docs/
│   ├── ai-usage-report.md      # detailed AI usage report and declaration
│   └── technical-documentation.md
└── .gitignore
```
 
## Setup – Run Locally
 
No installation is needed.
 
1. **Get the code**, either:
   - Clone it:
```
git clone https://github.com/Web-Engineering-KFUPM/202371310-RaghadAlyami-assignment3.git
```
   - or on GitHub select **Code → Download ZIP** and extract it.
2. **Open the folder** `202371310-RaghadAlyami-assignment3`.
3. **Open `index.html`** in a modern browser (Chrome, Edge, Firefox, or Safari) – double-click it, or right-click → *Open with*.
4. **Stay online** – the GitHub card and Quote of the Moment need an internet connection. Everything else works offline.
To edit the site, open the folder in VS Code, save your changes, and refresh the browser.
To run a **Lighthouse** test, the page must be served over `http://`: install the **Live Server** extension in VS Code, right-click `index.html` → **Open with Live Server**, then open DevTools → **Lighthouse**.
 
## How to Use
 
- Use the navigation bar to jump to **About Me**, **GitHub**, **Projects**, **Quote**, or **Contact**.
- **Theme:** select **🌙 Dark mode** / **☀️ Light mode** in the header. Your choice is remembered next time.
- **GitHub:** the profile loads automatically. If it fails, read the message and select **Try again**.
- **Projects:** select **Show details** on a card; use **Expand all / Collapse all** for all cards.
- **Quote:** select **New quote** for another quote, or **Try again** if loading failed.
- **Contact:** fill in Name, Email, and Message and select **Send Message**. The form tells you exactly what to fix, but does not send anything.
- **Keyboard:** press **Tab** to move between buttons and links, and **Enter** or **Space** to activate them.
## Testing Summary
 
Full test cases and results are in the [technical documentation](docs/technical-documentation.md#6-testing).
 
- GitHub card: loading, success, missing bio, wrong username, offline, slow network, recovery with Try again ✔
- Contact form: empty fields, spaces only, short name, invalid email, short message, valid entries ✔
- Theme: toggle, remembered after refresh, device setting on first visit ✔
- Lighthouse (mobile): **100** in Performance, Accessibility, Best Practices, and SEO in both themes ✔
- Phone, tablet, and desktop layouts; no JavaScript console errors ✔
## Browser Compatibility
 
Uses only standard features supported by current versions of Chrome, Edge, Firefox, and Safari (desktop and mobile).
`localStorage` is wrapped in `try/catch`, so the theme still switches (without being remembered) in browsers that block storage, such as some private modes.
 
## AI Use (summary)
 
I used Claude (Claude Opus 5.5) and ChatGPT (GPT-6) to plan the assignment, explain the GitHub API and `localStorage`, suggest and review code for the new features, interpret my Lighthouse reports, and draft documentation.
I adapted the code to my existing style, added my own changes, and tested everything in the browser.
All AI use, the Usage Log, and my declaration are in the **[AI usage report](docs/ai-usage-report.md)**.
 
## Documentation
 
- [Technical documentation](docs/technical-documentation.md)
- [AI usage report](docs/ai-usage-report.md)
## Known Limitations
 
- The contact form does not send or store messages.
- The GitHub card and quote section need an internet connection and depend on GitHub and DummyJSON being available. GitHub allows 60 requests per hour per visitor without login.
- The greeting uses the visitor's device clock and updates only when the page loads.
## Future Improvements
 
- Connect the contact form to a real email service.
- Add more projects with filtering by category and sorting by date.
## Author
 
Raghad Alyami – 202371310 – KFUPM
 