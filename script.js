const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");

const readSavedTheme = () => {
  try {
    return localStorage.getItem("spc-theme");
  } catch (error) {
    console.warn("The saved theme preference could not be read.", error);
    return null;
  }
};

const applyTheme = (isDark, savePreference = false) => {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));

  if (savePreference) {
    try {
      localStorage.setItem("spc-theme", isDark ? "dark" : "light");
    } catch (error) {
      console.warn("The theme preference could not be saved.", error);
    }
  }
};

const savedTheme = readSavedTheme();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

themeToggle.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark-mode"), true);
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

const gallery = document.querySelector(".gallery-grid");
const galleryLightbox = document.getElementById("galleryLightbox");

if (gallery && galleryLightbox) {
  const galleryItems = Array.from(gallery.querySelectorAll(".gallery-item"));
  const lightboxImage = galleryLightbox.querySelector(".gallery-lightbox-image");
  const zoomLabel = galleryLightbox.querySelector(".gallery-zoom-level");
  const imageCounter = galleryLightbox.querySelector(".gallery-image-counter");
  const closeButton = galleryLightbox.querySelector(".gallery-lightbox-close");
  let activeImageIndex = 0;
  let zoomLevel = 1;
  let previouslyFocusedElement;

  const updateZoom = () => {
    lightboxImage.style.transform = `scale(${zoomLevel})`;
    zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
  };

  const showGalleryImage = (index) => {
    activeImageIndex = (index + galleryItems.length) % galleryItems.length;
    const image = galleryItems[activeImageIndex].querySelector("img");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    imageCounter.textContent = `${activeImageIndex + 1} / ${galleryItems.length}`;
    zoomLevel = 1;
    updateZoom();
  };

  const openGalleryImage = (index) => {
    previouslyFocusedElement = document.activeElement;
    showGalleryImage(index);
    galleryLightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeGallery = () => {
    galleryLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
  };

  galleryItems.forEach((item, index) => {
    const image = item.querySelector("img");
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View photo: ${image.alt}`);
    item.setAttribute("aria-haspopup", "dialog");
    item.addEventListener("click", () => openGalleryImage(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGalleryImage(index);
      }
    });
  });

  galleryLightbox.querySelector("[data-lightbox-previous]").addEventListener("click", () => {
    showGalleryImage(activeImageIndex - 1);
  });
  galleryLightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => {
    showGalleryImage(activeImageIndex + 1);
  });
  galleryLightbox.querySelector("[data-zoom-in]").addEventListener("click", () => {
    zoomLevel = Math.min(zoomLevel + 0.25, 3);
    updateZoom();
  });
  galleryLightbox.querySelector("[data-zoom-out]").addEventListener("click", () => {
    zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
    updateZoom();
  });
  galleryLightbox.querySelector("[data-zoom-reset]").addEventListener("click", () => {
    zoomLevel = 1;
    updateZoom();
  });
  galleryLightbox.querySelectorAll("[data-lightbox-close]").forEach((button) => {
    button.addEventListener("click", closeGallery);
  });

  galleryLightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGallery();
    } else if (event.key === "ArrowLeft") {
      showGalleryImage(activeImageIndex - 1);
    } else if (event.key === "ArrowRight") {
      showGalleryImage(activeImageIndex + 1);
    } else if (event.key === "Tab") {
      const focusableElements = Array.from(
        galleryLightbox.querySelectorAll("button:not(:disabled)")
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });
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
