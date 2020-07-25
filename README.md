# pageManager
Single page website building framework with dynamic loading

# Include this in your index.html
```
<script src="/web/tools/jquery.js"></script>
<script src="/web/tools/common.js"></script>
<script src="/web/tools/pageManager.js"></script>
<script src="/web/tools/htmlBind.js"></script>
<script>
	// add pages root js with page name
	pageManager.linkList = [
		{path: '/web/pages/bootstrap/bootstrap.js', name: 'bootstrap'},
		{path: '/web/pages/detail/detail.js', name: 'detail'},
		{path: '/web/pages/home/home.js', name: 'home'},
		{path: '/web/pages/profile/profile.js', name: 'profile'},
		{path: '/web/popup/login/login.js', name: 'login'},
		{path: '/web/pages/test/test.js', name: 'test'}
	];
	pageManager.project = 'test';       // enter your project name
	pageManager.defaultPage = 'home';   // home page or default page name
	pageManager.bootstrap = 'bootstarp';// bootstrap page or the container for all your project (it can be null)
	$(window).on("popstate", function() {
		pageManager.checkURL();
	});
</script>
```
In your body tag
```
<body onload="pageManager.checkURL();"></body>
```
# Adding pages
Pages has some parts
1) include
2) init() // can be avoided this function is called only for the first time when the page is loaded before calling open()
2) open()
3) close()
```
home = {
	include: [
		{path: '/web/pages/home/home.html', type:'html', var: 'html'},
		{path: '/web/pages/home/home.css', type:'css'}
		...
	],
	inserial: true, // true or false to include files in the given order
	open: function(value) {
		if (!home.loaded) {
			...
			home.loaded = true;
		}
		if (value != null) {
			...
		} else {
			...
		}
	},
	close: function() {
		
	},
	loaded: false,
	multiload: true // if this page can be loaded with different data multiple time
}
```
# include
include has some types
1) html
```
{path: 'path to file', type:'html', var: 'variable name to be used'}
{path: '/web/pages/home/home.html', type:'html', var: 'html'}
```
2) css
```
{path: 'path to file', type:'css'}
{path: '/web/pages/home/home.css', type:'css'}
```
3) normal js file
```
{path: 'path to file', type:'js'}
{path: '/web/tools/user/user.js', type:'js'}
```
4) lib (js file with include)
```
{path: 'path to file', type:'lib', name: 'variable name to be used'}
{path: '/web/tools/user/libs.js', type:'lib', name: 'testLib'}
```
5) json
```
{path: 'path to file', type:'json', var: 'variable name to be used'}
{path: '/web/tools/user/data.json', type:'json', var: 'data'}
```
5) svg
```
{path: 'path to file', type:'svg', var: 'variable name to be used'}
{path: '/web/tools/user/like.svg', type:'svg', var: 'likeImage'}
```
You can add <inserial: true> to make this include serially in the sequence it is written
# binding data
```
$('.home').append(htmlBind(htmlData, jsonData));
$('.home').append(htmlBind(home.template, home.tjson));
```
json
```
[
    {"name": "Nirmalya Gayen", "roll": 5, "addr": [
            {"city": "Baruipur", "pin": 700144}, {"city": "Barasat", "pin": 700026}
        ]
    },
    {"name": "Subhosree Saha", "roll": 8, "addr": [
            {"city": "Jadavpur", "pin": 700056}, {"city": "Barasat", "pin": 700026}
        ]
    },
    {"name": "Sourav Dey", "roll": 9, "addr": [
            {"city": "Purulia", "pin": 700424}
        ]
    }
]

```
html file
```
<div class="nodes" bindFrom="!">
<div class="node" name="{{name}}" onclick="pageManager.add('detail', '{{name}}');">
        <div class="name">Name: {{name}}</div>
        <div class="roll">Roll: {{roll}}</div>
        <div class="addr" bindFrom="addr">
            Address: 
            <div class="addr-nodes">
                {{city}} pin: {{pin}}
            </div>
        </div>
    </div>
</div>
```
# call function on demand
```
// we can add path before usage like this
pageManager.priv.addLinkList({path: '/web/pages/home/myjs.js', type: 'js', name: 'testCall'});
//pageManager.call(functionName, value)
pageManager.call('testCall.search', 'mobile')
//or
pageManager.call('testCall.search', ['mobile', 3224])

//pageManager.call(functionName, value, libName)
pageManager.call('search', ['mobile', 3224], 'testCall')

// if we did not added path can include path when calling like this
//pageManager.call(functionName, value, libName, libPath)
pageManager.call('search', ['mobile', 3224], 'testCall', '/web/pages/home/myjs.js')
```
