const webhookUrl = "https://n8n.svitskyi.com/webhook/38acd88b-1d20-4546-b05b-c140d0eaa795";

// --- Session Management ---
let sessionId = localStorage.getItem('chatSessionId');
if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('chatSessionId', sessionId);
}

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

  // Update toggle button class for animated icon (Mobile only)
  if (sidebarToggleBtn && window.innerWidth <= 1024) {
    sidebarToggleBtn.classList.toggle('open');
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

// --- Theme Toggle ---
const body = document.body;
const themeToggleSidebarBtn = document.getElementById('theme-toggle-sidebar');

if (themeToggleSidebarBtn) {
  themeToggleSidebarBtn.addEventListener('click', () => {
    // Toggle between theme-orange and theme-blue classes
    if (body.classList.contains('theme-orange')) {
      body.classList.remove('theme-orange');
      body.classList.add('theme-blue');
    } else {
      body.classList.remove('theme-blue');
      body.classList.add('theme-orange');
    }
  });
}

// --- Chat Functionality ---
const container = document.querySelector('.chat-container');

// --- About Me Modal ---
const aboutMeLink = document.getElementById('about-me-link');
const aboutModal = document.getElementById('about-modal');
const closeModal = document.getElementById('close-modal');

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

function addMessage(text, sender) {
    const chatBody = document.getElementById("chat-body");
    const welcome = document.querySelector('.welcome-container');

    // Remove welcome message and shift layout on first message
    if (welcome) {
        welcome.remove();
        container.classList.add('started');
    }

    const msg = document.createElement("div");
    msg.className = sender + " message";
    msg.innerText = text;
    
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("chat-message");
    const text = input.value.trim();
    if(!text) return;

    addMessage(text, "user");
    input.value = "";
    input.focus();

    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "bot message typing";
    typing.innerText = "Typing...";
    
    document.getElementById("chat-body").appendChild(typing);
    document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

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

        if(!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
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

// Enter to send, Shift+Enter for newline
const chatInput = document.getElementById("chat-message");
chatInput.addEventListener("keydown", function(e){
    if(e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        sendMessage();
    }
});

// Send button
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Initial setup: Ensure initial theme class is set correctly
// The body tag in index.html should have 'theme-orange' by default.
// If it doesn't, uncomment the next lines to enforce it.
// if (!body.classList.contains('theme-orange') && !body.classList.contains('theme-blue')) {
//   body.classList.add('theme-orange');
// }