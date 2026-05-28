document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Scroll Animation Logic
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

  
  // 2. Custom Button Interaction
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