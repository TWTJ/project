
$(document).ready(function(){

    $('.speaker-slider').slick({
        // infinite: true,
        speed: 300,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        centerMode: true,
        variableWidth: true,
        responsive: "100%",
        arrows:true,
        autoplay: true,
        autoplaySpeed:2000
        // dots:true,
        // fade:false,  
        // responsive: [
        //     {
        //         breakpoint: 100,
        //         settings: {
        //             slidesToShow: 3
        //         }
        //     },
        //     {
        //         breakpoint: 100,
        //         settings: {
        //             slidesToShow: 2
        //         }
        //     },
        //     {
        //         breakpoint: 100,
        //         settings: {
        //             slidesToShow: 1
        //         }
        //     }
        // ]
    });      

    $(window).resize(() => {
        console.log($('.slide .item').width())
        // $('.slide-contents').css('width', )
    });

})

    // -----------------------------
    //  Screenshot Slider
    // -----------------------------
  