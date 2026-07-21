// 1. Instantly check for saved theme to prevent flashing before the DOM loads
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

document.addEventListener("DOMContentLoaded", () => {
  
  // Determine base path dynamically
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  const basePath = isLocal ? '' : '/clientengineering.dmg.github.io';

  // 2. Load Navbar Component Dynamically
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch(`${basePath}/components/navbar.html`)
      .then(response => {
        if (!response.ok) throw new Error('Navbar fetch failed');
        return response.text();
      })
      .then(html => {
        navPlaceholder.innerHTML = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
        
        // NEW: Scroll listener for Glassmorphism
        const navElement = navPlaceholder.querySelector('.navbar');
        window.addEventListener('scroll', () => {
          if (window.scrollY > 20) {
            navElement.classList.add('scrolled');
          } else {
            navElement.classList.remove('scrolled');
          }
        });
        
        initMobileMenu();
        initThemeToggle(); 
      })
      .catch(error => console.error('Error loading navbar:', error));
  }

  // 3. Load Footer Component Dynamically
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch(`${basePath}/components/footer.html`)
      .then(response => {
        if (!response.ok) throw new Error('Footer fetch failed');
        return response.text();
      })
      .then(html => {
        // Inject the HTML, swapping our placeholder for the correct path
        footerPlaceholder.innerHTML = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
      })
      .catch(error => console.error('Error loading footer:', error));
  }

  // Helper function for mobile menu logic
  function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
      mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('active');
      });
    }
  }

  // Helper function for Theme Toggle
  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (document.body.classList.contains('dark-theme')) {
      themeToggleBtn.textContent = '☀️';
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
          themeToggleBtn.textContent = '☀️';
          localStorage.setItem('theme', 'dark');
        } else {
          themeToggleBtn.textContent = '🌙';
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  // 4. Scroll Animation Logic
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  // 5. Custom Button Interaction (Homepage)
  const startBtn = document.getElementById('startTestBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      console.log("CTA button clicked. Ready to test Glia!");
      startBtn.textContent = "Testing Started!";
      setTimeout(() => { startBtn.textContent = "Start Engagement"; }, 2000);
    });
  }
});