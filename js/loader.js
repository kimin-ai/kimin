        // Function to check authentication and redirect
        function checkAndRedirect() {
            // Check if user is authenticated
            const isAuthenticated = localStorage.getItem('kimini_auth') === 'true';
            
            if (isAuthenticated) {
                // If authenticated, go directly to chat
                window.location.href = 'kiminai.html';
            } else {
                // If not authenticated, go to login page
                window.location.href = 'login.html';
            }
        }

        // Status message cycling
        let currentStatus = 1;
        const statusElements = [
            document.getElementById('status1'),
            document.getElementById('status2'),
            document.getElementById('status3')
        ];

        function cycleStatus() {
            // Hide all statuses
            statusElements.forEach(status => status.classList.remove('active'));
            
            // Show current status
            statusElements[currentStatus - 1].classList.add('active');
            
            // Move to next status
            currentStatus = currentStatus % 3 + 1;
        }

        // Start status cycling every second
        setInterval(cycleStatus, 1000);

        // Countdown timer
        let seconds = 3;
        const countdownElement = document.getElementById('countdown');
        
        const countdownInterval = setInterval(() => {
            seconds--;
            countdownElement.textContent = `Inakufungulia baada ya ${seconds}s`;
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = '✓ Tayari kuingia!';
                
                // Add a small delay for smooth transition
                setTimeout(checkAndRedirect, 500);
            }
        }, 1000);

        // Also redirect if user clicks anywhere
        document.addEventListener('click', function() {
            clearInterval(countdownInterval);
            checkAndRedirect();
        });

        // Also redirect if user presses any key
        document.addEventListener('keydown', function() {
            clearInterval(countdownInterval);
            checkAndRedirect();
        });