document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Mobile nav toggle
  ------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu after tapping a link (mobile)
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     Theme toggle (light / dark)
     Defaults to the visitor's OS preference, then can be switched
     manually for the session. Intentionally not persisted to
     localStorage so this file behaves identically in any preview
     sandbox as well as a real deploy.
  ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (theme) => root.setAttribute('data-theme', theme);
  // The site defaults to the dark "flagship" theme (set directly on <html>
  // to avoid a flash of the light theme before this script runs). Only
  // fall back to OS preference if that attribute is somehow missing.
  if (!root.getAttribute('data-theme')) {
    applyTheme(prefersDark.matches ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ------------------------------------------------------------------
     Active nav link on scroll
  ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* ------------------------------------------------------------------
     Scroll-reveal animations
  ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.project, .timeline__item, .skills__group, .about__bio, .spec-list, .contact__intro, .contact__form'
  );
  revealTargets.forEach((el) => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     Contact form validation
     No backend is wired up yet — this only validates input and shows
     a confirmation message. To actually receive messages, connect it
     to a service like Formspree (https://formspree.io) or EmailJS,
     or point the form at your own backend endpoint.
  ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const showError = (fieldName, message) => {
    const field = document.getElementById(fieldName);
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    field.closest('.field').classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message;
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    const setStatus = (text, kind) => {
      formStatus.textContent = text;
      formStatus.classList.remove('form__status--success', 'form__status--error');
      if (kind) formStatus.classList.add(`form__status--${kind}`);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot: if a bot filled this hidden field, silently drop the submission.
      if (form.company.value.trim()) return;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      let isValid = true;

      if (!name) {
        showError('name', 'Please enter your name.');
        isValid = false;
      } else {
        showError('name', '');
      }

      if (!email) {
        showError('email', 'Please enter your email.');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      } else {
        showError('email', '');
      }

      if (!message) {
        showError('message', 'Please write a short message.');
        isValid = false;
      } else {
        showError('message', '');
      }

      if (!isValid) {
        setStatus('');
        return;
      }

      // Real submission — sends the form data to the Formspree endpoint
      // set in the <form action="..."> attribute.
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      setStatus('Sending…');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          setStatus(`Thanks, ${name}! Your message has been sent — I'll get back to you soon.`, 'success');
          form.reset();
        } else {
          const data = await response.json().catch(() => null);
          const detail = data?.errors?.map((err) => err.message).join(', ');
          setStatus(detail || 'Something went wrong sending your message. Please try emailing me directly instead.', 'error');
        }
      } catch (err) {
        setStatus('Network error — please check your connection and try again, or email me directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
      }
    });
  }

});