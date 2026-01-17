// Global state
let currentUserType = 'student';

// DOM elements
const userToggle = document.getElementById('userToggle');
const studentLabel = document.getElementById('studentLabel');
const universityLabel = document.getElementById('universityLabel');
const universityContent = document.getElementById('universityContent');
const studentContent = document.getElementById('studentContent');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeToggle();
    initializeAnimations();
    initializeScrollAnimations();
    updateContent();
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

// Toggle functionality
function initializeToggle() {
    userToggle.addEventListener('click', toggleUserType);
    studentLabel.addEventListener('click', () => switchToUserType('student'));
    universityLabel.addEventListener('click', () => switchToUserType('university'));
}

function toggleUserType() {
    currentUserType = currentUserType === 'student' ? 'university' : 'student';
    updateContent();
}

function switchToUserType(type) {
    if (currentUserType !== type) {
        currentUserType = type;
        updateContent();
    }
}

function updateContent() {
    console.log('Switching to:', currentUserType);
    
    // Update toggle state
    if (currentUserType === 'university') {
        userToggle.classList.add('university-mode');
        universityLabel.classList.add('active');
        studentLabel.classList.remove('active');
        
        // Show university content
        universityContent.style.display = 'block';
        studentContent.style.display = 'none';
    } else {
        userToggle.classList.remove('university-mode');
        studentLabel.classList.add('active');
        universityLabel.classList.remove('active');
        
        // Show student content
        studentContent.style.display = 'block';
        universityContent.style.display = 'none';
    }
    
    // Reset scroll animations when switching
    document.querySelectorAll('.fade-in-on-scroll').forEach(element => {
        element.classList.remove('visible');
    });
    
    // Re-initialize animations after content is visible
    setTimeout(() => {
        console.log('Re-initializing animations...');
        initializeScrollAnimations();
        initializeAnimations();
    }, 100);
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
            case '4':
                console.log('Starting animation 4');
                animateDocumentView(ctx, canvas);
                break;
            case '5':
                console.log('Starting animation 5');
                animateLayeredDocs(ctx, canvas);
                break;
            case '6':
                console.log('Starting animation 6');
                animateTerminalView(ctx, canvas);
                break;
            default:
                console.log('Unknown animation type:', animationType);
        }
    });
}

// Animation 1: Dashboard with evaluation criteria (university side)
function animateChimation(ctx, canvas) {
    let animationProgress = 0;
    
    function draw() {
        // Dark background
        ctx.fillStyle = '#1a1d2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Top metric cards
        const cardWidth = 160;
        const cardHeight = 80;
        const cardY = 30;
        const cardSpacing = 20;
        const startX = 40;
        
        // Card 1 - Total Applicants
        drawMetricCard(ctx, startX, cardY, cardWidth, cardHeight, 
            'Total Applicants', '1,247', '#a855f7', '#9333ea');
        
        // Card 2 - Avg Score
        drawMetricCard(ctx, startX + cardWidth + cardSpacing, cardY, cardWidth, cardHeight, 
            'Avg Score', '82.5', '#06b6d4', '#0891b2');
        
        // Card 3 - Acceptance Rate
        drawMetricCard(ctx, startX + (cardWidth + cardSpacing) * 2, cardY, cardWidth, cardHeight, 
            'Acceptance Rate', '18%', '#ec4899', '#db2777');
        
        // Donut chart - Application Status
        const donutX = 140;
        const donutY = 280;
        const donutRadius = 70;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Application Status', 40, 180);
        
        drawDonutChart(ctx, donutX, donutY, donutRadius, [
            { label: 'Accepted', value: 18, color: '#06b6d4' },
            { label: 'Pending', value: 45, color: '#a855f7' },
            { label: 'Rejected', value: 22, color: '#ec4899' },
            { label: 'Waitlist', value: 15, color: '#f59e0b' }
        ], animationProgress);
        
        // Legend for donut chart (animated)
        if (animationProgress > 0.3) {
            const legendX = 240;
            const legendY = 220;
            const legendItems = [
                { label: 'Accepted', color: '#06b6d4' },
                { label: 'Pending', color: '#a855f7' },
                { label: 'Rejected', color: '#ec4899' },
                { label: 'Waitlist', color: '#f59e0b' }
            ];
            
            const legendOpacity = Math.min(1, (animationProgress - 0.3) / 0.3);
            
            legendItems.forEach((item, i) => {
                const y = legendY + (i * 25);
                
                // Color dot
                ctx.fillStyle = item.color;
                ctx.globalAlpha = legendOpacity;
                ctx.beginPath();
                ctx.arc(legendX, y, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Label
                ctx.fillStyle = '#e0e0e0';
                ctx.font = '12px Inter, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(item.label, legendX + 15, y + 4);
                ctx.globalAlpha = 1;
            });
        }
        
        // Bar chart - No title
        const barData = [
            { value: 85, color: '#06b6d4' },
            { value: 72, color: '#a855f7' },
            { value: 78, color: '#ec4899' },
            { value: 68, color: '#f59e0b' }
        ];
        
        const barStartX = 380;
        const barStartY = 210;
        const barWidth = 35;
        const barSpacingX = 50;
        const maxBarHeight = 150;
        
        barData.forEach((bar, i) => {
            const x = barStartX + (i * barSpacingX);
            const barHeight = (bar.value / 100) * maxBarHeight * Math.min(1, animationProgress);
            const y = barStartY + maxBarHeight - barHeight;
            
            // Bar gradient
            const gradient = ctx.createLinearGradient(x, y, x, barStartY + maxBarHeight);
            gradient.addColorStop(0, bar.color);
            gradient.addColorStop(1, bar.color + '66');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Value on top
            if (animationProgress > 0.5) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 14px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(bar.value, x + barWidth / 2, y - 8);
            }
        });
        
        // Animate progress
        if (animationProgress < 1) {
            animationProgress += 0.015;
        } else {
            setTimeout(() => {
                animationProgress = 0;
            }, 2000);
        }
        
        requestAnimationFrame(draw);
    }
    
    function drawMetricCard(ctx, x, y, width, height, label, value, color1, color2) {
        // Card background with gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 12);
        ctx.fill();
        
        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 15, y + 25);
        
        // Value
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillText(value, x + 15, y + 58);
    }
    
    function drawDonutChart(ctx, centerX, centerY, radius, data, progress) {
        const innerRadius = radius * 0.6;
        let currentAngle = -Math.PI / 2;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * Math.PI * 2 * Math.min(1, progress);
            
            // Draw slice
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            
            ctx.fillStyle = item.color;
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
        
        // Center circle
        ctx.fillStyle = '#1a1d2e';
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Center text
        if (progress > 0.5) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('1,247', centerX, centerY + 7);
        }
    }
    
    draw();
}

// Animation 2: 3D Orbs converging to one big sphere (university side)
function animateSlashes(ctx, canvas) {
    const orbs = [];
    const labels = [
        'Data Analysis',
        'Dashboard Integration',
        'Smart Matching',
        'AI-Ready Assessments'
    ];
    
    let animationPhase = 0; // 0: orbiting, 1: converging, 2: merged (final state)
    let phaseProgress = 0;
    let phaseTimer = 0;
    
    // Create orbs
    for (let i = 0; i < 4; i++) {
        orbs.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 40 + Math.random() * 20,
            angle: (Math.PI * 2 / 4) * i,
            distance: 120,
            initialDistance: 120,
            color: `hsl(${240 + i * 30}, 80%, 60%)`,
            label: labels[i],
            rotation: 0,
            targetX: canvas.width / 2,
            targetY: canvas.height / 2,
            initialRadius: 40 + Math.random() * 20
        });
    }
    
    function draw() {
        // Dark background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        phaseTimer++;
        
        // Phase management
        if (animationPhase === 0 && phaseTimer > 180) { // Orbit for 3 seconds
            animationPhase = 1;
            phaseProgress = 0;
            phaseTimer = 0;
        } else if (animationPhase === 1 && phaseProgress >= 1) { // Converging complete
            animationPhase = 2;
            phaseProgress = 0;
            phaseTimer = 0;
        }
        // Animation stops at merged state - no more phase transitions
        
        if (animationPhase === 1) { // Converging
            phaseProgress += 0.02;
            phaseProgress = Math.min(1, phaseProgress);
        }
        
        orbs.forEach((orb, i) => {
            let x, y, radius;
            
            if (animationPhase === 0) { // Orbiting phase
                orb.angle += 0.015;
                x = canvas.width / 2 + Math.cos(orb.angle) * orb.distance;
                y = canvas.height / 2 + Math.sin(orb.angle) * orb.distance;
                radius = orb.radius;
            } else if (animationPhase === 1) { // Converging phase
                const startX = canvas.width / 2 + Math.cos(orb.angle) * orb.distance;
                const startY = canvas.height / 2 + Math.sin(orb.angle) * orb.distance;
                
                // Smooth easing function for convergence
                const easeProgress = 1 - Math.pow(1 - phaseProgress, 3);
                
                x = startX + (orb.targetX - startX) * easeProgress;
                y = startY + (orb.targetY - startY) * easeProgress;
                radius = orb.radius * (1 - easeProgress * 0.7); // Shrink as they converge
            } else if (animationPhase === 2) { // Merged phase - single big sphere (final state)
                x = canvas.width / 2;
                y = canvas.height / 2;
                
                // Only draw one large sphere (use first orb)
                if (i === 0) {
                    radius = 100 + Math.sin(phaseTimer * 0.1) * 10; // Pulsing effect
                    
                    // Create a multi-colored gradient for the merged sphere
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                    gradient.addColorStop(0, '#ffffff');
                    gradient.addColorStop(0.3, 'hsl(240, 80%, 70%)');
                    gradient.addColorStop(0.6, 'hsl(270, 80%, 60%)');
                    gradient.addColorStop(0.8, 'hsl(300, 80%, 50%)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add sparkle effect
                    for (let j = 0; j < 8; j++) {
                        const sparkleAngle = (phaseTimer * 0.05) + (j * Math.PI / 4);
                        const sparkleDistance = radius * 0.7;
                        const sparkleX = x + Math.cos(sparkleAngle) * sparkleDistance;
                        const sparkleY = y + Math.sin(sparkleAngle) * sparkleDistance;
                        
                        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(phaseTimer * 0.1 + j) * 0.3})`;
                        ctx.beginPath();
                        ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                return; // Skip drawing individual orbs
            }
            
            // Draw individual orb (except in merged phase)
            if (animationPhase !== 2) {
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, orb.color);
                gradient.addColorStop(0.7, orb.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Add subtle glow effect
                ctx.shadowColor = orb.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
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
        ['Essay Score: 95', 'Recommendation: Excellent', 'Interview: Strong', 'Portfolio: Outstanding', 'Writing Award', 'Public Speaking'],
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
        // Dark background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
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

// Animation 4: Chat Interface (AI and Student interaction)
function animateDocumentView(ctx, canvas) {
    const messages = [
        {
            sender: 'ai',
            text: 'Just tell me what you have been thinking about and I will try to help',
            visible: true
        },
        {
            sender: 'student',
            text: 'I want to study computer science but I\'m not sure which universities would be the best fit for me...',
            visible: false,
            charIndex: 0
        }
    ];
    
    let studentTyping = false;
    let typingStartTime = 0;
    const typingDelay = 2000; // Wait 2 seconds before student starts typing
    let waveTime = 0;
    
    function draw() {
        // Dark background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let yPosition = 120;
        
        // Draw AI message
        const aiMsg = messages[0];
        
        // AI label
        ctx.fillStyle = '#ff8c42';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Pecan AI:', 40, yPosition);
        
        yPosition += 40;
        
        // AI message text
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px Inter, sans-serif';
        ctx.textAlign = 'left';
        
        const aiWords = aiMsg.text.split(' ');
        let aiLine = '';
        let aiLineY = yPosition;
        const maxWidth = canvas.width - 80;
        
        aiWords.forEach((word, i) => {
            const testLine = aiLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(aiLine, 40, aiLineY);
                aiLine = word + ' ';
                aiLineY += 35;
            } else {
                aiLine = testLine;
            }
        });
        ctx.fillText(aiLine, 40, aiLineY);
        
        yPosition = aiLineY + 80;
        
        // Start typing after delay
        if (!studentTyping && Date.now() - typingStartTime > typingDelay) {
            studentTyping = true;
            messages[1].visible = true;
        }
        
        // Draw student message (typing effect)
        if (messages[1].visible) {
            const studentMsg = messages[1];
            
            // Student label with Siri-like animation
            ctx.fillStyle = '#d946ef';
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('You:', canvas.width - 40, yPosition);
            
            // Siri-like waveform animation next to "You:" - only animate while typing
            const waveX = canvas.width - 100;
            const waveY = yPosition - 6;
            const numBars = 8;
            const barWidth = 3;
            const barSpacing = 5;
            const maxBarHeight = 20;
            const isTyping = studentMsg.charIndex < studentMsg.text.length;
            
            for (let i = 0; i < numBars; i++) {
                let barHeight;
                if (isTyping) {
                    // Animated bars while typing
                    barHeight = Math.abs(Math.sin(waveTime + i * 0.5)) * maxBarHeight * 0.5 + maxBarHeight * 0.3;
                } else {
                    // Static minimal bars when done typing
                    barHeight = maxBarHeight * 0.2;
                }
                
                const x = waveX - (numBars * (barWidth + barSpacing)) + i * (barWidth + barSpacing);
                const y = waveY - barHeight / 2;
                
                // Gradient for bars
                const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
                gradient.addColorStop(0, '#d946ef');
                gradient.addColorStop(0.5, '#a855f7');
                gradient.addColorStop(1, '#d946ef');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
                ctx.fill();
            }
            
            yPosition += 40;
            
            // Student message text (typing effect)
            ctx.fillStyle = '#ffffff';
            ctx.font = '22px Inter, sans-serif';
            ctx.textAlign = 'right';
            
            const displayText = studentMsg.text.substring(0, studentMsg.charIndex);
            const words = displayText.split(' ');
            let line = '';
            let lineY = yPosition;
            const maxWidth = canvas.width - 80;
            const lines = [];
            
            // Build lines array
            words.forEach((word, i) => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && i > 0) {
                    lines.push(line);
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });
            if (line) lines.push(line);
            
            // Draw lines right-aligned
            lines.forEach((textLine, i) => {
                ctx.fillText(textLine, canvas.width - 40, lineY);
                lineY += 35;
            });
            
            // Typing cursor
            if (studentMsg.charIndex < studentMsg.text.length && Math.floor(Date.now() / 500) % 2 === 0) {
                const lastLine = lines[lines.length - 1] || '';
                const cursorX = canvas.width - 40 - ctx.measureText(lastLine).width;
                ctx.fillText('|', cursorX + ctx.measureText(lastLine).width, lineY - 35);
            }
            
            // Typing animation
            if (Math.random() > 0.85 && studentMsg.charIndex < studentMsg.text.length) {
                studentMsg.charIndex++;
            }
            
            // Reset after completion
            if (studentMsg.charIndex >= studentMsg.text.length) {
                setTimeout(() => {
                    studentMsg.charIndex = 0;
                    studentMsg.visible = false;
                    studentTyping = false;
                    typingStartTime = Date.now();
                }, 3000);
            }
        } else {
            typingStartTime = Date.now();
        }
        
        // Update wave animation only while typing
        if (messages[1].visible && messages[1].charIndex < messages[1].text.length) {
            waveTime += 0.15;
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Animation 5: Scanning animation with dots (for student side)
function animateLayeredDocs(ctx, canvas) {
    const numDots = 8;
    const dotSize = 15;
    const spacing = 50;
    const centerY = canvas.height / 2;
    const startX = (canvas.width - (numDots * spacing)) / 2;
    
    let time = 0;
    
    function draw() {
        // Dark background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // "Scanning the web" text at top
        ctx.fillStyle = '#ffffff';
        ctx.font = '28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scanning the web', canvas.width / 2, centerY - 80);
        
        // Draw dots in a straight horizontal line
        for (let i = 0; i < numDots; i++) {
            const x = startX + i * spacing;
            const y = centerY;
            
            // Calculate wave effect for size and opacity
            const wave = Math.sin(time + i * 0.5);
            const size = dotSize * (0.6 + wave * 0.4);
            const opacity = 0.4 + wave * 0.6;
            
            // Color gradient from white to pink
            const colorIntensity = i / numDots;
            const r = 255;
            const g = Math.floor(255 * (1 - colorIntensity * 0.5));
            const b = Math.floor(255 * (1 - colorIntensity * 0.3));
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Subtitle text at bottom
        ctx.fillStyle = '#888888';
        ctx.font = '18px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Finding the best matches for you', canvas.width / 2, centerY + 80);
        
        time += 0.08;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Animation 6: Scrolling attributes list (for student side)
function animateTerminalView(ctx, canvas) {
    const attributes = [
        'Enjoys building computer games',
        'Volunteers at the local dog shelter',
        'Captain of the debate team',
        'Passionate about environmental science',
        'Plays violin in the school orchestra',
        'Tutors younger students in math',
        'Founded a coding club at school',
        'Writes poetry in spare time',
        'Active member of robotics team',
        'Organizes community food drives',
        'Speaks three languages fluently',
        'Loves solving complex puzzles'
    ];
    
    let scrollOffset = 0;
    const lineHeight = 60;
    const startY = 100;
    
    function draw() {
        // Dark background
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create clipping region for scrolling area
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.clip();
        
        // Draw attributes twice for seamless loop
        for (let loop = 0; loop < 2; loop++) {
            attributes.forEach((attr, i) => {
                const y = startY + (i * lineHeight) + (loop * attributes.length * lineHeight) - scrollOffset;
                
                // Only draw if visible
                if (y > -30 && y < canvas.height + 30) {
                    // Calculate opacity based on position (fade at edges)
                    let opacity = 1;
                    if (y < 100) {
                        opacity = y / 100;
                    } else if (y > canvas.height - 100) {
                        opacity = (canvas.height - y) / 100;
                    }
                    opacity = Math.max(0, Math.min(1, opacity));
                    
                    // Bullet point
                    ctx.fillStyle = `rgba(212, 70, 239, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(60, y, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Attribute text
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.font = '20px Inter, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText(attr, 90, y + 7);
                }
            });
        }
        
        ctx.restore();
        
        // Scroll animation
        scrollOffset += 0.5;
        
        // Reset when first set has scrolled completely
        if (scrollOffset >= attributes.length * lineHeight) {
            scrollOffset = 0;
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

// Matrix-style code rain (alternative animation)
function animateCodeRain(ctx, canvas) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height / fontSize;
    }
    
    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff8c42';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            // Reset drop randomly
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
}

// Typing effect animation
function animateTyping(ctx, canvas) {
    const lines = [
        'const pecan = new AI();',
        'pecan.analyze(student);',
        'pecan.recommend();',
        '// Finding best match...'
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    let y = 30;
    
    function draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff8c42';
        ctx.font = '14px "Courier New", monospace';
        
        // Draw completed lines
        for (let i = 0; i < currentLine; i++) {
            ctx.fillText(lines[i], 10, 30 + (i * 25));
        }
        
        // Draw current line being typed
        if (currentLine < lines.length) {
            const currentText = lines[currentLine].substring(0, currentChar);
            ctx.fillText(currentText, 10, 30 + (currentLine * 25));
            
            // Add cursor
            const cursorX = ctx.measureText(currentText).width + 10;
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillText('_', cursorX, 30 + (currentLine * 25));
            }
        }
        
        // Progress typing
        if (Math.random() > 0.7 && currentChar < lines[currentLine].length) {
            currentChar++;
        }
        
        // Move to next line
        if (currentChar >= lines[currentLine].length && Math.random() > 0.98) {
            currentLine++;
            currentChar = 0;
            
            // Reset after all lines
            if (currentLine >= lines.length) {
                setTimeout(() => {
                    currentLine = 0;
                    currentChar = 0;
                }, 2000);
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