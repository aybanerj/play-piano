const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// $('.white-key').hover(
//     function() {
//         $('.clef-note').addClass('.hover');
//     },
//     function() {
//         $('.clef-note').removeClass('.hover');
//     }
// );