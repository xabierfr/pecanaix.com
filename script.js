// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollAnimations();
});

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in-on-scroll class
    document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Code Animation System
function initializeAnimations() {
    const canvases = document.querySelectorAll('.code-animation');
    
    console.log('Total canvases found:', canvases.length);
    
    canvases.forEach(canvas => {
        const animationType = canvas.dataset.animation;
        console.log('Initializing animation type:', animationType, 'Canvas:', canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        console.log('Canvas size:', canvas.width, 'x', canvas.height);
        
        // Start animation based on type
        switch(animationType) {
            case '1':
                console.log('Starting animation 1');
                animateChimation(ctx, canvas);
                break;
            case '2':
                console.log('Starting animation 2');
                animateSlashes(ctx, canvas);
                break;
            case '3':
                console.log('Starting animation 3');
                animate3DCards(ctx, canvas);
                break;
            default:
                console.log('Unknown animation type:', animationType);
        }
    });
}

// Animation 1: Outlook email interface (university side)
function animateChimation(ctx, canvas) {
    let animationProgress = 0;
    
    const emailContent = {
        to: "james.rodriguez@monzo.com",
        subject: "Fintech Pitch Competition - Judge Invitation",
        body: `Hi James,

I hope you're well. I've been following your work at Monzo since you led the credit risk overhaul last year — really compelling stuff, and exactly the kind of experience our students need more exposure to.

We're hosting a student fintech pitch competition next month and are putting together a small panel of judges. Given where you sit in the neobanking space, you'd bring a perspective that no one else on the panel can — someone who's actually had to make the hard product and risk decisions, not just advise on them.

It's an evening commitment, roughly two hours, and a handful of the student teams pitching are specifically building in the banking infrastructure and payments space — so there's a reasonable chance you'll see something worth keeping an eye on.

Would you be open to a quick call to hear more?

Best,
Sarah
Alumni Engagement`
    };
    
    let bodyTextProgress = 0;
    const typingSpeed = 3; // characters per frame
    let showSentConfirmation = false;
    let sentTimer = 0;
    
    function draw() {
        // White background (Outlook style)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const padding = 20;
        const headerHeight = 120;
        
        // Outlook header bar (blue)
        ctx.fillStyle = '#0078d4';
        ctx.fillRect(0, 0, canvas.width, 50);
        
        // "New Message" text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Open Sans, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('New Message', padding, 32);
        
        // To field
        ctx.fillStyle = '#333333';
        ctx.font = '14px Open Sans, sans-serif';
        ctx.fillText('To:', padding, 80);
        
        ctx.fillStyle = '#0078d4';
        ctx.font = '14px Open Sans, sans-serif';
        ctx.fillText(emailContent.to, padding + 30, 80);
        
        // Subject field
        ctx.fillStyle = '#333333';
        ctx.font = '14px Open Sans, sans-serif';
        ctx.fillText('Subject:', padding, 105);
        
        ctx.fillStyle = '#333333';
        ctx.font = '14px Open Sans, sans-serif';
        ctx.fillText(emailContent.subject, padding + 60, 105);
        
        // Separator line
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, headerHeight);
        ctx.lineTo(canvas.width - padding, headerHeight);
        ctx.stroke();
        
        // Email body
        if (bodyTextProgress < emailContent.body.length) {
            bodyTextProgress += typingSpeed;
            bodyTextProgress = Math.min(bodyTextProgress, emailContent.body.length);
        } else if (!showSentConfirmation && sentTimer > 60) {
            showSentConfirmation = true;
        }
        
        const displayBody = emailContent.body.substring(0, Math.floor(bodyTextProgress));
        const lines = displayBody.split('\n');
        
        ctx.fillStyle = '#333333';
        ctx.font = '13px Open Sans, sans-serif';
        ctx.textAlign = 'left';
        
        let yPos = headerHeight + 30;
        lines.forEach((line, i) => {
            if (yPos < canvas.height - 60) {
                ctx.fillText(line, padding + 10, yPos);
                yPos += 20;
            }
        });
        
        // Send button (bottom right)
        if (bodyTextProgress >= emailContent.body.length) {
            sentTimer++;
            
            const buttonWidth = 80;
            const buttonHeight = 35;
            const buttonX = canvas.width - padding - buttonWidth;
            const buttonY = canvas.height - padding - buttonHeight - 10;
            
            if (!showSentConfirmation) {
                // Send button
                ctx.fillStyle = '#0078d4';
                ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px Open Sans, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Send', buttonX + buttonWidth / 2, buttonY + 22);
            } else {
                // Sent confirmation
                ctx.fillStyle = '#107c10';
                ctx.fillRect(buttonX - 20, buttonY, buttonWidth + 40, buttonHeight);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px Open Sans, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✓ Sent', buttonX + buttonWidth / 2 + 10, buttonY + 22);
            }
        }
        
        animationProgress += 0.01;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Animation 2: Chat interface only (university side)
function animateSlashes(ctx, canvas) {
    let phaseTimer = 0;
    
    // Chat messages
    const userMessage = "What potential fintech networking events should we run in October?";
    const pecanResponse = "Many of your alumni are interested in breaking into credit risk at neobanks. Alberto Fernandez just graduated last year and works at Monzo; I would recommend reaching out to him via the following alumni email. I will draft it out for you.";
    
    let userTextProgress = userMessage.length; // Start with full message
    let pecanTextProgress = 0;
    const typingSpeed = 1; // characters per frame (slower)
    
    function drawChatInterface() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 20;
        const messageWidth = canvas.width - padding * 2 - 40;
        
        // User message bubble (right side) - always shown
        if (userTextProgress > 0) {
            const displayText = userMessage.substring(0, Math.floor(userTextProgress));
            const lines = wrapText(ctx, displayText, messageWidth - 40);
            const bubbleHeight = lines.length * 22 + 20;
            const bubbleY = 70; // Lower to make room for label
            const bubbleX = canvas.width - padding - messageWidth;
            
            // "You" label above bubble
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 12px Open Sans, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('You', canvas.width - padding - 10, bubbleY - 10);
            
            // User bubble (orange)
            ctx.fillStyle = '#ff8c42';
            roundRect(ctx, bubbleX, bubbleY, messageWidth, bubbleHeight, 15);
            ctx.fill();
            
            // User text
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Open Sans, sans-serif';
            ctx.textAlign = 'left';
            lines.forEach((line, i) => {
                ctx.fillText(line, bubbleX + 15, bubbleY + 25 + i * 22);
            });
        }
        
        // Pecan response bubble (left side)
        if (pecanTextProgress > 0) {
            const displayText = pecanResponse.substring(0, Math.floor(pecanTextProgress));
            const lines = wrapText(ctx, displayText, messageWidth - 40);
            const bubbleHeight = lines.length * 22 + 20;
            const bubbleY = 190; // Adjusted for label
            
            // "Pecan" label above bubble
            ctx.fillStyle = '#666666';
            ctx.font = 'bold 12px Open Sans, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Pecan', padding + 10, bubbleY - 10);
            
            // Pecan bubble (purple)
            ctx.fillStyle = '#a855f7';
            roundRect(ctx, padding, bubbleY, messageWidth, bubbleHeight, 15);
            ctx.fill();
            
            // Pecan text
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px Open Sans, sans-serif';
            ctx.textAlign = 'left';
            lines.forEach((line, i) => {
                ctx.fillText(line, padding + 15, bubbleY + 25 + i * 22);
            });
        }
    }
    
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    function draw() {
        phaseTimer++;
        
        drawChatInterface();
        
        // User message is already shown, start typing Pecan response after short delay
        if (phaseTimer > 30) { // Wait 0.5 seconds
            if (pecanTextProgress < pecanResponse.length) {
                pecanTextProgress += typingSpeed;
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Animation 3: Moving data cards (university side)
function animate3DCards(ctx, canvas) {
    const dataItems = [
        // Row 1 (left to right)
        ['GPA: 3.9', 'SAT: 1480', 'ACT: 34', 'AP Courses: 8', 'Honor Roll', 'Dean\'s List'],
        // Row 2 (right to left)
        ['Debate Team', 'Robotics Club', 'Volunteer Hours: 200', 'Student Council', 'NHS Member', 'Peer Tutor'],
        // Row 3 (left to right)
        ['Math Competition', 'Science Fair Winner', 'Published Research', 'Coding Projects', 'Hackathon Winner', 'Patent Filed'],
        // Row 4 (right to left)
        ['Leadership Role', 'Community Service', 'Sports Captain', 'Music Performance', 'Drama Club', 'Art Exhibition'],
        // Row 5 (left to right)
        ['Essay Score: 95', 'Recommendations', 'Interview: Strong', 'Portfolio: Outstanding', 'Writing Award', 'Public Speaking'],
        // Row 6 (right to left)
        ['Language: Spanish', 'Language: French', 'Study Abroad', 'Cultural Exchange', 'Language: Mandarin', 'Translation Work'],
        // Row 7 (left to right)
        ['Work Experience', 'Internship', 'Entrepreneurship', 'Awards: 5', 'Startup Founder', 'Business Plan']
    ];
    
    // Color palette with various colors (less bright versions)
    const colors = [
        '#c44d7a',      // Muted pink
        '#b83dd1',      // Muted purple-pink
        '#8b3fc7',      // Muted purple
        '#6d3fb8',      // Muted deep purple
        '#d67035',      // Muted orange
        '#c77d0a',      // Muted yellow-orange
        '#d66f2f',      // Muted light orange
        '#c75a8f',      // Muted light pink
        '#a01fa8',      // Muted magenta
        '#7526b8',      // Muted violet
        '#b84d7a',      // Another muted pink
        '#9d3fc7'       // Another muted purple
    ];
    
    const rows = 7;
    const cardWidth = 140;
    const cardHeight = 50;
    const rowHeight = 65;
    const cardSpacing = 20;
    const scrollSpeed = 0.8;
    
    let scrollOffsets = Array(rows).fill(0);
    
    function draw() {
        // Transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let row = 0; row < rows; row++) {
            const y = 10 + row * rowHeight;
            const isLeftToRight = row % 2 === 0;
            const rowItems = dataItems[row];
            const totalRowWidth = rowItems.length * (cardWidth + cardSpacing);
            
            // Update scroll offset continuously
            if (isLeftToRight) {
                scrollOffsets[row] += scrollSpeed;
                if (scrollOffsets[row] >= totalRowWidth) {
                    scrollOffsets[row] = 0;
                }
            } else {
                scrollOffsets[row] += scrollSpeed;
                if (scrollOffsets[row] >= totalRowWidth) {
                    scrollOffsets[row] = 0;
                }
            }
            
            // Draw cards - render multiple copies for seamless loop
            const numCopies = Math.ceil(canvas.width / totalRowWidth) + 2;
            
            for (let copy = 0; copy < numCopies; copy++) {
                rowItems.forEach((item, i) => {
                    let x;
                    if (isLeftToRight) {
                        x = (copy * totalRowWidth) + i * (cardWidth + cardSpacing) - scrollOffsets[row];
                    } else {
                        x = canvas.width - ((copy * totalRowWidth) + i * (cardWidth + cardSpacing)) + scrollOffsets[row];
                    }
                    
                    // Only draw if visible
                    if (x > -cardWidth - 20 && x < canvas.width + 20) {
                        // Select color based on row and item index for variety
                        const colorIndex = (row * rowItems.length + i) % colors.length;
                        const cardColor = colors[colorIndex];
                        
                        // Card background with selected color
                        ctx.fillStyle = cardColor;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.lineWidth = 2;
                        
                        // Rounded rectangle
                        const radius = 8;
                        ctx.beginPath();
                        ctx.moveTo(x + radius, y);
                        ctx.lineTo(x + cardWidth - radius, y);
                        ctx.quadraticCurveTo(x + cardWidth, y, x + cardWidth, y + radius);
                        ctx.lineTo(x + cardWidth, y + cardHeight - radius);
                        ctx.quadraticCurveTo(x + cardWidth, y + cardHeight, x + cardWidth - radius, y + cardHeight);
                        ctx.lineTo(x + radius, y + cardHeight);
                        ctx.quadraticCurveTo(x, y + cardHeight, x, y + cardHeight - radius);
                        ctx.lineTo(x, y + radius);
                        ctx.quadraticCurveTo(x, y, x + radius, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        // Card text
                        ctx.fillStyle = '#e0e0e0';
                        ctx.font = '13px Inter, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(item, x + cardWidth / 2, y + cardHeight / 2 + 5);
                    }
                });
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Handle window resize
window.addEventListener('resize', function() {
    const canvases = document.querySelectorAll('.code-animation');
    canvases.forEach(canvas => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
    initializeAnimations();
});

// Smooth scrolling
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

// Magnetic text effect for description
let magneticAnimationRunning = false;
let magneticAnimationId = null;

function initMagneticText() {
    const el = document.getElementById('magnetic-description');
    
    if (!el) {
        return;
    }
    
    // Check if already has character spans
    const hasChars = el.querySelector('.char') !== null;
    
    if (!hasChars) {
        // Get the plain text content, ignoring HTML tags
        const text = el.innerText.trim();
        
        // Split into words first, then split each word into characters
        const words = text.split(' ');
        el.innerHTML = words.map((word, index) => {
            const chars = word.split('').map(ch => `<span class="char">${ch}</span>`).join('');
            // Make "Pecan" (first word) bold and orange
            if (index === 0) {
                return `<span class="word" style="color: #ff8c42; font-weight: 700;">${chars}</span>`;
            }
            return `<span class="word">${chars}</span>`;
        }).join(' ');
    }
    
    // Cancel any existing animation
    if (magneticAnimationId) {
        cancelAnimationFrame(magneticAnimationId);
        magneticAnimationId = null;
    }
    
    // Wait a bit for layout
    setTimeout(() => {
        const chars = [...el.querySelectorAll('.char')];
        
        if (chars.length === 0) {
            return;
        }
        
        const target = chars.map(() => ({ x: 0, y: 0 }));
        const current = chars.map(() => ({ x: 0, y: 0 }));
        
        // Cache the resting position of each character
        let origins = [];
        
        function cacheOrigins() {
            chars.forEach(c => c.style.transform = 'none');
            origins = chars.map(c => {
                const r = c.getBoundingClientRect();
                return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
            });
        }
        
        cacheOrigins();
        
        // Remove old resize listener and add new one
        window.removeEventListener('resize', cacheOrigins);
        window.addEventListener('resize', cacheOrigins);
        
        let mouseX = -9999, mouseY = -9999;
        
        const mouseMoveHandler = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        
        // Remove old listener and add new one
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mousemove', mouseMoveHandler);
        
        const INFLUENCE = 150;
        const STRENGTH = 60;
        const LERP = 0.08;
        
        magneticAnimationRunning = true;
        
        function tick() {
            if (!magneticAnimationRunning) return;
            
            if (origins.length === 0) {
                magneticAnimationId = requestAnimationFrame(tick);
                return;
            }
            
            chars.forEach((char, i) => {
                if (!origins[i]) return;
                
                const dx = origins[i].cx - mouseX;
                const dy = origins[i].cy - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < INFLUENCE) {
                    const force = (1 - dist / INFLUENCE) * STRENGTH;
                    target[i].x = (dx / dist) * force;
                    target[i].y = (dy / dist) * force;
                } else {
                    target[i].x = 0;
                    target[i].y = 0;
                }
            });
            
            current.forEach((cur, i) => {
                cur.x += (target[i].x - cur.x) * LERP;
                cur.y += (target[i].y - cur.y) * LERP;
                
                // Calculate opacity based on movement distance
                const moveDistance = Math.sqrt(cur.x * cur.x + cur.y * cur.y);
                const maxDistance = STRENGTH;
                const opacity = 1 - (moveDistance / maxDistance) * 0.4; // Fade to 60% opacity at max distance
                
                chars[i].style.transform = 
                    `translate(${current[i].x.toFixed(2)}px, ${current[i].y.toFixed(2)}px)`;
                chars[i].style.opacity = opacity.toFixed(2);
            });
            
            magneticAnimationId = requestAnimationFrame(tick);
        }
        
        tick();
    }, 150);
}

// Run on load
window.addEventListener('load', () => {
    initMagneticText();
});

// Run on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
    initMagneticText();
});

// Run on pageshow for back navigation - this is key for bfcache
window.addEventListener('pageshow', (event) => {
    // Always reinitialize on pageshow
    setTimeout(initMagneticText, 50);
});
