var now = new Date(),
    secPassed = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
var t = (60 * 60 * 24) - secPassed;
jQuery('.time').countdown({
    until: (t),
    labels: ['Годы', 'Месяцы', 'Недели', 'Дни', 'Часов', 'Минут', 'Секунд'],
    labels1: ['Годы', 'Месяцы', 'Недели', 'Дни', 'Часов', 'Минут', 'Секунд'],
    format: 'HMS',
    layout: ' <ul class="ul-time"><li class="time-bg"><span>0</span><span>0</span></li><li class="time-bg"><span>{h10}</span><span>{h1}</span></li><li class="time-bg"><span>{m10}</span><span>{m1}</span></li><li class="time-bg"><span>{s10}</span><span>{s1}</span></li></ul>'
});

$('.order-form input[name=name_last]').val('Заказ').closest('.form-group').hide();
$('.form-group label').hide();
$('button[type=submit]').text('ОФОРМИТЬ ЗАКАЗ').addClass('button-form');
$(".form-group input[name=name_first]").after('<i class="icon-name"></i>');
$(".form-group input[name=phone]").after('<i class="icon-phone"></i>');

//$size = '<div class="form-group" id="form-group-size">\n' +
//    '           <p class="text-size size-des"><input class="size" checked name="ss" value="40 / 26,5см" type="radio">40 / 26,5см</p>\n' +
//    '           <p class="text-size size-des"><input class="size" name="ss" value="41 / 27,5см" type="radio">41 / 27,5см</p>\n' +
//    '           <p class="text-size size-des"><input class="size" name="ss" value="42 / 28см" type="radio">42 / 28см</p>\n' +
//    '           <p class="text-size size-des"><input class="size" name="ss" value="43 / 28,5см" type="radio">43 / 28,5см</p>\n' +
//    '           <p class="text-size size-des"><input class="size" name="ss" value="44 / 29см" type="radio">44 / 29см</p>\n' +
//    '           <p class="text-size size-des"><input class="size" name="ss" value="45 / 29,5см" type="radio">45 / 29,5см</p>\n' +
//    '        </div>';
//
//$('.forma input[name=name_first]').closest('.form-group').before($size);



$('.text-size').on('click', function () {
    $(this).closest('.text-size').addClass('active').siblings('.text-size').removeClass('active');
});




$('#big-1, #big-112').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    accessibility: false,
    lazyLoad: 'ondemand',
    focusOnSelect: true,
    asNavFor: '#small-1, #big-112'
});
$('#small-1, #small-112').slick({
    slidesToShow: 6,
    slidesToScroll: false,
    asNavFor: '#big-1, #big-112',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    accessibility: false,
});
$('#big-2').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    accessibility: false,
    lazyLoad: 'ondemand',
    focusOnSelect: true,
    asNavFor: '#small-2'
});
$('#small-2').slick({
    slidesToShow: 6,
    slidesToScroll: false,
    asNavFor: '#big-2',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    accessibility: false,
});
$('#big-3').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    accessibility: false,
    lazyLoad: 'ondemand',
    focusOnSelect: true,
    asNavFor: '#small-3'
});
$('#small-3').slick({
    slidesToShow: 6,
    slidesToScroll: false,
    asNavFor: '#big-3',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    accessibility: false,
});
$('#big-4').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    accessibility: false,
    lazyLoad: 'ondemand',
    focusOnSelect: true,
    asNavFor: '#small-4'
});
$('#small-4').slick({
    slidesToShow: 6,
    slidesToScroll: false,
    asNavFor: '#big-4',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    accessibility: false,
});

$('#big-222').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    accessibility: false,
    lazyLoad: 'ondemand',
    focusOnSelect: true,
    asNavFor: '#small-222'
});
$('#small-222').slick({
    slidesToShow: 6,
    slidesToScroll: false,
    asNavFor: '#big-222',
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    accessibility: false,
});


$('.rev-mobile').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    dots: true,
    centerMode: true,
    variableWidth: true,

});

$(".big-foto").fancybox({
    selector: '[data-fancybox="gallery1"]',
    loop: !0
})


$(".button-a").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
        top = $(id).offset().top;
    $('body,html').animate({
        scrollTop: top
    }, 1500);
});


window.onresize = $(window).resize(function () {

    if (window.matchMedia("(min-width: 768px)").matches) {
        $("a[href='#zakaz-mobile']").attr('href', '#zakaz');
    }
    if (window.matchMedia("(max-width: 768px)").matches) {
        $("a[href='#zakaz']").attr('href', '#zakaz-mobile');
    }
});

//
window.onload = $(function () {
    if (window.matchMedia("(max-width: 768px)").matches) {
        $("a[href='#zakaz']").attr('href', '#zakaz-mobile');
    }
}); // при загрузке страницы..
