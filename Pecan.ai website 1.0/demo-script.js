// Global state
let currentStep = 1;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// DOM elements
const demoForm = document.getElementById('demoForm');
const successModal = document.getElementById('successModal');

// Step elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

// Progress elements
const progressSteps = document.querySelectorAll('.progress-step');

// Calendar elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthDisplay = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Button elements
const dateNextBtn = document.getElementById('dateNextBtn');
const timeNextBtn = document.getElementById('timeNextBtn');

// Display elements
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const bookingSummary = document.getElementById('bookingSummary');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
    updateProgressIndicator(); // Ensure initial state is correct
});

// Setup event listeners
function setupEventListeners() {
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    nextMonthBtn.addEventListener('click', () => navigateMonth(1));
    
    // Step navigation
    dateNextBtn.addEventListener('click', () => goToStep(2));
    timeNextBtn.addEventListener('click', () => goToStep(3));
    
    // Progress indicator navigation
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const targetStep = parseInt(this.dataset.step);
            if (canNavigateToStep(targetStep)) {
                goToStep(targetStep);
            } else {
                // Provide visual feedback when navigation is not allowed
                showNavigationError(targetStep);
            }
        });
    });
    
    // Time slot selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            if (!this.classList.contains('unavailable')) {
                selectTimeSlot(this);
            }
        });
    });
    
    // Form submission
    demoForm.addEventListener('submit', handleFormSubmission);
    
    // Input validation
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Calendar functions
function initializeCalendar() {
    updateCalendarDisplay();
    generateCalendar();
}

function updateCalendarDisplay() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendarDisplay();
    generateCalendar();
}

function generateCalendar() {
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(currentYear, currentMonth, day);
        
        // Disable past dates
        if (dayDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
        }
        
        // Mark selected date
        if (selectedDate && 
            dayDate.getDate() === selectedDate.getDate() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getFullYear() === selectedDate.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    selectedDate = date;
    dateNextBtn.disabled = false;
    
    // Update progress indicator to show step 2 is now accessible
    updateProgressIndicator();
    
    // Update time slots availability (simulate some unavailable slots)
    updateTimeSlotAvailability();
}

function updateTimeSlotAvailability() {
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.classList.remove('unavailable');
        // Randomly make some slots unavailable (simulate real booking system)
        if (Math.random() < 0.3) {
            slot.classList.add('unavailable');
        }
    });
}

function selectTimeSlot(element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    selectedTime = element.dataset.time;
    timeNextBtn.disabled = false;
    
    // Update progress indicator to show step 3 is now accessible
    updateProgressIndicator();
}

// Step navigation
function canNavigateToStep(stepNumber) {
    // Can always go to step 1
    if (stepNumber === 1) return true;
    
    // Can go to step 2 only if date is selected
    if (stepNumber === 2) return selectedDate !== null;
    
    // Can go to step 3 only if both date and time are selected
    if (stepNumber === 3) return selectedDate !== null && selectedTime !== null;
    
    return false;
}

function showNavigationError(targetStep) {
    let message = '';
    
    if (targetStep === 2 && !selectedDate) {
        message = 'Please select a date first';
    } else if (targetStep === 3 && !selectedDate) {
        message = 'Please select a date and time first';
    } else if (targetStep === 3 && !selectedTime) {
        message = 'Please select a time first';
    }
    
    if (message) {
        showTemporaryMessage(message);
    }
}

function showTemporaryMessage(message) {
    // Remove any existing temporary message
    const existingMessage = document.querySelector('.temp-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'temp-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(231, 76, 60, 0.95);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        animation: fadeInOut 2.5s ease-in-out forwards;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after animation
    setTimeout(() => {
        messageDiv.remove();
        style.remove();
    }, 2500);
}

function goToStep(stepNumber) {
    // Hide all steps
    [step1, step2, step3].forEach(step => step.style.display = 'none');
    
    // Show target step
    switch(stepNumber) {
        case 1:
            step1.style.display = 'block';
            break;
        case 2:
            step2.style.display = 'block';
            updateStep2Display();
            break;
        case 3:
            step3.style.display = 'block';
            updateStep3Display();
            break;
    }
    
    currentStep = stepNumber;
    updateProgressIndicator();
}

function updateStep2Display() {
    if (selectedDate) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        selectedDateDisplay.textContent = `Selected Date: ${selectedDate.toLocaleDateString('en-US', options)}`;
    }
}

function updateStep3Display() {
    if (selectedDate && selectedTime) {
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // Convert 24-hour time to 12-hour format
        const timeFormatted = formatTime(selectedTime);
        
        bookingSummary.innerHTML = `
            <h3>Your Booking Details</h3>
            <p><strong>Date:</strong> ${selectedDate.toLocaleDateString('en-US', dateOptions)}</p>
            <p><strong>Time:</strong> ${timeFormatted}</p>
            <p><strong>Duration:</strong> 30 minutes</p>
        `;
    }
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

function updateProgressIndicator() {
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
        
        // Add visual feedback for clickable steps
        if (canNavigateToStep(stepNumber)) {
            step.style.cursor = 'pointer';
            step.style.opacity = stepNumber === currentStep ? '1' : '0.8';
            step.classList.remove('disabled');
        } else {
            step.style.cursor = 'not-allowed';
            step.style.opacity = '0.4';
            step.classList.add('disabled');
        }
    });
}

// Form handling
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Collect form data
    const formData = new FormData(demoForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add booking details
    data.selectedDate = selectedDate.toISOString();
    data.selectedTime = selectedTime;
    
    try {
        // Simulate API call
        await simulateBookingSubmission(data);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form and go back to step 1
        resetBookingProcess();
        
    } catch (error) {
        console.error('Booking submission failed:', error);
        showErrorMessage('Something went wrong. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

function resetBookingProcess() {
    // Reset form
    demoForm.reset();
    
    // Reset selections
    selectedDate = null;
    selectedTime = null;
    
    // Reset buttons
    dateNextBtn.disabled = true;
    timeNextBtn.disabled = true;
    
    // Clear selections
    document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Go back to step 1
    setTimeout(() => {
        goToStep(1);
    }, 2000);
}

// Simulate booking submission (replace with actual API call)
function simulateBookingSubmission(data) {
    return new Promise((resolve, reject) => {
        console.log('Booking data:', data);
        
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve({ success: true, bookingId: 'BOOK-' + Date.now() });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Validation functions
function validateForm() {
    let isValid = true;
    const requiredFields = demoForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError({ target: field });
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showErrorMessage(message) {
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: #fee;
            color: #e74c3c;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #fcc;
        `;
        demoForm.insertBefore(errorDiv, demoForm.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setLoadingState(loading) {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const inputs = demoForm.querySelectorAll('input, select, textarea, button');
    
    if (loading) {
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        inputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        inputs.forEach(input => input.disabled = false);
    }
}

// Modal functions
function showSuccessModal() {
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const modalContent = successModal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.3s ease';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modalContent = successModal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        successModal.style.display = 'none';
        document.body.style.overflow = '';
        modalContent.style.transition = '';
    }, 300);
}

// Event listeners for modal
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.style.display === 'flex') {
        closeModal();
    }
});

// Auto-resize textarea
document.getElementById('extraThoughts').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});