// --- Correspondence Form Relay Module ---
export function initContactForm() {
    const form = document.getElementById('discord-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const deviceData = {
            ua: navigator.userAgent,
            res: `${window.screen.width}x${window.screen.height}`,
            lang: navigator.language
        };

        const nameVal = document.getElementById('sender-name')?.value || '';
        const emailVal = document.getElementById('sender-email')?.value || '';
        const messageVal = document.getElementById('message')?.value || '';

        const payload = {
            name: nameVal,
            sender: nameVal, // Compatible with api/contact.js
            email: emailVal,
            message: messageVal,
            deviceData: deviceData
        };

        const submitBtn = document.getElementById('submit-btn');
        const statusDiv = document.getElementById('form-status');

        if (submitBtn) {
            submitBtn.innerText = "Transmitting...";
            submitBtn.disabled = true;
        }

        // Try primary endpoint (/api/contact) with fallback to relay
        let success = false;
        const endpoints = ['/api/contact', 'https://api.imono.bro.bd/api/contact'];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    success = true;
                    break;
                }
            } catch (err) {
                // Continue to next endpoint fallback
            }
        }

        if (statusDiv) {
            if (success) {
                statusDiv.style.color = "#10b981";
                statusDiv.innerText = "Transmission successful.";
                form.reset();
            } else {
                statusDiv.style.color = "#ef4444";
                statusDiv.innerText = "Transmission failure. Please use direct email.";
            }
        }

        if (submitBtn) {
            submitBtn.innerText = "Transmit Message";
            submitBtn.disabled = false;
        }
    });
}

