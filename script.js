(() => {
const institutions = window.SGI_INSTITUTIONS;
const contact = window.SGI_CONTACT;
const nav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.querySelector(".back-to-top");

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const addInstitutionCards = () => {
  const grid = document.getElementById("institutionCards");
  if (!grid) return;

  institutions.forEach((institution) => {
    const card = makeElement("article", "institution-card");
    const imageFrame = makeElement("div", "institution-card-image");
    const image = document.createElement("img");
    image.src = institution.image;
    image.alt = `Campus photo displayed for ${institution.name}`;
    image.loading = "lazy";
    imageFrame.append(image);
    imageFrame.append(makeElement("span", "institution-category", institution.category));

    const content = makeElement("div", "institution-card-content");
    content.append(makeElement("h3", "", institution.name));
    content.append(makeElement("p", "", institution.description));

    const courses = makeElement("div", "course-chips");
    institution.courses.forEach((course) => courses.append(makeElement("span", "course-chip", course)));
    content.append(courses);

    const link = makeElement("a", "card-link");
    link.href = `institution.html?college=${encodeURIComponent(institution.id)}`;
    link.setAttribute("aria-label", `View details for ${institution.name}`);
    link.append(document.createTextNode("View Details "));
    link.append(makeElement("span", "", "↗"));
    content.append(link);
    card.append(imageFrame, content);
    grid.append(card);
  });
};

const addPopularCourses = () => {
  const grid = document.getElementById("popularCourses");
  if (!grid) return;

  const courses = [];
  institutions.forEach((institution) => {
    institution.courses.forEach((course) => {
      let category;
      if (institution.id === "sainik-law-college") category = "law";
      else if (institution.id === "sainik-pharmacy-college") category = "pharmacy";
      else if (institution.id === "sainik-iti-college") category = "iti";
      else if (institution.id === "sainik-paramedical-nursing-college") category = "nursing";
      else if (["MA", "M.Sc", "M.Com"].includes(course)) category = "pg";
      else category = "ug";

      courses.push({ institution, course, category });
    });
  });

  const filterLabels = {
    ug: "Undergraduate",
    pg: "Postgraduate",
    law: "Law",
    pharmacy: "Pharmacy",
    iti: "ITI",
    nursing: "Nursing & Paramedical"
  };
  const resultCount = document.getElementById("courseResultCount");

  const renderCourses = (filter = "all") => {
    grid.replaceChildren();
    const visibleCourses = courses.filter(({ category }) => filter === "all" || category === filter);
    visibleCourses.forEach(({ institution, course, category }, index) => {
      const card = makeElement("article", "course-card");
      card.style.setProperty("--course-index", index);
      card.append(makeElement("span", "course-card-icon", category === "law" ? "§" : category === "pharmacy" ? "⚕" : category === "iti" ? "⚙" : category === "nursing" ? "✚" : category === "pg" ? "✦" : "▤"));

      const copy = makeElement("div", "course-card-copy");
      copy.append(makeElement("span", "course-category", filterLabels[category]));
      copy.append(makeElement("h3", "", course));
      copy.append(makeElement("p", "", institution.name));

      const link = makeElement("a", "course-card-link");
      link.href = `institution.html?college=${encodeURIComponent(institution.id)}`;
      link.setAttribute("aria-label", `Explore ${course} at ${institution.name}`);
      link.innerHTML = '<span>Explore course</span><span aria-hidden="true">↗</span>';
      card.append(makeElement("span", "course-card-number", String(index + 1).padStart(2, "0")));
      card.append(copy, link);
      grid.append(card);
    });

    resultCount.textContent = `${visibleCourses.length} ${visibleCourses.length === 1 ? "course" : "courses"} shown`;
  };

  document.querySelectorAll("[data-course-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-course-filter]").forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      renderCourses(button.dataset.courseFilter);
    });
  });

  renderCourses();
};

const configureContact = () => {
  const contactDetails = document.getElementById("contactDetails");
  if (!contactDetails) return;

  const addDetail = (icon, label, value, href) => {
    const row = makeElement("div", "contact-detail");
    row.append(makeElement("span", "contact-detail-icon", icon));
    const content = document.createElement("div");
    content.append(makeElement("span", "contact-detail-label", label));
    const valueElement = href ? makeElement("a", "contact-detail-value", value) : makeElement("span", "contact-detail-value", value);
    if (href) valueElement.href = href;
    content.append(valueElement);
    row.append(content);
    contactDetails.append(row);
  };

  (contact.phoneNumbers || [contact.phone]).filter(Boolean).forEach((phone) => {
    addDetail("☎", "Phone listed on previous website", phone, `tel:+91${phone}`);
  });
  if (contact.whatsapp) {
    addDetail("WA", "WhatsApp listed on previous website", `+${contact.whatsapp}`, `https://wa.me/${contact.whatsapp}`);
  }
  if (contact.email) addDetail("✉", "Email listed on previous website", contact.email, `mailto:${contact.email}`);
  const verificationNote = document.getElementById("verificationNote");
  verificationNote.textContent = contact.verificationNote;

  const whatsappButton = document.getElementById("floatingWhatsApp");
  if (contact.whatsapp) {
    whatsappButton.href = `https://wa.me/${contact.whatsapp}`;
    whatsappButton.hidden = false;
  }

  const callButton = document.getElementById("floatingCall");
  if (contact.phone) {
    callButton.href = `tel:+91${contact.phone}`;
    callButton.hidden = false;
  }
};

const configureLocation = (section) => {
  if (!section) return;

  const address = section.querySelector("[data-location-address]");
  const note = section.querySelector("[data-location-note]");
  const map = section.querySelector("[data-location-map]");
  const unavailable = section.querySelector("[data-location-unavailable]");
  const link = section.querySelector("[data-location-link]");

  address.textContent = contact.address || "The campus address has not been provided. Please contact the institution for location details.";
  note.textContent = contact.verificationNote;

  if (!contact.mapQuery) {
    unavailable.hidden = false;
    map.hidden = true;
    link.hidden = true;
    return;
  }

  const query = encodeURIComponent(contact.mapQuery);
  map.src = `https://maps.google.com/maps?q=${query}&output=embed`;
  map.hidden = false;
  unavailable.hidden = true;
  link.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  link.hidden = false;
};

const configureEnquiryForm = (form, fixedInstitutionId = "") => {
  if (!form) return;

  const institutionSelect = form.elements.institution;
  const courseSelect = form.elements.course;
  const status = form.querySelector(".form-status");
  const initialInstitution = fixedInstitutionId || institutionSelect.dataset.institutionId || "";

  institutions.forEach((institution) => {
    const option = document.createElement("option");
    option.value = institution.id;
    option.textContent = institution.name;
    institutionSelect.append(option);
  });

  const updateCourses = (selectedInstitution, preselectCourse = "") => {
    courseSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = selectedInstitution ? "Choose a course" : "Choose an institution first";
    courseSelect.append(placeholder);
    const institution = institutions.find((item) => item.id === selectedInstitution);

    if (!institution) {
      courseSelect.disabled = true;
      return;
    }

    institution.courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.append(option);
    });
    courseSelect.disabled = false;
    if (preselectCourse && institution.courses.includes(preselectCourse)) {
      courseSelect.value = preselectCourse;
    }
  };

  if (initialInstitution && institutions.some((item) => item.id === initialInstitution)) {
    institutionSelect.value = initialInstitution;
    updateCourses(initialInstitution);
  }

  institutionSelect.addEventListener("change", () => {
    updateCourses(institutionSelect.value);
    status.textContent = "";
    status.removeAttribute("data-state");
  });

  const nameInput = form.elements.name;
  const phoneInput = form.elements.phone;
  nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
  phoneInput.addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const digits = phoneInput.value.replace(/\D/g, "");
    const phonePattern = /^\+?[\d\s().-]+$/;
    const phoneValue = phoneInput.value.trim();

    phoneInput.setCustomValidity(
      !phoneValue || (phonePattern.test(phoneValue) && digits.length >= 10 && digits.length <= 15)
        ? ""
        : "Enter a valid phone number containing 10 to 15 digits."
    );
    nameInput.setCustomValidity(nameInput.value.trim() ? "" : "Enter your name.");

    if (!form.reportValidity()) {
      status.textContent = "Please check the required fields and correct any errors.";
      status.dataset.state = "error";
      return;
    }

    if (!contact.whatsapp) {
      status.textContent = "WhatsApp contact is not configured. Please contact the institution directly.";
      status.dataset.state = "error";
      return;
    }

    const institution = institutions.find((item) => item.id === institutionSelect.value);
    if (!institution || !institution.courses.includes(courseSelect.value)) {
      status.textContent = "Choose a valid institution and course.";
      status.dataset.state = "error";
      return;
    }

    const message = [
      "Hello Sainik Group of Institutions,",
      "",
      `Student name: ${form.elements.name.value.trim()}`,
      `Mobile number: ${phoneInput.value.trim()}`,
      `Email address: ${form.elements.email.value.trim()}`,
      `Institution: ${institution.name}`,
      `Course: ${courseSelect.value}`,
      `Message: ${form.elements.message.value.trim() || "No additional message"}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      status.textContent = "Your browser blocked the WhatsApp window. Allow pop-ups and try again.";
      status.dataset.state = "error";
      return;
    }

    whatsappWindow.opener = null;
    status.textContent = "A WhatsApp draft is ready to review. It has not been sent or stored by this website.";
    status.dataset.state = "success";
  });
};

const configureTheme = () => {
  let savedTheme = "";
  try {
    savedTheme = localStorage.getItem("sgi-theme") || localStorage.getItem("spc-theme") || "";
  } catch (error) {
    console.warn("The saved theme preference could not be read.", error);
  }

  const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;

  if (!themeToggle) return;
  const updateButton = (theme) => {
    const isDark = theme === "dark";
    themeToggle.textContent = isDark ? "☼" : "◐";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };

  updateButton(initialTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    updateButton(nextTheme);
    try {
      localStorage.setItem("sgi-theme", nextTheme);
    } catch (error) {
      console.warn("The theme preference could not be saved.", error);
    }
  });
};

const configureNavigation = () => {
  if (!nav || !menuToggle) return;

  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      nav.querySelector(".nav-dropdown[open]")?.removeAttribute("open");
    }
  });
};

const configureCarousel = () => {
  const carousel = document.querySelector(".hero-carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
  const dotsContainer = document.querySelector(".hero-carousel-controls .carousel-dots");
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
    const dot = makeElement("button", "carousel-dot");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show campus photo ${index + 1}`);
    dot.setAttribute("aria-pressed", String(index === currentSlide));
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.append(dot);
  });

  const stopAutoAdvance = () => window.clearInterval(autoAdvance);
  const startAutoAdvance = () => {
    stopAutoAdvance();
    if (!reducedMotion.matches && !document.hidden) {
      autoAdvance = window.setInterval(() => showSlide(currentSlide + 1), 6000);
    }
  };

  document.querySelectorAll(".hero-carousel-controls [data-slide-direction]").forEach((button) => {
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
};

const configureGallery = () => {
  const gallery = document.querySelector(".gallery-grid");
  const lightbox = document.getElementById("galleryLightbox");
  if (!gallery || !lightbox) return;

  const items = Array.from(gallery.querySelectorAll(".gallery-item"));
  const image = lightbox.querySelector(".lightbox-image");
  const counter = lightbox.querySelector(".lightbox-counter");
  const zoomLabel = lightbox.querySelector(".lightbox-zoom-level");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let activeIndex = 0;
  let zoomLevel = 1;
  let previousFocus;

  const updateZoom = () => {
    image.style.transform = `scale(${zoomLevel})`;
    zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
  };

  const showImage = (index) => {
    activeIndex = (index + items.length) % items.length;
    const source = items[activeIndex].querySelector("img");
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    counter.textContent = `${activeIndex + 1} / ${items.length}`;
    zoomLevel = 1;
    updateZoom();
  };

  const closeGallery = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };

  items.forEach((item, index) => {
    const source = item.querySelector("img");
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View photo: ${source.alt}`);
    item.setAttribute("aria-haspopup", "dialog");
    const open = () => {
      previousFocus = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach((button) => button.addEventListener("click", closeGallery));
  lightbox.querySelector("[data-lightbox-previous]").addEventListener("click", () => showImage(activeIndex - 1));
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", () => showImage(activeIndex + 1));
  lightbox.querySelector("[data-zoom-out]").addEventListener("click", () => {
    zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
    updateZoom();
  });
  lightbox.querySelector("[data-zoom-in]").addEventListener("click", () => {
    zoomLevel = Math.min(zoomLevel + 0.25, 3);
    updateZoom();
  });
  lightbox.querySelector("[data-zoom-reset]").addEventListener("click", () => {
    zoomLevel = 1;
    updateZoom();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
    if (event.key === "Tab") {
      const focusable = Array.from(lightbox.querySelectorAll("button:not(:disabled)"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};

const configureBackToTop = () => {
  if (!backToTop) return;
  const updateVisibility = () => {
    backToTop.hidden = window.scrollY < 420;
  };
  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
};

const applyReadableTextScale = () => {
  const elements = Array.from(document.querySelectorAll("body, body *")).filter((element) => {
    if (element.matches("script, style, link, meta, title")) return;

    if (!Object.prototype.hasOwnProperty.call(element.dataset, "originalFontSize")) {
      element.dataset.originalFontSize = element.style.fontSize;
    }

    if (element.dataset.originalFontSize) {
      element.style.fontSize = element.dataset.originalFontSize;
    } else {
      element.style.removeProperty("font-size");
    }

    return true;
  });
  const originalSizes = elements.map((element) => Number.parseFloat(window.getComputedStyle(element).fontSize));

  elements.forEach((element, index) => {
    if (Number.isFinite(originalSizes[index])) {
      element.style.fontSize = `${originalSizes[index] * 1.12}px`;
    }
  });
};

let textScaleFrame;
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(textScaleFrame);
  textScaleFrame = window.requestAnimationFrame(applyReadableTextScale);
}, { passive: true });

window.SGI = { configureEnquiryForm, configureLocation, applyReadableTextScale };

addInstitutionCards();
addPopularCourses();
configureContact();
configureLocation(document.getElementById("location"));
configureEnquiryForm(document.getElementById("enquiryForm"));
configureTheme();
configureNavigation();
configureCarousel();
configureGallery();
configureBackToTop();
applyReadableTextScale();
document.getElementById("year").textContent = new Date().getFullYear();
})();
