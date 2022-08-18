// Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({
        behavior: "smooth",
      });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");

    // Navigate to new page if it is a link
    if (!href.startsWith("#")) window.open(href, "_blank");
  });
});

// Sticky navigation
const heroSectionEl = document.querySelector(".hero");

const observe = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      document.body.classList.remove("sticky");
    } else {
      document.body.classList.add("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-104px",
  }
);
observe.observe(heroSectionEl);

// Reveal Sections on scroll
const hiddenSections = document.querySelectorAll(".section-hidden");
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
hiddenSections.forEach((section) => {
  sectionObserver.observe(section);
});

function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section-hidden");
  entry.target.classList.remove("go-in-from-bottom");
  entry.target.classList.remove("go-in-from-right");
  entry.target.classList.remove("go-in-from-left");
  observer.unobserve(entry.target);
}

// Print Writer Effect
const textEl = document.querySelector("#typewriter");
const texts = JSON.parse(textEl.getAttribute("data-text"));

let index = 0;
let isErasing = false;
let charIndex = 0;
let start;
let delta = 300;

function typeWriter(timestamp) {
  window.requestAnimationFrame(typeWriter);

  if (start === undefined) start = timestamp;
  let progress = timestamp - start;

  if (progress > delta) {
    let text = texts[index];

    if (!isErasing) {
      textEl.innerHTML = text.slice(0, ++charIndex);
      delta = 300 - Math.random() * 200;
    } else {
      textEl.innerHTML = text.slice(0, charIndex--);
    }

    start = timestamp;

    if (charIndex === text.length) {
      isErasing = true;
      delta = 50;
      start = timestamp + 800;
    }

    if (charIndex < 0) {
      isErasing = false;
      start = timestamp + 200;
      index = ++index % texts.length;
    }
  }
}

window.requestAnimationFrame(typeWriter);
