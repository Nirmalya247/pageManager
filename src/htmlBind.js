function htmlBind(html, data) {
    var ret = false;
    if (typeof(html) == 'string') {
        ret = true;
        html = $(html);
    }
    var conts = html.filter('*');
    for (var i=0; i<conts.length; i++) {
        var nowElem = conts.eq(i);
        var bindFrom = false;
        $.each(nowElem[0].attributes, function() {
            if(this.specified) {
                try {
                    if (this.name == 'bindfrom' && (data[this.value] != null || (this.value == '!'))) {
                        bindFrom = true;
                        var tData = data;
                        if (this.value != '!') tData = data[this.value];
                        if (Array.isArray(tData)) {
                            var t = nowElem.children().clone();
                            nowElem.children().remove();
                            $.each(tData, function() {
                                var tt = t.clone();
                                htmlBind(tt, this);
                                nowElem.append(tt);
                            });
                        } else {
                            htmlBind(nowElem.children(), tData);
                        }
                    } else if (this.name != 'bindfrom') {
                        nowElem.attr(this.name, this.value.replace(/{{\w*}}/g, function(x){return data[x.substr(2, x.length - 4)]}));
                    }
                } catch(e) {}
            }
        });
        if (!bindFrom) {
            htmlBind(nowElem.children(), data);
        }
        nowElem.html(function (i, html) {return html.replace(/{{\w*}}/g, function(x){return data[x.substr(2, x.length - 4)]});});
    }
    if (ret) return html;
}

tData = {
    roll: 5, name: 'ram', imgpath: 'img/5', addr: [
        {city: 'kol', pin: '4421', vill: 'ruby', ph: [{phno: 34345345345}, {phno: 443534553}]},
        {city: 'barasat', pin: '34535', vill: 'kaji', ph: [{phno: 434363434}]}
    ]
};