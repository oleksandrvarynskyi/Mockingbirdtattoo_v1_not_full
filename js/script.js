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

  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    navToggle.classList.toggle("active");
  });
}

function initBookingForm() {
  const bookingForm = qs("#bookingForm");

  if (!bookingForm) return;

  const serviceType = qs("#serviceType");
  const artistSelect = qs("#preferredArtist");
  const ideaLabel = qs("#ideaLabel");
  const ideaField = qs("#ideaField");

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

      artistSelect.innerHTML =
        `<option value="Wiktoria">Wiktoria</option>`;

      artistSelect.value = "Wiktoria";

    } else {

      ideaLabel.textContent = "Tattoo idea";

      ideaField.placeholder =
        "Tell us about your tattoo idea, placement and size";

      artistSelect.innerHTML = tattooArtists;
    }
  }

  function clearErrors() {

    bookingForm
      .querySelectorAll(".form-error")
      .forEach(el => el.classList.remove("form-error"));

    bookingForm
      .querySelectorAll(".error-message")
      .forEach(el => el.remove());
  }

function showError(field, message) {

  if (!field) {
    console.error(
      "Validation error: field not found",
      message
    );
    return;
  }

  field.classList.add("form-error");

  const error = document.createElement("div");

  error.className = "error-message";
  error.textContent = message;

  field.insertAdjacentElement("afterend", error);

  field.scrollIntoView({
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

    const nameInput =
      bookingForm.querySelector("#fullName") ||
      bookingForm.querySelector("#name") ||
      bookingForm.querySelector('input[type="text"]');

    const emailInput =
      bookingForm.querySelector("#email") ||
      bookingForm.querySelector('input[type="email"]');

    if (!nameInput || nameInput.value.trim().length < 2) {

      showError(
        nameInput,
        "Please enter your full name."
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {

      showError(
        emailInput,
        "Please enter a valid email address."
      );

      return;
    }

    if (ideaField.value.trim().length < 10) {

      showError(
        ideaField,
        "Please provide more details."
      );

      return;
    }

    Swal.fire({
      icon: "success",
      title: "Booking request sent!",
      text: "We will get back to you as soon as possible.",
      confirmButtonColor: "#AA671C",
      background: "#193426",
      color: "#F4EAD7"
    });

    bookingForm.reset();
updateBookingFields();

  });

  bookingForm
    .querySelectorAll("input, textarea, select")
    .forEach(field => {

      field.addEventListener("input", () => {

        field.classList.remove("form-error");

        const error =
          field.parentNode.querySelector(".error-message");

        if (error) error.remove();

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

      if (symbol) {
        symbol.textContent = item.classList.contains("active") ? "−" : "+";
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

  if (lightboxDots) {
    lightboxDots.innerHTML = "";

    portfolioImages.forEach((_, index) => {
      const dot = document.createElement("span");

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => updateImage(index));
      lightboxDots.appendChild(dot);
    });

    dots = qsa("span", lightboxDots);
  }

  function updateImage(index) {
    currentIndex = (index + portfolioImages.length) % portfolioImages.length;

    const activeImage = portfolioImages[currentIndex];
    const fullSrc = activeImage.dataset.full || activeImage.src;

    lightboxImage.src = fullSrc;

    dots.forEach((dot) => dot.classList.remove("active"));

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("active");
    }
  }

  function openLightbox(index) {
    updateImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
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

  function clearErrors() {

    guestForm
      .querySelectorAll(".form-error")
      .forEach(el => el.classList.remove("form-error"));

    guestForm
      .querySelectorAll(".error-message")
      .forEach(el => el.remove());

  }

  function showError(field, message) {

    if (!field) return;

    field.classList.add("form-error");

    const error = document.createElement("div");

    error.className = "error-message";
    error.textContent = message;

    field.insertAdjacentElement("afterend", error);

    field.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    field.focus();

  }

  guestForm.addEventListener("submit", function (e) {

    e.preventDefault();

    clearErrors();

    const name =
      document.getElementById("guestName");

    const portfolio =
      document.getElementById("guestPortfolio");

    const experience =
      document.getElementById("guestExperience");

    const dates =
      document.getElementById("guestDates");

    if (!name || !name.value.trim()) {

      showError(
        name,
        "Please enter your name."
      );

      return;
    }

    if (!portfolio || !portfolio.value.trim()) {

      showError(
        portfolio,
        "Please provide your Instagram or portfolio."
      );

      return;
    }

    if (!experience || !experience.value.trim()) {

      showError(
        experience,
        "Please select your experience level."
      );

      return;
    }

    if (!dates || !dates.value.trim()) {

      showError(
        dates,
        "Please enter your preferred dates."
      );

      return;
    }

    Swal.fire({
      icon: "success",
      title: "Guest request sent!",
      text: "We will review your application and get back to you.",
      confirmButtonColor: "#AA671C",
      background: "#193426",
      color: "#F4EAD7"
    }).then(() => {

      guestForm.reset();

    });

  });

  guestForm
    .querySelectorAll("input, textarea, select")
    .forEach(field => {

      field.addEventListener("input", () => {

        field.classList.remove("form-error");

        const error =
          field.parentNode.querySelector(".error-message");

        if (error) {
          error.remove();
        }

      });

      field.addEventListener("change", () => {

        field.classList.remove("form-error");

        const error =
          field.parentNode.querySelector(".error-message");

        if (error) {
          error.remove();
        }

      });

    });

}

function initCareReadMore() {
  const buttons = qsa(".read-more-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".care-card");
      const label = qs(".read-more-label", button);
      if (!card) return;

      card.classList.toggle("expanded");
      const isExpanded = card.classList.contains("expanded");

      if (label) label.textContent = isExpanded ? "Show Less" : "Read More";
    });
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
