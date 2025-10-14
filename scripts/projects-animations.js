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
});
