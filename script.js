document.addEventListener("DOMContentLoaded", () => {
  // 1. Contact Form Initialization
  const initContactForm = () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const inputs = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      phone: document.getElementById("phone"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message")
    };

    const errorContainer = document.createElement("div");
    errorContainer.className = "error-messages";
    form.insertBefore(errorContainer, form.firstChild);

    const validateField = (field, value) => {
      const errors = [];
      if (!value.trim()) {
        errors.push(`${field.name} is required`);
        return errors;
      }

      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors.push("Please enter a valid email address");
      }

      if (field.type === 'tel' && value.trim()) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) errors.push("Please enter a valid phone number");
      }

      return errors;
    };

    const showErrors = (errors) => {
      errorContainer.innerHTML = errors.map(error =>
        `<div class="error-message"><i class="bi bi-exclamation-circle"></i> ${error}</div>`
      ).join('');
      errorContainer.style.display = errors.length ? 'block' : 'none';
    };

    const showSuccessMessage = () => {
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `
        <div class="success-content">
          <i class="bi bi-check-circle-fill"></i>
          <div>
            <h4>Message Sent Successfully!</h4>
            <p>We'll get back to you within 24 hours.</p>
          </div>
        </div>
        <button class="close-success">&times;</button>
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => successMessage.classList.add("show"), 10);
      successMessage.querySelector(".close-success").addEventListener("click", () => {
        successMessage.classList.remove("show");
        setTimeout(() => successMessage.remove(), 300);
      });
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.classList.remove("show");
          setTimeout(() => successMessage.remove(), 300);
        }
      }, 5000);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const allErrors = [];
      Object.entries(inputs).forEach(([key, input]) => {
        const errors = validateField(input, input.value);
        if (errors.length) {
          input.classList.add("error");
          input.setAttribute("aria-invalid", "true");
          allErrors.push(...errors);
        } else {
          input.classList.remove("error");
          input.setAttribute("aria-invalid", "false");
        }
      });

      showErrors(allErrors);
      if (allErrors.length) return;

      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;

      try {
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        submitBtn.disabled = true;

        const formData = {
          name: inputs.name.value.trim(),
          email: inputs.email.value.trim(),
          phone: inputs.phone?.value.trim() || '',
          subject: inputs.subject?.value.trim() || 'Website Inquiry',
          message: inputs.message.value.trim(),
          timestamp: new Date().toISOString()
        };

        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay

        // Use mailto for fallback message sending
        const recipient = "contact@steppintech.com";
        const subject = encodeURIComponent(formData.subject);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n${formData.phone ? `Phone: ${formData.phone}\n` : ""}Message:\n${formData.message}`
        );
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

        showSuccessMessage();
        form.reset();
      } catch (err) {
        console.error(err);
        showErrors(["There was an error sending your message. Please try again later."]);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    };

    form.addEventListener("submit", handleSubmit);
    Object.values(inputs).forEach(input => {
      input.addEventListener("input", () => {
        const errors = validateField(input, input.value);
        input.classList.toggle("error", errors.length > 0);
      });
    });
  };

  // 2. Portfolio Filter
  const initPortfolioFilter = () => {
    const filterContainer = document.querySelector('.portfolio-filter');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterButtons = filterContainer?.querySelectorAll('button') || [];
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterContainer || !portfolioItems.length) return;

    if (window.Isotope) {
      const iso = new Isotope(portfolioGrid, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s'
      });

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filterValue = button.dataset.filter;
          iso.arrange({ filter: filterValue === 'all' ? '*' : `.${filterValue}` });
        });
      });
    } else {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filterValue = button.dataset.filter;

          portfolioItems.forEach(item => {
            const show = filterValue === 'all' || item.classList.contains(filterValue);
            item.style.display = show ? 'block' : 'none';
          });
        });
      });
    }
  };

  // 3. Brand Animation
  const initBrandAnimation = () => {
    const brand = document.querySelector('.brand-animation');
    if (!brand) return;

    brand.addEventListener('mouseenter', () => {
      if (window.gsap) {
        gsap.to(brand, { scale: 1.05, duration: 0.3 });
        gsap.to(brand.querySelector('.brand-tech'), { color: '#ff6b6b', duration: 0.3 });
      }
    });

    brand.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(brand, { scale: 1, duration: 0.3 });
        gsap.to(brand.querySelector('.brand-tech'), { color: '#0d6efd', duration: 0.3 });
      }
    });
  };

  // 4. Back to Top Button
  const initBackToTop = () => {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(backToTopBtn);

    const toggleVisibility = () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleVisibility();
  };

  // 5. Lazy Loading
  const initLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyImages.forEach(img => observer.observe(img));
    } else {
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  };

  // 6. Initialize Everything
  const initAll = () => {
    initContactForm();
    initPortfolioFilter();
    initBrandAnimation();
    initBackToTop();
    initLazyLoading();

    if (window.AOS) {
      AOS.init({ duration: 800, once: true });
    }

    if (window.Fancybox) {
      Fancybox.bind("[data-fancybox]", {
        Thumbs: false,
        Toolbar: {
          display: { left: [], middle: [], right: ["close"] }
        }
      });
    }
  };

  initAll();
});

// Performance Optimization: Lazy load Isotope after page load
window.addEventListener('load', () => {
  if (document.querySelector('.portfolio-grid')) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js';
    script.onload = () => console.log('Isotope loaded');
    document.body.appendChild(script);
  }
});

