pageManager.priv.addLinkList({path: '/web/pages/home/testCall.js', type: 'js', name: 'testCall'});
home = {
	include: [
		{path: '/web/pages/home/home.html', type:'html', var: 'html'},
		{path: '/web/pages/home/home.css', type:'css'},
		{path: '/web/pages/home/template.html', type:'html', var: 'template'},
		{path: '/web/pages/home/template.css', type:'css'},
		{path: '/web/pages/home/data.json', type:'json', var: 'tjson'},

		{path: '/web/tools/user/user.js', type:'lib', name: 'user'}
	],
	inserial: true,
	open: function(value) {
		if (!home.loaded) {
			$('.content').html(home.html);
			$('.home').append(htmlBind(home.template, home.tjson));
			home.loaded = true;
		}
		if (value != null) {
			$(`.node`).hide();

			var nodes = $('.node').filter(function() {
				return $(this).attr('name').toLowerCase().indexOf(value) > -1;
			});
			nodes.show();
			$('.search').val(value);
		} else {
			$(`.node`).show();
			$('.search').val('');
		}
	},
	close: function() {
        	$('.home').remove();
        	home.loaded = false;
	},
	openDetail: function() {
		pageManager.add('detail', {type: 'mobile', brand: 'samsung'});
	},
	loaded: false,
	multiload: true
}