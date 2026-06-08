// ─── Current year in footer ─────────────────────────────────
    document.getElementById('year').textContent = new Date().getFullYear();

    // ─── Navbar scroll effect ────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ─── Mobile nav toggle ───────────────────────────────────────
    const hamburger     = document.getElementById('hamburger');
    const mobileNav     = document.getElementById('mobileNav');
    const mobileNavClose= document.getElementById('mobileNavClose');

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        mobileNav.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    mobileNavClose.addEventListener('click', closeMobileNav);

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });

    // ─── Back to top ─────────────────────────────────────────────
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── Scroll reveal ───────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Form handling – FormSubmit AJAX ────────────────────────
    const signupForm  = document.getElementById('signupForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn   = document.getElementById('submitBtn');

    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate all required fields (including hidden native selects)
      const requiredFields = signupForm.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(function(field) {
        // Reset border
        const wrapper = field.closest('.custom-select-wrapper');
        if (wrapper) {
          wrapper.querySelector('.custom-select-trigger').style.borderColor = '';
        } else {
          field.style.borderColor = '';
        }

        const isEmpty = field.tagName === 'SELECT'
          ? !field.value
          : !field.value.trim();

        if (isEmpty) {
          valid = false;
          if (wrapper) {
            wrapper.querySelector('.custom-select-trigger').style.borderColor = '#E53E3E';
          } else {
            field.style.borderColor = '#E53E3E';
          }
        }
      });

      if (!valid) return;

      // Disable button and show sending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Submit to FormSubmit via AJAX (stays on page, shows branded success)
      fetch('https://formsubmit.co/ajax/michael@theplayershub.co.uk', {
        method: 'POST',
        body: new FormData(signupForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(function() {
        // Hide form, show branded success message
        signupForm.style.display = 'none';
        formSuccess.style.display = 'block';
        // Smooth scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function() {
        // Re-enable button and show inline error
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Interest';
        const existingErr = document.getElementById('formError');
        if (!existingErr) {
          const errMsg = document.createElement('p');
          errMsg.id = 'formError';
          errMsg.style.cssText = 'color:#E53E3E;font-size:0.85rem;text-align:center;margin-top:12px;';
          errMsg.textContent = 'Something went wrong. Please try again or email michael@theplayershub.co.uk directly.';
          signupForm.appendChild(errMsg);
        }
      });
    });

    // ─── Smooth scroll for all anchor links ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // ─── Custom branded select dropdowns ─────────────────────────
    document.querySelectorAll('.form-group select').forEach(function(select) {
      // Wrap the native select
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      // Hide the native select but keep it functional for form submission
      select.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:0;height:0;';

      // Arrow SVG
      const arrowSvg = '<svg class="custom-select-arrow" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      // Build trigger button
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger is-placeholder';
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      const placeholderOpt = select.querySelector('option[disabled]');
      const placeholderText = placeholderOpt ? placeholderOpt.textContent : 'Select…';
      trigger.innerHTML = '<span>' + placeholderText + '</span>' + arrowSvg;

      // Build options list
      const optionsList = document.createElement('div');
      optionsList.className = 'custom-select-options';
      optionsList.setAttribute('role', 'listbox');

      Array.from(select.options).forEach(function(opt) {
        if (opt.disabled) return;
        const div = document.createElement('div');
        div.className = 'custom-select-option';
        div.setAttribute('role', 'option');
        div.setAttribute('data-value', opt.value);
        div.textContent = opt.textContent;

        div.addEventListener('click', function() {
          // Update native select value (keeps form submission working)
          select.value = opt.value;

          // Update trigger label
          trigger.querySelector('span').textContent = opt.textContent;
          trigger.classList.remove('is-placeholder');

          // Mark selected option
          optionsList.querySelectorAll('.custom-select-option').forEach(function(o) {
            o.classList.remove('is-selected');
          });
          div.classList.add('is-selected');

          // Close dropdown
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });

        optionsList.appendChild(div);
      });

      wrapper.appendChild(trigger);
      wrapper.appendChild(optionsList);

      // Open / close on trigger click
      trigger.addEventListener('click', function() {
        const isOpen = wrapper.classList.contains('open');

        // Close any other open custom selects
        document.querySelectorAll('.custom-select-wrapper.open').forEach(function(w) {
          w.classList.remove('open');
          w.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          wrapper.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard navigation
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        } else if (e.key === 'Escape') {
          wrapper.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close custom selects when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-wrapper.open').forEach(function(w) {
          w.classList.remove('open');
          w.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
        });
      }
    });
