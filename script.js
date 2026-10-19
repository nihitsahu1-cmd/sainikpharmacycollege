const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
});

const updateBackToTop = () => {
  backToTop.hidden = window.scrollY < 320;
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

const carousel = document.querySelector(".hero-carousel");
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const dotsContainer = carousel.querySelector(".carousel-dots");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentSlide = 0;
  let autoAdvance;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      dotsContainer.children[slideIndex].setAttribute("aria-pressed", String(isActive));
    });
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.setAttribute("aria-pressed", String(index === currentSlide));
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.append(dot);
  });

  const stopAutoAdvance = () => window.clearInterval(autoAdvance);
  const startAutoAdvance = () => {
    stopAutoAdvance();
    if (!reducedMotion.matches && !document.hidden) {
      autoAdvance = window.setInterval(() => showSlide(currentSlide + 1), 5000);
    }
  };

  carousel.querySelectorAll("[data-slide-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(currentSlide + Number(button.dataset.slideDirection));
      startAutoAdvance();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoAdvance);
  carousel.addEventListener("mouseleave", startAutoAdvance);
  carousel.addEventListener("focusin", stopAutoAdvance);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoAdvance();
  });
  document.addEventListener("visibilitychange", startAutoAdvance);
  reducedMotion.addEventListener("change", startAutoAdvance);
  startAutoAdvance();
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("enquiryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const topic = document.getElementById("topic").value;
  const message = `Hello Sainik Pharmacy College,%0A%0AMy name is ${encodeURIComponent(name)}.%0AMy mobile number is ${encodeURIComponent(phone)}.%0AI would like to enquire about: ${encodeURIComponent(topic)}.%0A%0APlease share the details.`;
  const whatsappNumber = form.dataset.whatsappNumber;
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
  document.getElementById("formStatus").textContent = "WhatsApp opened in a new tab. Review your message and press Send.";
});
