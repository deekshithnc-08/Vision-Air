'use strict';
const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){menu.click();menu.focus();}});
const video=document.querySelector('#hero-video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (video) {
  const revealFilm = () => video.closest('.hero').classList.add('film-playing');
  video.addEventListener('playing', revealFilm);
  video.muted = true;
  if (reducedMotion.matches) {
    video.autoplay = false;
    video.pause();
  } else {
    if (!video.paused && video.readyState >= 2) revealFilm();
    video.play().then(revealFilm).catch(() => {});
  }
}

if (!reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.add('entered');
      observer.unobserve(target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .product-card, .image-section, .portfolio-grid figure, .service-list article').forEach(element => {
    element.classList.add('scroll-enter');
    observer.observe(element);
  });

}

const assembly = document.querySelector('[data-assembly]');
if (assembly) {
  const reel = assembly.querySelector('.assembly-reel');
  const frames = Array.from(reel.querySelectorAll('.assembly-frame'));
  const markers = assembly.querySelectorAll('.assembly-progress i');
  const title = assembly.querySelector('[data-step-title]');
  const detail = assembly.querySelector('[data-step-detail]');
  const number = assembly.querySelector('[data-step-number]');
  let scheduled = false;
  let drag;
  const updateLayer = () => {
    scheduled = false;
    const index = Math.min(frames.length - 1, Math.max(0, Math.round(reel.scrollLeft / reel.clientWidth)));
    const caption = frames[index].querySelector('figcaption');
    number.textContent = String(index + 1).padStart(2, '0');
    title.textContent = caption.querySelector('strong').textContent;
    detail.textContent = caption.querySelector('p').textContent;
    markers.forEach((marker, i) => marker.classList.toggle('active', i <= index));
  };
  reel.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateLayer); }
  }, { passive: true });
  reel.addEventListener('keydown', event => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    reel.scrollBy({ left: direction * reel.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  reel.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, start: reel.scrollLeft };
    reel.setPointerCapture(event.pointerId);
    reel.classList.add('is-dragging');
  });
  reel.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) reel.scrollLeft = drag.start + drag.x - event.clientX;
  });
  const endDrag = () => { drag = undefined; reel.classList.remove('is-dragging'); };
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) reel.addEventListener(type, endDrag);
  new ResizeObserver(updateLayer).observe(reel);
  assembly.classList.add('horizontal-assembly');
  updateLayer();
}

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='All products'&&card.dataset.category!==button.dataset.filter);}));
const form=document.querySelector('#inquiry-form');
if(form){const selected=new URLSearchParams(location.search).get('product');if(selected&&Array.from(form.elements.product.options).some(x=>x.value===selected))form.elements.product.value=selected;
 form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
 form.addEventListener('submit',e=>{e.preventDefault();const phone=form.elements.phone;const digits=phone.value.replace(/\D/g,'');if(digits.length<7||digits.length>15){phone.setCustomValidity('Enter a phone number with 7 to 15 digits, including country code where applicable.');phone.reportValidity();return;}const data=new FormData(form);const fields=[['Name','name'],['Company','company'],['Phone','phone'],['Email','email'],['Product / service','product'],['Location','location'],['Requirements','requirements']];const message='Hello Visionaire, I would like to discuss a laboratory project.\n\n'+fields.map(([label,key])=>label+': '+String(data.get(key)).trim()).join('\n');document.querySelector('#message-preview').textContent=message;document.querySelector('#whatsapp-send').href='https://wa.me/919632987799?text='+encodeURIComponent(message);const result=document.querySelector('#inquiry-result');result.hidden=false;result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});});
 document.querySelector('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#message-preview').textContent);document.querySelector('#copy-status').textContent='Message copied. Paste it into WhatsApp and press Send.';}catch{document.querySelector('#copy-status').textContent='Copy is unavailable here. Select and copy the message above, or use Open WhatsApp.';}});
 form.addEventListener('input',()=>{document.querySelector('#inquiry-result').hidden=true;});
}

const projectSearch = document.querySelector('#project-search');
if (projectSearch) {
  const projects = Array.from(document.querySelectorAll('.project-directory .clients li'));
  const count = document.querySelector('#project-count');
  projectSearch.closest('label').hidden = false;
  projectSearch.addEventListener('input', () => {
    const query = projectSearch.value.trim().toLowerCase();
    let visible = 0;
    for (const project of projects) {
      project.hidden = !project.textContent.toLowerCase().includes(query);
      if (!project.hidden) visible++;
    }
    count.textContent = query ? (visible ? `${visible} matching projects` : 'No matching projects.') : '';
  });
}

const clientMarquee = document.querySelector('#client-marquee');
if (clientMarquee && !reducedMotion.matches) {
  const motionButton = document.querySelector('.client-motion');
  const startMarquee = () => {
    clientMarquee.classList.add('is-moving');
    motionButton.hidden = false;
  };
  if ('IntersectionObserver' in window) {
    const nearby = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      startMarquee();
      nearby.disconnect();
    }, { rootMargin: '300px' });
    nearby.observe(clientMarquee);
  } else {
    startMarquee();
  }
  motionButton.addEventListener('click', () => {
    const paused = clientMarquee.classList.toggle('is-paused');
    motionButton.textContent = paused ? 'Resume client logos' : 'Pause client logos';
  });
}

const labTour = document.querySelector('#explore-lab');
if (labTour) {
  const panels = Array.from(labTour.querySelectorAll('[data-panel]'));
  const announce = labTour.querySelector('.tour-announcement');
  const card = document.createElement('aside');
  card.className = 'lab-inspector';
  card.setAttribute('aria-label', 'Equipment details');
  card.hidden = true;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'lab-inspector-close';
  close.textContent = 'Close';
  const content = document.createElement('div');
  card.append(close, content);
  let activePin;

  const hideCard = () => {
    if (card.contains(document.activeElement)) activePin?.focus({ preventScroll: true });
    card.hidden = true;
    activePin = undefined;
  };
  close.addEventListener('click', hideCard);
  labTour.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !card.hidden) hideCard();
  });
  const selectPoint = key => {
    for (const button of labTour.querySelectorAll('[data-point]')) {
      button.setAttribute('aria-pressed', String(button.dataset.point === key));
    }
    for (const panel of panels) panel.hidden = panel.dataset.panel !== key;
    return panels.find(panel => panel.dataset.panel === key);
  };
  selectPoint(panels[0].dataset.panel);
  labTour.querySelector('.lab-pins').hidden = false;
  labTour.querySelector('.lab-tour-options').hidden = false;
  const activatePoint = (button, keyboard = false) => {
    const panel = selectPoint(button.dataset.point);
    announce.textContent = panel.querySelector('h3').textContent + ' details selected.';
    const scene = button.closest('.lab-viewport, .lab-tour-photo');
    if (!scene || (scene.classList.contains('lab-viewport') && !matchMedia('(max-width: 760px)').matches)) {
      hideCard();
      return;
    }
    if (button === activePin && !card.hidden) {
      hideCard();
      return;
    }

    activePin = button;
    content.replaceChildren(...Array.from(panel.children, element => element.cloneNode(true)));
    scene.after(card);
    card.hidden = false;
    if (keyboard) close.focus({ preventScroll: true });
  };
  labTour.addEventListener('click', event => {
    const button = event.target.closest('[data-point]');
    if (button) activatePoint(button, event.detail === 0);
  });

  // A tap targets the pin directly. Movement leaves the browser's scroll gesture alone.
  let touchPin;
  labTour.addEventListener('touchstart', event => {
    const pin = event.target.closest('.lab-pin');
    const touch = event.touches[0];
    touchPin = pin && event.touches.length === 1
      ? { pin, id: touch.identifier, x: touch.clientX, y: touch.clientY }
      : undefined;
  }, { passive: true });
  labTour.addEventListener('touchmove', event => {
    if (!touchPin) return;
    const touch = event.touches[0];
    if (event.touches.length !== 1 || Math.hypot(touch.clientX - touchPin.x, touch.clientY - touchPin.y) > 8) touchPin = undefined;
  }, { passive: true });
  labTour.addEventListener('touchcancel', () => { touchPin = undefined; }, { passive: true });
  labTour.addEventListener('touchend', event => {
    const start = touchPin;
    touchPin = undefined;
    if (!start || !event.cancelable) return;
    const touch = Array.from(event.changedTouches).find(touch => touch.identifier === start.id);
    if (!touch || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 8) return;
    event.preventDefault();
    activatePoint(start.pin);
  }, { passive: false });
  labTour.querySelector('.lab-reference').addEventListener('toggle', event => {
    if (!event.target.open && card.closest('.lab-reference')) hideCard();
  });
}
