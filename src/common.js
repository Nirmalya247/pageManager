tools = {common: {}};
tools.common.url = {
    getJSONFromCurrentUrl: function (mode) {
        var urlS = location.search.substring(1);
        urlS = tools.common.url.getURLJson(urlS);
        if (mode == 'single') {
            var pageName = location.pathname.substr(1).split('/').join('~');
            if (pageName != '') pageName = pageName.substr(0, pageName.length - 1);
            if (pageName != '') urlS.pageName = pageName;
            //console.log('getJSONFromCurrentUrl', urlS);
        }
        return urlS;
    },
    getURLJson: function(value) {
        value = value.split('&');
        var ret = {};
        for (var i = 0; i < value.length; i++) {
            value[i] = value[i].split('=');
            if (value[i][1] == '' || value[i][0] == '') continue;
            value[i][1] = decodeURIComponent(value[i][1]);
            //if (value[i][1] == 'array') ret[value[i][0]] = [];
            if (ret.hasOwnProperty(value[i][0])) {
                if (Array.isArray(ret[value[i][0]])) {
                    if (value[i][1] != 'array') ret[value[i][0]].push(JSON.parse(window.atob(value[i][1])));
                } else if (ret[value[i][0]] == 'json') {
                    ret[value[i][0]] = JSON.parse(window.atob(value[i][1]));
                } else if (value[i][1] == 'json') {
                    ret[value[i][0]] = JSON.parse(window.atob(ret[value[i][0]]));
                } else {
                    if (value[i][1] == 'array') ret[value[i][0]] = [JSON.parse(window.atob(ret[value[i][0]]))];
                    else ret[value[i][0]] = [JSON.parse(window.atob(ret[value[i][0]])), JSON.parse(window.atob(value[i][1]))];
                }
            } else if (value[i][1] == 'array') ret[value[i][0]] = [];
            else ret[value[i][0]] = value[i][1];
        }
        return ret;
    },
    getUrlStr: function(value, mode) {
        var tV = jQuery.extend(true, {}, value);
        $.each(tV, function(index, data) {
            if (data == null) { delete tV[index]; }
            else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    data[i] = window.btoa(JSON.stringify(data[i]));
                }
                tV[index] = ['array'].concat(data);
            }else if (typeof(data) == 'object') {
                for (var i = 0; i < data.length; i++) {
                    data[i] = window.btoa(JSON.stringify(data[i]));
                }
                tV[index] = ['json', window.btoa(JSON.stringify(data))];
            }
        });
        if (mode == 'single') {
            if (tV.pageName != null) {
                var t = tV.pageName;
                delete tV.pageName;
                var ret = $.param(tV, true);
                //console.log('getUrlStr', t);
                t = '/' + t.split('~').join('/') + '/?';
                return t + ret;
            } else {
                return '/?' + $.param(tV, true);
            }
        } else {
            var ret = $.param(tV, true);
            ret = mode + ret;
            return ret;
        }
    }
}
tools.common.data = {
    getJSONindex: function(json, attr, val) {
        try {
            for (var i = 0; i < json.length; i++) {
                if (json[i][attr] == val) return i;
            }
            return -1;
        } catch(e) {}
        return -1;
    },
    getJSON: function(json, attr, val) {
        try {
            for (var i = 0; i < json.length; i++) {
                if (json[i][attr] == val) return json[i];
            }
            return null;
        } catch(e) {}
        return null;
    }
}
tools.common.func = {
    call: function(name, parent, value) {
        if (parent == null) parent = window;
        if (name != null && typeof(name) == 'string') {
            name = name.split('.');
            for (var i = 0; i < name.length; i++) parent = parent[name[i]];
        } else if (name != null) {
            parent = name;
        }
        if (value != null) {
            if (Array.isArray(value)) return parent(...value);
            else return parent(...[value]);
        } else return parent;
    }
}