import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap is installed and imported

import SimpleLightbox from 'simple-lightbox'; // Ensure SimpleLightbox is installed and imported

window.addEventListener('DOMContentLoaded', event => {
    // Navbar shrink function
    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        const logo = document.querySelector(".navbar-brand img");
        
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
            logo.src = "logo.png";
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
            logo.src = "logo_fixed_voidclass_black.png"; // Change to the smaller logo
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);
    
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
    new window.bootstrap.ScrollSpy(document.body, {

            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });
});
