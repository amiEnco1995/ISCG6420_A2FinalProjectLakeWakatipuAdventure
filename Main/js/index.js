$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
      loop: true,
      autoplay: true,
      slidespeed: 3000,
      margin: 10,
      items: 2,
      nav: true,
      navText: [
        '<i class="fa-regular fa-circle  arrowDecor"></i>',
        '<i class="fa-regular fa-circle arrowDecor"></i>',
      ],
      dots: false,
      responsive: {
        0: {
          items: 1,
        },
        780: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });

    //make review stars
    function makeStar(rating, selector){
        for(let i = 0; i < rating; i++){
            $(selector).append('<i class="fa-solid fa-star"></i>'); 
            }
    }
    
    makeStar(4, '.star4');

  });