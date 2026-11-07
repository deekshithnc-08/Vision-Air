from pathlib import Path
import json, html, re
import xml.etree.ElementTree as ET
from hashlib import sha256
from urllib.parse import quote
D=Path(__file__).parent/'dist'
ORIGIN='https://visionairelab.com'
nav=[('','Home'),('about','About'),('products','Products'),('services','Services'),('portfolio','Portfolio'),('contact','Contact Us')]
products=[('Benchtop Fume Hood','Fume hoods','catalogue-2-2.892bd897d5.jpg','An enclosed, mechanically ventilated workspace for handling processes that release vapours, gases, dust and fumes.','CAV and VAV airflow configurations; post-installation validation.'),('Distillation Fume Hood','Fume hoods','catalogue-2-1.abbd88df67.jpg','A fume hood configuration for distillation laboratory requirements.','Discuss apparatus dimensions, exhaust requirements and utilities with our team.'),('Walk-in Fume Hood','Fume hoods','catalogue-2-0.bfc7553da4.jpg','A walk-in configuration for laboratory processes requiring a larger enclosure.','Specify equipment footprint and process requirements for a tailored proposal.'),('Modular Laboratory Furniture','Furniture','catalogue-1-0.0c4465b8d3.jpg','Plan a coordinated laboratory around benches, sinks, storage and integrated services.','Floor-mounted and C-frame systems; wall and suspended cabinets; service carriers.'),('Laboratory Storage & Tables','Furniture','catalogue-3-1.4130362677.jpg','Furniture selected around your workflow, available space and storage needs.','Anti-vibration tables, tall storage and racks, vented and safety storage cabinets.'),('Laboratory Accessories','Accessories','catalogue-3-2.e08873e780.jpg','Bring the essential utilities of a laboratory together in a considered installation.','Gas distribution, utility panels, eyewash stations, safety showers, faucets, sinks and drainage.')]
services=[('Fume hoods & exhaust','Hoods, exhaust systems and ducting coordinated around your laboratory processes.'),('Laboratory furniture','Modular workspaces with integrated accessories and safety cabinets.'),('HVAC systems','Supply, installation and commissioning for laboratory climate control.'),('Electrical infrastructure','High-tension and low-tension electrical works for laboratory facilities.'),('Cleanroom partitions','Modular partitions and installation for controlled laboratory environments.'),('Gas distribution & drainage','Laboratory utilities coordinated with your equipment and layout.'),('Fire safety & building systems','Fire alarms, access control and building management systems.'),('Animal house laboratories','Specialist planning and setup for animal house laboratory requirements.'),('Office interiors','Furniture and interior works for research and administrative spaces.')]
def img(name,alt,cls=''):
 return f'<img class="{cls}" src="/assets/{name}" alt="{alt}" loading="lazy" width="1000" height="700">'
def link(label,url,cls='button'):
 return f'<a class="{cls}" href="{url}">{label}</a>'
def intro(k,title,desc):
 return f'<section class="page-intro wrap"><p class="eyebrow">{k}</p><h1>{title}</h1><p class="lead">{desc}</p></section>'
lab_points = [
 ('extraction', 'Local extraction hood', 62, 58, 'An articulated extraction arm can be positioned over a bench task to draw fumes away near their source.', 'Explore fume hoods and exhaust', '/services/#fume-hoods-exhaust'),
 ('benches', 'Laboratory benches', 33, 65, 'The continuous worktop gives instruments and preparation tasks a dedicated surface, with services positioned close to the work.', 'Explore modular laboratory furniture', '/products/#modular-laboratory-furniture'),
 ('storage', 'Underbench storage', 36, 79, 'Cabinets and drawers keep frequently used supplies within reach and clear the work surface.', 'Explore storage and tables', '/products/#laboratory-storage-tables'),
 ('utilities', 'Utility panels', 91, 70, 'Bench-mounted outlets bring equipment connections close to the instruments that need them.', 'Explore laboratory accessories', '/products/#laboratory-accessories'),
]

def item_id(name):
 return '-'.join(re.findall(r'[a-z0-9]+', name.lower()))

def lab_tour():
 hotspots = ''.join(
  f'<button class="lab-pin" type="button" data-point="{key}" aria-label="{name}" aria-controls="lab-{key}" aria-pressed="false" style="--x:{x}%;--y:{y}%">{i:02}</button>'
  for i, (key, name, x, y, *_rest) in enumerate(lab_points, 1)
 )
 controls = ''.join(
  f'<button type="button" data-point="{key}" aria-controls="lab-{key}" aria-pressed="false">{i:02} {name}</button>'
  for i, (key, name, *_rest) in enumerate(lab_points, 1)
 )
 panels = ''.join(
  f'<article class="lab-point" id="lab-{key}" data-panel="{key}"><p class="eyebrow">SYSTEM {i:02} / {len(lab_points):02}</p><h3>{name}</h3><p>{description}</p>{link(label, href, "text-link")}</article>'
  for i, (key, name, _x, _y, description, label, href) in enumerate(lab_points, 1)
 )
 return f'''<section class="lab-tour section" id="explore-lab">
  <div class="wrap">
   <p class="eyebrow">INSIDE THE LAB</p>
   <h2>Explore a laboratory.</h2>
   <p>Swipe sideways or drag to rotate. Tap a numbered point to explore the equipment.</p>
   <div class="lab-tour-grid">
    <div class="lab-visual">
     <div class="lab-viewport" hidden>
      <canvas width="840" height="650" aria-label="Interactive 3D illustration of laboratory equipment"></canvas>
      <div class="lab-model-pins"></div>
      <div class="lab-orbit-controls" role="group" aria-label="Rotate the lab model">
       <button type="button" data-orbit="-1">Rotate left</button>
       <button type="button" data-orbit="1">Rotate right</button>
       <button type="button" data-orbit="0">Reset</button>
      </div>
      <span class="lab-model-label">INTERACTIVE MODEL / LAB 01</span>
     </div>
     <details class="lab-reference" open>
      <summary>View the installation photo</summary>
      <figure class="lab-tour-image">
     <div class="lab-tour-photo">
      <img src="/assets/catalogue-3-2.e08873e780.jpg" width="1078" height="1475" loading="lazy" decoding="async" alt="Laboratory bench with articulated extraction arms, utility outlets, and underbench cabinets">
      <div class="lab-pins" hidden>{hotspots}</div>
     </div>
     <figcaption>Laboratory installation · Visionaire catalogue</figcaption>
      </figure>
     </details>
    </div>
    <div class="lab-tour-copy">
     <div class="lab-tour-options" role="group" aria-label="Choose laboratory equipment" hidden>{controls}</div>
     <p class="tour-announcement" role="status"></p>
     {panels}
    </div>
   </div>
  </div>
 </section>'''


def cards(items):
 return '<div class="product-grid">'+''.join(f'<article class="product-card" id="{item_id(n)}" data-category="{cat}">{img(im,n)}<div class="card-copy"><p class="eyebrow">{cat}</p><h3>{n}</h3><p>{desc}</p><details><summary>Product details</summary><p>{detail}</p></details>{link("Enquire about this", "/contact/?product="+quote(n),"text-link")}</div></article>' for n,cat,im,desc,detail in items)+'</div>'
def cta():return '<section class="cta wrap"><p class="eyebrow">YOUR NEXT LAB STARTS HERE</p><div><h2>Let’s make room<br>for discovery.</h2>'+link('Discuss your project','/contact/')+'</div></section>'
client_data = json.loads(Path(__file__).with_name('clients.json').read_text())

def client_logos(entries, lazy=True):
 loading = 'loading="lazy"' if lazy else ""
 return ''.join(
  f'<li><img src="/assets/clients/{asset}" alt="" width="120" height="46" decoding="async" {loading}><span>{html.escape(name)}</span></li>'
  if asset else f'<li><span>{html.escape(name)}</span></li>'
  for name, asset in entries
 )

def client_section(full=False):
 names = client_data['logos']
 directory = ''
 if full:
  showcase = f'<ul class="logo-grid">{client_logos(names)}</ul>'
  projects = ''.join(f'<li>{html.escape(project)}</li>' for project in client_data['projects'])
  directory = f'<div class="project-directory"><h3>Project directory</h3><label class="project-search" hidden>Find a project or organisation<input type="search" id="project-search" autocomplete="off"></label><p id="project-count" role="status"></p><ul class="clients">{projects}</ul></div>'
 else:
  rows = []
  for row in [names[::2], names[1::2]]:
   logos = client_logos(row)
   rows.append(f'<div class="client-lane"><div class="client-track"><ul class="logo-grid">{logos}</ul><ul class="logo-grid" aria-hidden="true">{logos}</ul></div></div>')
  showcase = '<div class="client-marquee" id="client-marquee">' + ''.join(rows) + '</div><button type="button" class="client-motion" aria-controls="client-marquee" hidden>Pause client logos</button>'
 return f'<section class="client-section section" id="clients"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">OUR CLIENTS</p><h2>Across research and industry.</h2></div>{"" if full else link("View all clients", "/portfolio/#clients", "text-link")}</div>{showcase}{directory}</div></section>'


def asset_version(name):
 return sha256((D/name).read_bytes()).hexdigest()[:12]

hero_poster = '/assets/hero-poster.47452400cd23.webp'
hero_film = '/assets/lab-hero.bcdd4dd04d1f.mp4'
whatsapp_url = 'https://wa.me/919632987799'
whatsapp_icon = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11 20L3 29l6-2A13 13 0 1 0 16 3Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 9c-3 0-2 5 1 8s8 5 10 2l-4-3-2 1c-2-1-3-2-4-4l1-1Z" fill="currentColor"/></svg>'

assembly_steps = [
 ('Support frame', 'The support frame carries the layers above it.'),
 ('Base cabinet', 'Storage sits beneath the work surface.'),
 ('Worktop', 'A dedicated surface for laboratory work.'),
 ('Containment enclosure', 'Rear and side panels define the work chamber.'),
 ('Rear baffle', 'The baffle guides air toward the exhaust.'),
 ('Glazed sash', 'The sash controls the working opening.'),
 ('Exhaust plenum', 'The plenum collects air from the chamber.'),
 ('Duct collar', 'The hood connects to the building exhaust.'),
 ('One integrated system', 'The layers come together as one fume hood.')
]

def assembly_section():
 return Path(__file__).with_name('assembly.html').read_text().replace('ASSEMBLY_FRAMES', Path(__file__).with_name('assembly-model.svg').read_text())


def testimonials():
 profiles = [
  ('Anita Rao', 'Laboratory manager', 'anita', 'The layout gives our team a clearer, more organised workspace.'),
  ('Arjun Menon', 'Project lead', 'arjun', 'Having equipment, furniture and services planned together made coordination easier.'),
  ('Meera Iyer', 'Research team lead', 'meera', 'The space works around how our researchers use the laboratory each day.')
 ]
 cards = ''.join(
  f'<article class="quote-placeholder"><div class="quote-top"><span class="quote-symbol" aria-hidden="true">“</span><span class="placeholder-tag">Illustrative testimonial</span></div><blockquote>“{quote}”</blockquote><div class="quote-person"><div class="quote-portrait"><img src="/assets/testimonials/{photo}.jpg" width="144" height="176" loading="lazy" alt="AI-generated portrait of fictional profile {name}"></div><div><strong>{name}</strong><p>{role}</p><small>Fictional profile · AI portrait</small></div></div></article>'
  for name, role, photo, quote in profiles
 )
 return '<section class="testimonials section"><div class="wrap"><p class="eyebrow">CLIENT PERSPECTIVES</p><h2>Built around the people<br>who use the lab.</h2><div class="placeholder-grid">' + cards + '</div><p class="small">Sample testimonials with fictional names and AI-generated portraits for design review. Approved quotes and client photographs will replace these examples.</p></div></section>'


def portfolio_placeholders():
 return '<section class="section soft"><div class="wrap"><p class="eyebrow">PROJECT STORIES</p><h2>A closer look at the work.</h2><div class="placeholder-grid">' + ''.join(
  f'<article class="content-placeholder"><span class="placeholder-tag">Case study placeholder</span><h3>{name}</h3><p>Project brief, client approval, scope and installation photographs to be added.</p><ul><li>The challenge</li><li>The laboratory solution</li><li>The finished workspace</li></ul></article>'
  for name in ['Research laboratory', 'Turnkey laboratory', 'Laboratory modernisation']
 ) + '</div><div class="certification-placeholders"><p class="eyebrow">CERTIFICATIONS & DOCUMENTATION</p><h2>Quality, documented.</h2><div class="placeholder-grid">' + ''.join(
  f'<article class="content-placeholder"><span class="placeholder-tag">Document placeholder</span><h3>{name}</h3><p>Upload the verified document, issuing body, scope and validity dates here.</p></article>'
  for name in ['Company certifications', 'Product validation', 'Quality documentation']
 ) + '</div><p class="small">Document slots for review. No certification is represented as held until a verified document is supplied.</p></div></div></section>'

def people_placeholders():
 return '<section class="section soft"><div class="wrap"><p class="eyebrow">BEHIND THE SYSTEMS</p><h2>People. Process. Precision.</h2><div class="photo-placeholder-grid">' + ''.join(
  f'<figure class="photo-placeholder"><div class="photo-slot" role="img" aria-label="{name} photo placeholder"><span>{number}</span><strong>{name}</strong><small>PHOTO PLACEHOLDER</small></div><figcaption>{caption}</figcaption></figure>'
  for number, name, caption in [
   ('01', 'Our manufacturing facility', 'Factory photo placeholder · add an approved photograph of the manufacturing unit.'),
   ('02', 'Our people', 'Team photo placeholder · add an approved photograph of the Visionaire team.')
  ]
 ) + '</div></div></section>'

home=f'''<section class="hero"><img class="hero-poster" fetchpriority="high" src="{hero_poster}" alt="A bright laboratory with integrated equipment"><video id="hero-video" autoplay muted playsinline preload="auto" poster="{hero_poster}" aria-label="Laboratory walkthrough"><source src="{hero_film}" type="video/mp4"></video><div class="hero-shade"></div><div class="hero-grid" aria-hidden="true"></div><div class="hero-copy wrap"><p class="eyebrow">PRECISION ENGINEERING. PURPOSEFUL SPACES.</p><h1>Built for science.<br>Designed for<br><em>what’s next.</em></h1><p>Laboratory systems, furniture and turnkey environments.<br>Engineered in Bengaluru. Since 2007.</p><div class="hero-actions">'''+link('Explore our solutions','/products/')+link('Download catalogue','/assets/visionaire-catalogue.pdf','button ghost')+'''</div></div><div class="hero-bottom wrap"><span>01 / ENVIRONMENTS FOR DISCOVERY</span><a href="#lab-systems">Explore below</a></div></section>'''+assembly_section()+''''''+client_section()+testimonials()+'''<section id="intro" class="split wrap section"><div><p class="eyebrow">THE VISIONAIRE APPROACH</p><h2>Great science needs<br>a considered space.</h2></div><div><p class="lead">From a single fume hood to a complete research facility, we bring laboratory equipment, furniture and engineering together.</p><p>Established in Bengaluru in March 2007, Visionaire Lab Systems serves research centres, pilot plants and technology facilities with solutions shaped around the work that happens inside them.</p>'''+link('Discover Visionaire','/about/','text-link')+'''</div></section><section class="section soft"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">ENGINEERED AROUND YOUR WORK</p><h2>Systems with purpose.</h2></div>'''+link('All products','/products/','text-link')+'</div>'+cards([products[0],products[3],products[5]])+'''</div></section><section class="split wrap section image-section">'''+img('catalogue-3-0.64f26f9146.jpg','Laboratory furniture installation from the Visionaire catalogue')+'''<div><p class="eyebrow">ONE COORDINATED VISION</p><h2>From first drawing<br>to final installation.</h2><p>Laboratory planning, equipment manufacturing, interiors and building services. Explore a coordinated approach to your next laboratory.</p>'''+link('Explore turnkey services','/services/','text-link')+'''<div class="mini-steps"><span>01 — Plan</span><span>02 — Design</span><span>03 — Manufacture</span><span>04 — Install</span></div></div></section>'''+cta()
about=intro('ABOUT VISIONAIRE','A foundation for<br><em>better science.</em>','Laboratory engineering from Bengaluru, India. Since March 2007.')+'<section class="split wrap section image-section">'+img('catalogue-0-0.9eed30169c.jpg','Laboratory featured in Visionaire’s catalogue')+'<div><p class="eyebrow">NEARLY 20 YEARS IN THE MAKING</p><h2>Precision in every detail.<br>Purpose in every space.</h2><p>Visionaire Lab Systems Pvt. Ltd. manufactures laboratory equipment and furniture, with a focus on fume hoods, laminar air flow systems and bio-safety cabinets.</p><p>Our work spans research and technology centres, CROs, pilot plants, scale-up labs and kilo labs. We connect planning and design with manufacturing and installation to deliver complete laboratory environments.</p></div></section><section class="soft section"><div class="wrap split"><div><p class="eyebrow">OUR VISION</p><h2>Clean, safe spaces.<br>New possibilities.</h2></div><div><h3>Engineering for discovery</h3><p>To support laboratory innovation through quality equipment, thoughtful engineering and a clean working environment.</p><h3>From Bengaluru, with expertise</h3><p>Our administrative office is in Vijayanagar, with manufacturing at the KIADB Industrial Area on Jigani–Bommasandra Link Road.</p><h3>Industries we serve</h3><p>Pharmaceuticals · Biotechnology · Chemicals · Healthcare · Aerospace · Agrochemicals</p></div></div></section>'+people_placeholders()+cta()
productpage=intro('OUR PRODUCTS','The building blocks<br>of <em>your laboratory.</em>','Explore fume hoods, modular furniture and integrated laboratory accessories. Each inquiry starts with your application.')+'<section class="wrap section compact"><div class="filter-bar" role="group" aria-label="Filter products">'+''.join(f'<button class="filter {"active" if x=="All products" else ""}" data-filter="{x}" aria-pressed="{"true" if x=="All products" else "false"}">{x}</button>' for x in ['All products','Fume hoods','Furniture','Accessories'])+'</div>'+cards(products)+'''<div class="technical"><div><p class="eyebrow">FUME HOOD AIRFLOW</p><h2>Configured for<br>your application.</h2></div><div><h3>Constant air volume (CAV)</h3><p>Exhaust air volume remains constant as the sash position changes.</p><h3>Variable air volume (VAV)</h3><p>Airflow is modulated in relation to sash height. Fume hood validation is performed after installation.</p><p>Discuss the process, equipment dimensions, utilities and exhaust requirements with the team to confirm a suitable configuration.</p></div></div><div class="download-panel"><div><h3>The complete product catalogue</h3><p>Original Visionaire brochure · PDF · 2.3 MB</p></div>'''+link('Download catalogue','/assets/visionaire-catalogue.pdf')+'''</div><div class="technical"><h2>Specialist laboratory systems</h2><div><p>Laminar air flow systems and bio-safety cabinets are also part of Visionaire’s offering. Contact the team for application-specific configurations and technical specifications.</p>'''+link('Discuss your requirements','/contact/?product=Specialist%20laboratory%20systems','text-link')+'</div></div></section>'+cta()
servicepage=intro('TURNKEY SERVICES','One partner.<br><em>The complete laboratory.</em>','Bring the building services, equipment and interiors of your laboratory into one coordinated project.')+'<section class="wrap section compact"><div class="service-list">'+''.join(f'<article id="{item_id(name)}"><span class="service-number">0{i+1}</span><h2>{name}</h2><p>{desc}</p></article>' for i,(name,desc) in enumerate(services))+'</div></section><section class="soft section"><div class="wrap"><p class="eyebrow">FROM CONCEPT TO COMPLETION</p><h2>A clear path to your new lab.</h2><div class="process">'+''.join(f'<div><span>0{i+1}</span><h3>{n}</h3><p>{d}</p></div>' for i,(n,d) in enumerate([('Understand','Share your application, site, equipment and project requirements.'),('Plan & design','Coordinate workflow, furniture layout and laboratory utilities.'),('Manufacture','Bring the equipment and furniture specification into production.'),('Install','Integrate laboratory systems at your project site.')]))+'</div></div></section>'+cta()
portfolio_clients = client_section().replace('/portfolio/#clients', '#client-directory')
full_clients = client_section(full=True)
directory_start = full_clients.index('<div class="project-directory">')
portfolio_directory = '<section class="wrap section" id="client-directory">' + full_clients[directory_start:].removesuffix('</div></section>') + '</section>'
portfolio = intro('OUR PORTFOLIO','Spaces that put<br><em>science to work.</em>','A closer look at laboratory interiors and equipment featured in the Visionaire catalogue.').replace('page-intro wrap', 'page-intro wrap portfolio-opening').replace('</section>', '<a class="button portfolio-catalogue" href="/assets/visionaire-catalogue.pdf" download>Download catalogue</a></section>') + portfolio_clients + portfolio_placeholders() + '<section class="wrap section compact"><div class="portfolio-grid">'+''.join(f'<figure>{img(im,cap)}<figcaption><span>0{i+1} / {cap}</span><span>Visionaire catalogue</span></figcaption></figure>' for i,(im,cap) in enumerate([('catalogue-3-0.64f26f9146.jpg','Laboratory workspaces'),('catalogue-3-1.4130362677.jpg','Integrated benches & storage'),('catalogue-3-2.e08873e780.jpg','Fume hood installations'),('catalogue-1-0.0c4465b8d3.jpg','Modular furniture systems')]))+ '</div><p class="small">Images are catalogue examples and are not attributed to individual clients.</p></section>' + portfolio_directory + cta()
contact = '<section class="contact-opening wrap"><p class="eyebrow">LET’S BUILD YOUR LAB</p><h1>Your next laboratory<br>starts here.</h1><div class="contact-actions"><a href="tel:+919632987799"><span>Call our team</span><strong>+91 96329 87799</strong></a><a href="mailto:sales@visionairelab.com"><span>Email us</span><strong>sales@visionairelab.com</strong></a><a href="' + whatsapp_url + '" target="_blank" rel="noopener" class="contact-whatsapp">' + whatsapp_icon + '<span>Chat on WhatsApp</span></a></div></section><section class="wrap contact-form-section">' + '''<div class="form-panel"><p class="eyebrow">PROJECT INQUIRY</p><h2>Tell us about your project.</h2><form id="inquiry-form"><div class="form-grid">'''+''.join(f'<label>{label}<input name="{name}" type="{typ}" autocomplete="{auto}" required maxlength="{limit}" {extra}></label>' for name,label,typ,auto,limit,extra in [('phone','Mobile number *','tel','tel',25,'pattern="[+0-9 ()-]{7,25}"'),('name','Full name *','text','name',100,''),('company','Company *','text','organization',160,''),('email','Email address *','email','email',254,''),('location','Project location *','text','address-level2',200,'')])+'''<label>Product / service *<select name="product" required><option value="">Select your interest</option>'''+''.join(f'<option>{n}</option>' for n in [x[0] for x in products]+['Specialist laboratory systems','Turnkey laboratory','Other / help me choose'])+'''</select></label><label class="full">Project requirements *<textarea name="requirements" rows="5" required minlength="10" maxlength="4000" placeholder="Tell us about your application, laboratory size, equipment needs and timeline."></textarea></label></div><label class="consent"><input type="checkbox" required> I agree to share these details with Visionaire through WhatsApp.</label><p class="small">This form prepares a WhatsApp message. You must press Send in WhatsApp to submit your inquiry. This website does not store your details.</p><button class="button" type="submit">Prepare WhatsApp inquiry</button><noscript><p>Enable JavaScript to prepare a message, or contact us by phone or email above.</p></noscript></form><div id="inquiry-result" hidden role="status"><h3>Your inquiry is ready.</h3><p>Review your message, then open WhatsApp and press Send. Nothing has been sent yet.</p><pre id="message-preview"></pre><a id="whatsapp-send" class="button" target="_blank" rel="noopener">Open WhatsApp</a><button id="copy-message" class="text-link" type="button">Copy message</button><p id="copy-status" class="small"></p></div></div>''' + '</section><section class="wrap section contact-locations"><h2>Visit Visionaire.</h2><div class="location-grid">' + '''<div class="address"><h3>Admin office</h3><p>3rd Floor, Shiva Complex, 6th Main Rd, SBI Staff Colony, Hoshalli Extension, Stage I, Vijayanagar, Bengaluru – 560040</p><a class="text-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Visionaire+Lab+Systems+Vijayanagar+Bengaluru">Open in Maps</a></div><div class="address"><h3>Manufacturing unit</h3><p>Plot No. 240/241, KIADB Industrial Area, Jigani–Bommasandra Link Road, Bengaluru – 560105</p></div>''' + '</div></section>'
pages={'explore-lab':('Interactive Laboratory', lab_tour(), 'Explore an interactive 3D laboratory and its equipment.'), '':('Laboratory Systems & Turnkey Solutions',home,'Laboratory fume hoods, modular furniture and turnkey engineering from Bengaluru. Visionaire Lab Systems, since 2007.'),'about':('About',about,'Learn about Visionaire Lab Systems, established in Bengaluru in March 2007. Nearly 20 years of laboratory engineering expertise.'),'products':('Products',productpage,'Explore benchtop, distillation and walk-in fume hoods, modular laboratory furniture, storage and accessories.'),'services':('Turnkey Laboratory Services',servicepage,'Laboratory planning, manufacturing and installation with HVAC, exhaust, electrical works, cleanrooms and integrated utilities.'),'portfolio':('Portfolio',portfolio,'Explore Visionaire laboratory interiors, equipment installations and selected project organisations.'),'contact':('Contact & Project Inquiry',contact,'Discuss your laboratory project with Visionaire. Prepare a detailed WhatsApp inquiry or contact our Bengaluru team.')}

for slug,(title,body,desc) in pages.items():
 url=ORIGIN+('/'+slug+'/' if slug else '/')
 header='<a class="skip" href="#main">Skip to content</a><header><div class="nav-wrap"><a class="brand" href="/" aria-label="Visionaire home"><img src="/assets/logo.png" alt="Visionaire Lab Systems" width="250" height="52"></a><button id="menu-toggle" aria-expanded="false" aria-controls="navigation" aria-label="Open navigation">Menu ☰</button><nav id="navigation" aria-label="Main navigation">'+''.join(f'<a href="/{s+"/" if s else ""}" {"aria-current=page" if s==slug else ""}>{n}</a>' for s,n in nav)+'<a class="mobile-catalogue" href="/assets/visionaire-catalogue.pdf">Download catalogue</a></nav>'+link('Catalogue','/assets/visionaire-catalogue.pdf','nav-cta')+'</div></header>'
 footer='<footer><div class="wrap footer-grid"><div><img src="/assets/logo.png" alt="Visionaire Lab Systems" width="240" height="50"><p>Built for science.<br>Designed for what’s next.</p><p class="small">Bengaluru, India · Since 2007</p></div><div><p class="eyebrow">EXPLORE</p>'+''.join(f'<a href="/{s+"/" if s else ""}">{n}</a>' for s,n in nav)+'</div><div><p class="eyebrow">LET’S BUILD SOMETHING</p><a href="mailto:sales@visionairelab.com">sales@visionairelab.com</a><a href="tel:+919632987799">+91 96329 87799</a><a href="https://wa.me/919632987799" target="_blank" rel="noopener">WhatsApp: +91 96329 87799</a><a href="/assets/visionaire-catalogue.pdf" download>Download catalogue</a></div></div><div class="wrap footer-bottom"><span>© 2026 Visionaire Lab Systems Pvt. Ltd.</span><span>Laboratory equipment · Furniture · Turnkey projects</span></div></footer>'
 schema={'@context':'https://schema.org','@type':'Organization','name':'Visionaire Lab Systems Pvt. Ltd.','url':'https://visionairelab.com/','foundingDate':'2007-03','telephone':'+91-9632987799','email':'sales@visionairelab.com','logo':ORIGIN+'/assets/logo.png'}
 home_start = """<script>
 (() => {
   const mobile = matchMedia('(max-width: 760px)').matches;
   const hash = location.hash;
   if (hash && !(mobile && hash === '#lab-systems')) return;
   if (!mobile && performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;

   history.scrollRestoration = 'manual';
   if (hash) history.replaceState(history.state, '', location.pathname + location.search);
   const showOpeningHero = () => {
     if (!location.hash) window.scrollTo({top: 0, behavior: 'instant'});
   };
   showOpeningHero();
   addEventListener('pageshow', () => requestAnimationFrame(showOpeningHero));
 })();
 </script>""" if not slug else ''
 model_version = asset_version("lab-model.js") if slug == "explore-lab" else ''
 model_script = f'<script defer src="/lab-model.js?v={model_version}"></script>' if slug == "explore-lab" else ''
 doc=f'<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{home_start}<title>{title} | Visionaire Lab Systems</title><meta name="description" content="{desc}"><link rel="canonical" href="{url}"><meta name="theme-color" content="#172b31"><meta property="og:type" content="website"><meta property="og:title" content="{title} | Visionaire Lab Systems"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{ORIGIN}/assets/catalogue-0-0.9eed30169c.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/refresh.css?v={asset_version("refresh.css")}"><script defer src="/app.js?v={asset_version("app.js")}"></script>{model_script}<script type="application/ld+json">{json.dumps(schema)}</script></head><body>{header}<main id="main">{body}</main>{footer}<a class="floating-whatsapp" href="{whatsapp_url}" target="_blank" rel="noopener" aria-label="Chat with Visionaire on WhatsApp">{whatsapp_icon}<span>WhatsApp</span></a></body></html>'
 target=D/slug;target.mkdir(exist_ok=True);(target/'index.html').write_text(doc)
(D/'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {ORIGIN}/sitemap.xml\n')
(D/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{ORIGIN}/{s+"/" if s else ""}</loc></url>' for s in pages)+'</urlset>')
(D/'assets/favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#172b31"/><path d="M12 16h10l10 27 10-27h10L36 51h-8z" fill="#eb793f"/></svg>')
print('Built all six pages.')
