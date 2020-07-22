profile = {
	include: [
		{path: '/web/pages/profile/profile.html', type:'html', var: 'html'},
		{path: '/web/pages/profile/profile.css', type:'css'}
	],
	open: function(value) {
        $('.content').html(profile.html);
        profile.loaded = true;
    },
    close: function() {
        $('.profile').remove();
        profile.loaded = false;
    },
	loaded: false,
	multiload: false
}