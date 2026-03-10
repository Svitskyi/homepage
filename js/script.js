// --- Sidebar Toggle ---
const sidebar = document.querySelector('.sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const mainContent = document.getElementById('main-content'); // Target the main container

function toggleSidebar() {
  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle('active');
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.remove('active');
  }
  
  mainContent.classList.toggle('sidebar-collapsed');

  if (sidebarToggleBtn && window.innerWidth <= 1024) {
    sidebarToggleBtn.classList.toggle('open');
  }

  // Collapse all submenus when the sidebar is closed (either collapsed on desktop or inactive on mobile)
  if (sidebar.classList.contains('collapsed') || (!sidebar.classList.contains('active') && window.innerWidth <= 1024)) {
    document.querySelectorAll('.has-submenu.open').forEach(item => {
      item.classList.remove('open');
    });
  }
}

// Add event listener to the new toggle button
if (sidebarToggleBtn) {
  sidebarToggleBtn.addEventListener('click', toggleSidebar);
}

// Close sidebar when clicking outside on mobile
mainContent.addEventListener('click', () => {
  if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
    toggleSidebar();
  }
});

// --- Tree-like Menu ---
const submenus = document.querySelectorAll('.has-submenu > a');
submenus.forEach(submenu => {
  submenu.addEventListener('click', (e) => {
    e.preventDefault();
    const parentLi = e.target.closest('.has-submenu');
    parentLi.classList.toggle('open');
  });
});

// --- About Me Modal ---
const aboutMeLink = document.getElementById('about-me-link');
const aboutModal = document.getElementById('about-modal');
const closeModal = document.getElementById('close-modal');

if (aboutMeLink && aboutModal) {
    aboutMeLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.add('active');
        // Close mobile sidebar if open
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
}

if (closeModal && aboutModal) {
    closeModal.addEventListener('click', () => {
        aboutModal.classList.remove('active');
    });

    // Close on click outside
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove('active');
        }
    });
}

// --- Login Modal ---
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeLoginModal = document.getElementById('close-login-modal');

if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
        // Close mobile sidebar if open
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
}


if (closeLoginModal && loginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Close on click outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

const authForm = document.getElementById('auth-form');
const loginMessage = document.getElementById('login-message');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const pwdReqs = document.getElementById('password-requirements');
const authSubmitText = document.getElementById('auth-submit-text');
const authModalTitle = document.getElementById('auth-modal-title');
let currentAuthMode = 'login';

if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        currentAuthMode = 'login';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        authUsername.style.display = 'none';
        authUsername.required = false;
        pwdReqs.style.display = 'none';
        authSubmitText.textContent = 'Login';
        authModalTitle.textContent = 'Login';
        loginMessage.textContent = '';
    });
    
    tabRegister.addEventListener('click', () => {
        currentAuthMode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        authUsername.style.display = 'block';
        authUsername.required = true;
        pwdReqs.style.display = 'block';
        authSubmitText.textContent = 'Register';
        authModalTitle.textContent = 'Register';
        loginMessage.textContent = '';
    });
}

function validatePassword(password) {
    return password.length >= 8;
}

if (authPassword) {
    authPassword.addEventListener('input', () => {
        if (currentAuthMode === 'register') {
            if (validatePassword(authPassword.value)) {
                pwdReqs.classList.add('valid');
            } else {
                pwdReqs.classList.remove('valid');
            }
        }
    });
}

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = authPassword.value;
        const username = authUsername.value.trim();
        
        const cfResponse = document.querySelector('[name="cf-turnstile-response"]');
        const captchaToken = cfResponse ? cfResponse.value : null;

        if (!captchaToken) {
            loginMessage.textContent = 'Please complete the captcha';
            loginMessage.className = 'login-message error';
            return;
        }

        if (currentAuthMode === 'register' && !validatePassword(password)) {
            loginMessage.textContent = 'Password does not meet requirements';
            loginMessage.className = 'login-message error';
            return;
        }

        loginMessage.textContent = 'Processing...';
        loginMessage.className = 'login-message';
        
        try {
            const response = await fetch('http://localhost:5678/webhook/tWtqKDf6CNeMuE9z/webhook/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: currentAuthMode, email, password, username, captcha: captchaToken })
            });
            
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            
            if (data.success) {
                if (currentAuthMode === 'register') {
                    loginMessage.textContent = 'Registration successful! Please check your email to verify your account.';
                    loginMessage.classList.add('success');
                    if (window.turnstile) turnstile.reset();
                    // Optional: Switch to login tab after short delay
                    setTimeout(() => {
                        tabLogin.click();
                    }, 3000);
                } else {
                    loginMessage.textContent = 'Login successful!';
                    loginMessage.classList.add('success');
                    setTimeout(() => {
                        loginModal.classList.remove('active');
                        if (loginBtn) loginBtn.innerHTML = `<i class="fas fa-user"></i> ${data.username}`;
                    }, 1000);
                    if (window.turnstile) turnstile.reset();
                }
            } else {
                loginMessage.textContent = data.message || 'Authentication failed';
                loginMessage.classList.add('error');
                if (window.turnstile) turnstile.reset();
            }
        } catch (err) {
            loginMessage.textContent = 'Error: ' + err.message;
            loginMessage.classList.add('error');
            if (window.turnstile) turnstile.reset();
        }
    });
}

// --- Chat Functionality ---
const webhookUrl = "https://n8n.svitskyi.com/webhook/38acd88b-1d20-4546-b05b-c140d0eaa795";
const chatInput = document.getElementById("chat-message");
const sendBtn = document.getElementById("send-btn");
const chatSnippets = document.querySelectorAll('.chat-snippet');
const chatContainer = document.querySelector('.chat-container');

if (chatInput && sendBtn) {
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('chatSessionId', sessionId);
    }

    function addMessage(text, sender) {
        const chatBody = document.getElementById("chat-body");
        const welcome = document.querySelector('.welcome-container');

        if (welcome) {
            welcome.remove();
            chatContainer.classList.add('started');
        }

        const msg = document.createElement("div");
        msg.className = sender + " message";
        msg.innerText = text;

        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        chatInput.value = "";
        chatInput.focus();

        const typing = document.createElement("div");
        typing.className = "bot message typing";
        typing.innerText = "Typing...";

        document.getElementById("chat-body").appendChild(typing);
        document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    message: text,
                    sessionId: sessionId
                })
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
            const data = await response.json();
            typing.remove();
            addMessage(data.reply || "No response", "bot");
        } catch (err) {
            typing.remove();
            clearTimeout(timeoutId);

            if (err.name === 'AbortError') {
                addMessage("Error: Request timed out after 15 seconds.", "bot");
            } else {
                console.error("Fetch error:", err);
                addMessage("Error contacting server: " + err.message, "bot");
            }
        }
    }

    chatInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener("click", sendMessage);

    chatSnippets.forEach(snippet => {
        snippet.addEventListener('click', () => {
            chatInput.value = snippet.textContent;
            sendMessage();
        });
    });
}

