       // Tab Switching
        const loginTab = document.querySelector('[data-tab="login"]');
        const signupTab = document.querySelector('[data-tab="signup"]');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
        
        // Switch links
        document.getElementById('switch-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            signupTab.click();
        });
        
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            loginTab.click();
        });
        
        // Form Submissions
        const loginFormEl = document.getElementById('loginForm');
        const signupFormEl = document.getElementById('signupForm');
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const loginLoading = document.getElementById('login-loading');
        const signupLoading = document.getElementById('signup-loading');
        
        loginFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Show loading
            loginBtn.querySelector('span').style.opacity = '0.5';
            loginLoading.style.display = 'block';
            loginBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In production, you would call your authentication API here
            console.log('Login attempt:', { email, password });
            
            // For demo purposes - simulate successful login
            const isDemoLogin = email.includes('@') && password.length >= 6;
            
            if (isDemoLogin) {
                // Store auth state
                localStorage.setItem('kimini_auth', 'true');
                localStorage.setItem('kimini_user', email);
                // Redirect to chat interface
                window.location.href = 'kiminloader.html';
            } else {
                alert('Please enter a valid email and password (min 6 characters for demo)');
            }
            
            // Reset button
            loginBtn.querySelector('span').style.opacity = '1';
            loginLoading.style.display = 'none';
            loginBtn.disabled = false;
        });
        
        signupFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Show loading
            signupBtn.querySelector('span').style.opacity = '0.5';
            signupLoading.style.display = 'block';
            signupBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In production, you would call your registration API here
            console.log('Signup attempt:', { name, email, password });
            
            // For demo purposes
            if (email.includes('@') && password.length >= 6) {
                alert('Registration successful! Please login.');
                // Switch to login tab
                loginTab.click();
                // Fill email field
                document.getElementById('login-email').value = email;
            } else {
                alert('Please enter valid information');
            }
            
            // Reset button
            signupBtn.querySelector('span').style.opacity = '1';
            signupLoading.style.display = 'none';
            signupBtn.disabled = false;
        });
        
        // Check if already logged in
        if (localStorage.getItem('kimini_auth') === 'true') {
            window.location.href = 'kiminai.html';
        }