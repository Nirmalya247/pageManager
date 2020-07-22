detail = {
	include: [
		{path: '/web/pages/detail/detail.html', type:'html', var: 'html'},
		{path: '/web/pages/detail/detail.css', type:'css'}
	],
	open: function(value) {
		if (value != null) {
			$('.bootstrap').append(htmlBind(detail.html, {name: value}));
		} else {
			$('.bootstrap').append(detail.html);
		}
        detail.loaded = true;
	},
	close: function() {
        $('.detail').remove();
        detail.loaded = false;
	},
	loaded: false,
	multiload: false
}