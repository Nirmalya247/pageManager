login = {
	include: [
		{path: '/web/popup/login/login.html', type:'html', var: 'html'},
		{path: '/web/popup/login/login.css', type:'css'}
	],
	open: function(value) {
        $('.bootstrap').append(login.html);
        login.loaded = true;
	},
	close: function() {
        $('.login').remove();
        login.loaded = false;
	},
	success: function() {
		pageManager.callAllOpen('auth', true);
        pageManager.back('login');
	},
	loaded: false,
	multiload: false
}