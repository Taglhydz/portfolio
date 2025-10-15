(function() {
    emailjs.init('A4yA5LwPiHJTO9hxc');

    // Fonction pour afficher un toast
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
        
        // Auto-remove après 4s (sauf pour loading)
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

    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // verif honeypot, si rempli > bot
        const honeypot = document.getElementById('website').value;
        if (honeypot) {
            console.log('Bot détecté - soumission bloquée');
            this.reset();
            return;
        }

        // Afficher toast "envoi en cours"
        const loadingToast = showToast('Envoi en cours...', 'loading');

        // si honeypot vide > humain > envoi email
        emailjs.sendForm('service_iqs4i5t', 'template_vcdkvbj', this)
            .then(() => {
                // Supprimer le toast loading
                if (loadingToast.parentNode) {
                    loadingToast.classList.add('fade-out');
                    setTimeout(() => {
                        if (loadingToast.parentNode) {
                            loadingToast.parentNode.removeChild(loadingToast);
                        }
                    }, 400);
                }
                
                // Afficher toast succès
                showToast('E-mail envoyé avec succès !', 'success');
                this.reset(); // reset form après envoi
            })
            .catch((err) => {
                // Supprimer le toast loading
                if (loadingToast.parentNode) {
                    loadingToast.classList.add('fade-out');
                    setTimeout(() => {
                        if (loadingToast.parentNode) {
                            loadingToast.parentNode.removeChild(loadingToast);
                        }
                    }, 400);
                }
                
                console.error('Erreur lors de l\'envoi :', err);
                showToast('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            });
    });
})();