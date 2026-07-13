// --- Top Navigation Toggle ---
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const mainContent = document.getElementById('main-content');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking a link (unless it's a dropdown toggle)
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && !link.parentElement.classList.contains('has-dropdown')) {
      navToggle.classList.remove('open');
      navMenu.classList.remove('active');
    }
  });
});

// Mobile Dropdowns
const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
dropdownToggles.forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      const parent = toggle.parentElement;
      parent.classList.toggle('active');
    }
  });
});

// --- About Me / Dossier (Legacy Modal trigger removed as it is now root content) ---
