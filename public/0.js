(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./resources/js/react/UserInterface/Sidebarjs.js":
/*!*******************************************************!*\
  !*** ./resources/js/react/UserInterface/Sidebarjs.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = ((function () {
  // Sidebar links
  jquery__WEBPACK_IMPORTED_MODULE_0__('.sidebar .sidebar-menu li a').on('click', function () {
    var $this = jquery__WEBPACK_IMPORTED_MODULE_0__(this);

    if ($this.parent().hasClass('open')) {
      $this.parent().children('.dropdown-menu').slideUp(200, function () {
        $this.parent().removeClass('open');
      });
    } else {
      $this.parent().parent().children('li.open').children('.dropdown-menu').slideUp(200);
      $this.parent().parent().children('li.open').children('a').removeClass('open');
      $this.parent().parent().children('li.open').removeClass('open');
      $this.parent().children('.dropdown-menu').slideDown(200, function () {
        $this.parent().addClass('open');
      });
    }
  }); // Sidebar Activity Class

  var sidebarLinks = jquery__WEBPACK_IMPORTED_MODULE_0__('.sidebar').find('.sidebar-link');
  sidebarLinks.each(function (index, el) {
    jquery__WEBPACK_IMPORTED_MODULE_0__(el).removeClass('active');
  }).filter(function () {
    var href = jquery__WEBPACK_IMPORTED_MODULE_0__(this).attr('href');
    var pattern = href[0] === '/' ? href.substr(1) : href;
    return pattern === window.location.pathname.substr(1);
  }).addClass('active'); // ٍSidebar Toggle

  jquery__WEBPACK_IMPORTED_MODULE_0__('.sidebar-toggle').on('click', function (e) {
    jquery__WEBPACK_IMPORTED_MODULE_0__('.app').toggleClass('is-collapsed');
    e.preventDefault();
  });
  /**
   * Wait untill sidebar fully toggled (animated in/out)
   * then trigger window resize event in order to recalculate
   * masonry layout widths and gutters.
   */

  jquery__WEBPACK_IMPORTED_MODULE_0__('#sidebar-toggle').click(function (e) {
    e.preventDefault();
    setTimeout(function () {
      window.dispatchEvent(window.EVENT);
    }, 300);
  });
})());

/***/ })

}]);