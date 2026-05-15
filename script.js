/* ══════════════════════════════════════════════
   CANVAS PARTICLES
══════════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles(){
    particles = Array.from({length:55}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.2+0.3,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      a: Math.random()*0.5+0.1
    }));
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(14,165,233,${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    });
    // Draw connecting lines
    for(let i=0; i<particles.length; i++){
      for(let j=i+1; j<particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(14,165,233,${0.06*(1-dist/120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', ()=>{ resize(); initParticles(); });
  resize(); initParticles(); draw();
})();

/* ══════════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════════ */
const glow = document.getElementById('cursorGlow');
if(window.matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
} else { glow.style.display='none'; }

/* ══════════════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════════════ */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', scrollY > 60);
  // active link
  let cur = '';
  sections.forEach(s => { if(scrollY >= s.offsetTop - 140) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
}, {passive:true});

/* ══════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════ */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click', ()=>{
  mob.classList.toggle('open');
  const spans = ham.querySelectorAll('span');
  if(mob.classList.contains('open')){
    spans[0].style.transform='translateY(7px) rotate(45deg)';
    spans[1].style.opacity='0';
    spans[2].style.transform='translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  }
});
document.querySelectorAll('.mob-link,.mobile-menu .btn').forEach(a => {
  a.addEventListener('click', ()=>{
    mob.classList.remove('open');
    ham.querySelectorAll('span').forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  });
});

/* ══════════════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════════════ */
(function(){
  const el = document.getElementById('typed');
  const words = ['Frontend Developer','Software Engineer','CS & Design Student','Problem Solver'];
  let wi=0, ci=0, del=false;
  function type(){
    const word = words[wi];
    el.textContent = del ? word.slice(0,ci--) : word.slice(0,ci++);
    if(!del && ci===word.length+1){ del=true; return setTimeout(type,1800); }
    if(del && ci<0){ del=false; wi=(wi+1)%words.length; ci=0; return setTimeout(type,500); }
    setTimeout(type, del ? 50 : 100);
  }
  type();
})();

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); }});
}, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revObs.observe(el));

/* ══════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════ */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, {threshold:0.3});
document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

/* ══════════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════════ */
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.stat-num').forEach(el => {
      const target = +el.dataset.target;
      let cur = 0;
      const inc = () => {
        cur = Math.min(cur+1, target);
        el.textContent = cur;
        if(cur < target) setTimeout(inc, 120);
      };
      inc();
    });
    cntObs.unobserve(e.target);
  });
}, {threshold:0.5});
document.querySelectorAll('.stats-row').forEach(r => cntObs.observe(r));

/* ══════════════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* ══════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════ */
const sendBtn = document.getElementById('sendBtn');
const toast   = document.getElementById('toast');

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 4000);
}

sendBtn.addEventListener('click', ()=>{
  const inputs = document.querySelectorAll('#contact .form-input');
  let valid = true;
  inputs.forEach(inp => {
    if(!inp.value.trim()){ inp.style.borderColor='rgba(239,68,68,0.5)'; valid=false; }
    else inp.style.borderColor='';
  });
  if(!valid){ showToast('⚠ Please fill in all fields.'); return; }
  sendBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i>Sending…';
  sendBtn.disabled=true;
  setTimeout(()=>{
    inputs.forEach(inp=>inp.value='');
    sendBtn.innerHTML='<i class="fas fa-paper-plane"></i>Send Message';
    sendBtn.disabled=false;
    showToast('✔ Message sent! Jayant will get back to you soon.');
  },1800);
});

/* ══════════════════════════════════════════════
   TILT EFFECT on project cards
══════════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width - 0.5;
    const y = (e.clientY-r.top)/r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
});

