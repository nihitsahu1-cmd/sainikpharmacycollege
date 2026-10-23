(() => {
const institutions = window.SGI_INSTITUTIONS;
const contact = window.SGI_CONTACT;
const page = document.getElementById("institutionContent");
const collegeId = new URLSearchParams(window.location.search).get("college");
const institution = institutions.find((item) => item.id === collegeId);

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const makeLink = (label, href, className = "") => {
  const link = makeElement("a", className, label);
  link.href = href;
  return link;
};

const addSectionHeading = (container, label, title) => {
  container.append(makeElement("p", "eyebrow", label));
  container.append(makeElement("h2", "", title));
};

const addCourseOptions = (container) => {
  institution.courses.forEach((course, index) => {
    const card = makeElement("article", "detail-course-card");
    card.append(makeElement("span", "", `Course ${String(index + 1).padStart(2, "0")}`));
    card.append(document.createTextNode(course));
    container.append(card);
  });
};

const addContactDetails = (container) => {
  const details = makeElement("div", "contact-details");
  const detail = (icon, label, value, href) => {
    const row = makeElement("div", "contact-detail");
    row.append(makeElement("span", "contact-detail-icon", icon));
    const content = document.createElement("div");
    content.append(makeElement("span", "contact-detail-label", label));
    const valueElement = href ? makeLink(value, href, "contact-detail-value") : makeElement("span", "contact-detail-value", value);
    content.append(valueElement);
    row.append(content);
    details.append(row);
  };

  (contact.phoneNumbers || [contact.phone]).filter(Boolean).forEach((phone) => {
    detail("☎", "Phone listed on previous website", phone, `tel:+91${phone}`);
  });
  if (contact.whatsapp) {
    detail("WA", "WhatsApp listed on previous website", `+${contact.whatsapp}`, `https://wa.me/${contact.whatsapp}`);
  }
  if (contact.email) detail("✉", "Email listed on previous website", contact.email, `mailto:${contact.email}`);
  container.append(details);
  container.append(makeElement("p", "verification-note", contact.verificationNote));

};

const addEnquiryForm = () => {
  const form = makeElement("form", "contact-form");
  form.id = "enquiryForm";
  form.noValidate = true;
  form.innerHTML = `
    <h3>Ask about ${institution.name}</h3>
    <p>Fill in your details to prepare a WhatsApp message. This website does not store or send the form data.</p>
    <div class="form-grid">
      <label>Student name<input name="name" type="text" autocomplete="name" placeholder="Your full name" required></label>
      <label>Mobile number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 9876543210" required></label>
      <label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" required></label>
      <label>Institution<select name="institution" required data-institution-id="${institution.id}"></select></label>
      <label class="form-wide">Course<select name="course" required disabled><option value="">Choose a course</option></select></label>
      <label class="form-wide">Message <span class="optional-label">(optional)</span><textarea name="message" rows="4" placeholder="What would you like to know?"></textarea></label>
    </div>
    <button class="button button-navy" type="submit">Continue to WhatsApp <span aria-hidden="true">↗</span></button>
    <p class="form-status" role="status" aria-live="polite"></p>
    <small class="form-disclaimer">No backend is connected. Your browser opens a WhatsApp draft; review it and choose whether to send.</small>`;
  return form;
};

const renderInstitution = () => {
  document.title = `${institution.name} | Sainik Group of Institutions`;
  document.querySelector('meta[name="description"]').content =
    `Explore courses and admission enquiry information for ${institution.name}, part of Sainik Group of Institutions.`;

  const hero = makeElement("section", "institution-hero");
  hero.id = "institutionHome";
  const heroImage = document.createElement("img");
  heroImage.src = institution.image;
  heroImage.alt = `Campus photograph displayed for ${institution.name}`;
  heroImage.fetchPriority = "high";
  hero.append(heroImage);
  const heroContent = makeElement("div", "sg-container institution-hero-content");
  heroContent.append(makeElement("p", "eyebrow eyebrow-light", `SAINIK GROUP OF INSTITUTIONS · ${institution.category}`));
  heroContent.append(makeElement("h1", "", institution.name));
  heroContent.append(makeElement("p", "", institution.description));
  const heroActions = makeElement("div", "hero-actions");
  heroActions.append(makeLink("Enquire about admission ↗", "#admission-enquiry", "button button-gold"));
  heroActions.append(makeLink("All institutions", "index.html#institutions", "button button-outline"));
  heroContent.append(heroActions);
  hero.append(heroContent);
  page.append(hero);

  const overview = makeElement("section", "section");
  const overviewGrid = makeElement("div", "sg-container institution-summary");
  const about = document.createElement("div");
  addSectionHeading(about, "ABOUT THIS INSTITUTION", institution.name);
  about.append(makeElement("p", "", `${institution.name} is part of Sainik Group of Institutions. This page brings together its listed courses and an enquiry route; current institutional information should be confirmed directly with the college.`));
  about.append(makeElement("p", "", "Course duration, eligibility, fees, facilities, approvals and current admission dates have not been supplied as verified details for this page."));
  about.append(makeElement("div", "unverified-callout", "Please contact the institution to confirm all current course and admission details before applying."));

  const courses = document.createElement("div");
  addSectionHeading(courses, "COURSES OFFERED", "Find your course");
  const courseList = makeElement("div", "detail-course-list");
  addCourseOptions(courseList);
  courses.append(courseList);
  overviewGrid.append(about, courses);
  overview.append(overviewGrid);
  page.append(overview);

  const admission = makeElement("section", "section institutions-section");
  admission.id = "admissions";
  const admissionContent = makeElement("div", "sg-container");
  addSectionHeading(admissionContent, "ADMISSION ENQUIRIES", "A helpful place to start");
  admissionContent.append(makeElement("p", "section-intro", "This is a general enquiry guide, not a confirmed official admission process. Ask the college for its current application instructions and deadlines."));
  const steps = makeElement("div", "admission-steps");
  [
    ["01", "Choose a listed course", "Select the programme you want to ask about."],
    ["02", "Confirm current details", "Ask the college to verify eligibility, fees, documents and dates."],
    ["03", "Follow official instructions", "Submit an application only through the process confirmed by the institution."]
  ].forEach(([number, title, description]) => {
    const step = makeElement("article", "admission-step");
    step.append(makeElement("span", "", number));
    step.append(makeElement("h3", "", title));
    step.append(makeElement("p", "", description));
    steps.append(step);
  });
  admissionContent.append(steps);
  page.append(admission);

  const facilities = makeElement("section", "section");
  const facilitiesContent = makeElement("div", "sg-container");
  addSectionHeading(facilitiesContent, "FACILITIES & INFRASTRUCTURE", "Ask about your campus");
  facilitiesContent.append(makeElement("p", "section-intro", "Specific facilities have not been verified for this institution. Contact the college to ask about learning spaces, course-specific labs or workshops, student support, transport and accessibility."));
  const gallery = makeElement("div", "detail-gallery");
  institution.gallery.forEach((src, index) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = `Campus photo ${index + 1} displayed for ${institution.name}`;
    image.loading = "lazy";
    gallery.append(image);
  });
  facilitiesContent.append(gallery);
  facilities.append(facilitiesContent);
  page.append(facilities);

  const faq = makeElement("section", "section testimonial-section");
  const faqContent = makeElement("div", "sg-container");
  addSectionHeading(faqContent, "FREQUENTLY ASKED QUESTIONS", "Before you apply");
  const faqList = makeElement("div", "faq-list");
  [
    ["What are the course duration, eligibility and fees?", "These details have not been supplied as verified information. Contact the college for current details about your selected course."],
    ["How can I apply?", "Ask the institution for its current application process and admission dates. The enquiry form on this page is not an application."],
    ["Are the photos and facilities specific to this college?", "Photos have been selected from the existing Sainik Group image collection for this page. Confirm campus-specific facilities and information directly with the college."]
  ].forEach(([question, answer]) => {
    const item = document.createElement("details");
    item.append(makeElement("summary", "", question));
    item.append(makeElement("p", "", answer));
    faqList.append(item);
  });
  faqContent.append(faqList);
  page.append(faq);

  const locationSection = makeElement("section", "section location-section");
  locationSection.id = "location";
  const locationContent = makeElement("div", "sg-container");
  addSectionHeading(locationContent, "FIND OUR CAMPUS", "Plan your visit");
  locationContent.append(makeElement("p", "section-intro", "View the location listed on the previous website. Please confirm the address with the institution before travelling."));
  const locationCard = makeElement("div", "location-card");
  const mapFrame = makeElement("div", "location-map-frame");
  const map = document.createElement("iframe");
  map.dataset.locationMap = "";
  map.title = `Map for ${institution.name}`;
  map.loading = "lazy";
  map.referrerPolicy = "no-referrer-when-downgrade";
  map.allowFullscreen = true;
  map.hidden = true;
  mapFrame.append(map);
  mapFrame.append(makeElement("p", "location-map-unavailable", "Map location is not configured yet."));
  mapFrame.querySelector(".location-map-unavailable").dataset.locationUnavailable = "";

  const locationCopy = makeElement("div", "location-copy");
  locationCopy.append(makeElement("span", "location-icon", "⌖"));
  locationCopy.append(makeElement("p", "eyebrow", "CAMPUS LOCATION"));
  locationCopy.append(makeElement("h3", "", institution.name));
  locationCopy.append(makeElement("p", "location-address"));
  locationCopy.lastChild.dataset.locationAddress = "";
  locationCopy.append(makeElement("p", "location-note"));
  locationCopy.lastChild.dataset.locationNote = "";
  const directions = makeLink("Open directions in Google Maps ↗", "#", "button button-navy location-directions");
  directions.target = "_blank";
  directions.rel = "noopener noreferrer";
  directions.hidden = true;
  directions.dataset.locationLink = "";
  locationCopy.append(directions);
  locationCard.append(mapFrame, locationCopy);
  locationContent.append(locationCard);
  locationSection.append(locationContent);
  page.append(locationSection);
  window.SGI.configureLocation(locationSection);

  const contactSection = makeElement("section", "detail-contact");
  contactSection.id = "admission-enquiry";
  const contactGrid = makeElement("div", "sg-container detail-contact-grid");
  const contactCopy = document.createElement("div");
  addSectionHeading(contactCopy, "CONTACT THE COLLEGE", "Ask about admission");
  contactCopy.append(makeElement("p", "", "The contact details below were listed on the previous website. Please confirm they are current and apply to your chosen institution before using them."));
  addContactDetails(contactCopy);
  contactGrid.append(contactCopy, addEnquiryForm());
  contactSection.append(contactGrid);
  page.append(contactSection);

  const returnSection = makeElement("section", "section return-section");
  const returnContent = makeElement("div", "sg-container return-institutions");
  returnContent.append(makeLink("← Return to all institutions", "index.html#institutions", "text-link"));
  returnSection.append(returnContent);
  page.append(returnSection);

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

  window.SGI.configureEnquiryForm(document.getElementById("enquiryForm"), institution.id);
};

if (institution) {
  renderInstitution();
} else {
  document.title = "Institution not found | Sainik Group of Institutions";
  const emptyState = makeElement("section", "empty-state");
  emptyState.append(makeElement("h1", "", "Institution not found"));
  emptyState.append(makeElement("p", "", "Choose a college from the full list of Sainik Group of Institutions."));
  emptyState.append(makeLink("View all institutions", "index.html#institutions", "button button-navy"));
  page.append(emptyState);
}

window.SGI.applyReadableTextScale();

})();
