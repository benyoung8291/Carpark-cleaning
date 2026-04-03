/* ============================================
   CARPARK CLEANING PROS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isActive = item.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(function (faqItem) {
        faqItem.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Contact Form Handling ---
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      var submitBtn = this.querySelector('.form-submit');
      var originalText = submitBtn.textContent;

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Build mailto link as fallback / direct email approach
      var name = formData.get('name');
      var email = formData.get('email');
      var phone = formData.get('phone');
      var service = formData.get('service');
      var message = formData.get('message');

      var subject = encodeURIComponent('Carpark Cleaning Enquiry from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Service: ' + service + '\n\n' +
        'Message:\n' + message
      );

      // Try FormSubmit.co for seamless email delivery
      fetch('https://formsubmit.co/ajax/office@premrest.com.au', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          service: service,
          message: message,
          _subject: 'Carpark Cleaning Enquiry from ' + name,
          _template: 'table'
        })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          showFormSuccess();
        } else {
          // Fallback to mailto
          window.location.href = 'mailto:office@premrest.com.au?subject=' + subject + '&body=' + body;
          showFormSuccess();
        }
      })
      .catch(function () {
        // Fallback to mailto on network error
        window.location.href = 'mailto:office@premrest.com.au?subject=' + subject + '&body=' + body;
        showFormSuccess();
      });

      function showFormSuccess() {
        contactForm.style.display = 'none';
        var successMsg = document.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('show');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  var fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.site-header').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
