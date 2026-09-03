/**
 * Anchorage Glacier Helicopter Tour — Main JS
 * Vanilla JS, no dependencies.
 */

/* ── Config ──
   partner_id comes from this project folder's own gyg_analytics_head_code.txt
   (1MSALBX, confirmed by Marina 2026-09-03); cmp is this site's campaign. Affiliate params
   are injected at RUNTIME so partner_id/utm_medium/cmp never sit in static HTML
   (/final-check §4). Swap GYG_CAMPAIGN + the featured URL per build. */
const GYG_PARTNER_ID = '1MSALBX';
const GYG_CAMPAIGN   = 'anchorageglacierhelicoptertour';
const GYG_AFFILIATE_URL = 'https://www.getyourguide.com/anchorage-l978/anchorage-knik-glacier-helicopter-tour-with-landing-t147264/?partner_id=' + GYG_PARTNER_ID + '&utm_medium=online_publisher&cmp=' + GYG_CAMPAIGN;

/* ── DOM helpers ── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* Is this URL one of OUR affiliate destinations? Only those may be decorated.
   Not every link in a comparison table or a guide is monetised: the kit's own
   "official ticket / operator-direct" framing (orchestrate-full-site Patch 11)
   routinely points a column at the attraction's OWN ticket page, which earns
   nothing. Appending partner_id there produces a URL the operator's site does
   not understand AND claims an affiliate relationship that does not exist.
   Fails CLOSED: an unparseable value is treated as non-GYG and left alone.
   (Reported on futureofflighttickets.com 2026-08-29 — its comparison table
   links boeingfutureofflight.com beside two GYG columns.) */
function isGYGUrl(u) {
  try { return /(^|\.)getyourguide\.com$/i.test(new URL(u, location.href).hostname); }
  catch (e) { return false; }
}

/* Append partner_id + utm_medium + cmp to a bare GYG destination URL.
   Non-GYG URLs are returned untouched. */
function gygDecorate(bareURL) {
  if (!bareURL) return GYG_AFFILIATE_URL;
  if (!isGYGUrl(bareURL)) return bareURL;
  const sep = bareURL.indexOf('?') === -1 ? '?' : '&';
  return bareURL + sep + 'partner_id=' + GYG_PARTNER_ID +
         '&utm_medium=online_publisher&cmp=' + GYG_CAMPAIGN;
}

/* ════════════════════════════════════════════════════════════
   1. GYG Affiliate Links
   [data-gyg-link]  → the single featured-tour affiliate URL.
   [data-gyg-href]  → per-element bare GYG URL, decorated at runtime with the
                      affiliate params (keeps partner_id/cmp out of static HTML).
   ════════════════════════════════════════════════════════════ */
function initGYGLinks() {
  $$('[data-gyg-link]').forEach(el => {
    el.href       = GYG_AFFILIATE_URL;
    el.target     = '_blank';
    el.rel        = 'sponsored noopener noreferrer';
  });
  $$('[data-gyg-href]').forEach(el => {
    const bare = el.getAttribute('data-gyg-href');
    el.href    = gygDecorate(bare);
    el.target  = '_blank';
    /* rel must match reality. "sponsored" on a link that pays nothing is a
       false disclosure, and Google treats a mis-tagged link as a disclosure
       error. Only genuinely monetised GYG destinations carry it. */
    el.rel     = isGYGUrl(bare) ? 'sponsored nofollow noopener noreferrer'
                                : 'noopener noreferrer';
  });
}

/* ════════════════════════════════════════════════════════════
   2. Header — scroll-triggered background
   ════════════════════════════════════════════════════════════ */
function initScrollHeader() {
  const header = $('#site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ════════════════════════════════════════════════════════════
   3. Sticky Mobile CTA — handled by inline <script> in
      sticky-cta.html partial (scroll-direction aware).
   ════════════════════════════════════════════════════════════ */
function initStickyCTA() { /* no-op — see sticky-cta.html */ }

/* ════════════════════════════════════════════════════════════
   4. Mobile Menu
   ════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = $('#hamburger-btn');
  const closeBtn  = $('#mobile-close-btn');
  const menu      = $('#mobile-menu');
  const backdrop  = $('#mobile-backdrop');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    // Move focus inside menu
    closeBtn?.focus();
  }

  function closeMenu() {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on nav link click
  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on mobile menu CTA click (Book Now button)
  const mobileCTA = $('.mobile-menu-cta');
  if (mobileCTA) {
    mobileCTA.addEventListener('click', closeMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

/* ════════════════════════════════════════════════════════════
   5. FAQ Accordion
   Single-expand: only one item open at a time.
   Uses hidden attribute + max-height trick for animation.
   ════════════════════════════════════════════════════════════ */
function initFAQ() {
  const questions = $$('.faq-question');
  if (!questions.length) return;

  // Remove the 'hidden' attribute so CSS animation works,
  // but collapse via max-height: 0 in CSS.
  $$('.faq-answer').forEach(answer => {
    answer.removeAttribute('hidden');
  });

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(targetId);

      // Close all
      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(q.getAttribute('aria-controls'));
        if (a) a.style.maxHeight = '0';
      });

      // Open clicked (if it was closed)
      if (!isOpen && answer) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   5b. Gallery Arrow Controls
   ════════════════════════════════════════════════════════════ */
function initGalleryArrows() {
  const strip = $('.gallery-scroll');
  if (!strip) return;
  const prev = $('.gallery-arrow--prev');
  const next = $('.gallery-arrow--next');
  const step = () => Math.max(280, strip.clientWidth * 0.8);
  if (prev) prev.addEventListener('click', () => strip.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => strip.scrollBy({ left: step(), behavior: 'smooth' }));
}

/* ════════════════════════════════════════════════════════════
   6. Scroll-Triggered Fade-Up Animations
   ════════════════════════════════════════════════════════════ */
function initFadeUp() {
  const elements = $$('.fade-up');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════════════
   7. Smooth scroll for in-page anchor links
   (Handles fixed header offset)
   ════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const HEADER_HEIGHT = 70; // approx fixed header height

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id     = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════════════════════
   Init
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initGYGLinks();
  initScrollHeader();
  initStickyCTA();
  initMobileMenu();
  initFAQ();
  initGalleryArrows();
  initFadeUp();
  initSmoothScroll();
});
