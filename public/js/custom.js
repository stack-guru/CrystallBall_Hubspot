// import * as $ from 'jquery';

// // Collapse click
// $('[data-toggle=sidebar-colapse]').click(function() {
//     SidebarCollapse();
// });
//
// function SidebarCollapse () {
//     $('.menu-collapsed').toggleClass('d-none');
//     $('.sidebar-submenu').toggleClass('d-none');
//     $('.submenu-icon').toggleClass('d-none');
//     $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
//
//     // Treating d-flex/d-none on separators with title
//     var SeparatorTitle = $('.sidebar-separator-title');
//     if ( SeparatorTitle.hasClass('d-flex') ) {
//         SeparatorTitle.removeClass('d-flex');
//     } else {
//         SeparatorTitle.addClass('d-flex');
//     }
//
//     // Collapse/Expand icon
//     $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
// }
// $(document).ready(function(){
    console.log('heol');

    $('.dropdown').click(function(){
        $('.gaa-menu-item.dropdown').toggleClass('open');
        console.log('heol');
    });
// })
$(".dropdown").click(function(){
    console.log("The paragraph was clicked.");
});
