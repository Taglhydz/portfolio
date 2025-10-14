(function() {
    emailjs.init('A4yA5LwPiHJTO9hxc');

    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // verif honeypot, si rempli > bot
        const honeypot = document.getElementById('website').value;
        if (honeypot) {
            console.log('Bot détecté - soumission bloquée');
            this.reset();
            return;
        }

        // si honeypot vide > humain > envoi email
        emailjs.sendForm('service_iqs4i5t', 'template_vcdkvbj', this)
            .then(() => {
                alert('E-mail envoyé avec succès !');
                this.reset(); // reset form après envoi
            })
            .catch((err) => {
                console.error('Erreur lors de l\'envoi :', err);
                alert('Erreur lors de l\'envoi. Veuillez réessayer.');
            });
    });
})();