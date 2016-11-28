var url = require('url');
var Crawler = require('crawler');
// var mongoose = require('mongoose');

function test() {
    var crawler_Video = new Crawler({
        maxConnections : 10,

        callback : function (error, result, $) {
            var actress = {};
            actress.title = $('#title')[0].children[0].data;
            actress.url_image_cover = $('#sample-video').children('a')[0].attribs.href;
            actress.description = $('div.mg-b20.lh4')[0].children[0].data.replace(/\n/g, '');

            actress.performer = [];
            var obj_performer = $('#performer')[0];
            for (var v = 0; v < obj_performer.children.length; v++) {
                if (obj_performer.children[v].name == 'a') {
                    var performer = {};
                    performer.name = obj_performer.children[v].children[0].data;
                    var array_href = obj_performer.children[v].attribs.href.split('/');
                    for (var x = 0; x < array_href.length; x++) {
                        if(array_href[x].indexOf('id') > -1)
                            performer.id = array_href[x].replace('id=', '');
                    }
                    actress.performer.push(performer);
                }
            }
            var td_nw = $('td.nw');
            for (var v = 0; v < td_nw.length; v++) {
                if (td_nw[v].children[0].data.indexOf('品番') > -1)
                    actress.cid = td_nw[v].next.next.children[0].data.replace(/\n/g, '');
                if (td_nw[v].children[0].data.indexOf('配信開始日') > -1)
                    actress.date_sale_online = td_nw[v].next.next.children[0].data.replace(/\n/g, '');
                if (td_nw[v].children[0].data.indexOf('商品発売日') > -1)
                    actress.date_sale_stock = td_nw[v].next.next.children[0].data.replace(/\n/g, '');
                if (td_nw[v].children[0].data.indexOf('シリーズ') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        actress.series = {};
                        actress.series.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                actress.series.id = array_href[x].replace('id=', '');
                        }
                    }
                }
                if (td_nw[v].children[0].data.indexOf('メーカー') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        actress.maker = {};
                        actress.maker.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                actress.maker.id = array_href[x].replace('id=', '');
                        }
                    }
                }
                if (td_nw[v].children[0].data.indexOf('監督') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        actress.director = {};
                        actress.director.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                actress.director.id = array_href[x].replace('id=', '');
                        }
                    }
                }
            }
            actress.url_image_sample = [];
            for (var v = 1; v <= $('a[name="sample-image"]').length; v++) {
                actress.url_image_sample.push('http://pics.dmm.co.jp/digital/video/' + actress.cid + '/' + actress.cid + 'jp-' + v + '.jpg');
            }
            console.log(actress);
        }
    });

    crawler_Video.queue('http://www.dmm.co.jp/digital/videoa/-/detail/=/cid=118bgn00039/');
    crawler_Video.queue('http://www.dmm.co.jp/digital/videoa/-/detail/=/cid=lzwm00018/');
}

test();