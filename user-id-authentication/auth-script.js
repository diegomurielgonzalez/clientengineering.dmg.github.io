document.addEventListener("DOMContentLoaded", () => {
  
  // Scroll Animation Logic
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

  // Element Selectors
  const generateBtn = document.getElementById('generateTokenBtn');
  const authenticateBtn = document.getElementById('authenticateBtn');
  const tokenText = document.getElementById('tokenText');
  const blinkingCursor = document.getElementById('blinkingCursor');
  
  let generatedToken = "";

  // 1. Browser-Side JWT Generation Function
  async function generateBrowserToken() {
    // The private key generated
    const privateKeyPem = `-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIAcJY0LLsvZsDjdXYtj+k+ZDpGBETW5P3fdMTWuEFj7NoAoGCCqGSM49\nAwEHoUQDQgAE+OiOhhRBgwcc/nXDSaaYMbIOVnNnygXO4j5pk+PrUqrw5yYdbVBu\n0QeKFLzlDSDLcaQYWPRDo4Vd6xC8YeUPBQ==\n-----END EC PRIVATE KEY-----`;

    // Import the PEM key into a format the Web Crypto API can use
    const privateKey = await jose.importPKCS8(privateKeyPem, 'ES256');

    // Define claims based on the provided guide
    const claims = {
      'name': 'Diego M.',
      'given_name': 'Diego',
      'family_name': 'Muriel',
      'email': 'dmg@glia.com',
      'sub': 'dmg.visitor',
    };

    // Sign the JWT using jose
    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('5d') // Automatically sets 'exp' for 5 days from now
      .sign(privateKey);

    return jwt;
  }

  // 2. Handle Token Generation Click
  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      try {
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;

        // Generate the token
        generatedToken = await generateBrowserToken();
        
        // Update Code Snippet UI
        tokenText.textContent = generatedToken;
        if (blinkingCursor) {
            blinkingCursor.style.display = 'none';
        }

        // Enable Authenticate Button
        authenticateBtn.disabled = false;
        authenticateBtn.title = "Click to authenticate";
        
        // Reset Generate Button UI
        generateBtn.textContent = "Token Generated";
        generateBtn.style.backgroundColor = "var(--purple-shade-2)";
      } catch (error) {
        console.error("Error generating token:", error);
        generateBtn.textContent = "Error - Try Again";
        generateBtn.disabled = false;
      }
    });
  }

  // 3. Handle Authentication Redirect
  if (authenticateBtn) {
    authenticateBtn.addEventListener('click', () => {
      if (generatedToken) {
        // Appends ?idtoken=... to the current URL of the GitHub page dynamically
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('idtoken', generatedToken);
        
        console.log("Redirecting to:", currentUrl.toString());
        
        authenticateBtn.textContent = "Redirecting...";
        
        // Redirect the browser
        window.location.href = currentUrl.toString(); 
      }
    });
  }
});