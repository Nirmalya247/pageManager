bootstrap = {
	include: [
		{path: '/web/pages/bootstrap/bootstrap.html', type:'html', var: 'html'},
		{path: '/web/pages/bootstrap/bootstrap.css', type:'css'}
	],
	open: function(value) {
        $('body').append(htmlBind(bootstrap.html, {name: pageManager.project}));
        bootstrap.loaded = true;
    },
	auth: function(value) {
        if (value) {
            $('.loginB').hide();
            $('.profileB').show();
            $('.logoutB').show();
        } else {
            $('.loginB').show();
            $('.profileB').hide();
            $('.logoutB').hide();
        }
	},
    close: function() {
        $('.bootstrap').remove();
        bootstrap.loaded = false;
    },
	loaded: false,
	multiload: false
}