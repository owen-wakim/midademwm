// Midade MWM starter interactions.
// This file is plain JavaScript and does not require a build step.

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const currentYear = document.querySelector("#currentYear");

// Keep the footer year current.
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Mobile navigation.
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Toggle navigation"
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Toggle navigation");
    });
  });
}

// Highlight the current section in the navigation.
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const matches = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", matches);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// This starter form does not send data to a server yet.
// For a real contact form, connect it to a secure backend or a form service.
if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    // Open the visitor's email application with a prefilled draft.
    // Replace this placeholder with the real community email address.
    const communityEmail = "hello@example.com";

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formMessage.textContent =
      "Your email app will open with a draft. Replace hello@example.com in script.js with your real community email.";

    window.location.href =
      `mailto:${communityEmail}?subject=${subject}&body=${body}`;
  });
}
