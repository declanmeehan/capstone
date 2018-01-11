$(document).ready(function () {
	"use strict"; // start of use strict

	/*==============================
	Sidebar
	==============================*/
	$('.sidebar__dropdown').on('mouseenter mouseleave', function () {
		$(this).children('.sidebar__dropdown-menu').toggleClass('active');
	});

	$('.header__mobile-menu').on('click', function() {
		$(this).toggleClass('header__mobile-menu--active');
		$('.sidebar').toggleClass('sidebar--open');
	});

	/*==============================
	Search
	==============================*/
	$('.header__search-btn, .search__btn').on('click', function() {
		$('.search').toggleClass('search--active');
	});

	/*==============================
	Dropdowns
	==============================*/
	$(document).on('click.bs.dropdown.data-api', '[data-toggle="dropdown-menu--click"]', function (e) {
		e.stopPropagation();
	});

	/*==============================
	Scroll bar
	==============================*/
	$('.scrollbar-dropdown').mCustomScrollbar({
		axis:"y",
		scrollbarPosition:"outside",
		theme:"custom-bar1"
	});

	$('.scrollbar-sidebar').mCustomScrollbar({
		axis:"y",
		scrollbarPosition:"outside",
		theme:"custom-bar2"
	});

	/*==============================
	Home carousel
	==============================*/
	$('.home-carousel').owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		autoplayTimeout: 6000,
		smartSpeed: 500,
		responsive:{
			0:{
				dots: true
			},
			1200:{
				dots: false
			}
		}
	});

	$('.home-carousel-nav__next').on('click', function() {
		$('.home-carousel').trigger('next.owl.carousel');
	});
	$('.home-carousel-nav__prev').on('click', function() {
		$('.home-carousel').trigger('prev.owl.carousel');
	});

	$('.home-carousel .item').each(function(){
		if ($(this).attr("data-bg")){
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	/*==============================
	Article carousel
	==============================*/
	$('.article-carousel').owlCarousel({
		margin: 20,
		loop: true,
		smartSpeed: 800,
		responsive:{
			0:{
				items:1,
				dots: true,
				loop: true
			},
			1200:{
				items:2,
				dots: false
			}
		}
	});

	$('.article-carousel-nav__next').on('click', function() {
		$('.article-carousel').trigger('next.owl.carousel');
	});
	$('.article-carousel-nav__prev').on('click', function() {
		$('.article-carousel').trigger('prev.owl.carousel');
	});

	/*==============================
	Item carousel
	==============================*/
	$('.item__slider').owlCarousel({
		items: 1,
		loop: true,
		autoplay: true,
		autoplayTimeout: 6000,
		smartSpeed: 500,
		dots: true
	});

	/*==============================
	Events
	==============================*/
	$('.event-post').each(function(){
		if ($(this).attr("data-bg")){
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	/*==============================
	Masonry
	==============================*/
	$('.row--masonry').masonry({
		itemSelector: '.col-xs-12'
	});

	/*==============================
	Filter
	==============================*/
	$('.section__filter-menu li').each(function(){
		$(this).attr('data-value', $(this).text().toLowerCase());
	});

	$('.section__filter-menu li').on('click', function() {
		var text = $(this).text();
		var item = $(this);
		var id = item.closest('.section__filter').attr('id');
		$('#'+id).find('.section__filter-btn input').val(text);
	});

	/*==============================
	Map
	==============================*/
	var myCenter=new google.maps.LatLng(53.902242, 27.559726);
	function initialize() {
		if ($('.contacts__map').length) {
			var mapProp = {
				center:myCenter,
				scrollwheel: false,
				zoom:14,
				mapTypeControl:false,
				streetViewControl:false,
				mapTypeId:google.maps.MapTypeId.ROADMAP,
				styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{ "color": "#ffffff" }, {"visibility": "on"} ]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{ "color": "#ffffff" },{"visibility":"off"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{ "color": "#ffffff" }]},{"featureType":"water","elementType":"geometry","stylers":[{ "color": "#444951" }, {"visibility": "on"} ]}],
			};
				
			var map=new google.maps.Map(document.getElementById("contacts__map"),mapProp);
				
			var marker=new google.maps.Marker({
				position:myCenter,
				icon:'img/marker.png',
			});
				
			marker.setMap(map);
		} else {
			return false;
		}
		return false;
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	/*==============================
	Player
	==============================*/
	var myPlayer = new jPlayerPlaylist({
		jPlayer: "#jquery_jplayer_1",
		cssSelectorAncestor: "#jp_container_1"
	}, [
		{
			title:"Cro Magnon Man",
			artist:"The Stark Palace",
			mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
			oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg",
			poster: "img/covers/cover1.jpg",
		}, {
			title:"Cyber Sonnet",
			artist:"The Stark Palace",
			mp3:"http://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3",
			oga:"http://www.jplayer.org/audio/ogg/TSP-07-Cybersonnet.ogg",
			poster: "img/covers/cover2.jpg",
		}, {
			title:"Tempered Song",
			artist:"Miaow",
			mp3:"http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
			oga:"http://www.jplayer.org/audio/ogg/Miaow-01-Tempered-song.ogg",
			poster: "img/covers/cover3.jpg",
		}, {
			title:"Lentement",
			artist:"Miaow",
			mp3: "http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
			oga: "http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg",
			poster: "img/covers/cover4.jpg",
		},
	], {
		playlistOptions: {
			loopOnPrevious: true,
			enableRemoveControls: true
		},
		loop: true,
		swfPath: "js/jPlayer",
		supplied: "mp3, oga",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		audioFullScreen: true,
		keyEnabled: true,
		size: { width: "100%", height: "auto" },
	});

	var $jp = $('#jquery_jplayer_1');

	$jp.on($.jPlayer.event.play,  function(e){
		$('#current-track').empty();
		$('#current-track').append(myPlayer.playlist[myPlayer.current].title);
		$('#get-track').empty();
		$('#get-track').append("Current track", myPlayer.current);
	});

	/* volume bar */
	$('.jp-volume-bar').mousedown(function() {
		var parentOffset = $(this).offset(),
		width = $(this).width();
		$(window).mousemove(function(e) {
			var x = e.pageX - parentOffset.left,
			volume = x/width
			var barValue = Math.floor(volume*100);
			if (barValue < 0 ) barValue = 0;
			if (barValue > 100) barValue = 100;
			$('.jp-volume-bar-value').css('width', barValue + '%');
			$('#jquery_jplayer_1').jPlayer('volume', volume);
		});
		return false;
	});
	$(document).on('mouseup', function() {
		$(window).unbind('mousemove');
	});
});