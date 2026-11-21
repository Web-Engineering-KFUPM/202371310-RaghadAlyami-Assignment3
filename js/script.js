function showGreeting() {
    let currentTime = new Date();
    let hour = currentTime.getHours();
    let greeting;

    if (hour<12){
        greeting = "Good Morning! Welcome to my portfolio.";
    }
    else if (hour<18){
        greeting = "Good afternoon! Welcome to my portfolio.";
    }
    else{
       greeting = "Good evening! Welcome to my portfolio."; 
    }

    document.getElementById("greeting").textContent=greeting;
}

showGreeting();

let contactForm = document.getElementById("contact-form");
let feedback = document.getElementById("form-feedback");

// Simple email pattern: text@text.text with no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkMessage(event){
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    // Step 1: no field can be empty or only spaces
    if (name === "" || email === "" || message === ""){
        feedback.textContent =
        "Please fill in your name, email and message, not just spaces.";
        return;
    }

       if (name.length < 2) {
        feedback.textContent = "Name must contain at least 2 characters.";
        return;
    }

    // Step 2: the email must look like a real address
    if (!EMAIL_PATTERN.test(email)){
        feedback.textContent =
        "Please enter a valid email address, like name@example.com.";
        return;
    }

    // Step 3: the message must be at least 10 characters
    if (message.length < 10){
        feedback.textContent =
        "Your message is a bit short. Please write at least 10 characters.";
        return;
    }

    // All checks passed
    feedback.textContent =
    "Thank you, " + name + "! Your entries are valid.";
    contactForm.reset(); // clear the form after a successful submit
}

contactForm.addEventListener("submit",checkMessage);

contactForm.addEventListener("input",function() {
    feedback.textContent="";
});

// ----- Expandable project cards -----

const projectGrid = document.querySelector(".project-container");
const toggleAllBtn = document.getElementById("toggle-all-btn");

// Opens or closes one card
function setCardState(button, shouldOpen) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return; // safety check if an ID is mistyped

    button.setAttribute("aria-expanded", String(shouldOpen));
    button.querySelector(".toggle-label").textContent = shouldOpen ? "Hide details" : "Show details";
    panel.classList.toggle("open", shouldOpen);

    // Hidden content should not be reachable with the Tab key
    panel.inert = !shouldOpen;
}

// Updates the "Expand all / Collapse all" label to match the cards
function updateToggleAllLabel() {
    const buttons = projectGrid.querySelectorAll(".toggle-btn");
    const allOpen = [...buttons].every(btn => btn.getAttribute("aria-expanded") === "true");
    toggleAllBtn.textContent = allOpen ? "Collapse all" : "Expand all";
}

// Event delegation: one listener on the grid handles every card
projectGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".toggle-btn");
    if (!button) return; // the click was not on a toggle button

    const isOpen = button.getAttribute("aria-expanded") === "true";
    setCardState(button, !isOpen);
    updateToggleAllLabel();
});

// Expand all / Collapse all
toggleAllBtn.addEventListener("click", () => {
    const shouldOpen = toggleAllBtn.textContent === "Expand all";
    projectGrid.querySelectorAll(".toggle-btn").forEach(btn => setCardState(btn, shouldOpen));
    updateToggleAllLabel();
});

// Start with every card closed
projectGrid.querySelectorAll(".toggle-btn").forEach(btn => setCardState(btn, false));

// ----- Quote of the Moment (public API) -----

const QUOTE_API_URL = "https://dummyjson.com/quotes/random";
const REQUEST_TIMEOUT_MS = 8000; // give up after 8 seconds

const quoteLoading = document.getElementById("quote-loading");
const quoteContent = document.getElementById("quote-content");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const quoteError = document.getElementById("quote-error");
const quoteErrorMsg = document.getElementById("quote-error-message");
const newQuoteBtn = document.getElementById("new-quote-btn");

let lastQuoteId = null; // used to avoid showing the same quote twice in a row

// Shows exactly one of the three states: "loading", "success" or "error"
function showState(state) {
    quoteLoading.hidden = state !== "loading";
    quoteContent.hidden = state !== "success";
    quoteError.hidden = state !== "error";

    // Disable the button while a request is running so users can't spam it
    newQuoteBtn.disabled = state === "loading";
    newQuoteBtn.textContent = state === "error" ? "Try again" : "New quote";
}

// Turns a technical error into a message that tells the user
// what happened and what to do next
function getFriendlyErrorMessage(error) {
    if (!navigator.onLine) {
        return "You seem to be offline. Check your internet connection, then press \"Try again\".";
    }
    if (error.name === "AbortError") {
        return "The quote service took too long to respond. Press \"Try again\" in a moment.";
    }
    return "The quote service is not available right now. Press \"Try again\", or check back later.";
}

// Fetches a random quote from the API and displays it
async function loadQuote() {
    showState("loading");

    // AbortController lets us cancel the request if it takes too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        let data;
        // Try up to 2 times to get a quote different from the current one
        for (let attempt = 0; attempt < 2; attempt++) {
            const response = await fetch(QUOTE_API_URL, { signal: controller.signal });

            // fetch() only rejects on network failure, so HTTP errors (404, 500...) must be checked manually
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            data = await response.json();
            if (data.id !== lastQuoteId) break;
        }

        // Make sure the response has the fields we expect
        if (!data || typeof data.quote !== "string" || typeof data.author !== "string") {
            throw new Error("Unexpected response format");
        }

        // textContent (not innerHTML) so API text can never inject HTML into the page
        quoteText.textContent = data.quote;
        quoteAuthor.textContent = data.author;
        lastQuoteId = data.id;

        showState("success");

        // Restart the fade-in animation for every new quote
        quoteContent.classList.remove("fade-in");
        void quoteContent.offsetWidth; // forces the browser to reset the animation
        quoteContent.classList.add("fade-in");

    } catch (error) {
        console.error("Quote request failed:", error);
        quoteErrorMsg.textContent = getFriendlyErrorMessage(error);
        showState("error");
        quoteError.classList.remove("fade-in");
        void quoteError.offsetWidth;
        quoteError.classList.add("fade-in");
    } finally {
        clearTimeout(timeoutId);
    }
}

newQuoteBtn.addEventListener("click", loadQuote);

// Load the first quote when the page opens
loadQuote();

// ----- GitHub profile card (GitHub REST API) -----

const GITHUB_USERNAME = "Raghad25B";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

const githubLoading = document.getElementById("github-loading");
const githubProfile = document.getElementById("github-profile");
const githubError = document.getElementById("github-error");
const githubErrorMsg = document.getElementById("github-error-message");
const githubRetryBtn = document.getElementById("github-retry-btn");

// Shows exactly one of the three states: "loading", "success" or "error"
function showGitHubState(state) {
    githubLoading.hidden = state !== "loading";
    githubProfile.hidden = state !== "success";
    githubError.hidden = state !== "error";
    githubRetryBtn.hidden = state !== "error"; // only offer a retry when something failed
}

// Turns each kind of failure into a message the visitor can understand
function getGitHubErrorMessage(error) {
    if (!navigator.onLine) {
        return "You seem to be offline. Check your internet connection, then press \"Try again\".";
    }
    if (error.name === "AbortError") {
        return "GitHub took too long to respond. Press \"Try again\" in a moment.";
    }
    if (error.message === "HTTP 404") {
        return "This GitHub profile could not be found.";
    }
    if (error.message === "HTTP 403") {
        return "GitHub's request limit was reached (60 per hour). Please try again later.";
    }
    return "GitHub is not available right now. Press \"Try again\", or check back later.";
}

// Fetches my public GitHub profile and fills in the card
async function loadGitHubProfile() {
    showGitHubState("loading");

    // Cancel the request if it takes longer than REQUEST_TIMEOUT_MS (shared with the quote feature)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(GITHUB_API_URL, { signal: controller.signal });

        // fetch() only rejects on network failure, so HTTP errors must be checked manually
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const user = await response.json();

        // Make sure the response has the field we rely on most
        if (!user || typeof user.login !== "string") {
            throw new Error("Unexpected response format");
        }

        // name and bio can be null, so fall back to friendly text instead of showing "null"
        document.getElementById("github-name").textContent = user.name || user.login;
        document.getElementById("github-bio").textContent = user.bio || "No bio yet.";

        const avatar = document.getElementById("github-avatar");
        // GitHub can resize avatars: s=176 is 2× the 88px display size (sharp on high-res screens)
        avatar.src = user.avatar_url + "&s=176";
        avatar.alt = `GitHub profile picture of ${user.login}`;
        document.getElementById("github-link").href = user.html_url;

        // Build the info pills (reuses the .tech-list style from the project cards)
        const stats = [];
        stats.push(user.public_repos > 0
            ? `${user.public_repos} public repositories`
            : "No public repositories yet");

        if (user.created_at) {
            const joined = new Date(user.created_at)
                .toLocaleDateString("en-GB", { month: "long", year: "numeric" });
            stats.push(`Joined ${joined}`);
        }

        const statsList = document.getElementById("github-stats");
        statsList.replaceChildren(); // remove old pills if the visitor pressed "Try again"
        stats.forEach(text => {
            const item = document.createElement("li");
            item.textContent = text; // textContent so API text can never inject HTML
            statsList.appendChild(item);
        });

        showGitHubState("success");

    } catch (error) {
        console.error("GitHub request failed:", error);
        githubErrorMsg.textContent = getGitHubErrorMessage(error);
        showGitHubState("error");
    } finally {
        clearTimeout(timeoutId);
    }
}

githubRetryBtn.addEventListener("click", loadGitHubProfile);

// Load the profile when the page opens
loadGitHubProfile();

// ----- Light / dark theme (remembered with localStorage) -----

const themeToggle = document.getElementById("theme-toggle");

// Updates the page and the button label to match the given theme
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme; // the CSS reacts to data-theme
    themeToggle.textContent = theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
}

// The small script in <head> already chose the starting theme; sync the button to it
applyTheme(document.documentElement.dataset.theme || "light");

themeToggle.addEventListener("click", () => {
    const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(newTheme);

    try {
        localStorage.setItem("theme", newTheme); // remember the choice for next visit
    } catch (e) {
        // Storage blocked: the theme still switches, it just won't be remembered
    }
});