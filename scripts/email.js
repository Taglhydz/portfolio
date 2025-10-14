(function() {
    emailjs.init('A4yA5LwPiHJTO9hxc');

    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();

        emailjs.sendForm('service_iqs4i5t', 'template_vcdkvbj', this)
            .then(() => {
                alert('E-mail envoyé avec succès !');
                this.reset(); // Réinitialiser le formulaire après envoi
            })
            .catch((err) => {
                console.error('Erreur lors de l\'envoi :', err);
                alert('Erreur lors de l\'envoi. Veuillez réessayer.');
            });
    });
})();