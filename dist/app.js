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
  const stages = [["Support frame", "The support frame carries the layers above it."], ["Base cabinet", "Storage sits beneath the work surface."], ["Worktop", "A dedicated surface for laboratory work."], ["Containment enclosure", "Rear and side panels define the work chamber."], ["Rear baffle", "The baffle guides air toward the exhaust."], ["Glazed sash", "The sash controls the working opening."], ["Exhaust plenum", "The plenum collects air from the chamber."], ["Duct collar", "The hood connects to the building exhaust."], ["One integrated system", "The layers come together as one fume hood."]];
  const scene = assembly.querySelector('.assembly-live-model');
  const scrubber = assembly.querySelector('.assembly-scrubber');
  const pieces = assembly.querySelectorAll('[data-piece]');
  const markers = assembly.querySelectorAll('.assembly-progress i');
  let gesture;
  let step;
  let renderedProgress = 0;
  let animationFrame;
  let previousTime;
  const render = time => {
    animationFrame = undefined;
    const travel = scrubber.scrollWidth - scrubber.clientWidth;
    const target = travel <= 0 ? 0 : travel - scrubber.scrollLeft <= 2 ? 1 : Math.max(0, scrubber.scrollLeft / travel);
    const elapsed = previousTime === undefined ? 16 : Math.min(64, time - previousTime);
    previousTime = time;
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 65);
    renderedProgress += (target - renderedProgress) * blend;
    if (Math.abs(target - renderedProgress) < .0001) renderedProgress = target;
    else animationFrame = requestAnimationFrame(render);
    const stage = renderedProgress * 8;
    const index = Math.min(8, Math.floor(stage + .001));
    for (const part of pieces) {
      const order = Number(part.dataset.piece);
      const arrival = Math.min(1, Math.max(0, stage - order + 1));
      const offset = (1 - arrival) ** 2;
      part.setAttribute('transform', `translate(${Number(part.dataset.x) * offset} ${Number(part.dataset.y) * offset})`);
      part.style.opacity = order <= index ? '1' : '.55';
    }
    assembly.classList.toggle('is-complete', index === 8);
    if (step === index) return;
    step = index;
    assembly.querySelector('[data-step-number]').textContent = String(index + 1).padStart(2, '0');
    assembly.querySelector('[data-step-title]').textContent = stages[index][0];
    assembly.querySelector('[data-step-detail]').textContent = stages[index][1];
    markers.forEach((marker,i) => marker.classList.toggle('active', i <= index));
  };
  const queueRender = () => {
    if (animationFrame !== undefined) return;
    previousTime = undefined;
    animationFrame = requestAnimationFrame(render);
  };
  scrubber.addEventListener('scroll', queueRender, { passive: true });
  scene.addEventListener('wheel', event => {
    if (!event.deltaX || Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
    event.preventDefault();
    scrubber.scrollLeft += event.deltaX * 5;
  }, { passive: false });
  scene.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    gesture = { id:event.pointerId, x:event.clientX, start:scrubber.scrollLeft };
    scene.setPointerCapture(event.pointerId);
  });
  scene.addEventListener('pointermove', event => {
    if (gesture?.id === event.pointerId) {
      scrubber.scrollLeft = gesture.start + (gesture.x - event.clientX) * 10;
    }
  });
  for (const type of ['pointerup','pointercancel','lostpointercapture']) scene.addEventListener(type,()=>{gesture=undefined;});
  scene.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const end = scrubber.scrollWidth - scrubber.clientWidth;
    scrubber.scrollLeft = event.key === 'Home' ? 0 : event.key === 'End' ? end : scrubber.scrollLeft + (event.key === 'ArrowRight' ? 1 : -1)*end/8;
  });
  new ResizeObserver(queueRender).observe(scrubber);
  queueRender();
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
