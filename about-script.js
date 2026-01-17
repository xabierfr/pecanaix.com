// Global variables
let isListening = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentVoice = null;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const voiceButton = document.getElementById('voiceButton');
const voiceStatus = document.getElementById('voiceStatus');
const voiceModal = document.getElementById('voiceModal');

// Initialize the chatbot
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    initializeTextToSpeech();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Enter key in input
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Voice button
    voiceButton.addEventListener('click', toggleVoiceRecognition);
}

// Initialize speech recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isListening = true;
            voiceButton.classList.add('listening');
            voiceStatus.style.display = 'block';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            sendMessage();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopListening();
            if (event.error === 'not-allowed') {
                showVoiceModal();
            }
        };
        
        recognition.onend = function() {
            stopListening();
        };
    } else {
        voiceButton.style.display = 'none';
        console.log('Speech recognition not supported');
    }
}

// Initialize text-to-speech
function initializeTextToSpeech() {
    if (speechSynthesis) {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            // Prefer female voices for a more friendly experience
            currentVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') ||
                voice.name.includes('Karen') ||
                voice.lang.startsWith('en')
            ) || voices[0];
        };
    }
}

// Toggle voice recognition
function toggleVoiceRecognition() {
    if (!recognition) {
        showVoiceModal();
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// Stop listening
function stopListening() {
    isListening = false;
    voiceButton.classList.remove('listening');
    voiceStatus.style.display = 'none';
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
        
        // Speak the response if text-to-speech is available
        if (speechSynthesis && currentVoice) {
            speakText(response);
        }
    }, 1000 + Math.random() * 2000); // Random delay for realism
}

// Send quick message
function sendQuickMessage(message) {
    messageInput.value = message;
    sendMessage();
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = formatMessage(text);
    
    content.appendChild(bubble);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format message text
function formatMessage(text) {
    // Convert line breaks to <br> tags
    return text.replace(/\n/g, '<br>');
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Generate bot response
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Predefined responses based on keywords
    if (message.includes('how does pecan work') || message.includes('how it works')) {
        return "Great question! pecan is an AI-powered platform that streamlines the admissions process. Here's how it works:\n\n• For Universities: I help consolidate evaluation criteria, visualize applicant data, and create AI-safe assessments\n• For Students: I help you find the right programs, understand what universities want, and present yourself effectively\n\nWould you like me to explain any specific aspect in more detail?";
    }
    
    if (message.includes('different') || message.includes('unique') || message.includes('special')) {
        return "What makes pecan special is our voice-powered AI approach! Unlike traditional admissions tools, I can:\n\n• Have natural conversations with both students and admissions teams\n• Create personalized dashboards that show how different metrics interact\n• Generate AI-safe assessments that bypass LLM cheating\n• Provide real-time insights and recommendations\n\nI'm designed to make admissions more human and intuitive, not just automated.";
    }
    
    if (message.includes('cost') || message.includes('price') || message.includes('pricing')) {
        return "I'd be happy to discuss pricing! Our costs vary based on:\n\n• Institution size and needs\n• Features required (basic vs. premium)\n• Number of users and applications processed\n\nFor detailed pricing information, I'd recommend booking a demo where we can discuss your specific needs and provide a customized quote. Would you like me to help you schedule one?";
    }
    
    if (message.includes('demo') || message.includes('demonstration') || message.includes('see it')) {
        return "Absolutely! I'd love to show you pecan in action. Our demos are personalized to your specific needs and typically last about 30 minutes.\n\nYou can book a demo right from our website, or I can help guide you through the process. During the demo, you'll see:\n\n• Live examples of our AI capabilities\n• How the platform works for your specific use case\n• Q&A with our admissions specialists\n\nWould you like me to help you book a demo now?";
    }
    
    if (message.includes('universities') || message.includes('schools') || message.includes('who uses')) {
        return "We work with a diverse range of educational institutions! While I can't share specific client names due to privacy, our users include:\n\n• Major research universities\n• Liberal arts colleges\n• Graduate and professional schools\n• International institutions\n\nOur platform scales from small colleges processing hundreds of applications to large universities handling tens of thousands. Each institution gets a customized experience based on their unique needs and criteria.";
    }
    
    if (message.includes('get started') || message.includes('begin') || message.includes('start')) {
        return "Getting started with pecan is easy! Here's the typical process:\n\n1. **Book a Demo**: See how pecan works for your specific needs\n2. **Consultation**: We discuss your current admissions process and challenges\n3. **Customization**: We tailor pecan to your institution's criteria and workflows\n4. **Training**: Your team gets hands-on training with the platform\n5. **Launch**: Start using pecan for your next admissions cycle\n\nThe whole process usually takes 2-4 weeks. Would you like to start with a demo?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hello! It's great to meet you! I'm pecan, and I'm here to help you understand how AI can transform your admissions process. Whether you're a student looking for the right program or a university wanting to improve your admissions workflow, I'm here to help.\n\nWhat would you like to know about our platform?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
        return "You're very welcome! I'm always happy to help. If you have any other questions about pecan or would like to see our platform in action, just let me know. I'm here whenever you need me!";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
        return "Thanks for chatting with me today! If you have more questions later, I'll be right here. Don't forget - you can always book a demo to see pecan in action. Have a great day!";
    }
    
    // Default response for unrecognized queries
    return "That's an interesting question! While I try to cover the most common topics, I might not have a specific answer for that right now.\n\nI'd recommend booking a demo where our team can give you detailed, personalized answers to all your questions. Or feel free to ask me about:\n\n• How pecan works\n• What makes us different\n• Pricing information\n• Getting started\n• Who uses our platform\n\nWhat else would you like to know?";
}

// Speak text using text-to-speech
function speakText(text) {
    if (!speechSynthesis || !currentVoice) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Clean text for speech (remove HTML and special characters)
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[•]/g, '').replace(/\n/g, ' ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = currentVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
}

// Show voice modal
function showVoiceModal() {
    voiceModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close voice modal
function closeVoiceModal() {
    voiceModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Enable voice
function enableVoice() {
    closeVoiceModal();
    if (recognition) {
        recognition.start();
    }
}

// Close modal when clicking outside
voiceModal.addEventListener('click', function(e) {
    if (e.target === voiceModal) {
        closeVoiceModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && voiceModal.style.display === 'flex') {
        closeVoiceModal();
    }
});

