/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ── Smooth nav link active state ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const onScroll = () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.style.color = scrollY >= top && scrollY < bottom ? 'var(--red)' : '';
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Scroll reveal (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.scroll-reveal').forEach((el, i) => {
  // Stagger siblings
  const parent = el.parentElement;
  const siblings = [...parent.querySelectorAll(':scope > .scroll-reveal')];
  const idx = siblings.indexOf(el);
  el.dataset.delay = Math.min(idx * 80, 400);
  revealObserver.observe(el);
});

/* ── Footer year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
══════════════════════════════════════════════════════ */
(function initCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentIndex = 0;
  let slides = [];
  let dots = [];
  let autoTimer = null;

  function getSlides() {
    slides = track.querySelectorAll('.testimonial-slide');
    return slides;
  }

  function rebuildDots() {
    dotsContainer.innerHTML = '';
    dots = [];
    getSlides().forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
    // Update grid columns
    track.style.gridTemplateColumns = `repeat(${slides.length}, 100%)`;
  }

  function goTo(index) {
    const count = getSlides().length;
    currentIndex = (index + count) % count;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(currentIndex + 1), 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); startAuto(); });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) { dx > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1); startAuto(); }
  });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  rebuildDots();
  startAuto();

  // Expose to dynamic review injector
  window._carouselRebuild = rebuildDots;
  window._carouselGoTo = goTo;
})();

/* ══════════════════════════════════════════════════════
   STAR RATING WIDGET
══════════════════════════════════════════════════════ */
(function initStars() {
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRating');
  let selected = 0;

  function highlight(n) {
    starBtns.forEach((btn, i) => btn.classList.toggle('lit', i < n));
  }

  starBtns.forEach((btn, idx) => {
    btn.addEventListener('mouseenter', () => highlight(idx + 1));
    btn.addEventListener('mouseleave', () => highlight(selected));
    btn.addEventListener('click', () => {
      selected = idx + 1;
      ratingInput.value = selected;
      highlight(selected);
      starBtns.forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      document.getElementById('ratingError').textContent = '';
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selected = idx + 1;
        ratingInput.value = selected;
        highlight(selected);
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════
   REVIEW FORM
══════════════════════════════════════════════════════ */
(function initReviewForm() {
  const form = document.getElementById('reviewForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitReview');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // In-memory store (session)
  const reviews = [];

  function validate() {
    let valid = true;

    const name = document.getElementById('reviewName');
    const nameErr = document.getElementById('nameError');
    if (!name.value.trim() || name.value.trim().length < 2) {
      nameErr.textContent = 'Please enter your name (at least 2 characters).';
      name.classList.add('error');
      valid = false;
    } else {
      nameErr.textContent = '';
      name.classList.remove('error');
    }

    const rating = parseInt(document.getElementById('reviewRating').value, 10);
    const ratingErr = document.getElementById('ratingError');
    if (!rating || rating < 1) {
      ratingErr.textContent = 'Please select a star rating.';
      valid = false;
    } else {
      ratingErr.textContent = '';
    }

    const msg = document.getElementById('reviewMessage');
    const msgErr = document.getElementById('messageError');
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      msgErr.textContent = 'Please write a review (at least 10 characters).';
      msg.classList.add('error');
      valid = false;
    } else {
      msgErr.textContent = '';
      msg.classList.remove('error');
    }

    return valid;
  }

  function getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  function starsHTML(n) {
    return '★'.repeat(n) + (n < 5 ? `<span style="opacity:0.3">${'★'.repeat(5 - n)}</span>` : '');
  }

  function injectReviewToCarousel(review) {
    const track = document.getElementById('testimonialsTrack');
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `Review by ${review.name}`);
    slide.innerHTML = `
      <div class="testimonial-card" style="border-color:rgba(232,0,28,0.3)">
        <div class="stars" aria-label="${review.rating} stars">${starsHTML(review.rating)}</div>
        <p class="testimonial-text">"${review.message}"</p>
        <div class="testimonial-author">
          <div class="author-avatar" aria-hidden="true">${getInitials(review.name)}</div>
          <div class="author-info">
            <strong>${review.name}</strong>
            <span>Verified Customer · Just now</span>
          </div>
        </div>
      </div>
    `;
    track.appendChild(slide);

    if (window._carouselRebuild) {
      const total = track.querySelectorAll('.testimonial-slide').length;
      window._carouselRebuild();
      window._carouselGoTo(total - 1);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate async
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = '';

    setTimeout(() => {
      const review = {
        name: document.getElementById('reviewName').value.trim(),
        rating: parseInt(document.getElementById('reviewRating').value, 10),
        message: document.getElementById('reviewMessage').value.trim(),
        timestamp: new Date().toISOString(),
      };
      reviews.push(review);
      injectReviewToCarousel(review);

      // Show success
      submitBtn.style.display = 'none';
      successMsg.style.display = 'flex';

      // Scroll to testimonials section after short delay
      setTimeout(() => {
        document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 800);
    }, 900);
  });

  // Live validation on blur
  document.getElementById('reviewName').addEventListener('blur', validate);
  document.getElementById('reviewMessage').addEventListener('blur', validate);
})();
