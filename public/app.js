window.onload = function() {
	var socket = io.connect('http://localhost'),
		$controls = $('.controls'),
		$pagination = $('.pagination'),
		$progress_indicator = $('.progress_indicator'),
		$paginationTrigger = $pagination.find('.trigger');
		$thumbnails = $pagination.find('img'),
		$toggle_progress = $('.toggle_progress'),
		slides = {
			$slides: $('.slide', '#slides'),
			end: $('.slide', '#slides').length > 0 ? $('.slide', '#slides').length : 0,
		};

	socket.on('changeSlide', function (data) {
		slides.$slides.eq(data.currentSlide).addClass("current").siblings().removeClass("current");
		$thumbnails.removeClass('active').eq(data.currentSlide).addClass('active');
		$progress_indicator.find('li').removeClass('active').eq(data.currentSlide).addClass('active');
	});

	socket.on('toggleProgress', function (data) {
		$progress_indicator.toggleClass('active', data.toggle);
		$toggle_progress.toggleClass('active', data.toggle);
	});

	$controls.on('click', function (e) {
		var action = $(e.target).data('action');
		socket.emit('send', {
			direction: action,
			end: slides.end
		});
	});

	$toggle_progress.on('click', function (e) {
		socket.emit('sendToggleProgress', {
			toggle: !$('.toggle_progress').is('.active')
		});
	});

	$thumbnails.on('click', function (e) {
		var currentThumb = $thumbnails.index($(this));
		$thumbnails.removeClass('active');
		$(this).addClass('active');
		socket.emit('send', {
			currentSlide: currentThumb
		});
	});

	$paginationTrigger.on('click', function (e) {
		$pagination.toggleClass('offscreen');
	});

	$('.visuals').on('click', '.main', function (e) {
		var src = $(this).attr('src'),
			alt = $(this).data('menu');

		$(this).attr('src', alt).data('menu', src);
	});

	socket.emit('send', {
		direction: 0
	});

	socket.emit('sendToggleProgress', {
		direction: 0
	});

	$('body').addClass('active');
}