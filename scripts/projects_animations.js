document.addEventListener('DOMContentLoaded', function() {
    // header
    const header = document.querySelector('header');
    if (header) {
        setTimeout(() => {
            header.classList.add('visible');
        }, 100);
    }

    // anime cartes
    const projects = document.querySelectorAll('.project');
    projects.forEach((project, index) => {
        setTimeout(() => {
            project.classList.add('visible');
        }, 300 + (index * 150));
    });

    // footer
    const footer = document.querySelector('footer');
    if (footer) {
        setTimeout(() => {
            footer.classList.add('visible');
        }, 300 + (projects.length * 150) + 200);
    }

    // défilement animé vers les ancres de la page (#section)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function highlight(target) {
        target.classList.remove('section-highlight');
        void target.offsetWidth; // relance l'animation si on reclique
        target.classList.add('section-highlight');
    }

    function scrollToSection(target) {
        const startY = window.scrollY;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        // on ne vise pas plus bas que le bas de la page, sinon l'animation s'arrête net
        const endY = Math.min(target.getBoundingClientRect().top + startY - margin, maxY);
        const distance = endY - startY;

        if (reduceMotion.matches || Math.abs(distance) < 2) {
            window.scrollTo(0, endY);
            highlight(target);
            return;
        }

        const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * easeInOutCubic(progress));
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                highlight(target);
            }
        }
        requestAnimationFrame(step);
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const id = link.getAttribute('href').slice(1);
            const target = id && document.getElementById(id);
            if (!target) return;
            event.preventDefault();
            history.pushState(null, '', '#' + id);
            scrollToSection(target);
        });
    });
});
