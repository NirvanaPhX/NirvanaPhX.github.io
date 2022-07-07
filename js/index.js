window.onload = () => {
  // Styling for Top setion text
  const texts = [...document.querySelector(".text-left").children];
  texts.forEach((text, index) => {
    text.style.marginLeft = `${index}em`;
  });

  // Smooth Scroll on navigation tabs
  document.querySelector(".nav_links").addEventListener("click", function (e) {
    if (e.target.classList.contains("nav_link")) {
      const id = e.target.getAttribute("href");

      if (id.startsWith("#")) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });

  // Menu fade animation
  function fadeOnHover(e, opacity) {
    if (e.target.classList.contains("nav_link")) {
      const link = e.target;
      const siblings = link.closest(".nav_links").querySelectorAll(".nav_link");

      siblings.forEach((el) => {
        if (el !== link) {
          el.style.opacity = opacity;
        }
      });
    }
  }

  const nav = document.querySelector(".nav_links");
  nav.addEventListener("mouseover", (e) => {
    fadeOnHover(e, 0.1);
  });
  nav.addEventListener("mouseout", (e) => {
    fadeOnHover(e, 1);
  });

  // Sticky Navigation Bar
  const header = document.querySelector(".header");
  const top = document.querySelector(".top");
  const headerHeight = header.getBoundingClientRect().height;
  console.log(headerHeight);
  const topObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${headerHeight}px`,
  });
  topObserver.observe(top);

  function stickyNav(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  // Change Navigation Bar color
  const about = document.querySelector(".About");
  const aboutObserver = new IntersectionObserver(changeNavColor, {
    root: null,
    threshold: 0,
  });
  aboutObserver.observe(about);

  function changeNavColor(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      header.classList.remove("header_onwhite");
      header.classList.add("header_onblack");
    } else {
      header.classList.add("header_onwhite");
      header.classList.remove("header_onblack");
    }
  }

  // Reveal Sections on scroll
  const allSections = document.querySelectorAll(".section-hidden");
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.1,
  });
  allSections.forEach((section) => {
    sectionObserver.observe(section);
  });

  function revealSection(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section-hidden");
    observer.unobserve(entry.target);
  }
};
