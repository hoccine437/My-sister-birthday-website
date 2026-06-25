/* ============================================================
   🎂  BIRTHDAY SITE — Interactive Script
   ------------------------------------------------------------
   Vanilla JS. No dependencies.
   To rename the sister, edit SISTER_NAME below.
   ============================================================ */

(() => {
  'use strict';

  /* --------------------------------------------------------
     SISTER NAME — edit here, changes everywhere
     -------------------------------------------------------- */
  const SISTER_NAME = 'basmala';

  /* --------------------------------------------------------
     CONFIG
     -------------------------------------------------------- */
  const CONFIG = {
    // Music options:
    //  - 'generated' (default): plays a synthesized "Happy Birthday"
    //    melody via Web Audio API — no external file required.
    //  - 'file': plays a user-supplied audio file (set musicPath).
    musicMode: 'generated',
    musicPath: 'assets/music/birthday-song.mp3',
    musicVolume: 0.22,
    confettiDuration: 4500, // ms
    surpriseDuration: 12000, // ms fireworks auto-duration
  };

  /* ========================================================
     1. UTILITIES
     ======================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================
     2. SISTER NAME BINDING
        Replaces every [data-sister] / [data-sister-title]
     ======================================================== */
  function bindSisterName() {
    $$('[data-sister]').forEach((el) => (el.textContent = SISTER_NAME));
    $$('[data-sister-title]').forEach((el) => (el.textContent = SISTER_NAME));
    document.title = `Happy Birthday ${SISTER_NAME} 🎂`;
  }

  /* ========================================================
     3. LOADER
     ======================================================== */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;

    let hidden = false;

    function hide() {
      if (hidden) return;
      hidden = true;
      loader.classList.add('is-hidden');
    }

    // Hide on any first user interaction (also unlocks audio on mobile)
    const onInteract = () => {
      hide();
      if (window.__startMusic) window.__startMusic();
      document.removeEventListener('pointerdown', onInteract);
      document.removeEventListener('keydown', onInteract);
    };
    document.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    document.addEventListener('keydown', onInteract, { once: true });

    // Fallback: auto-hide after load + a short pause
    window.addEventListener('load', () => setTimeout(hide, 800));
    setTimeout(hide, 3500); // hard ceiling
  }

  /* ========================================================
     4. STARS / PARTICLES CANVAS
     ======================================================== */
  function initStars() {
    const canvas = $('#stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let stars = [];
    const STAR_COUNT_DESKTOP = 180;
    const STAR_COUNT_MOBILE = 80;

    function resize() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function buildStars() {
      stars = [];
      const count = window.innerWidth < 768 ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: rand(0, window.innerWidth),
          y: rand(0, window.innerHeight),
          r: rand(0.3, 1.6),
          a: rand(0.2, 1),
          twinkleSpeed: rand(0.005, 0.02),
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          hue: rand(0, 60), // gold-pink range
        });
      }
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Soft moving gradient that follows mouse (very subtle)
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 400);
      grad.addColorStop(0, 'rgba(255, 107, 157, 0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.a += s.twinkleSpeed * s.twinkleDir;
        if (s.a > 1) { s.a = 1; s.twinkleDir = -1; }
        if (s.a < 0.2) { s.a = 0.2; s.twinkleDir = 1; }

        // Color: warm cream/rose/gold mix
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${30 + s.hue}, 80%, 85%, ${s.a})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    resize();
    buildStars();
    draw();

    window.addEventListener('resize', () => {
      resize();
      buildStars();
    });
  }

  /* ========================================================
     5. CONFETTI (Page load burst)
     ======================================================== */
  function initConfetti() {
    const canvas = $('#confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let active = false;
    let startTime = 0;

    const COLORS = ['#f7cac9', '#ff6b9d', '#d4af37', '#c9a96e', '#b794f4', '#6b3fa0', '#fff5e6'];

    function resize() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function spawn(n = 120) {
      for (let i = 0; i < n; i++) {
        particles.push({
          x: rand(0, window.innerWidth),
          y: rand(-40, -10),
          vx: rand(-3, 3),
          vy: rand(2, 6),
          r: rand(4, 9),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.2, 0.2),
          color: COLORS[randInt(0, COLORS.length - 1)],
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          life: 1,
        });
      }
    }

    function draw(now) {
      if (!active) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.rot += p.vr;
        p.vx *= 0.995; // air resistance

        if (p.y > window.innerHeight + 20) {
          particles.splice(i, 1);
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / CONFIG.confettiDuration);

        if (p.shape === 'rect') {
          ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < CONFIG.confettiDuration && particles.length > 0) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        active = false;
        particles = [];
      }
    }

    function burst() {
      if (prefersReducedMotion || active) return;
      active = true;
      particles = [];
      startTime = performance.now();
      spawn(140);
      // Secondary bursts
      setTimeout(() => spawn(60), 800);
      setTimeout(() => spawn(60), 1600);
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);

    // Auto-burst on load
    setTimeout(burst, 1000);

    // Expose for the Celebrate button
    window.__confettiBurst = burst;
  }

  /* ========================================================
     6. HERO TITLE — split into per-letter spans
     ======================================================== */
  function initHeroTitle() {
    const titleEl = $('.hero-title');
    if (!titleEl) return;
    titleEl.innerHTML = '';

    const words = ['Happy', 'Birthday'];
    words.forEach((word, wIdx) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'word';

      [...word].forEach((ch, lIdx) => {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        if (lIdx === 0) letterEl.classList.add('is-cap');
        letterEl.textContent = ch;
        // Stagger: each letter after the previous by ~80ms, with a beat between words
        const delay = wIdx * 6 * 80 + lIdx * 80;
        letterEl.style.animationDelay = `${delay}ms, ${delay + 800}ms`;
        wordEl.appendChild(letterEl);
      });

      titleEl.appendChild(wordEl);
    });
  }

  /* ========================================================
     7. TYPEWRITER
     ======================================================== */
  function initTypewriter() {
    const target = $('#typewriter');
    if (!target) return;

    const messages = [
      `Wishing you a day as beautiful as your heart, ${SISTER_NAME}.`,
      `May every wish you make today come true.`,
      `You deserve all the soft, sweet things.`,
      `Today, the world celebrates you.`,
    ];

    let msgIdx = 0;
    let chIdx = 0;
    let deleting = false;

    function tick() {
      const current = messages[msgIdx];

      if (!deleting) {
        chIdx++;
        target.textContent = current.slice(0, chIdx);
        if (chIdx === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, rand(40, 80));
      } else {
        chIdx--;
        target.textContent = current.slice(0, chIdx);
        if (chIdx === 0) {
          deleting = false;
          msgIdx = (msgIdx + 1) % messages.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, rand(20, 40));
      }
    }

    // Start after hero letters have begun to appear
    setTimeout(tick, 1200);
  }

  /* ========================================================
     8. INTERACTIVE CAKE
     ======================================================== */
  function initCake() {
    const candles = $$('[data-candle]');
    const wishEl = $('#wish-text');
    const resetBtn = $('#reset-candles');

    const wishes = [
      `Make a wish, ${SISTER_NAME} ✨`,
      `That one's coming true 🌸`,
      `Almost there… 💫`,
      `Two more wishes to go! 🎀`,
      `One last candle… 🤍`,
      `All wishes sealed. Happy Birthday, ${SISTER_NAME} 🎂`,
    ];

    let blownCount = 0;

    function blowCandle(candle) {
      if (candle.classList.contains('is-blown')) return;
      candle.classList.add('is-blown');
      blownCount++;
      wishEl.classList.remove('show');
      // Force reflow to restart animation
      void wishEl.offsetWidth;
      wishEl.textContent = wishes[Math.min(blownCount, wishes.length - 1)];
      wishEl.classList.add('show');

      // Soft puff sound on every blow
      if (window.__playBlowSFX) window.__playBlowSFX();

      if (blownCount >= candles.length) {
        // Final wish — big celebration with fanfare!
        setTimeout(() => {
          if (window.__confettiBurst) window.__confettiBurst();
          if (window.__playCelebrationSFX) window.__playCelebrationSFX();
          spawnHeartBurst(8);
        }, 400);
      }
    }

    candles.forEach((candle) => {
      // pointerdown handles both mouse + touch with no 300ms tap delay
      candle.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        blowCandle(candle);
      });
    });

    // Clicking the cake itself blows a random candle
    const cake = $('.cake');
    if (cake) {
      cake.addEventListener('click', (e) => {
        if (e.target.closest('[data-candle]')) return;
        const remaining = candles.filter((c) => !c.classList.contains('is-blown'));
        if (remaining.length) {
          blowCandle(remaining[randInt(0, remaining.length - 1)]);
        }
      });
      cake.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const remaining = candles.filter((c) => !c.classList.contains('is-blown'));
          if (remaining.length) {
            blowCandle(remaining[randInt(0, remaining.length - 1)]);
          }
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        candles.forEach((c) => c.classList.remove('is-blown'));
        blownCount = 0;
        wishEl.classList.remove('show');
      });
    }

    // Auto-blow a random candle after the user has lingered on the section
    if (!prefersReducedMotion) {
      const cakeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                const remaining = candles.filter((c) => !c.classList.contains('is-blown'));
                if (remaining.length) blowCandle(remaining[0]);
              }, 3500);
              cakeObserver.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      const cakeEl = $('.cake');
      if (cakeEl) cakeObserver.observe(cakeEl);
    }
  }

  /* ========================================================
     9. REVEAL ON SCROLL
     ======================================================== */
  function initReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger delay based on the inline --wi / --gi variable for grids
            const idx = parseInt(entry.target.style.getPropertyValue('--wi') || entry.target.style.getPropertyValue('--gi') || 0, 10);
            entry.target.style.setProperty('--reveal-delay', `${idx * 120}ms`);
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ========================================================
     10. ACTIVE NAV DOTS
     ======================================================== */
  function initNavDots() {
    const dots = $$('.nav-dot');
    const sections = $$('section[id]');

    if (!dots.length) return;

    function update() {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      let currentId = sections[0]?.id;

      sections.forEach((s) => {
        if (s.offsetTop <= scrollY) currentId = s.id;
      });

      dots.forEach((dot) => {
        dot.classList.toggle('active', dot.dataset.target === currentId);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ========================================================
     11. MUSIC — Web Audio synthesized Happy Birthday
     ======================================================== */

  // Shared AudioContext (re-used for music + SFX for best practice)
  let _audioCtx = null;
  function getAudioContext() {
    if (_audioCtx) return _audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      _audioCtx = new AC();
      return _audioCtx;
    } catch (e) {
      return null;
    }
  }

  // Note frequencies (equal temperament, A4 = 440Hz)
  const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
    G5: 783.99,
  };

  // Classic "Happy Birthday" melody — [note, duration in beats]
  const MELODY = [
    // "Happy birthday to you"
    ['G4', 0.5], ['G4', 0.5], ['A4', 1.0], ['G4', 1.0], ['C5', 1.0], ['B4', 2.0],
    // "Happy birthday to you"
    ['G4', 0.5], ['G4', 0.5], ['A4', 1.0], ['G4', 1.0], ['D5', 1.0], ['C5', 2.0],
    // "Happy birthday dear ___"
    ['G4', 0.5], ['G4', 0.5], ['G5', 1.0], ['E5', 1.0], ['C5', 1.0], ['B4', 1.0], ['A4', 2.0],
    // "Happy birthday to you"
    ['F5', 0.5], ['F5', 0.5], ['E5', 1.0], ['C5', 1.0], ['D5', 1.0], ['C5', 2.0],
  ];

  class BirthdayMusic {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.playing = false;
      this.loopTimer = null;
      this.scheduledNodes = [];
      this.bpm = 100;
      this.beatDur = 60 / this.bpm;
    }

    ensureCtx() {
      if (this.ctx) return true;
      this.ctx = getAudioContext();
      if (!this.ctx) return false;
      try {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = CONFIG.musicVolume;
        // A gentle low-pass for warmth
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 3500;
        this.masterGain.connect(filter);
        filter.connect(this.ctx.destination);
        return true;
      } catch (e) {
        console.warn('AudioContext setup failed:', e);
        return false;
      }
    }

    async start() {
      if (!this.ensureCtx()) return false;
      if (this.ctx.state === 'suspended') {
        try { await this.ctx.resume(); } catch (e) {}
      }
      if (this.playing) return true;
      this.playing = true;
      this.loop();
      return true;
    }

    stop() {
      this.playing = false;
      if (this.loopTimer) {
        clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      // Cancel any oscillators that are still scheduled/running
      this.scheduledNodes.forEach(({ osc }) => {
        try { osc.stop(); } catch (e) {}
      });
      this.scheduledNodes = [];
    }

    async toggle() {
      return this.playing ? (this.stop(), false) : this.start();
    }

    loop() {
      if (!this.playing || !this.ctx) return;

      const startAt = this.ctx.currentTime + 0.1;
      let t = startAt;
      let totalBeats = 0;

      MELODY.forEach(([note, beats]) => {
        const dur = beats * this.beatDur;
        this.scheduleNote(note, t, dur);
        t += dur;
        totalBeats += beats;
      });

      const totalMs = totalBeats * this.beatDur * 1000;
      this.loopTimer = setTimeout(() => {
        if (this.playing) this.loop();
      }, totalMs - 150);
    }

    scheduleNote(note, time, duration) {
      const freq = NOTES[note];
      if (!freq || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();

      // Triangle wave = warm, music-box-ish tone
      osc.type = 'triangle';
      osc.frequency.value = freq;

      // Simple ADSR-ish envelope (no sustain)
      const atk = 0.015;
      const rel = Math.min(0.18, duration * 0.4);
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(0.45, time + atk);
      env.gain.setValueAtTime(0.45, time + Math.max(atk, duration - rel));
      env.gain.linearRampToValueAtTime(0, time + duration);

      osc.connect(env);
      env.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);

      this.scheduledNodes.push({ osc });
    }
  }

  function initMusic() {
    const btn = $('#music-toggle');
    if (!btn) return;

    let music = null;
    let fileAudio = null;
    let fileTried = false;
    let isPlaying = false;

    btn.classList.add('is-muted');

    async function start() {
      if (CONFIG.musicMode === 'file') {
        if (!fileAudio) fileAudio = new Audio(CONFIG.musicPath);
        fileAudio.loop = true;
        fileAudio.volume = 0.5;
        try {
          await fileAudio.play();
          isPlaying = true;
          btn.classList.remove('is-muted');
          return true;
        } catch (e) {
          // Fall back to generated music if file fails
          fileTried = true;
        }
      }
      if (!music) music = new BirthdayMusic();
      const ok = await music.start();
      if (ok) {
        isPlaying = true;
        btn.classList.remove('is-muted');
      }
      return ok;
    }

    function stop() {
      if (fileAudio) {
        fileAudio.pause();
        fileAudio.currentTime = 0;
      }
      if (music) music.stop();
      isPlaying = false;
      btn.classList.add('is-muted');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) stop();
      else start();
    });

    // Expose for the loader's "first interaction" handler
    window.__startMusic = start;
  }

  /* ========================================================
     11b. CELEBRATION SOUND EFFECT
     ======================================================== */
  function playCelebrationSFX() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      try { ctx.resume(); } catch (e) {}
    }

    const t = ctx.currentTime;
    const dest = ctx.destination;

    // === 1. Party-popper noise burst ===
    const noiseLen = Math.floor(ctx.sampleRate * 0.18);
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1200;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.18;
    noise.connect(noiseFilter).connect(noiseGain).connect(dest);
    noise.start(t);

    // === 2. Ascending fanfare (C5 → E5 → G5 → C6) ===
    const fanfare = [
      { freq: 523.25, time: t + 0.05 },
      { freq: 659.25, time: t + 0.13 },
      { freq: 783.99, time: t + 0.21 },
      { freq: 1046.50, time: t + 0.29 },
    ];
    fanfare.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.22, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);
      osc.connect(gain).connect(dest);
      osc.start(time);
      osc.stop(time + 0.6);
    });

    // === 3. Sub-bass thump for emphasis ===
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(90, t);
    boom.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    boomGain.gain.setValueAtTime(0, t);
    boomGain.gain.linearRampToValueAtTime(0.25, t + 0.02);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    boom.connect(boomGain).connect(dest);
    boom.start(t);
    boom.stop(t + 0.55);

    // === 4. Sustained major triad (C5 – E5 – G5) ===
    [523.25, 659.25, 783.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + 0.4);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.65);
      gain.gain.setValueAtTime(0.1, t + 2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 3);
      osc.connect(gain).connect(dest);
      osc.start(t + 0.4);
      osc.stop(t + 3.1);
    });

    // === 5. Sparkle chimes cascading down ===
    const sparkles = [
      { t: 0.60, f: 2637 }, // E7
      { t: 0.80, f: 2349 }, // D7
      { t: 1.00, f: 2093 }, // C7
      { t: 1.25, f: 1760 }, // A6
      { t: 1.50, f: 1568 }, // G6
      { t: 1.75, f: 1318 }, // E6
    ];
    sparkles.forEach(({ t: dt, f }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const start = t + dt;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.16, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain).connect(dest);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  }

  // Subtle "click" / "sparkle" sound for cake candle blowing
  function playBlowSFX() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    // Soft puff: short white noise burst + descending tone
    const noiseLen = Math.floor(ctx.sampleRate * 0.18);
    const buf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 2;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t);

    // Small descending tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.2);
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(oscGain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Make both available globally so other modules can use them
  window.__playCelebrationSFX = playCelebrationSFX;
  window.__playBlowSFX = playBlowSFX;

  /* ========================================================
     12. FLOATING HEARTS (periodic spawner)
     ======================================================== */
  function initFloatingHearts() {
    const container = $('.floating-hearts');
    if (!container) return;

    const EMOJI = ['💗', '💖', '💕', '🤍', '💝', '✨'];

    function spawn() {
      const heart = document.createElement('span');
      heart.className = 'float-heart';
      heart.textContent = EMOJI[randInt(0, EMOJI.length - 1)];
      heart.style.left = `${rand(0, 100)}%`;
      heart.style.fontSize = `${rand(18, 36)}px`;
      heart.style.setProperty('--drift', `${rand(-80, 80)}px`);
      heart.style.animationDuration = `${rand(5, 9)}s`;
      container.appendChild(heart);

      setTimeout(() => heart.remove(), 9500);
    }

    function loop() {
      spawn();
      setTimeout(loop, rand(2200, 4500));
    }

    if (!prefersReducedMotion) loop();
  }

  // Helper used by cake "all blown" state
  function spawnHeartBurst(count = 6) {
    const container = $('.floating-hearts');
    if (!container) return;
    const EMOJI = ['💗', '💖', '✨', '🎉'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'float-heart';
        heart.textContent = EMOJI[randInt(0, EMOJI.length - 1)];
        heart.style.left = `${rand(20, 80)}%`;
        heart.style.fontSize = `${rand(22, 38)}px`;
        heart.style.setProperty('--drift', `${rand(-100, 100)}px`);
        heart.style.animationDuration = `${rand(5, 8)}s`;
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 9000);
      }, i * 120);
    }
  }

  /* ========================================================
     13. FIREWORKS CANVAS
     ======================================================== */
  function initFireworks() {
    const canvas = $('#fireworks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const rockets = [];
    const COLORS = ['#f7cac9', '#ff6b9d', '#d4af37', '#c9a96e', '#b794f4', '#6b3fa0', '#fff5e6', '#ffd700'];

    function launchRocket() {
      rockets.push({
        x: rand(window.innerWidth * 0.15, window.innerWidth * 0.85),
        y: window.innerHeight,
        tx: rand(window.innerWidth * 0.1, window.innerWidth * 0.9),
        ty: rand(window.innerHeight * 0.15, window.innerHeight * 0.45),
        vx: 0,
        vy: -rand(7, 10),
        color: COLORS[randInt(0, COLORS.length - 1)],
        trail: [],
        done: false,
      });
    }

    function explode(x, y, color, count = 60) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.05, 0.05);
        const speed = rand(2, 6);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: rand(0.012, 0.022),
          color,
          size: rand(1.5, 3),
          gravity: 0.06,
        });
      }
    }

    let active = false;
    let rocketTimer = null;

    function draw() {
      ctx.fillStyle = 'rgba(7, 5, 15, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y, life: 1 });
        if (r.trail.length > 12) r.trail.shift();

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.06; // slight gravity for arc

        // Draw trail
        r.trail.forEach((t, idx) => {
          t.life -= 0.06;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 245, 230, ${Math.max(0, t.life * 0.6)})`;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Explode when reaching apex (vy >= 0 or close to target)
        if (r.vy >= -1 || r.y < r.ty) {
          explode(r.x, r.y, r.color, randInt(50, 80));
          rockets.splice(i, 1);
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    draw();

    function start() {
      if (active) return;
      active = true;
      const startTime = performance.now();
      // Launch a few right away
      launchRocket();
      setTimeout(launchRocket, 300);
      setTimeout(launchRocket, 600);

      rocketTimer = setInterval(() => {
        if (performance.now() - startTime > CONFIG.surpriseDuration) {
          stop();
          return;
        }
        launchRocket();
        if (Math.random() > 0.5) {
          setTimeout(launchRocket, rand(200, 600));
        }
      }, 900);
    }

    function stop() {
      active = false;
      if (rocketTimer) clearInterval(rocketTimer);
      rocketTimer = null;
    }

    window.__startFireworks = start;
  }

  /* ========================================================
     14. SURPRISE SCREEN
     ======================================================== */
  function initSurprise() {
    const surprise = $('#surprise');
    const btnCelebrate = $('#btn-celebrate');
    const btnFinal = $('#btn-final-celebrate');
    const btnClose = $('#surprise-close');

    if (!surprise) return;

    function open() {
      surprise.classList.add('is-open');
      surprise.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Play celebration SFX first, then visuals cascade on top
      if (window.__playCelebrationSFX) window.__playCelebrationSFX();
      if (window.__confettiBurst) window.__confettiBurst();
      if (window.__startFireworks) setTimeout(window.__startFireworks, 200);
      spawnHeartBurst(14);
    }

    function close() {
      surprise.classList.remove('is-open');
      surprise.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btnCelebrate?.addEventListener('click', open);
    btnFinal?.addEventListener('click', open);
    btnClose?.addEventListener('click', () => {
      close();
      // Replay by reopening
      setTimeout(open, 400);
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && surprise.classList.contains('is-open')) close();
    });
  }

  /* ========================================================
     15. PARALLAX (mouse-based subtle movement)
     ======================================================== */
  function initParallax() {
    if (prefersReducedMotion) return;
    const orbs = $$('.orb');

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 12;
        orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
      });
    });
  }

  /* ========================================================
     16. FOOTER YEAR
     ======================================================== */
  function initFooter() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ========================================================
     BOOT
     ======================================================== */
  function boot() {
    bindSisterName();
    initLoader();
    initStars();
    initConfetti();
    initHeroTitle();
    initTypewriter();
    initCake();
    initReveal();
    initNavDots();
    initMusic();
    initFloatingHearts();
    initFireworks();
    initSurprise();
    initParallax();
    initFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();