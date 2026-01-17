// DOM elements
const signinForm = document.getElementById('signinForm');
const submitBtn = document.querySelector('.submit-btn');
const successModal = document.getElementById('successModal');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    signinForm.addEventListener('submit', handleFormSubmission);

    // Input validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Collect form data
    const formData = new FormData(signinForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Simulate API call
        await simulateSigninSubmission(data);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        signinForm.reset();
        
    } catch (error) {
        console.error('Sign in submission failed:', error);
        showErrorMessage('Invalid email or password. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

// Simulate signin submission (replace with actual API call)
function simulateSigninSubmission(data) {
    return new Promise((resolve, reject) => {
        // Log the data (in real implementation, send to server)
        console.log('Sign in data:', data);
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% success rate)
            if (Math.random() > 0.1) {
                resolve({ success: true, userId: 'USER-' + Date.now() });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1500);
    });
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const requiredFields = signinForm.querySelectorAll('[required]');
    
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

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Clear previous errors
    clearFieldError({ target: field });
    
    // Required field validation
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError({ target: field });
    
    // Add error styling
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    // Insert error message
    if (field.parentNode.classList.contains('checkbox-option')) {
        field.parentNode.parentNode.appendChild(errorDiv);
    } else {
        field.parentNode.appendChild(errorDiv);
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error') || 
                    field.parentNode.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Show general error message
function showErrorMessage(message) {
    // Create or update error message div
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
        signinForm.insertBefore(errorDiv, signinForm.firstChild);
    }
    
    errorDiv.textContent = message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Set loading state
function setLoadingState(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const inputs = signinForm.querySelectorAll('input, select, button');
    
    if (loading) {
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        // Disable all form elements
        inputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Re-enable all form elements
        inputs.forEach(input => input.disabled = false);
    }
}

// Show success modal
function showSuccessModal() {
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    const modalContent = successModal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8) translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.3s ease';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
}

// Close modal
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

// Close modal when clicking outside
successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.style.display === 'flex') {
        closeModal();
    }
});