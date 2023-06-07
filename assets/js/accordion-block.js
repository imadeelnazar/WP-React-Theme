jQuery(document).ready(function($) {

  $('.accordion-header').on('click',function() {
alert('ddd');
    $(this).parent('.accordion-item').toggleClass('active');
    $(this).next('.accordion-content').slideToggle();
  });
});