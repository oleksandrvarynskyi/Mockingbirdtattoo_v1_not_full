
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  }

  const params = new URLSearchParams(window.location.search);
  const artist = params.get("artist");
  const service = params.get("service");

  const artistSelect = document.getElementById("preferredArtist");
  const serviceType = document.getElementById("serviceType");
  const ideaLabel = document.getElementById("ideaLabel");
  const ideaField = document.getElementById("ideaField");

  if (artist && artistSelect) artistSelect.value = artist;
  if (service && serviceType) serviceType.value = service;

  function updateBookingFields() {
    if (!serviceType || !ideaLabel || !ideaField) return;
    if (serviceType.value === "Piercing") {
      ideaLabel.textContent = "Piercing details";
      ideaField.placeholder = "Tell us what piercing you are interested in and any important details";
      if (artistSelect && (artistSelect.value === "" || artistSelect.value === "Any")) artistSelect.value = "Nika";
    } else {
      ideaLabel.textContent = "Tattoo idea";
      ideaField.placeholder = "Tell us about your tattoo idea, placement and size";
    }
  }
  if (serviceType) {
    serviceType.addEventListener("change", updateBookingFields);
    updateBookingFields();
  }
});


document.querySelectorAll('.faq-question').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item = btn.parentElement;
    item.classList.toggle('active');

    const symbol = btn.querySelector('.faq-symbol');
    symbol.textContent = item.classList.contains('active') ? '−' : '+';
  });
});


/* AUTO ANIMATION SYSTEM */
const animatedItems = document.querySelectorAll(
  '.hero-copy, .visual-card, .artist-card, .review-card, .booking-card, .care-card, .editorial-card'
);

animatedItems.forEach((el, index)=>{
  el.classList.add(index % 3 === 0 ? 'fade-up' : index % 3 === 1 ? 'fade-left' : 'fade-right');
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
    }
  });
},{threshold:0.14});

animatedItems.forEach(el=>observer.observe(el));


document.addEventListener("DOMContentLoaded", () => {
  const portfolioItems = document.querySelectorAll(".portfolio-item img");
  const lightbox = document.getElementById("portfolioLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxDots = document.getElementById("lightboxDots");

  if (!portfolioItems.length || !lightbox || !lightboxImage) return;

  const galleryImages = Array.from(portfolioItems);
  let currentIndex = 0;

  lightboxDots.innerHTML = "";

  galleryImages.forEach((_, index) => {
    const dot = document.createElement("span");
    if (index === 0) dot.classList.add("active");
    lightboxDots.appendChild(dot);
  });

  const dots = lightboxDots.querySelectorAll("span");

  function updateImage(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;

    const activeImage = galleryImages[currentIndex];
    const fullSrc = activeImage.dataset.full || activeImage.src;

    lightboxImage.src = fullSrc;

    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentIndex].classList.add("active");
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

  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => updateImage(currentIndex - 1));
  lightboxNext.addEventListener("click", () => updateImage(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") updateImage(currentIndex + 1);
    if (e.key === "ArrowLeft") updateImage(currentIndex - 1);
  });

  let startX = 0;

  lightboxImage.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  lightboxImage.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].screenX;
    const diff = startX - endX;

    if (Math.abs(diff) < 40) return;

    if (diff > 0) updateImage(currentIndex + 1);
    else updateImage(currentIndex - 1);
  });
});

const track = document.querySelector('.artist-slider-track');

const nextBtn = document.querySelector('.artist-arrow.next');

const prevBtn = document.querySelector('.artist-arrow.prev');

function updateArrows() {

  const maxScroll =
    track.scrollWidth - track.clientWidth;

  if(track.scrollLeft <= 10){
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
  }

  if(track.scrollLeft >= maxScroll - 10){
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.classList.remove('disabled');
  }
}

nextBtn.addEventListener('click', () => {

  track.scrollBy({
    left: track.clientWidth,
    behavior: 'smooth'
  });

});

prevBtn.addEventListener('click', () => {

  track.scrollBy({
    left: -track.clientWidth,
    behavior: 'smooth'
  });

});

track.addEventListener('scroll', updateArrows);

window.addEventListener('load', updateArrows);

window.addEventListener('resize', updateArrows);

