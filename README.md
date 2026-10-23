# Sainik Group of Institutions

A responsive static website for six institutions, built with plain HTML, CSS,
and JavaScript.

## Preview

Keep `index.html`, `institution.html`, the JavaScript and CSS files, and the
`assests/` folder together. Open `index.html` directly or serve the folder
with a static web server. Google Fonts requires an internet connection.

Institution pages share a data-driven template. For example:

`institution.html?college=sainik-pg-college`

The homepage course browser filters the supplied course list by undergraduate,
postgraduate, law, pharmacy, ITI, and nursing/paramedical study areas.

Other supported IDs are `sainik-law-college`,
`sainik-pharmacy-college`, `sainik-iti-college`,
`sainik-paramedical-nursing-college`, and
`sant-ram-lakhan-degree-college`.

## Updating information

Edit `institutions.js` to update course lists, each institution's `image` and
`gallery` asset paths, and configurable contact details, including the campus
address and Google Maps search location. Confirm that each photo depicts the
intended institution before publishing. Phone, WhatsApp, email and address
information currently shown was carried over from the previous website and has
not been independently verified. Confirm it before publishing. Confirm course
availability, eligibility, duration, fees, facilities and admission dates
with each college before presenting them as facts.

## Enquiry form

The form performs browser-side validation and opens a pre-filled WhatsApp
draft for the visitor to review and send. It does not store or send submissions
to a server. Connect a backend, CRM or email service separately if automatic
enquiry collection is required.

## Mamta Hospital and Research Center

The separate hospital page is `mamta-hospital/index.html`. Open that file
directly when previewing the project from the filesystem; opening the folder
itself may show a directory listing in some browsers. Its navigation link is
also present on the homepage and institution detail pages. Edit `mamta-hospital/hospital-config.js`
to add hospital-approved contact details, departments, doctor profiles and
qualifications, services, facilities, research information, gallery images,
opening hours and map location. Keep fields empty until the hospital verifies
them; the page displays an explicit placeholder in that case.

The appointment enquiry form validates entries in the browser but does not
send or store them and does not book an appointment. Connect and document an
approved hospital API, backend, or email/CRM service before accepting
appointment requests.
