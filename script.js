// 1. Instantly check for saved theme to prevent flashing before the DOM loads
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

document.addEventListener("DOMContentLoaded", () => {
  
  // 2. Load Navbar Component Dynamically
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch('/clientengineering.dmg.github.io/components/navbar.html')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => {
        // Inject the HTML
        navPlaceholder.innerHTML = data;
        
        // Initialize interactive elements ONLY AFTER the navbar is injected
        initMobileMenu();
        initThemeToggle(); 
      })
      .catch(error => console.error('Error loading navbar:', error));
  }

  // 3. Load Footer Component Dynamically
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/clientengineering.dmg.github.io/components/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => {
        // Inject the HTML
        footerPlaceholder.innerHTML = data;
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
    
    // Set the initial icon based on the current theme state
    if (document.body.classList.contains('dark-theme')) {
      themeToggleBtn.textContent = '☀️';
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        // Toggle the class on the body
        document.body.classList.toggle('dark-theme');
        
        // Update the icon and save to localStorage
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
  // Select all elements that need to be animated
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');

  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element is in the viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: Stop observing once animated
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1 // Triggers when 10% of the element is visible
  });

  // Attach observer to each element
  animatedElements.forEach(el => observer.observe(el));

  
  // 5. Custom Button Interaction (Homepage)
  const startBtn = document.getElementById('startTestBtn');
  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // You can replace this with a Glia API call, e.g., to open the widget
      // Example: sm.getApi({version: 'v1'}).then(api => api.maximize());
      console.log("CTA button clicked. Ready to test Glia!");
      
      // Temporary visual feedback
      startBtn.textContent = "Testing Started!";
      setTimeout(() => {
        startBtn.textContent = "Start Engagement";
      }, 2000);
    });
  }
});

/*
  WSL Ubuntu user: yinga
  Pswrd: yinga
*/