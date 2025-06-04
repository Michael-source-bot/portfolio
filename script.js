// script.js

// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav#navbar .nav-link');
    const sections = document.querySelectorAll('.section');
    const buttonsWithTarget = document.querySelectorAll('button[data-target]');
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('nav#navbar .nav-links');

    // Smoothly scroll or navigate to the target section (on index.html)
    function goToSection(targetId) {
        const path = window.location.pathname;
        const isIndex = path.endsWith('index.html') || path === '/' || path === '';
        if (isIndex) {
            const targetElem = document.getElementById(targetId);
            if (!targetElem) return;
            targetElem.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = `index.html#${targetId}`;
            return;
        }

        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('selected');
            } else {
                link.classList.remove('selected');
            }
        });

        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-target');
            goToSection(targetSection);
        });
    });

    buttonsWithTarget.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-target');
            goToSection(targetSection);
        });
    });

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || path === '/' || path === '';
    if (isIndex) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6  // when 60% of the section is visible
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        if (link.getAttribute('data-target') === id) {
                            link.classList.add('selected');
                        } else {
                            link.classList.remove('selected');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        goToSection('home');
    }
});