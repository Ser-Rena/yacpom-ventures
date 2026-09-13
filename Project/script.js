document.addEventListener('DOMContentLoaded', () => {

  // Set Current Year in Footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ==========================================================================
     1. STICKY NAVBAR, MOBILE MENU & DYNAMIC SCROLL SPY HIGHLIGHT
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Navbar Link Highlighting on Scroll (ScrollSpy)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ==========================================================================
     2. HERO CAROUSEL SLIDER
     ========================================================================== */
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  
  let currentSlide = 0;
  let slideInterval;
  const autoPlayDelay = 5000;

  if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlidePosition() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    function goToSlide(index) {
      currentSlide = index;
      if (currentSlide < 0) currentSlide = slides.length - 1;
      if (currentSlide >= slides.length) currentSlide = 0;
      updateSlidePosition();
      resetTimer();
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlidePosition();
    }

    function startTimer() {
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function resetTimer() {
      clearInterval(slideInterval);
      startTimer();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
      heroSection.addEventListener('mouseleave', startTimer);
    }

    startTimer();
  }

  /* ==========================================================================
     3. PROJECT CATEGORY FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ==========================================================================
     4. ANIMATED COUNTERS FOR STATISTICS (RE-ANIMATE ON SCROLL INTO VIEW)
     ========================================================================== */
  const statsSection = document.getElementById('stats-counter');
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateSingleCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      counter.textContent = Math.floor(progress * target);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCount);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsSection.classList.add('visible');
        statNumbers.forEach(stat => {
          stat.textContent = '0';
          animateSingleCounter(stat);
        });
      }
    });
  }, { threshold: 0.4 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

  function checkScrollReveal() {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', checkScrollReveal);
  checkScrollReveal();

  /* ==========================================================================
     6. CONTACT FORM VALIDATION & WEB3FORMS SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  // YOUR WEB3FORMS ACCESS KEY HERE
  const WEB3FORMS_ACCESS_KEY = "4c88a8b8-d9b8-4491-a827-e0b4bfb7d7f2";

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');

      clearErrors();

      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your full name.');
        isValid = false;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Please enter your phone number.');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Please enter project details or message.');
        isValid = false;
      }

      if (isValid) {
        // Show loading status on button
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';

        try {
          const formData = new FormData(contactForm);
          formData.append("access_key", WEB3FORMS_ACCESS_KEY);

          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
          });

          const result = await response.json();

          if (result.success && formAlert) {
            formAlert.className = 'form-alert success';
            formAlert.textContent = 'Thank you! Your message has been sent successfully. Our team will contact you shortly.';
            formAlert.classList.remove('hidden');
            contactForm.reset();

            setTimeout(() => {
              formAlert.classList.add('hidden');
            }, 6000);
          } else if (formAlert) {
            formAlert.className = 'form-alert error';
            formAlert.textContent = result.message || 'Something went wrong. Please try again.';
            formAlert.classList.remove('hidden');
          }
        } catch (error) {
          if (formAlert) {
            formAlert.className = 'form-alert error';
            formAlert.textContent = 'Network error. Please try again later.';
            formAlert.classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearErrors() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('error'));
    
    const errorSpans = document.querySelectorAll('.error-msg');
    errorSpans.forEach(span => span.textContent = '');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

});