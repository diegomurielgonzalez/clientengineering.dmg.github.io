document.addEventListener("DOMContentLoaded", () => {
  
  // Element Selectors
  const generateBtn = document.getElementById('generateTokenBtn');
  const authenticateBtn = document.getElementById('authenticateBtn');
  const tokenText = document.getElementById('tokenText');
  const blinkingCursor = document.getElementById('blinkingCursor');
  
  let generatedToken = "";

  // 1. Browser-Side JWT Generation Function
  async function generateBrowserToken() {
    // The dummy private key provided in the testing guide
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgBwljQsuy9mwON1di
2P6T5kOkYERNbk/d90xNa4QWPs2hRANCAAT46I6GFEGDBxz+dcNJppgxsg5Wc2fK
Bc7iPmmT4+tSqvDnJh1tUG7RB4oUvOUNIMtxpBhY9EOjhV3rELxh5Q8F
-----END PRIVATE KEY-----`;

    // Import the PEM key into a format the Web Crypto API can use
    const privateKey = await jose.importPKCS8(privateKeyPem, 'ES256');

    // Define claims based on the provided guide
    const claims = {
      'name': 'Gianluca, Visitor',
      'given_name': 'Gianluca',
      'family_name': 'Ciccarelli',
      'email': 'gian+visitor@ciccarelli.dev',
      'sub': 'gian.visitor',
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