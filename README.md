# Visionaire Lab Systems redesign

Complete six-page static website. No package installation or build service required.

## Preview locally

From this directory run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173/. Use a web server rather than opening HTML files directly: asset and page links are root-relative.

## Edit and deploy

- `build.py`: page content and shared HTML. Run `python3 build.py` after editing.
- `dist/style.css`: responsive layout and visual styling.
- `dist/app.js`: navigation, video, product filters and WhatsApp message preparation.
- `dist/assets/`: original uploaded video and PDF, extracted catalogue images, and original website logo.
- Deploy the contents of `dist/` at the root of any static web host. Folder URLs preserve the six original routes.
- Change `ORIGIN` in `build.py` to the final domain before deploying there, then rebuild to update canonical URLs, social previews and sitemap.
- This delivery does not replace the existing visionairelab.com website.

## Inquiry flow

All seven fields are required: name, company, phone, email, product/service, location and requirements. The visitor reviews a generated message, opens WhatsApp and presses Send. The site does not automatically send messages or store personal information. No backend lead capture is enabled. Email and telephone alternatives are supplied.

WhatsApp: +91 9901076118. This number appears in the supplied catalogue and in the existing site's WhatsApp link (`https://api.whatsapp.com/send/?phone=919901076118`). Telephone: +91 9632987799, as displayed on the existing contact page. Source verification does not establish current account availability or delivery; no message was sent during testing.

## Source and editorial notes

Checked 7 November 2026:
- https://visionairelab.com/ — six-page navigation and company offering.
- https://visionairelab.com/about/ — founding year and industries.
- https://visionairelab.com/products/ — product families and airflow descriptions.
- https://visionairelab.com/services/ — turnkey service scope.
- https://visionairelab.com/portfolio/ — selected project organisations and WhatsApp destination.
- https://visionairelab.com/contact/ — telephone, email and addresses.
- User-supplied Visionary-Catalogue-1.6 (1).pdf — March 2007 founding, product details, photography, contact number.
- User-supplied Camera_gliding_through_research_lab_2d1ab03a.mp4 — unmodified 7.93-second hero footage, used as visual atmosphere rather than an attributed completed project.

The company is described as “Since 2007” / “Nearly 20 years”. The supplied brochure is preserved unmodified and contains a historical 18-year badge. Catalogue photographs are not assigned to specific clients. No unsupported certifications, guarantees, testimonials or performance specifications were added.

## Verification

Browser checks at desktop and 390px mobile width: six pages render, one H1 per page, no horizontal overflow, no broken loaded images. Mobile menu, furniture filtering, product-prefilled inquiry and the complete encoded WhatsApp destination were checked. Desktop video playback and mobile paused fallback checked. JavaScript syntax and local asset/page links checked. No test inquiry was sent. Actual WhatsApp delivery requires the visitor to send from their account.
