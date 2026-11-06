'use strict';

const viewport = document.querySelector('.lab-viewport');
const canvas = viewport?.querySelector('canvas');
const context = canvas?.getContext('2d');

if (context) {
  const lab = viewport.closest('.lab-tour');
  const pinLayer = viewport.querySelector('.lab-model-pins');
  const originalPins = Array.from(lab.querySelectorAll('.lab-pin'));
  const pins = originalPins.map(original => {
    const pin = original.cloneNode(true);
    pin.removeAttribute('style');
    pin.addEventListener('click', () => original.click());
    pinLayer.append(pin);
    return pin;
  });
  const selection = new MutationObserver(() => {
    pins.forEach((pin, index) => pin.setAttribute('aria-pressed', originalPins[index].getAttribute('aria-pressed')));
    draw();
  });
  originalPins.forEach(pin => selection.observe(pin, { attributes: true, attributeFilter: ['aria-pressed'] }));

  // Solid primitives arranged in lab coordinates: width, height and depth.
  const boxes = [];
  const box = (x, y, z, w, h, d, color, group = '') => boxes.push({ x,y,z,w,h,d,color,group });
  box(-3.8,-.15,-2.55,7.6,.15,5.1,'#28464c');
  box(-3.8,0,-2.53,7.6,2.75,.12,'#315157');
  box(-3.79,0,-2.4,.12,2.75,4.95,'#28494f');
  for (let i=0;i<4;i++) {
    const x = -2.95+i*1.47;
    box(x,.08,-.75,1.38,.95,1.36,'#396b65','storage');
    box(x+.09,.19,.62,1.19,.51,.05,'#527f76','storage');
    box(x+.09,.76,.62,1.19,.18,.05,'#52867e','storage');
    box(x+.47,.82,.68,.4,.045,.045,'#e5f1dd','storage');
    box(x+.15,.43,.68,.07,.15,.05,'#e5f1dd','storage');
    box(x+.25,1.09,-.46,.75,.16,.29,'#749699','utilities');
    for (let j=0;j<3;j++) box(x+.33+j*.21,1.14,-.15,.095,.065,.025,'#142b38','utilities');
  }
  box(-3.14,1.02,-.86,6.07,.13,1.64,'#83a6a0','benches');
  for (const x of [-2.66,-.52,1.62]) {
    box(x,1.15,-.73,.08,1.04,.09,'#6c9d98','benches');
    box(x+1.08,1.15,-.73,.08,1.04,.09,'#6c9d98','benches');
    box(x-.05,1.79,-.76,1.28,.07,.49,'#65928d','benches');
  }
  // Ceiling-mounted extraction arm with a stepped capture canopy.
  box(.65,2.25,-.95,.21,1.05,.21,'#cbded4','extraction');
  box(.65,2.25,-.75,.21,.2,1.23,'#d2e5dc','extraction');
  box(.65,1.76,.3,.21,.55,.2,'#d2e5dc','extraction');
  box(.44,1.64,.12,.63,.14,.58,'#d9e7df','extraction');
  box(.34,1.57,.03,.83,.08,.75,'#b3d2c6','extraction');
  box(-3.44,.07,-2.26,.63,2.16,.72,'#52756d');
  box(-3.38,.21,-1.52,.49,1.78,.07,'#71988b');
  box(-3.02,1.12,-1.44,.055,.18,.045,'#e5f1dd');

  const faces = [
    { points:[0,1,5,4], light:.63 }, { points:[3,7,6,2], light:.87 },
    { points:[0,4,7,3], light:.7 }, { points:[1,2,6,5], light:.92 },
    { points:[4,5,6,7], light:1.14 }, { points:[0,3,2,1], light:.51 }
  ];
  const anchors = [[.76,2.52,.21],[-1.8,1.15,.95],[-.6,.58,1.02],[2.12,1.25,-.09]];
  const startAngle = -.36;
  let angle = startAngle;
  let pitch = .52;
  let drag;

  function project(x,y,z) {
    const rx = x*Math.cos(angle) - z*Math.sin(angle);
    const rz = x*Math.sin(angle) + z*Math.cos(angle);
    const ry = (y-1.18)*Math.cos(pitch) - rz*Math.sin(pitch);
    const depth = rz*Math.cos(pitch) + (y-1.18)*Math.sin(pitch);
    const scale = 83 * 16 / (16-depth);
    return { x:420 + rx*scale, y:306 - ry*scale, depth };
  }

  function tint(hex, light) {
    const value = parseInt(hex.slice(1),16);
    const rgb = [value>>16,(value>>8)&255,value&255].map(n=>Math.min(255,Math.round(n*light)));
    return `rgb(${rgb.join(',')})`;
  }

  function draw() {
    context.clearRect(0,0,840,650);
    const selected = pins.find(pin => pin.getAttribute('aria-pressed') === 'true')?.dataset.point;
    const surfaces = [];
    for (const { x,y,z,w,h,d,color,group } of boxes) {
      const vertices = [[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d],[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]].map(v=>project(...v));
      for (const face of faces) {
        const p = face.points.map(i=>vertices[i]);
        const winding = (p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);
        if (winding <= 0) continue;
        surfaces.push({p,depth:p.reduce((sum,v)=>sum+v.depth,0)/4,color,light:face.light,group});
      }
    }
    surfaces.sort((a,b)=>a.depth-b.depth);
    for (const {p,color,light,group} of surfaces) {
      const active = group && group === selected;
      context.beginPath();
      p.forEach((v,i)=>i ? context.lineTo(v.x,v.y) : context.moveTo(v.x,v.y));
      context.closePath();
      context.fillStyle=tint(color,active ? light*1.16 : light);
      context.fill();
      context.strokeStyle=active ? '#b5f5d5' : '#81aaa485';
      context.lineWidth=active ? 1.5 : 1;
      context.stroke();
    }
    anchors.forEach((point,index)=>{
      const pos=project(...point);
      pins[index].style.left=`${100*pos.x/840}%`;
      pins[index].style.top=`${100*pos.y/650}%`;
    });
  }

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    drag = { id:event.pointerId, x:event.clientX, y:event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    angle = Math.max(-1.17,Math.min(.95,angle+(event.clientX-drag.x)*.009));
    pitch = Math.max(.3,Math.min(.82,pitch+(event.clientY-drag.y)*.005));
    drag.x=event.clientX;
    drag.y=event.clientY;
    draw();
  });
  for (const type of ['pointerup','pointercancel','lostpointercapture']) {
    canvas.addEventListener(type, () => { drag=undefined; });
  }
  viewport.querySelectorAll('[data-orbit]').forEach(button => button.addEventListener('click',()=>{
    const direction=Number(button.dataset.orbit);
    angle=direction ? Math.max(-1.17,Math.min(.95,angle+direction*.22)) : startAngle;
    if (!direction) pitch=.52;
    draw();
  }));
  pins.forEach((pin,index)=>pin.setAttribute('aria-pressed',originalPins[index].getAttribute('aria-pressed')));
  draw();
  viewport.hidden=false;
  lab.querySelector('.lab-reference').open=false;
}
