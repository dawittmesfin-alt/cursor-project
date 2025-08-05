// Security Configuration
const SECURITY_CONFIG = {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_MESSAGES_PER_MINUTE: 20,
    RATE_LIMIT_WINDOW: 60000, // 1 minute
    ALLOWED_HTML_TAGS: ['br', 'strong', 'em', 'p'],
    SANITIZE_INPUT: true
};

// Rate limiting
let messageCount = 0;
let lastMessageTime = 0;

// Security utility functions
function sanitizeInput(input) {
    if (!SECURITY_CONFIG.SANITIZE_INPUT) return input;
    
    // Remove any HTML tags except allowed ones
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    
    // Only allow specific HTML tags
    const allowedTags = SECURITY_CONFIG.ALLOWED_HTML_TAGS.join('|');
    sanitized = sanitized.replace(new RegExp(`<(?!\/?(?:${allowedTags})\b)[^>]+>`, 'gi'), '');
    
    // Escape remaining HTML entities
    sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    
    return sanitized.trim();
}

function validateInput(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input type');
    }
    
    if (input.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
        throw new Error(`Message too long. Maximum ${SECURITY_CONFIG.MAX_MESSAGE_LENGTH} characters allowed.`);
    }
    
    if (input.length === 0) {
        throw new Error('Message cannot be empty');
    }
    
    // Check for potential XSS patterns
    const xssPatterns = [
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i,
        /onclick=/i,
        /onmouseover=/i,
        /<script/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
    ];
    
    for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
            throw new Error('Potentially unsafe content detected');
        }
    }
    
    return true;
}

function checkRateLimit() {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - lastMessageTime > SECURITY_CONFIG.RATE_LIMIT_WINDOW) {
        messageCount = 0;
        lastMessageTime = now;
    }
    
    if (messageCount >= SECURITY_CONFIG.MAX_MESSAGES_PER_MINUTE) {
        throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }
    
    messageCount++;
    lastMessageTime = now;
    return true;
}

function secureLog(message, type = 'info') {
    // Secure logging - only log non-sensitive information
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type,
        message: typeof message === 'string' ? message.substring(0, 100) : 'Object logged',
        userAgent: navigator.userAgent.substring(0, 100)
    };
    
    // In production, this would be sent to a secure logging service
    console.log(`[${type.toUpperCase()}] ${logEntry.message}`);
}

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const chatOverlay = document.getElementById('chatOverlay');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatCompanionName = document.getElementById('chatCompanionName');
const chatCompanionStatus = document.getElementById('chatCompanionStatus');
const startChatBtn = document.getElementById('startChatBtn');
const meetCompanionsBtn = document.getElementById('meetCompanionsBtn');
const chatWithBtns = document.querySelectorAll('.chat-with-btn');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

// Companion personalities and responses
const companions = {
    sarah: {
        name: 'Sarah',
        title: 'The Empathetic Listener',
        personality: 'empathetic',
        responses: {
            greeting: "Hello! I'm Sarah, and I'm here to listen with an open heart. How are you feeling today?",
            anxious: "I can sense that you're feeling anxious. That's completely normal and valid. Would you like to tell me more about what's on your mind? Sometimes just talking about our worries can help us feel a bit lighter.",
            sad: "I'm so sorry you're feeling sad. Your feelings matter, and it's okay to not be okay. What's been weighing on your heart lately?",
            stressed: "Stress can feel overwhelming, and I want you to know that you're not alone in this. Let's take a moment to breathe together. What's causing you the most stress right now?",
            default: "I hear you, and I want you to know that your feelings are valid. Would you like to explore this further together?"
        }
    },
    marcus: {
        name: 'Marcus',
        title: 'The Motivational Coach',
        personality: 'motivational',
        responses: {
            greeting: "Hey there! I'm Marcus, your personal cheerleader! What amazing things are we going to accomplish today?",
            anxious: "Anxiety is just your mind's way of preparing for something important. You're stronger than you think! Let's channel that energy into something positive. What's one small step you can take right now?",
            sad: "I know it feels tough right now, but remember: every storm passes. You've got incredible strength inside you. What's one thing that usually brings you joy? Let's focus on that.",
            stressed: "Stress is temporary, but your potential is limitless! Let's break this down into manageable pieces. What's the most important thing you need to tackle first?",
            default: "You've got this! Every challenge is an opportunity to grow stronger. What's your next move?"
        }
    },
    luna: {
        name: 'Luna',
        title: 'The Mindfulness Guide',
        personality: 'mindful',
        responses: {
            greeting: "Welcome! I'm Luna. Let's take a moment to breathe and be present together. How are you feeling in this moment?",
            anxious: "Anxiety is like waves in the ocean - they come and go. Let's practice some mindful breathing together. Take a deep breath in... and slowly release. What's happening in your body right now?",
            sad: "Sadness is a natural part of being human, like clouds passing through the sky. Let's sit with these feelings without judgment. What do you notice about your emotions?",
            stressed: "Stress often lives in our thoughts about the future. Let's bring our attention back to this present moment. What can you see, hear, or feel right now?",
            default: "Let's pause and observe what's happening within you. There's wisdom in stillness."
        }
    },
    alex: {
        name: 'Alex',
        title: 'The Practical Problem Solver',
        personality: 'practical',
        responses: {
            greeting: "Hi! I'm Alex. I'm here to help you work through challenges and find practical solutions. What would you like to tackle today?",
            anxious: "Anxiety often comes from uncertainty. Let's identify what's within your control and what isn't. What specific situation is causing you worry?",
            sad: "When we're sad, it helps to understand the root cause. Let's explore what's behind these feelings. What changed recently that might be contributing to this?",
            stressed: "Stress usually means we have too much on our plate. Let's prioritize and create a plan. What are the top three things you need to address?",
            default: "Let's approach this systematically. What's the first step we can take to improve this situation?"
        }
    }
};

let currentCompanion = null;
let messageHistory = [];

// Security: Validate companion data
function validateCompanionData() {
    for (const [id, companion] of Object.entries(companions)) {
        if (!companion.name || !companion.title || !companion.responses) {
            secureLog(`Invalid companion data for ${id}`, 'error');
            throw new Error('Invalid companion configuration');
        }
    }
}

// Initialize security validation
try {
    validateCompanionData();
    secureLog('CompanionAI security validation passed');
} catch (error) {
    secureLog(`Security validation failed: ${error.message}`, 'error');
    console.error('Security validation failed:', error);
}

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chat functionality
function openChat(companionId) {
    try {
        // Validate companion ID
        if (!companions[companionId]) {
            throw new Error('Invalid companion selected');
        }
        
        currentCompanion = companions[companionId];
        chatCompanionName.textContent = currentCompanion.name;
        chatCompanionStatus.textContent = 'Online';
        chatOverlay.classList.add('active');
        
        // Clear previous messages
        chatMessages.innerHTML = '';
        messageHistory = [];
        
        // Add greeting message
        addMessage(currentCompanion.responses.greeting, 'companion');
        
        // Focus on input
        setTimeout(() => {
            chatInput.focus();
        }, 100);
        
        secureLog(`Chat opened with ${companionId}`);
    } catch (error) {
        secureLog(`Error opening chat: ${error.message}`, 'error');
        showSecurityAlert('Unable to open chat. Please try again.');
    }
}

function closeChatOverlay() {
    chatOverlay.classList.remove('active');
    currentCompanion = null;
    messageHistory = [];
    secureLog('Chat closed');
}

function addMessage(text, sender) {
    try {
        // Sanitize message content
        const sanitizedText = sanitizeInput(text);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${sanitizedText}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to history (limited to last 50 messages for memory management)
        messageHistory.push({ text: sanitizedText, sender, time });
        if (messageHistory.length > 50) {
            messageHistory.shift();
        }
    } catch (error) {
        secureLog(`Error adding message: ${error.message}`, 'error');
        showSecurityAlert('Unable to display message. Please try again.');
    }
}

function generateResponse(userMessage) {
    try {
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for specific keywords
        if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
            return currentCompanion.responses.anxious;
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
            return currentCompanion.responses.sad;
        } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('busy')) {
            return currentCompanion.responses.stressed;
        } else {
            return currentCompanion.responses.default;
        }
    } catch (error) {
        secureLog(`Error generating response: ${error.message}`, 'error');
        return "I'm having trouble processing that right now. Could you try rephrasing your message?";
    }
}

function showSecurityAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'security-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${sanitizeInput(message)}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

function sendUserMessageEnhanced() {
    try {
        const message = chatInput.value.trim();
        
        // Security validations
        validateInput(message);
        checkRateLimit();
        
        if (!currentCompanion) {
            throw new Error('No active chat session');
        }
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Generate response with typing delay
        setTimeout(() => {
            // Remove typing indicator
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            const response = generateResponse(message);
            addMessage(response, 'companion');
        }, 1500 + Math.random() * 2000);
        
        secureLog('Message sent successfully');
    } catch (error) {
        secureLog(`Error sending message: ${error.message}`, 'error');
        showSecurityAlert(error.message);
    }
}

// Event listeners
closeChat.addEventListener('click', closeChatOverlay);

chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) {
        closeChatOverlay();
    }
});

sendMessage.addEventListener('click', sendUserMessageEnhanced);

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessageEnhanced();
    }
});

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Chat with companion buttons
chatWithBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const companionId = btn.getAttribute('data-companion');
        if (companionId && companions[companionId]) {
            openChat(companionId);
        } else {
            showSecurityAlert('Invalid companion selected');
        }
    });
});

// Suggestion buttons
suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentCompanion) {
            const suggestionText = btn.textContent;
            if (suggestionText && suggestionText.length <= SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
                chatInput.value = suggestionText;
                sendUserMessageEnhanced();
            }
        }
    });
});

// Start chat button (opens with random companion)
startChatBtn.addEventListener('click', () => {
    const companionIds = Object.keys(companions);
    const randomCompanion = companionIds[Math.floor(Math.random() * companionIds.length)];
    openChat(randomCompanion);
});

// Meet companions button
meetCompanionsBtn.addEventListener('click', () => {
    document.getElementById('companions').scrollIntoView({ behavior: 'smooth' });
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate companion cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.companion-card, .safety-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add hover effects to companion avatars
    document.querySelectorAll('.companion-avatar').forEach(avatar => {
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    secureLog('CompanionAI initialized successfully');
});

// Add typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message companion-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Add CSS for typing indicator and security alerts
const style = document.createElement('style');
style.textContent = `
    .typing-indicator .message-content {
        background: #f3f4f6 !important;
        padding: 1rem !important;
    }
    
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .security-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .alert-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .security-notice {
        text-align: center;
        margin-top: 0.5rem;
        color: #6b7280;
        font-size: 0.875rem;
    }
    
    .security-notice i {
        margin-right: 0.25rem;
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close chat
    if (e.key === 'Escape' && chatOverlay.classList.contains('active')) {
        closeChatOverlay();
    }
    
    // Ctrl/Cmd + K to open chat with random companion
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!chatOverlay.classList.contains('active')) {
            const companionIds = Object.keys(companions);
            const randomCompanion = companionIds[Math.floor(Math.random() * companionIds.length)];
            openChat(randomCompanion);
        }
    }
});

// Add some personality-specific styling
function updateChatTheme(companionId) {
    const chatContainer = document.querySelector('.chat-container');
    const companionAvatar = document.querySelector('.companion-avatar-small');
    
    // Remove existing theme classes
    chatContainer.className = 'chat-container';
    companionAvatar.className = 'companion-avatar-small';
    
    // Add theme-specific classes
    switch(companionId) {
        case 'sarah':
            chatContainer.classList.add('theme-empathetic');
            companionAvatar.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
            break;
        case 'marcus':
            chatContainer.classList.add('theme-motivational');
            companionAvatar.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        case 'luna':
            chatContainer.classList.add('theme-mindful');
            companionAvatar.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'alex':
            chatContainer.classList.add('theme-practical');
            companionAvatar.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            break;
    }
}

// Update the openChat function to include theme
const originalOpenChat = openChat;
openChat = function(companionId) {
    originalOpenChat(companionId);
    updateChatTheme(companionId);
};

// Security: Prevent console access in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            ((e.ctrlKey || e.metaKey) && e.key === 'U')
        ) {
            e.preventDefault();
            showSecurityAlert('This action is not allowed for security reasons.');
        }
    });
}

// Security: Clear sensitive data on page unload
window.addEventListener('beforeunload', () => {
    messageHistory = [];
    currentCompanion = null;
    secureLog('Page unloaded - sensitive data cleared');
}); 