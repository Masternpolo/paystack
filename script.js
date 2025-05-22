      const form = document.getElementById('paymentForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const amount = document.getElementById('amount').value * 100; // Convert to kobo

            const query = `email=${email}&amount=${amount}`;
            const response = await fetch(`http://localhost:3300/paystack?${query}`);
            const data = await response.json();

            if (data.status) {
                window.location.href = data.data.authorization_url;
            } else {
                alert('Failed to initialize payment');
            }
        });