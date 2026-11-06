'use strict';
const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){menu.click();menu.focus();}});
const video=document.querySelector('#hero-video');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (video) {
  const control = document.querySelector('#video-control');
  const hero = video.closest('.hero');
  const updateLabel = () => {
    control.textContent = video.ended ? 'Replay film' : video.paused ? 'Play film' : 'Pause film';
  };
  for (const event of ['playing', 'pause', 'ended']) {
    video.addEventListener(event, updateLabel);
  }
  video.addEventListener('playing', () => hero.classList.add('film-playing'));
  video.muted = true;
  if (reducedMotion.matches) {
    video.autoplay = false;
    video.pause();
    updateLabel();
  } else {
    video.play().catch(updateLabel);
  }
  control.addEventListener('click', () => {
    if (!video.paused) {
      video.pause();
      return;
    }
    if (video.ended) video.currentTime = 0;
    video.play().catch(updateLabel);
  });
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

  const assembly = document.querySelector('[data-assembly]');
  if (assembly) {
    const steps = ['Base cabinet', 'Worktop', 'Containment enclosure', 'Glazed sash', 'Exhaust plenum', 'One integrated system'];
    const parts = Array.from(assembly.querySelectorAll('[data-piece]'), part => ({
      part,
      order: Number(part.dataset.piece),
      x: Number(part.dataset.x),
      y: Number(part.dataset.y)
    }));
    const number = assembly.querySelector('[data-step-number]');
    const title = assembly.querySelector('[data-step-title]');
    const pin = assembly.querySelector('.assembly-pin');
    const markers = assembly.querySelectorAll('.assembly-track i');
    const clamp = value => Math.min(1, Math.max(0, value));
    let frame;
    let lastStep;
    const renderAssembly = () => {
      frame = undefined;
      const bounds = assembly.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - pin.offsetHeight);
      const progress = clamp((parseFloat(getComputedStyle(pin).top) - bounds.top) / travel);
      const step = Math.min(5, Math.floor(progress * 6));
      for (const { part, order, x, y } of parts) {
        const arrival = clamp(progress * 6 - order);
        const offset = (1 - arrival) ** 2;
        part.setAttribute('transform', `translate(${x * offset} ${y * offset})`);
        part.style.opacity = order > step ? '.48' : '1';
      }
      if (lastStep !== step) {
        number.textContent = String(step + 1).padStart(2, '0');
        title.textContent = steps[step];
        markers.forEach((marker, index) => marker.classList.toggle('active', index <= step));
        lastStep = step;
      }
    };
    const queueAssembly = () => {
      if (frame === undefined) frame = requestAnimationFrame(renderAssembly);
    };
    assembly.classList.add('has-motion');
    addEventListener('scroll', queueAssembly, { passive: true });
    addEventListener('resize', queueAssembly);
    renderAssembly();
  }
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>card.hidden=button.dataset.filter!=='All products'&&card.dataset.category!==button.dataset.filter);}));
const form=document.querySelector('#inquiry-form');
if(form){const selected=new URLSearchParams(location.search).get('product');if(selected&&Array.from(form.elements.product.options).some(x=>x.value===selected))form.elements.product.value=selected;
 form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
 form.addEventListener('submit',e=>{e.preventDefault();const phone=form.elements.phone;const digits=phone.value.replace(/\D/g,'');if(digits.length<7||digits.length>15){phone.setCustomValidity('Enter a phone number with 7 to 15 digits, including country code where applicable.');phone.reportValidity();return;}const data=new FormData(form);const fields=[['Name','name'],['Company','company'],['Phone','phone'],['Email','email'],['Product / service','product'],['Location','location'],['Requirements','requirements']];const message='Hello Visionaire, I would like to discuss a laboratory project.\n\n'+fields.map(([label,key])=>label+': '+String(data.get(key)).trim()).join('\n');document.querySelector('#message-preview').textContent=message;document.querySelector('#whatsapp-send').href='https://wa.me/919901076118?text='+encodeURIComponent(message);const result=document.querySelector('#inquiry-result');result.hidden=false;result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});});
 document.querySelector('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#message-preview').textContent);document.querySelector('#copy-status').textContent='Message copied. Paste it into WhatsApp and press Send.';}catch{document.querySelector('#copy-status').textContent='Copy is unavailable here. Select and copy the message above, or use Open WhatsApp.';}});
 form.addEventListener('input',()=>{document.querySelector('#inquiry-result').hidden=true;});
}
