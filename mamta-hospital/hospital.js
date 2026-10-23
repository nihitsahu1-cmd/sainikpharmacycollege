(() => {
  const hospital = window.MAMTA_HOSPITAL;
  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const renderCards = (containerId, entries, emptyMessage, className = "hospital-info-card") => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!entries.length) {
      container.append(createElement("p", "hospital-empty-state", emptyMessage));
      return;
    }

    entries.forEach((entry) => {
      const card = createElement("article", className);
      card.append(createElement("span", "hospital-card-mark", entry.mark || "+"));
      card.append(createElement("h3", "", entry.name || entry.title || "Information to be confirmed"));
      if (entry.role) card.append(createElement("p", "hospital-card-role", entry.role));
      if (entry.qualification) card.append(createElement("p", "hospital-card-role", entry.qualification));
      if (entry.description) card.append(createElement("p", "", entry.description));
      container.append(card);
    });
  };

  const addContactDetail = (container, label, value, href = "") => {
    if (!value) return;
    const row = createElement("div", "hospital-contact-item");
    row.append(createElement("span", "hospital-contact-label", label));
    const content = href ? document.createElement("a") : document.createElement("span");
    content.className = "hospital-contact-value";
    content.textContent = value;
    if (href) content.href = href;
    row.append(content);
    container.append(row);
  };

  const renderContact = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    let hasDetails = false;
    const initialChildren = container.childElementCount;

    const addIfConfigured = (...args) => {
      addContactDetail(container, ...args);
      hasDetails = hasDetails || container.childElementCount > initialChildren;
    };

    addIfConfigured("Address", hospital.address);
    addIfConfigured("Phone", hospital.phone, hospital.phone ? `tel:${hospital.phone.replace(/[^\d+]/g, "")}` : "");
    addIfConfigured("WhatsApp", hospital.whatsapp, hospital.whatsapp ? `https://wa.me/${hospital.whatsapp.replace(/\D/g, "")}` : "");
    addIfConfigured("Email", hospital.email, hospital.email ? `mailto:${hospital.email}` : "");
    addIfConfigured("Opening hours", hospital.openingHours);

    if (!hasDetails) {
      container.append(createElement("p", "hospital-empty-state", "Contact details and opening hours will be shown here after verification."));
    }
  };

  const renderGallery = () => {
    const gallery = document.getElementById("hospitalGallery");
    if (!gallery) return;

    if (!hospital.gallery.length) {
      gallery.append(createElement("p", "hospital-empty-state", "Approved hospital photographs have not been provided yet."));
      return;
    }

    hospital.gallery.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "hospital-gallery-item";
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt || `Mamta Hospital and Research Center photograph ${index + 1}`;
      image.loading = "lazy";
      figure.append(image);
      if (photo.caption) figure.append(createElement("figcaption", "", photo.caption));
      gallery.append(figure);
    });
  };

  const configureMap = () => {
    const query = hospital.mapQuery.trim();
    const map = document.getElementById("hospitalMap");
    const placeholder = document.getElementById("hospitalMapPlaceholder");
    const link = document.getElementById("hospitalMapLink");
    if (!query) return;

    const encodedQuery = encodeURIComponent(query);
    map.src = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
    map.hidden = false;
    placeholder.hidden = true;
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
    link.hidden = false;
  };

  const configureDepartmentOptions = () => {
    const select = document.querySelector("#appointmentForm select[name='department']");
    hospital.departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.name;
      option.textContent = department.name;
      select.append(option);
    });
    const generalOption = document.createElement("option");
    generalOption.value = "General enquiry";
    generalOption.textContent = "General enquiry (department not specified)";
    select.append(generalOption);
  };

  const configureAppointmentForm = () => {
    const form = document.getElementById("appointmentForm");
    const status = form.querySelector(".form-status");
    const dateInput = form.elements.appointmentDate;
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localToday;
    [form.elements.patientName, form.elements.mobile, dateInput].forEach((input) => {
      input.addEventListener("input", () => input.setCustomValidity(""));
    });

    form.addEventListener("input", () => {
      status.textContent = "";
      status.removeAttribute("data-state");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const phone = form.elements.mobile;
      const digits = phone.value.replace(/\D/g, "");
      const phonePattern = /^\+?[\d\s().-]+$/;
      phone.setCustomValidity(phonePattern.test(phone.value.trim()) && digits.length >= 10 && digits.length <= 15 ? "" : "Enter a valid mobile number containing 10 to 15 digits.");
      form.elements.patientName.setCustomValidity(form.elements.patientName.value.trim() ? "" : "Enter the patient's name.");
      dateInput.setCustomValidity(dateInput.value >= localToday ? "" : "Choose today or a future date.");

      if (!form.reportValidity()) {
        status.textContent = "Please review the required fields and correct any invalid details.";
        status.dataset.state = "error";
        return;
      }

      status.textContent = "The details passed browser validation, but no appointment request was sent or booked. Contact the hospital directly; connect an approved backend before accepting appointment requests.";
      status.dataset.state = "success";
    });
  };

  document.getElementById("hospitalAbout").textContent = hospital.about;
  document.getElementById("researchFocus").textContent = hospital.researchFocus;
  renderCards("departmentCards", hospital.departments, "Department information will be added after the hospital confirms its current departments.");
  renderCards("doctorCards", hospital.doctors, "Doctor and medical-team names, roles and qualifications will be added after verification.", "hospital-info-card hospital-doctor-card");
  renderCards("serviceCards", hospital.services, "Healthcare services will be listed here after they are confirmed by the hospital.");
  renderCards("hospitalFacilities", hospital.facilities, "Only confirmed hospital facilities will be listed here.");
  renderContact("hospitalContactDetails");
  renderContact("hospitalLocationDetails");
  renderGallery();
  configureMap();
  configureDepartmentOptions();
  configureAppointmentForm();
})();
