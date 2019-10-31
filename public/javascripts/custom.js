
$(document).ready(function(){

    $('.speaker-slider').slick({
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
    });      

    $(window).resize(() => {
        console.log($('.slide .item').width())
        // $('.slide-contents').css('width', )
    });

})
