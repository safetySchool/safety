$(document).ready(function () {
    const pathName = window.location.pathname;
    const menu = $(`a[href$="${pathName}"]`).parent().parent().parent();
    if (menu.attr('class') === 'nav-item nav-item-submenu') {
        menu.addClass('nav-item-expanded nav-item-open');
    }
});
