const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');
const feedback = document.getElementById('feedback');
const strengthLabel = document.getElementById('strength-label');
const crackTime = document.getElementById('crack-time');

// Analyze password strength using zxcvbn
function analyzePassword(password) {
    return zxcvbn(password);
}

// Update UI based on analysis result
function updateStrengthUI(result) {
    const score = result.score;
    const scorePercent = (score + 1) * 20;
    strengthBar.style.width = `${scorePercent}%`;

    const colors = ['red', 'orange', 'yellowgreen', 'green', 'darkgreen'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Excellent'];

    strengthBar.style.background = colors[score];
    strengthLabel.textContent = labels[score];
    strengthLabel.style.color = colors[score];

    crackTime.textContent = `Estimated crack time: ${result.crack_times_display.offline_slow_hashing_1e4_per_second}`;

    const superCommonPasswords = [
        '123456', 'password', '123456789', '12345678', '12345', 'qwerty', 
        'abc123', '111111', '123123', 'password1'
    ];
    // Check if password is extremely common
    if (superCommonPasswords.includes(passwordInput.value.trim())) {
        feedback.textContent = 'This is one of the most common passwords and can be cracked instantly! Please choose something much stronger or use a password manager.';
        return;
    }

    if (result.feedback.suggestions.length > 0) {
        feedback.textContent = result.feedback.suggestions.join(' ') + ' Consider using a password manager to help create and store strong passwords.';
    } else if (result.feedback.warning) {
        feedback.textContent = result.feedback.warning + ' Using a password manager can improve security without burdening your memory.';
    } else {
        feedback.textContent = 'Strong password! Remember, using a password manager ensures every account has a unique strong password.';
    }
}

function handlePasswordInput() {
    const password = passwordInput.value;
    
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        feedback.textContent = '';
        strengthLabel.textContent = '';
        crackTime.textContent = '';
        return;
    }

    const result = analyzePassword(password);
    updateStrengthUI(result);
}

passwordInput.addEventListener('input', handlePasswordInput);