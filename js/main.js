/* ============================================================
   Mist Mountain Forest Gate - Main JavaScript
   ============================================================ */

/* ---------- Navbar: Sticky + Scroll Effect ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function updateNavbar() {
  if (!navbar) return;
  if (navbar.classList.contains('transparent')) {
    if (window.scrollY > 60) {
      navbar.classList.remove('transparent');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();

/* ---------- Hamburger Menu Toggle ---------- */
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- Active Nav Link Highlighting ---------- */
function setActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, #mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

/* ---------- Scroll Animation (AOS-like) ---------- */
const aosElements = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.aosDelay || 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, parseInt(delay));
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

aosElements.forEach(el => aosObserver.observe(el));

/* ---------- Gallery Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryItems = document.querySelectorAll('[data-lightbox]');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const src = galleryItems[index].querySelector('img').src;
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  lightboxImg.src = galleryItems[currentIndex].querySelector('img').src;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  lightboxImg.src = galleryItems[currentIndex].querySelector('img').src;
}

if (lightbox) {
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next')?.addEventListener('click', nextImage);
  document.getElementById('lightbox-prev')?.addEventListener('click', prevImage);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

/* ---------- Contact Form Handling ---------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const name = this.querySelector('[name="name"]')?.value || '';
    const phone = this.querySelector('[name="phone"]')?.value || '';
    const msg = this.querySelector('[name="message"]')?.value || '';
    const guests = this.querySelector('[name="guests"]')?.value || '';

    // Build WhatsApp message and open
    let waText = `Hello! I would like to enquire about booking at Mist Mountain Forest Gate.%0A%0A`;
    waText += `*Name:* ${encodeURIComponent(name)}%0A`;
    waText += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    if (guests) waText += `*Guests:* ${encodeURIComponent(guests)}%0A`;
    waText += `*Message:* ${encodeURIComponent(msg)}`;

    btn.textContent = 'Opening WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
      window.open(`https://wa.me/918261922889?text=${waText}`, '_blank');
      btn.textContent = 'Send via WhatsApp';
      btn.disabled = false;
      contactForm.reset();
    }, 400);
  });
}

/* ---------- Counter Animation ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const counters = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---------- Floating Button Visibility ---------- */
const floatBtns = document.querySelector('.float-btns');
window.addEventListener('scroll', () => {
  if (!floatBtns) return;
  if (window.scrollY > 300) {
    floatBtns.style.opacity = '1';
    floatBtns.style.pointerEvents = 'auto';
  } else {
    floatBtns.style.opacity = '0.7';
  }
});

/* ---------- Image Lazy Load Fallback ---------- */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (!img.src.includes('unsplash')) return;
  img.addEventListener('error', () => {
    img.src = `https://placehold.co/${img.getAttribute('width') || 800}x${img.getAttribute('height') || 500}/2D5016/ffffff?text=Mist+Mountain`;
  });
});
