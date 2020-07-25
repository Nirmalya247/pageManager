pageManager = {
	linkList: [],
	root: 'single', // '/?' or 'single'
	bindPage: false,
	project: 'unknown',
	defaultPage: 'home',
	bootstrap: 'bootstrap',
	now: [],
	popNow: [],
	priv: {
		addLinkList: function(value) {
			if (tools.common.data.getJSONindex(pageManager.linkList, 'path', value.path) < 0) {
				pageManager.linkList.push(value);
			}
		},
		progress: {
			htFirst: `
			<div class="pageManagerProgress">
				<style>
					body {
						overflow: hidden;
					}
					.pageManagerProgress {
						position: absolute;
						width: 100%;
						height: 100%;
						margin: 0;
						padding: 0;
						top: 0;
						left: 0;
						z-index: 10000;
						background-color: white;
					}
					
					#welcomeMessage {
						font: normal 20px/normal Arial, Helvetica, sans-serif;
						margin-top: 50px;
						text-align: center;
						color: gray;
					}
					
					#svg #progressCircle {
						stroke-dashoffset: 0;
						transition: stroke-dashoffset 1s linear;
						stroke: #d8d8d8;
						stroke-width: 5px;
					}
					
					#svg #progressBar {
						stroke-dashoffset: 565.48px;
						transition: stroke-dashoffset 1s linear;
						stroke: #5d03a3;
						stroke-width: 5px;
					}
					
					#progressCont {
						display: block;
						height: 200px;
						width: 200px;
						margin: 2em auto;
						border-radius: 100%;
						position: relative;
						text-align: center;
					}
					
					#progressCont:after {
						position: absolute;
						display: block;
						height: 160px;
						width: 160px;
						left: 50%;
						top: 50%;
						content: attr(data-pct)"%";
						margin-top: -80px;
						margin-left: -80px;
						border-radius: 100%;
						line-height: 160px;
						font-size: 2em;
						font-family: sans-serif;
					}
					
					#welcomeMessageArea {
						font: normal 15px/normal Arial, Helvetica, sans-serif;
						text-align: center;
						color: gray;
						position: absolute;
						bottom: 50px;
						width: 100%;
					}
				</style>
				<div id="welcomeMessage">
					welcome to unknown :)
				</div>
			
				<div id='progressCont' data-pct="0">
					<svg id="svg" width="200" height="200" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<circle id='progressCircle' r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>
					<circle id="progressBar" r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>
					
					</svg>
				</div>
			
				<div id="welcomeMessageArea">
					preparing for use
				</div>
			</div>`,
			ht: `
			<div class="pageManagerProgress">
				<style>
					.pageManagerProgress {
						position: absolute;
						top: 0;
						width: 100%;
						height: 5px;
						background-color: rgba(40, 40, 40, 0.5);
						z-index: 5000;
					}
					.progressCont {
						position: absolute;
						left: 0;
						height: 5px;
						top: 0;
						background-color: white;
						width: 0;
						transition: width 0.2s ease
					}
				</style>
				<div class="progressCont"></div>
				</div>
			</div>`,
			first: true,
			max: 0,
			now: 0,
			set: function(firstLoad) {
				pageManager.priv.progress.first = firstLoad;
				pageManager.priv.progress.max = 0;
				pageManager.priv.progress.now = 0;
				if (firstLoad) {
					var jq = $(pageManager.priv.progress.htFirst);
					jq.find('#welcomeMessage').text(`welcome to ${pageManager.project} :)`);
					$('body').append(jq);
				} else {
					$('body').append(pageManager.priv.progress.ht);
				}
			},
			close: function() {
				pageManager.priv.progress.first = false;
				pageManager.priv.progress.max = 0;
				pageManager.priv.progress.now = 0;
				$('.pageManagerProgress').remove();
			},
			update: function(max, now) {
				if (max != null) pageManager.priv.progress.max += max;
				if (now != null) pageManager.priv.progress.now += now;
				max = pageManager.priv.progress.max;
				now = pageManager.priv.progress.now;
				//console.log(max, now);
				try {
					if (pageManager.priv.progress.first) {
						var $circle = document.getElementById('progressBar');
						if (isNaN(now)) {
							val = 100;
						} else {
							var r = $circle.getAttribute('r');
							var c = Math.PI * (r * 2);
							if (now < 0) {
								now = 0;
							}
							var pct = parseInt(now / max * 100);
							var pctSet = ((100 - pct) / 100) * c;
		
							$circle.style.strokeDashoffset = pctSet;
							document.getElementById('progressCont').setAttribute('data-pct', pct);
						}
					} else {
						$('.progressCont').css('width', parseInt(now / max * 100) + '%');
					}
				} catch (err) {
					//alert(err.message);
				}
			}
		},
		includeLoad: [],
		jsExists: function(path) {
			return $.find(`[src="${path}"][ok="true"]`).length > 0
		},
		cssExists: function(path) {
			return $.find(`[href="${path}"][ok="true"]`).length > 0
		},
		addJS: function(path, callback, args) {
			if (pageManager.priv.jsExists(path.path)) {
				window.setTimeout(function() {callback(args);}, 1);return;
			}
			var fileref = document.createElement('script')

			if (fileref.readyState) { //IE
				fileref.onreadystatechange = function() {
					if (fileref.readyState == "loaded" || fileref.readyState == "complete") {
						fileref.onreadystatechange = null;
						callback(args);
					}
				};
			} else { //Others
				fileref.onload = function() {
					$('head').find(`[src="${path.path}"]`).attr('ok', 'true');
					callback(args);
				};
				fileref.onerror = function() {
					console.log('---------error js---------');
					window.setTimeout(function() {pageManager.priv.addJS(path, callback, args);}, 1000);
				};
			}

			fileref.setAttribute("src", path.path)
			if (typeof fileref != "undefined") {
				document.getElementsByTagName("head")[0].appendChild(fileref)
			}
		},
		addCSS: function(path, callback, args) {
			if (pageManager.priv.cssExists(path.path)) {
				window.setTimeout(function() {callback(args);}, 1);return;
			}
			var fileref = document.createElement("link")

			if (fileref.readyState) { //IE
				fileref.onreadystatechange = function() {
					if (fileref.readyState == "loaded" || fileref.readyState == "complete") {
						fileref.onreadystatechange = null;
						callback(args);
					}
				};
			} else { //Others
				fileref.onload = function() {
					$('head').find(`[href="${path.path}"]`).attr('ok', 'true');
					callback(args);
				};
				fileref.onerror = function() {
					console.log('---------error css---------');
					window.setTimeout(function() {pageManager.priv.addCSS(path, callback, args);}, 1000);
				};
			}

			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", path.path);
			if (typeof fileref != "undefined") {
				document.getElementsByTagName("head")[0].appendChild(fileref)
			}
		},
		addHTML: function(path, page, callback, args) {
			if (tools.common.func.call(page)[path.var] != null) {
				window.setTimeout(function() {callback(args);}, 1);return;
			}

			$.ajax({
				url: path.path
			}).done(function(ret) {
				if (args.svg) tools.common.func.call(page)[path.var] = ret.firstChild;
				else tools.common.func.call(page)[path.var] = ret;
				callback(args);
			});
		},
		open: function(name, callback, error, args) {
			function privAddFile(include, name) {
				pageManager.priv.progress.update(1, null);
				if (include.type == 'js') {
					pageManager.priv.addJS(include, runCallback, {
						name: name
					});
				} else if (include.type == 'css') {
					pageManager.priv.addCSS(include, runCallback, {
						name: name
					});
				} else if (include.type == 'html') {
					pageManager.priv.addHTML(include, name, runCallback, {
						name: name,
						html: true
					});
				} else if (include.type == 'svg') {
					pageManager.priv.addHTML(include, name, runCallback, {
						name: name,
						svg: true
					});
				} else if (include.type == 'json') {
					pageManager.priv.addHTML(include, name, runCallback, {
						name: name,
						json: true
					});
				} else if (include.type == 'lib') {
					window.setTimeout(function() {
						pageManager.priv.open(include.name, runCallback, runCallback, {
							name: name,
							lib: true,
							path: include.path
						});
					}, 1);
				}
			}
			if (tools.common.func.call(name) != null) {
				include = tools.common.func.call(name)['include'];
				if (include == null || include.length < 1) callback();
				else {
					pageManager.priv.includeLoad.push({
						name: name,
						i: 0,
						n: include.length,
						callback: callback,
						args: args
					});
					//console.log('lib', JSON.parse(JSON.stringify(pageManager.priv.includeLoad)));
					if (tools.common.func.call(name)['inserial']) {
						privAddFile(include[0], name);
					} else {
						//console.log('include', name, include);
						for (var i = 0; include != null && i < include.length; i++) {
							pageManager.priv.addLinkList(include[i]);
							privAddFile(include[i], name);
							//console.log('adding', name, include[i]);
						}
					}
				}
			} else if (tools.common.data.getJSON(pageManager.linkList, 'name', name) != null) {
				pageManager.priv.addJS(tools.common.data.getJSON(pageManager.linkList, 'name', name), function() {pageManager.priv.open(name, callback, error, args);});
			} else if (args != null && args.path != null) {
				pageManager.priv.addLinkList({path: args.path, name: name});
				pageManager.priv.addJS({path: args.path}, function() {pageManager.priv.open(name, callback, error, args);});
			} else {
				if (error != null) error(args);
			}

			function runCallback(args) {
				pageManager.priv.progress.update(null, 1);
				var includeLoadIndex = tools.common.data.getJSONindex(pageManager.priv.includeLoad, 'name', args.name);
				pageManager.priv.includeLoad[includeLoadIndex]['i']++;
				var includeLoadNow = pageManager.priv.includeLoad[includeLoadIndex];
				

				//console.log('callback', args.name, pageManager.priv.includeLoad, includeLoadNow.name);
				if (includeLoadNow.i >= includeLoadNow.n) {
					if (includeLoadNow.args && includeLoadNow.args.lib) {
						try {
							tools.common.func.call(includeLoadNow.name)['open']();
						} catch(e) {console.warn('lib has no open() ', includeLoadNow.name);}
					}
					//console.log('open', pageManager.priv.includeLoad, includeLoadNow);
					pageManager.priv.includeLoad.pop();
					includeLoadNow.callback(includeLoadNow.args);
				} else if (tools.common.func.call(args.name)['inserial']) {
					//pageManager.priv.progress.update(1, null);
					pageManager.priv.addLinkList(tools.common.func.call(includeLoadNow.name)['include'][includeLoadNow.i]);
					privAddFile(tools.common.func.call(includeLoadNow.name)['include'][includeLoadNow.i], includeLoadNow.name);
				}  
			}
		}
	},
    checkURL: function(value) {
		var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
		// new load and blank page (index/home)
        if (tools.common.url.getJSONFromCurrentUrl(pageManager.root).pageName == null) {
			// setup progress
			pageManager.priv.progress.set(true);
			// end progress
			if (pageManager.bootstrap != null) {
				pageManager.priv.open(pageManager.bootstrap, function() {
					if (tools.common.func.call(pageManager.bootstrap)['init']) tools.common.func.call(pageManager.bootstrap)['init']();
					tools.common.func.call(pageManager.bootstrap)['open']();
					pageManager.now.push(pageManager.bootstrap);
					openDefPage();
				});
			} else openDefPage();
			function openDefPage() {
				pageManager.priv.open(pageManager.defaultPage, function() {
					data.pageName = pageManager.defaultPage;
					var tPopup = [];
					if (data.popupName != null) tPopup = data.popupName.split('~');
					for (var i = 0; i < tPopup.length; i++) data[tPopup[i]] = null;
					data.popupName = null;
	
					pageManager.priv.progress.close(); // close progress
					history.replaceState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
	
					if (tools.common.func.call(pageManager.defaultPage)['init']) tools.common.func.call(pageManager.defaultPage)['init']();
					tools.common.func.call(pageManager.defaultPage)['open']();
					pageManager.now.push(pageManager.defaultPage);
				});
			}

        } else {
			var tPage = data.pageName.split('~');
			if (pageManager.bootstrap != null)tPage.unshift(pageManager.bootstrap);
			// new load
			if (pageManager.now.length == 0 && pageManager.popNow.length == 0) {
				// setup progress
				pageManager.priv.progress.set(true);
				// end progress
				var tPopup = [];
				if (data.popupName != null) tPopup = data.popupName.split('~');
				for (var i = 0; i < tPopup.length; i++) data[tPopup[i]] = null;
				data.popupName = null;
				history.replaceState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
			} else {
				pageManager.priv.progress.set();
			}
			var tPopup = [];
			if (data.popupName != null) tPopup = data.popupName.split('~');
			// check page
            var tCl = 0;
            for (; pageManager.now.length > tCl && tPage.length > tCl && pageManager.now[tCl] == tPage[tCl]; tCl++);
			//console.log(tCl, pageManager.now.length, tPage.length, pageManager.now, tPage);
			if (tCl == pageManager.now.length && pageManager.now.length == tPage.length && tools.common.func.call(tPage[tCl - 1])['multiload']) {
				tools.common.func.call(tPage[tCl - 1])['open'](data[tPage[tCl - 1]]);
				checkPopup();
			} else {
				while (tCl < pageManager.now.length){
					var t = pageManager.now.pop();
					data[t] = null;
					tools.common.func.call(t)['close'](data);
				}
				history.replaceState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
				var i = tCl;
				opener();
				function opener() {
					if (i < tPage.length) {
						pageManager.priv.open(tPage[i], function() {
							if (tools.common.func.call(tPage[i])['init']) tools.common.func.call(tPage[i])['init']();
							tools.common.func.call(tPage[i])['open'](data[tPage[i]]);
							pageManager.now.push(tPage[i]);
							i++;
							opener();
						});
					} else {
						checkPopup();
					}
				}
			}
			// check popup
			function checkPopup() {
				//console.log('pop');
				var tCl = 0;
				for (; pageManager.popNow.length > tCl && tPopup.length > tCl && pageManager.popNow[tCl] == tPopup[tCl]; tCl++);
				//console.log(tCl, pageManager.popNow.length, tPopup.length, pageManager.popNow, tPopup);
				if (tCl == pageManager.popNow.length && pageManager.popNow.length == tPopup.length && tCl != 0 && tools.common.func.call(tPopup[tCl - 1])['multiload']) {
					pageManager.priv.progress.close(); // close progress
					tools.common.func.call(tPopup[tCl - 1])['open'](data[tPopup[tCl - 1]]);
				} else {
					while (tCl < pageManager.popNow.length){
						var t = pageManager.popNow.pop();
						data[t] = null;
						tools.common.func.call(t)['close'](data);
					}
					history.replaceState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
					
					var i = tCl;
					popOpener();
					function popOpener() {
						if (i < tPopup.length) {
							pageManager.priv.open(tPopup[i], function() {
								tools.common.func.call(tPopup[i])['open'](data[tPopup[i]]);
								pageManager.popNow.push(tPopup[i]);
								i++;
								popOpener();
							});
						} else {
							pageManager.priv.progress.close(); // close progress
						}
					}
				}
			}
        }
    },
    add: function(value, param, onload, error, afterload) {
		pageManager.priv.progress.set(); // set progress
		pageManager.priv.open(value, function() {
			pageManager.priv.progress.close(); // close progress
			function getVal(val) {if (val == undefined || val == '' || val == null) return null; return val;}
			if (!tools.common.func.call(value)['loaded']) {
				var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
				if (data.pageName == null) data.pageName = value;
				else data.pageName += '~' + value;
				if (param != null) data[value] = param;
				
				if (tools.common.func.call(value)['init']) tools.common.func.call(value)['init'](param);
				tools.common.func.call(value)['open'](param, afterload);
				history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
				pageManager.now.push(value);
	
				if (onload != null) onload();
			} else if (tools.common.func.call(value)['multiload']) {
				var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
				//console.log(data[value], param, 2);
				if (getVal(param) != getVal(data[value])) {
					data[value] = param;
	
					tools.common.func.call(value)['open'](param, afterload);
					history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
					//pageManager.now.push(value);
		
					if (onload != null) onload();
				}
			}
		}, error);
    },
    replace: function(value, to, param, onload, error, afterload) {
        var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
        tPage = data.pageName.split('~');
		pageManager.priv.progress.set(); // set progress
		pageManager.priv.open(value, function() {
			pageManager.priv.progress.close(); // close progress
			function getVal(val) {if (val == undefined || val == '' || val == null) return null; return val;}
			if (!tools.common.func.call(value)['loaded']) {
				while (pageManager.now.length > 0 && 
					(pageManager.now[pageManager.now.length - 1] != to &&
						(pageManager.bootstrap == null || pageManager.now[pageManager.now.length - 1] != pageManager.bootstrap))) {
					tPage.pop();
					var t = pageManager.now.pop();
					data[t] = null;
					tools.common.func.call(t)['close'](data);
				}
				tPage.push(value);
				tPage = tPage.join('~');
				data.pageName = tPage;
				if (param != null) data[value] = param;

				if (tools.common.func.call(value)['init']) tools.common.func.call(value)['init'](param);
				tools.common.func.call(value)['open'](param, afterload);
				history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
				pageManager.now.push(value);
				if (onload != null) onload();
			} else if (tools.common.func.call(value)['multiload']) {
				if (getVal(param) != getVal(data[value])) {
					data[value] = param;
	
					tools.common.func.call(value)['open'](param, afterload);
					history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
					//pageManager.now.push(value);
		
					if (onload != null) onload();
				}
			}
		}, error);
    },
    back: function(to) {
        var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
        tPage = data.pageName == null ? [] : data.pageName.split('~');
		tPopup = data.popupName == null ? [] : data.popupName.split('~');
		if (to == null) {
			history.back();
			//console.log('ok1');
		} else if (tPopup.length > 0 && tPopup[tPopup.length - 1] == to) {
			history.back();
			//console.log('ok2');
		} else if (tPage.length > 0 && tPage[tPage.length - 1] == to) {
			history.back();
			//console.log('ok3');
		} else {
			history.back();
			pageManager.back(to);
			//console.log('ok!');
		}
	},
	cloaseAllPopup: function() {

	},
	addPopup: function(value, param, onload, error, afterload) {
		pageManager.priv.progress.set(); // set progress
		pageManager.priv.open(value, function() {
			pageManager.priv.progress.close(); // close progress
			if (!tools.common.func.call(value)['loaded']) {
				var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
				if (data.popupName == null) data.popupName = value;
				else data.popupName += '~' + value;
				if (param != null) data[value] = param;
	
				if (tools.common.func.call(value)['init']) tools.common.func.call(value)['init'](param);
				tools.common.func.call(value)['open'](param, afterload);
				history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
				pageManager.now.push(value);
	
				if (onload != null) onload();
			} else if (tools.common.func.call(value)['multiload']) {
				var data = tools.common.url.getJSONFromCurrentUrl(pageManager.root);
				//console.log(data[value], param);
				if (param != data[value]) {
					data[value] = param;
	
					tools.common.func.call(value)['open'](param, afterload);
					history.pushState(data, '', tools.common.url.getUrlStr(data, pageManager.root));
					//pageManager.now.push(value);
		
					if (onload != null) onload();
				}
			}
		}, error);
	},
	call: function(func, value, name, path) {
		if (path != null) {
			pageManager.priv.addLinkList({path: path, name: name});
		} else if (name == null) name = func.split('.')[0];
		pageManager.priv.open(name, function() {
			tools.common.func.call(func)(value);
		});
	},
	callAllOpen: function(func, value) {
		$.each(pageManager.now, function() {
			try {
				tools.common.func.call(func, window[this])(value);
			} catch(e) {}
		});
	}
}