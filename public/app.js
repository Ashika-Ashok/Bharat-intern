document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm'); 
    registrationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
  
        if (response.ok) {
          alert('Registration successful!');
        } else {
          const errorMessage = await response.text();
          alert(`Registration failed: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    });
  });