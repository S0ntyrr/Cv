const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', ()=>{
  if(nav.style.display === 'flex') nav.style.display = 'none';
  else nav.style.display = 'flex';
});

const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const audioEl = document.getElementById('presentacion-audio');
const audioProgress = document.querySelector('.audio-progress');
const audioTrack = document.querySelector('.audio-track');

const syncAudioButtons = (isPlaying) => {
  if (!playBtn || !pauseBtn || !audioTrack) return;
  playBtn.style.display = isPlaying ? 'none' : 'inline-block';
  pauseBtn.style.display = isPlaying ? 'inline-block' : 'none';
  audioTrack.classList.toggle('active', isPlaying);
};

const startAudio = () => audioEl?.play().then(()=>{
  syncAudioButtons(true);
}).catch(()=>{
  syncAudioButtons(false);
});

playBtn?.addEventListener('click', ()=>{
  startAudio();
});

pauseBtn?.addEventListener('click', ()=>{ 
  audioEl.pause();
  syncAudioButtons(false);
});

restartBtn?.addEventListener('click', ()=>{
  audioEl.currentTime = 0;
  startAudio();
});

audioEl?.addEventListener('timeupdate', ()=>{
  if(audioEl.duration) {
    const percent = (audioEl.currentTime / audioEl.duration) * 100;
    if(audioProgress) audioProgress.style.width = percent + '%';
  }
});

audioEl?.addEventListener('ended', ()=>{
  syncAudioButtons(false);
});

audioTrack?.addEventListener('click', (e)=>{
  if(!audioEl || !audioEl.duration) return;
  const rect = audioTrack.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioEl.currentTime = percent * audioEl.duration;
});

const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{ if(ent.isIntersecting) ent.target.classList.add('active'); });
},{threshold:0.08});
reveals.forEach(r=>obs.observe(r));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    const el = document.querySelector(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    if(window.innerWidth<=800) nav.style.display='none';
  });
});

window.addEventListener('load', ()=>{
  if (audioEl) audioEl.preload = 'auto';
  if (audioEl) audioEl.loop = false;
  startAudio();
  document.addEventListener('pointerdown', ()=>{
    if (audioEl && audioEl.paused) startAudio();
  }, { once: true });
});
