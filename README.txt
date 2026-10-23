SAINIK GROUP OF INSTITUTIONS

Site files:
- index.html: group homepage and its content sections
- institution.html: shared detail-page template (one URL per college)
- institutions.js: course lists and configurable contact information
- institution-page.js: renders an institution selected by the college query parameter
- style.css: visual design, dark theme and responsive layouts
- script.js: navigation, photo carousel/gallery, theme and enquiry form
- assests/: existing logo and campus photographs

Preview:
Keep the HTML, JavaScript, CSS and assests folder together. Open index.html
in a browser, or serve this folder using a static web server. The page uses
Google Fonts when an internet connection is available.

Institution detail URLs use this format:
institution.html?college=sainik-pg-college
institution.html?college=sainik-law-college
institution.html?college=sainik-pharmacy-college
institution.html?college=sainik-iti-college
institution.html?college=sainik-paramedical-nursing-college
institution.html?college=sant-ram-lakhan-degree-college

Contact details and courses:
Edit institutions.js to change the course lists, phone numbers, WhatsApp
number, email, address and map search. The contact details currently shown
were carried forward from the previous site and have not been independently
verified. Confirm them before publishing. Do not add approvals, affiliations,
fees, eligibility, course duration, facilities or social profiles unless
they have been confirmed by the relevant institution.

Admission enquiry:
The form validates entries in the visitor's browser and opens a pre-filled
WhatsApp draft for the visitor to review and send. It does not save or send
submissions to a server. A backend, CRM, or email service must be configured
and documented separately if enquiries need to be collected automatically.

Mamta Hospital and Research Center:
The separate page is mamta-hospital/index.html and is linked from the
homepage and college detail-page navigation. Open index.html directly when
previewing from the filesystem; opening the folder itself may show a directory
listing in some browsers. Edit
mamta-hospital/hospital-config.js to add hospital-approved address, phone,
WhatsApp, email, opening hours, map, department, doctor and qualification,
service, facility, research, and gallery information. Keep information empty
until verified; the page displays placeholders where details are unavailable.
The appointment enquiry form validates in the browser only. It does not send
or store details and does not book appointments. Connect an approved backend,
API, email, or CRM service before accepting appointment requests.
