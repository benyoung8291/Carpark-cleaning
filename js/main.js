/* ============================================
   CARPARK CLEANING PROS - Main JavaScript
   Redesigned: clean, modern vanilla JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     1. Mobile Navigation
     ------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  const closeNav = () => {
    mobileToggle?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeNav();
      }
    });
  }


  /* ------------------------------------------
     2. Header Scroll Effect
     ------------------------------------------ */
  const header = document.querySelector('.site-header');

  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    // Run once on load in case page is already scrolled
    onHeaderScroll();
  }


  /* ------------------------------------------
     3. FAQ Accordion
     ------------------------------------------ */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all items and reset aria
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
        const trigger = faqItem.querySelector('.faq-question');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it was not already open
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ------------------------------------------
     4. Contact Form (FormSubmit.co)
     ------------------------------------------ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      // Disable button, show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Collect field values
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const service = formData.get('service') || '';
      const message = formData.get('message') || '';

      // Mailto fallback
      const subject = encodeURIComponent(`Carpark Cleaning Enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
      );
      const mailtoLink = `mailto:office@premrest.com.au?subject=${subject}&body=${body}`;

      const showSuccess = () => {
        contactForm.style.display = 'none';
        const successEl = document.querySelector('.form-success');
        if (successEl) successEl.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      };

      const fallbackMailto = () => {
        window.location.href = mailtoLink;
        showSuccess();
      };

      fetch('https://formsubmit.co/ajax/office@premrest.com.au', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message,
          _subject: `Carpark Cleaning Enquiry from ${name}`,
          _template: 'table'
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === 'true' || data.success === true) {
            showSuccess();
          } else {
            fallbackMailto();
          }
        })
        .catch(() => {
          fallbackMailto();
        });
    });
  }


  /* ------------------------------------------
     5. Scroll Reveal Animations
     ------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay;

          if (delay) {
            setTimeout(() => {
              el.classList.add('revealed');
            }, parseInt(delay, 10));
          } else {
            el.classList.add('revealed');
          }

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ------------------------------------------
     6. Smooth Scroll
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ------------------------------------------
     7. Parallax-lite (blob decorations)
     ------------------------------------------ */
  const isDesktop = window.matchMedia('(min-width: 768px)');
  const blobs = document.querySelectorAll('.blob-decoration');

  if (blobs.length > 0 && isDesktop.matches) {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      blobs.forEach((blob, index) => {
        // Alternate rates for depth: even blobs move slower, odd blobs faster
        const rate = index % 2 === 0 ? 0.03 : 0.06;
        const yOffset = -(scrollY * rate);
        blob.style.transform = `translateY(${yOffset}px)`;
      });
      ticking = false;
    };

    const onParallaxScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onParallaxScroll, { passive: true });

    // Disable if viewport resizes below desktop
    isDesktop.addEventListener('change', (e) => {
      if (!e.matches) {
        window.removeEventListener('scroll', onParallaxScroll);
        blobs.forEach(blob => { blob.style.transform = ''; });
      } else {
        window.addEventListener('scroll', onParallaxScroll, { passive: true });
      }
    });
  }


  /* ------------------------------------------
     8. Counter Animation
     ------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 2000; // ms
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for a natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

});
