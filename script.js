

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

// Mobile navigation menu toggle and auto-close on link click
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation' : 'Open navigation'
    );
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  });
}

// Prevent placeholder links from jumping to the top
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
});

// Automatically update the copyright year in the footer
const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".clickable");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("closeLightbox");
  let autoCloseTimer;

  function openLightbox(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("show"); // fade-in
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeLightbox, 4000); // auto close after 4s
  }

  function closeLightbox() {
    lightbox.classList.add("fade-out");
    setTimeout(() => {
      lightbox.classList.remove("show", "fade-out");
      lightboxImg.src = "";
      // ❌ don’t set display:none manually here
      // let CSS handle visibility via .show class
    }, 800); // matches CSS transition
  }

  images.forEach(img => {
    img.addEventListener("click", () => {
      openLightbox(img);
    });
  });

  closeBtn.addEventListener("click", () => {
    clearTimeout(autoCloseTimer);
    closeLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      clearTimeout(autoCloseTimer);
      closeLightbox();
    }
  });
});
