(function() {
    emailjs.init('A4yA5LwPiHJTO9hxc');

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = '✓';
        if (type === 'loading') {
            icon = '⟳';
        } else if (type === 'error') {
            icon = '✕';
        }

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        if (type !== 'loading') {
            setTimeout(() => {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    if (toast.parentNode) {
                        container.removeChild(toast);
                    }
                }, 400);
            }, 4000);
        }

        return toast;
    }

    function removeToast(toast) {
        if (toast && toast.parentNode) {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }
    }

    function isValidEmailFormat(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(email);
    }

    // Interroge le DNS pour vérifier que le domaine peut recevoir des mails.
    // On accepte un MX, ou un A en secours (RFC 5321). Si le DNS est
    // injoignable, on laisse passer pour ne pas bloquer un visiteur légitime.
    async function domainCanReceiveMail(domain) {
        async function dnsHasAnswer(type) {
            const url = 'https://cloudflare-dns.com/dns-query?name='
                + encodeURIComponent(domain) + '&type=' + type;
            const res = await fetch(url, { headers: { accept: 'application/dns-json' } });
            if (!res.ok) {
                throw new Error('Réponse DNS invalide');
            }
            const data = await res.json();
            return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
        }

        try {
            if (await dnsHasAnswer('MX')) {
                return true;
            }
            if (await dnsHasAnswer('A')) {
                return true;
            }
            return false;
        } catch (err) {
            console.warn('Vérification DNS impossible, on laisse passer :', err);
            return true;
        }
    }

    document.getElementById('contact-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Honeypot : ce champ est caché, seul un bot le remplit.
        const honeypot = document.getElementById('website').value;
        if (honeypot) {
            this.reset();
            return;
        }

        const email = this.email.value.trim();

        if (!isValidEmailFormat(email)) {
            showToast('Adresse e-mail invalide. Vérifiez le format.', 'error');
            return;
        }

        const checkingToast = showToast('Vérification de l\'adresse...', 'loading');
        const domain = email.split('@')[1];
        const domainOk = await domainCanReceiveMail(domain);
        removeToast(checkingToast);

        if (!domainOk) {
            showToast('Cette adresse e-mail n\'existe pas. Vérifiez la saisie.', 'error');
            return;
        }

        const loadingToast = showToast('Envoi en cours...', 'loading');

        const templateParams = {
            name: this.name.value,
            email: email,
            message: this.message.value,
            reply_to: email
        };

        emailjs.send('service_iqs4i5t', 'template_vcdkvbj', templateParams)
            .then(() => {
                removeToast(loadingToast);
                showToast('E-mail envoyé avec succès !', 'success');
                this.reset();
            })
            .catch((err) => {
                removeToast(loadingToast);
                console.error('Erreur lors de l\'envoi :', err);
                showToast('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            });
    });
})();
