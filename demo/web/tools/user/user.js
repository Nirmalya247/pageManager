user = {
	include: [
		{path: '/web/tools/user/try1.js', type:'lib', name: 'try1'},
		{path: '/web/tools/user/try2.js', type:'js'}
    ],
    open: function() {
        console.log('it is try user lib');
        console.log(try2);
    }
}