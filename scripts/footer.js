(function () {
    // Détermine le chemin de base depuis l'attribut src de ce script
    function getBasePath() {
        const script = document.querySelector('script[src*="footer.js"]');
        if (!script) return './';
        return script.getAttribute('src').replace('scripts/footer.js', '');
    }

    const b = getBasePath();
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div>
            <div class="name"><p>Tom<br>Vaillant</p></div>
            <div class="contacts">
                <div class="mail">
                    <a class="mail-link">
                        <img src="${b}ui/images/icon_mail.svg" alt="">
                        <span class="mail-text"></span>
                    </a>
                </div>
                <div class="github">
                    <a href="https://github.com/Taglhydz" target="_blank" rel="noopener noreferrer">
                        <img src="${b}ui/images/icon_github.svg" alt="">
                        Github
                    </a>
                </div>
                <div class="phone">
                    <a class="phone-link">
                        <img src="${b}ui/images/icon_phone.svg" alt="">
                        <span class="phone-text"></span>
                    </a>
                </div>
                <div class="linkedin">
                    <a href="https://www.linkedin.com/in/tom-vaillant-67a587329/" target="_blank" rel="noopener noreferrer">
                        <img src="${b}ui/images/icon_linkedin.svg" alt="">
                        LinkedIn
                    </a>
                </div>
            </div>
            <div class="localisation">
                <div>
                    <a href="https://www.google.com/maps/place/Montpellier/@43.6101029,3.791768,12z/data=!3m1!4b1!4m6!3m5!1s0x12b6af0725dd9db1:0xad8756742894e802!8m2!3d43.6108535!4d3.8761323!16zL20vMGpxMjc?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                        <img src="${b}ui/images/icon_pin.svg" alt="">
                        Montpellier, Hérault, France
                    </a>
                </div>
                <div>
                    <a href="https://www.google.com/maps/place/%C3%89cole+digitale+Montpellier+-+MyDigitalSchool/@43.6361669,3.8281377,17z/data=!4m14!1m7!3m6!1s0x12b6afb32ed691d9:0x7f5cf3a0d9d0946d!2s%C3%89cole+digitale+Montpellier+-+MyDigitalSchool!8m2!3d43.636163!4d3.8307126!16s%2Fg%2F11fqcsv2ys!3m5!1s0x12b6afb32ed691d9:0x7f5cf3a0d9d0946d!8m2!3d43.636163!4d3.8307126!16s%2Fg%2F11fqcsv2ys?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                        <img src="${b}ui/images/icon_pin.svg" alt="">
                        MyDigitalSchool Montpellier
                    </a>
                </div>
                <div>
                    <a href="${b}pages/cv.html">
                        <img src="${b}ui/images/icon_redirect.svg" alt="">
                        Voir mon CV
                    </a>
                </div>
                <div>
                    <a href="${b}ui/files/cv_tom_vaillant.pdf" download="cv_tom_vaillant.pdf">
                        <img src="${b}ui/images/icon_download.svg" alt="">
                        Télécharger mon CV
                    </a>
                </div>
                <div>
                    <a href="${b}pages/mentions_legales.html">
                        <img src="${b}ui/images/icon_redirect.svg" alt="">
                        Mentions légales
                    </a>
                </div>
            </div>
        </div>
        <p>Tom Vaillant - Copyright &copy; 2025 All rights reserved</p>
    `;
})();
