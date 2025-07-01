// File: js/main.js

(function($) {
  "use strict";

  // Smooth Scrolling
  $('a.page-scroll').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 40
        }, 900);
        return false;
      }
    }
  });

  // Highlight Navigasi Aktif
  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  });

  // Menutup Menu Mobile
  $('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
  });

  // Affix Navbar
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  });

  // Inisialisasi Isotope untuk Filter Galeri
  $(window).load(function() {
    var $container = $('.portfolio-items');
    $container.isotope({
      filter: '*',
      animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
      }
    });
    $('.cat a').click(function() {
      $('.cat .active').removeClass('active');
      $(this).addClass('active');
      var selector = $(this).attr('data-filter');
      $container.isotope({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });
      return false;
    });
  });

  // Inisialisasi Nivo Lightbox
  $('.portfolio-item a').nivoLightbox({
    effect: 'slideDown',
    keyboardNav: true,
  });

}(jQuery));