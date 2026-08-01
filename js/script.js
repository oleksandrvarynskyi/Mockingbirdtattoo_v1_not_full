document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initBookingForm();
  initGuestForm();
  initFaqAccordion();
  initScrollAnimations();
  initPortfolioLightbox();
  initArtistSlider();
  initCareReadMore();
  initPortfolioFewItems();
});

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function initMobileMenu() {
  const navToggle = qs("#navToggle");
  const mainNav = qs("#mainNav");

  if (!navToggle || !mainNav) return;

  function setMenuState(isOpen) {
    mainNav.classList.toggle("open", isOpen);
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", () => {
    setMenuState(!mainNav.classList.contains("open"));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

function initBookingForm() {
  const bookingForm = qs("#bookingForm");

  if (!bookingForm) return;

  const serviceType = qs("#serviceType", bookingForm);
  const artistSelect = qs("#preferredArtist", bookingForm);
  const ideaLabel = qs("#ideaLabel", bookingForm);
  const ideaField = qs("#ideaField", bookingForm);
  const ageConfirm = qs("#ageConfirm", bookingForm);
  const privacyConsent = qs("#privacyConsent", bookingForm);

  const params = new URLSearchParams(window.location.search);
  const urlArtist = params.get("artist");
  const urlService = params.get("service");

  if (!serviceType || !artistSelect || !ideaLabel || !ideaField) return;

  const tattooArtists = `
    <option value="Any">Any artist</option>
    <option value="Artem">Artem</option>
    <option value="Ashley">Ashley</option>
    <option value="Colby">Colby</option>
    <option value="Hannah">Hannah</option>
    <option value="Oleh">Oleh</option>
    <option value="Ros">Ros</option>
    <option value="Tom">Tom</option>
    <option value="Viktoria">Viktoria</option>
    <option value="Wiktoria">Wiktoria</option>
    <option value="Xenia">Xenia</option>
  `;

  function updateBookingFields() {
    if (serviceType.value === "Piercing") {
      ideaLabel.textContent = "Piercing details";
      ideaField.placeholder =
        "Tell us what piercing you are interested in and any important details";
      artistSelect.innerHTML = `<option value="Wiktoria">Wiktoria</option>`;
      artistSelect.value = "Wiktoria";
    } else {
      ideaLabel.textContent = "Tattoo idea";
      ideaField.placeholder =
        "Tell us about your tattoo idea, placement and size";
      artistSelect.innerHTML = tattooArtists;
    }
  }

  function getErrorTarget(field) {
    if (!field) return null;
    return field.closest(".form-checkbox") || field.closest(".date-wrapper") || field;
  }

  function clearFieldError(field) {
    const target = getErrorTarget(field);
    if (!target) return;
    target.classList.remove("form-error");
    const next = target.nextElementSibling;
    if (next && next.classList.contains("error-message")) {
      next.remove();
    }
  }

  function clearErrors() {
    bookingForm
      .querySelectorAll(".form-error")
      .forEach((el) => el.classList.remove("form-error"));

    bookingForm
      .querySelectorAll(".error-message")
      .forEach((el) => el.remove());
  }

  function showError(field, message) {
    if (!field) {
      console.error("Validation error: field not found", message);
      return;
    }

    const target = getErrorTarget(field);
    target.classList.add("form-error");

    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;
    target.insertAdjacentElement("afterend", error);

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    field.focus();
  }

  serviceType.addEventListener("change", updateBookingFields);

  if (urlService) {
    serviceType.value = urlService;
  }

  updateBookingFields();

  if (urlArtist) {
    artistSelect.value = urlArtist;
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const nameInput = qs("#fullName", bookingForm);
    const emailInput = qs("#email", bookingForm);

    if (!nameInput || nameInput.value.trim().length < 2) {
      showError(nameInput, "Please enter your full name.");
      return;
    }

    if (!emailInput || !isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address.");
      return;
    }

    if (ideaField.value.trim().length < 10) {
      showError(ideaField, "Please provide more details.");
      return;
    }

    if (ageConfirm && !ageConfirm.checked) {
      showError(ageConfirm, "Please confirm that you are 18 years of age or older.");
      return;
    }

    if (privacyConsent && !privacyConsent.checked) {
      showError(privacyConsent, "Please agree to the Privacy Policy before submitting.");
      return;
    }

   const formData = new FormData(bookingForm);

fetch(bookingForm.action, {
  method: "POST",
  body: formData,
  headers: {
    Accept: "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    showAlert(
      "success",
      "Booking request sent!",
      "Thank you. We will get back to you soon."
    );

    bookingForm.reset();
  })
  .catch(() => {
    showAlert(
      "error",
      "Message not sent",
      "Please try again or contact the studio by email."
    );
  });

    updateBookingFields();
  });

  bookingForm
    .querySelectorAll("input, textarea, select")
    .forEach((field) => {
      ["input", "change"].forEach((eventName) => {
        field.addEventListener(eventName, () => clearFieldError(field));
      });
    });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(icon, title, text) {
  if (window.Swal) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#AA671C",
      background: "#193426",
      color: "#F4EAD7"
    });
    return;
  }

  alert(text);
}

function initFaqAccordion() {
  const faqButtons = qsa(".faq-question");

  if (!faqButtons.length) return;

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const symbol = qs(".faq-symbol", btn);

      if (!item) return;

      item.classList.toggle("active");
      const isExpanded = item.classList.contains("active");
      btn.setAttribute("aria-expanded", String(isExpanded));

      if (symbol) {
        symbol.textContent = isExpanded ? "−" : "+";
      }
    });
  });
}

function initScrollAnimations() {
  const animatedItems = qsa(
    ".hero-copy, .visual-card, .artist-card, .review-card, .booking-card, .care-card, .editorial-card"
  );

  if (!animatedItems.length) return;

  animatedItems.forEach((el, index) => {
    const animationClass =
      index % 3 === 0
        ? "fade-up"
        : index % 3 === 1
          ? "fade-left"
          : "fade-right";

    el.classList.add(animationClass);
  });

  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  animatedItems.forEach((el) => observer.observe(el));
}

function initPortfolioLightbox() {
  const portfolioImages = qsa(".portfolio-item img");
  const lightbox = qs("#portfolioLightbox");
  const lightboxImage = qs("#lightboxImage");
  const lightboxClose = qs("#lightboxClose");
  const lightboxPrev = qs("#lightboxPrev");
  const lightboxNext = qs("#lightboxNext");
  const lightboxDots = qs("#lightboxDots");

  if (!portfolioImages.length || !lightbox || !lightboxImage) return;

  let currentIndex = 0;
  let dots = [];
  let lastFocusedElement = null;

  if (lightboxDots) {
    lightboxDots.innerHTML = "";

    portfolioImages.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "lightbox-dot";
      dot.setAttribute("aria-label", `Open portfolio image ${index + 1}`);

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => updateImage(index));
      lightboxDots.appendChild(dot);
    });

    dots = qsa("button", lightboxDots);
  }

  function updateImage(index) {
    currentIndex = (index + portfolioImages.length) % portfolioImages.length;

    const activeImage = portfolioImages[currentIndex];
    const fullSrc = activeImage.dataset.full || activeImage.src;

    lightboxImage.src = fullSrc;
    lightboxImage.alt = activeImage.alt || "Selected portfolio image";

    dots.forEach((dot) => dot.classList.remove("active"));

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("active");
    }
  }

  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    updateImage(index);
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  portfolioImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      updateImage(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      updateImage(currentIndex + 1);
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") updateImage(currentIndex + 1);
    if (e.key === "ArrowLeft") updateImage(currentIndex - 1);
  });

  let startX = 0;

  lightboxImage.addEventListener("touchstart", (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;
    startX = e.changedTouches[0].screenX;
  });

  lightboxImage.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches.length) return;

    const endX = e.changedTouches[0].screenX;
    const diff = startX - endX;

    if (Math.abs(diff) < 40) return;

    if (diff > 0) {
      updateImage(currentIndex + 1);
    } else {
      updateImage(currentIndex - 1);
    }
  });
}

function initArtistSlider() {
  const track = qs(".artist-slider-track");
  const nextBtn = qs(".artist-arrow.next");
  const prevBtn = qs(".artist-arrow.prev");

  if (!track || !nextBtn || !prevBtn) return;

  function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth;

    prevBtn.classList.toggle("disabled", track.scrollLeft <= 10);
    nextBtn.classList.toggle("disabled", track.scrollLeft >= maxScroll - 10);
  }

  nextBtn.addEventListener("click", () => {
    track.scrollBy({
      left: track.clientWidth,
      behavior: "smooth"
    });
  });

  prevBtn.addEventListener("click", () => {
    track.scrollBy({
      left: -track.clientWidth,
      behavior: "smooth"
    });
  });

  track.addEventListener("scroll", updateArrows);
  window.addEventListener("load", updateArrows);
  window.addEventListener("resize", updateArrows);

  updateArrows();
}
function initGuestForm() {
  const guestForm = document.getElementById("guestForm");

  if (!guestForm) return;

  function getErrorTarget(field) {
    if (!field) return null;
    return field.closest(".form-checkbox") || field;
  }

  function clearFieldError(field) {
    const target = getErrorTarget(field);
    if (!target) return;
    target.classList.remove("form-error");
    const next = target.nextElementSibling;
    if (next && next.classList.contains("error-message")) {
      next.remove();
    }
  }

  function clearErrors() {
    guestForm
      .querySelectorAll(".form-error")
      .forEach((el) => el.classList.remove("form-error"));

    guestForm
      .querySelectorAll(".error-message")
      .forEach((el) => el.remove());
  }

  function showError(field, message) {
    if (!field) return;

    const target = getErrorTarget(field);
    target.classList.add("form-error");

    const error = document.createElement("div");
    error.className = "error-message";
    error.textContent = message;
    target.insertAdjacentElement("afterend", error);

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    field.focus();
  }

  guestForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("guestName");
    const portfolio = document.getElementById("guestPortfolio");
    const experience = document.getElementById("guestExperience");
    const dates = document.getElementById("guestDates");
    const privacyConsent = document.getElementById("guestPrivacyConsent");

    if (!name || !name.value.trim()) {
      showError(name, "Please enter your name.");
      return;
    }

    if (!portfolio || !portfolio.value.trim()) {
      showError(portfolio, "Please provide your Instagram or portfolio.");
      return;
    }

    if (!experience || !experience.value.trim()) {
      showError(experience, "Please select your experience level.");
      return;
    }

    if (!dates || !dates.value.trim()) {
      showError(dates, "Please enter your preferred dates.");
      return;
    }

    if (privacyConsent && !privacyConsent.checked) {
      showError(privacyConsent, "Please agree to the Privacy Policy before submitting.");
      return;
    }

const formData = new FormData(guestForm);

fetch(guestForm.action, {
  method: "POST",
  body: formData,
  headers: {
    Accept: "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    showAlert(
      "success",
      "Guest request sent!",
      "Thank you. We will get back to you soon."
    );

    guestForm.reset();
  })
  .catch(() => {
    showAlert(
      "error",
      "Message not sent",
      "Please try again or contact the studio by email."
    );
  });

  });

  guestForm
    .querySelectorAll("input, textarea, select")
    .forEach((field) => {
      ["input", "change"].forEach((eventName) => {
        field.addEventListener(eventName, () => clearFieldError(field));
      });
    });
}

function initCareReadMore() {
  const buttons = qsa(".read-more-btn");

  function updateButtonState(button) {
    const card = button.closest(".care-card");
    const copy = card && card.querySelector(".care-copy");

    if (!card || !copy) return;

    card.classList.remove("read-more-not-needed");

    const wasExpanded = card.classList.contains("expanded");
    card.classList.remove("expanded");

    const needsToggle = copy.scrollHeight > copy.clientHeight + 6;

    if (!needsToggle) {
      card.classList.add("read-more-not-needed");
      card.classList.remove("expanded");
      button.setAttribute("aria-expanded", "false");
      return;
    }

    if (wasExpanded) card.classList.add("expanded");
    button.setAttribute("aria-expanded", String(wasExpanded));
  }

  buttons.forEach((button) => {
    updateButtonState(button);

    button.addEventListener("click", () => {
      const card = button.closest(".care-card");
      const label = qs(".read-more-label", button);
      if (!card) return;

      card.classList.toggle("expanded");
      const isExpanded = card.classList.contains("expanded");
      button.setAttribute("aria-expanded", String(isExpanded));

      if (label) label.textContent = isExpanded ? "Show Less" : "Read More";
    });
  });

  window.addEventListener("resize", () => {
    buttons.forEach(updateButtonState);
  });
}

function initPortfolioFewItems() {
  qsa(".portfolio-feed").forEach((feed) => {
    const items = qsa(".portfolio-item", feed);
    if (items.length && items.length <= 2) {
      feed.classList.add("few-items");
    }
  });
}
